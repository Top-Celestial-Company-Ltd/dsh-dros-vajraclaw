# 🛡️ DROS™ 進階資安與多 Agent 拓撲加固手冊 (ADVANCED_SECOPS_GUIDE.md)
### 構建「預設不可繞過」的零信任 AI Agent 執行期縱深防禦體系

[English](#english) | [繁體中文說明](#-繁體中文說明)

---

# 🇹🇼 繁體中文說明

本手冊專為**資安架構師、SecOps 工程師與多 Agent 深度玩家 (OpenShip / OpenClaw 生態)** 設計。詳細解析如何在本地開發機或生產環境中，將 **DROS VajraClaw** 與 **DSH 內部插件** 及 **底層開源資安基礎設施 (Falco, Cilium, Wazuh)** 深度協同，打造無懈可擊的立體防禦縱深。

---

## 一、 核心防禦哲學：三層位階清晰解析 (Defense Hierarchy)

許多開發者容易混淆「應用層插件」、「執行期治理閘道」與「主機網路資安系統」的界線。在現代零信任架構中，這三者具備明確的位階與職責分工：

```
┌─────────────────────────────────────────────────────────────┐
│ 1. 應用程式內部層 (In-App Layer: DSH 內部插件)              │  <── 🏢 前台安檢 (Prompt Filter)
│    - NeMo / Llama-Guard / 語意過濾外掛                      │      專門審查「說話內容是否違規」
└──────────────────────────────┬──────────────────────────────┘
                               │ (通過語意審查，Agent 準備發起 Tool Call)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. 運行期治理閘道 (Runtime Gateway: DROS VajraClaw)          │  <── 🏛️ 金庫守衛 (Execution Identity)
│    - W3C DID 身分指紋 (RFC-010) + 364ns 點陣權限查表        │      專門檢查「工具執行權限與不可否認簽章」
│    - C-ABI / FFI 物理熔斷 (硬性阻斷越權操作)                │
└──────────────────────────────┬──────────────────────────────┘
                               │ (放行合法 Syscall / Egress Traffic)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. 基礎設施與核心層 (Infra SecOps: OpenShip / Falco / Cilium)│  <── 🚓 特警防線 (Kernel & Network Fabric)
│    - Cilium: L3-L7 網路微隔離 (阻斷私自外發 C2 流量)         │      專門監控「主機破壞、容器逃逸與封包外洩」
│    - Falco / Tracee: Linux eBPF 核心級 Syscall 探針         │
│    - Wazuh / Loki: 全局密碼學日誌收集與 SIEM 戰情中心        │
└─────────────────────────────────────────────────────────────┘
```

### 💡 核心比喻：
* **DSH 內部插件（前台安檢）**：檢查使用者或外部輸入的 Prompt 是否夾帶惡意指令（自然語言語意過濾）。
* **DROS VajraClaw（金庫守衛）**：Agent 只要試圖動手操作（Tool Call），DROS 立即核驗其 W3C 晶片卡與權限點陣，若未授權則於 364 奈秒內在應用與系統邊界實施**硬性物理熔斷**。
* **外部 Infra 資安（特警電網）**：在容器外圍拉起網路隔離網（Cilium），並在 Linux Kernel 核心層架設監視器（Falco eBPF），確保即便惡意代碼企圖利用 0-day 逃逸容器，也會在核心層被當場擊斃。

---

## 二、 預設不可繞過架構：Docker 網路微隔離實戰 (Egress Isolation)

若要防範被劫持的 Agent 或惡意第三方插件繞過 DROS 代理私自對外聯網（Data Exfiltration），必須採用 **Zero-Trust Network Isolation** 拓撲：

### 🔒 生產級加固範本 (`docker-compose.hardened.yml`)

```yaml
version: '3.8'

services:
  # -------------------------------------------------------------
  # 1. DROS 安全閘道 (唯一具備對外出站權限的節點)
  # -------------------------------------------------------------
  dros-gateway:
    image: ghcr.io/top-celestial/vajraclaw-gateway:v1.1.0
    container_name: dros-gateway
    environment:
      - DROS_MODE=community
      - DROS_CONCURRENT_LIMIT=5
    volumes:
      - audit-logs:/var/log/dros/audit
    networks:
      - agent-sandbox   # 連接內部隔離網段
      - internet-egress # 連接外部公網
    restart: unless-stopped

  # -------------------------------------------------------------
  # 2. 受困 Agent 容器 (純沙盒環境，剝奪 Default Gateway)
  # -------------------------------------------------------------
  dsh-workspace:
    image: deepseek/dsh:latest
    container_name: dsh-workspace
    environment:
      - DROS_GATEWAY_URL=http://dros-gateway:8080
      - HTTP_PROXY=http://dros-gateway:8080
      - HTTPS_PROXY=http://dros-gateway:8080
    cap_drop:
      - ALL             # 剝奪所有 Linux 核心特權 (防止提權)
    security_opt:
      - no-new-privileges:true
    networks:
      - agent-sandbox   # 僅置於 internal 網段
    depends_on:
      - dros-gateway

  # -------------------------------------------------------------
  # 3. Wazuh SIEM 審計代理 (自動成形，收集不可否認性日誌)
  # -------------------------------------------------------------
  wazuh-agent:
    image: wazuh/wazuh-agent:latest
    container_name: wazuh-agent
    volumes:
      - audit-logs:/var/log/dros/audit:ro # 唯讀掛載日誌
    networks:
      - agent-sandbox
    restart: unless-stopped

# ---------------------------------------------------------------
# 核心網路定義：internal: true 徹底消除預設網關
# ---------------------------------------------------------------
networks:
  agent-sandbox:
    internal: true      # 關鍵！Docker 不會配發預設路由，私自外發直接 Network Unreachable
  internet-egress:
    driver: bridge

volumes:
  audit-logs:
```

---

## 三、 DSH 開放架構下 5 大隱蔽安全盲區與 DROS 治理手段

| 深度安全盲區 | 攻擊手法與威脅機制 | DROS + 開源資安防禦策略 |
| :--- | :--- | :--- |
| **1. 軟體供應鏈投毒**<br>*(Supply-Chain Poisoning)* | 第三方插件在 `npm postinstall` 生命週期中注入惡意腳本。 | • 構建期實施 SHA-256 Lockfile 雜湊鎖定。<br>• 啟動時禁止動態自未授權來源拉取代碼。 |
| **2. 記憶體原型鏈污染**<br>*(Prototype Pollution)* | 惡意插件在 Node.js 中篡改 `Object.prototype` 竊取 Token。 | • DROS 驗證邏輯下沉至 C-ABI / Rust 獨立進程，JS 端僅為轉發樁，記憶體污染無法影響核心。 |
| **3. 協同調度與資源耗盡**<br>*(ReDoS / Loop DoS)* | 惡意插件構造死循環或阻塞正規表達式，掐死 Event Loop。 | • Docker 層強制施加 cgroups 資源限制 (CPU/Mem)。<br>• DROS 內建微秒級 Watchdog 超時熔斷計時器。 |
| **4. 殘留守護進程與幽靈監聽**<br>*(Ghost Handlers)* | 插件被卸載後，其派生的背景 Daemon 仍在偷偷監聽數據。 | • 沙盒生命週期結束時採用 Linux PID Namespace 樹狀硬性銷毀 (`kill -9 -PID`)。 |
| **5. 跨插件數據流側向洩漏**<br>*(Cross-Plugin Bleed)* | 上游插件獲取的 DB 機密在作為上下文傳給下游插件時外洩。 | • 實施動態數據流標籤追蹤 (Data Tainting)，跨插件傳遞時強制去識別化。 |

---

## 四、 多 Agent 混合治理拓撲 (DSH + AGY + Codex + Claude Code)

若您在開發機上同時運行多個 Agent 框架（如 Google Antigravity、OpenAI Codex、Claude CLI、Cursor 等），可將所有 Agent 統一導流至本地 DROS Gateway：

```
[ Developer Workstation ]
  ├── Agent 1 (DSH Web):     dsh plugin (Auto-routed) ────┐
  ├── Agent 2 (AGY Pro):     MCP Server (Proxy-routed) ───┼──> [ DROS Gateway :8080 ]
  ├── Agent 3 (Claude Code): CLI Proxy (Env-routed) ──────┤     - 5 並發治理配額
  └── Agent 4 (Codex/Cursor):REST Hook (SDK-routed) ──────┘     - 統一發放 W3C DID 指紋
                                                                - 364ns 權限點陣熔斷
```

---

# 🇺🇸 English Guide

This advanced manual provides architectural blueprints for SecOps engineers and multi-agent practitioners looking to build a **Default-Secure, Defense-in-Depth** environment around DROS VajraClaw, DSH, and open-source infrastructure tools (Falco, Cilium, Wazuh).

### 🏛️ The Three Tiers of Agent Security
1. **In-App Layer (DSH Plugins)**: Handles prompt filtering, conversational sanitization, and semantic evaluation.
2. **Runtime Gateway (DROS VajraClaw)**: The single choke point managing **W3C DID fingerprints (`RFC-010`)** and **<1μs deterministic C-ABI tool熔斷**.
3. **Infrastructure Layer (Falco / Cilium / Wazuh)**: Enforces **eBPF kernel monitoring, egress micro-segmentation, and court-admissible SIEM auditing**.

---

## 🏛️ Official Organization & Contact Information
* **Company**: Top-Celestial Company Ltd. (康宸園有限公司)
* **Official Website**: [https://dr-os.io](https://dr-os.io)
* **Customer Support & Business Inquiries**: [service@dr-os.io](mailto:service@dr-os.io)
* **GitHub Organization**: [https://github.com/Top-Celestial-Company-Ltd](https://github.com/Top-Celestial-Company-Ltd)
