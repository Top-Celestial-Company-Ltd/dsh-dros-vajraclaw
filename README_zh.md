# ⚡ DROS™ VajraClaw for DSH & Multi-Agent Workstations
### DSH 原生外掛 + 本機工具調用防護與運行期治理側車 (v2.2.0 - 個人版 DWGR-8 宣告式參數級微核心)

[![Official Website](https://img.shields.io/badge/官方網站-dr--os.io-purple.svg?style=for-the-badge)](https://dr-os.io)
[![DSH Compatible](https://img.shields.io/badge/DSH-Cordis_Native-success)](https://github.com/deepseek-ai/dsh)
[![npm version](https://img.shields.io/npm/v/dsh-plugin-vajraclaw.svg)](https://www.npmjs.com/package/dsh-plugin-vajraclaw)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Patent Status](https://img.shields.io/badge/U.S._Patent-64%2F111%2C973-blue.svg)](#)

[English](https://github.com/Top-Celestial-Company-Ltd/dsh-dros-vajraclaw/blob/main/README.md) | [繁體中文](https://github.com/Top-Celestial-Company-Ltd/dsh-dros-vajraclaw/blob/main/README_zh.md) | [🌐 官方網站 (dr-os.io)](https://dr-os.io)

**DSH 本機工具調用防護外掛**：在工具執行前精準攔截高風險 Shell 指令模式（如遞迴強制刪除、Fork 炸彈、磁區覆寫）與敏感憑證檔案讀取，具備跨 session 持續性之哈希鏈 JSONL 審計記錄，並可選配外部 Gateway 實現全域多 Agent 集中策略治理。

---

## 💡 雙模架構設計 (Dual-Mode Architecture)

DROS VajraClaw 提供「零依賴本機防護」與「集中式網關」雙模式：

* **模式 1：DSH 嵌入式本機防護 (Embedded Mode，預設)**：
  * 透過 Cordis `apply(ctx, config)` 原生掛載於 DSH。
  * 內建 TypeScript 正規表達式高危模式攔截與持久化哈希鏈審計日誌。
  * 預設 **Fail-Open (Fail-Safe)**，不破壞宿主正常調用，一鍵安裝即刻獲得本機安全防護。
* **模式 2：全工作站多 Agent 網關模式 (Gateway Mode，可選)**：
  * 使用者可選配啟動外部 DROS Gateway 容器，外掛自動將策略與審計日誌集中同步。
  * 支援 AGY、Codex、Claude Code、Cursor 多 Agent 共享集中治理邊界。

```text
                 DSH 工具調用事件 (Tool Call)
                          │
                          ▼
            [dsh-plugin-vajraclaw]
                          │
           ┌──────────────┴──────────────┐
           ▼                             ▼
   [嵌入模式] (預設)               [網關模式] (可選)
   • 正則高危模式攔截              • 集中式多 Agent 策略
   • 敏感憑證讀取防護              • 跨端同步 (AGY, Codex, Claude)
   • 持久化 JSONL 審計鏈           • 需額外啟動 Gateway 容器
```

---

> 🎁 **【個人開發者社群版：本機工作站永久免費】**
> * 🛡️ **個人使用（非商業用途） 100% 永久免費**：嵌入式本機引擎完全開源 (Apache-2.0)。
> * 📝 **持久化審計日誌**：結構化 JSONL 記錄，支援重啟後自動延續哈希鏈。
> * ⚡ **選配集中式網關**：如需多 Agent 跨工作站協同治理，可隨時啟用外部網關。
>
> ⚖️ **【非商業用途 (Non-Commercial Use) 法律邊界明確界定】**
> 
> | 授權類別 | 🟢 允許使用（社群免費版，永久 $0） | 🔴 禁止使用（須購買 Startup / Enterprise 商業授權） |
> | :--- | :--- | :--- |
> | **主體資格** | 自然人、獨立開源貢獻者、學生、個人研究員 | 法人實體、公司組織、營利機構、接案工作室、顧問團隊 |
> | **使用情境** | **個人技能學習**、本機技術實驗、開源代碼審計、個人玩具專案 | **公司內部業務開發**、正式生產環境部署、內部自動化運維、團隊協同工作站 |
> | **商業收益** | 無直接或間接收益、無向任何第三方收費 | **對外提供付費 SaaS/API 服務**、向客戶交付商務交付物、公司營利活動 |
> | **代理數量** | 單機最多 5 個並發 Agent（個人開發足夠） | 超過 5 個並發 Agent、多伺服器叢集、K8s 分散式環境 |
> 
> > 📌 **合規宣示**：任何由營利法人、受薪員工在職務範圍內使用、或用於產出直接/間接商業價值之環境，均不屬於非商業用途範圍，必須取得正式商業授權（Commercial License）。

---

## 🏛️ 核心哲學：引領開源資安陣營，守護極致開放的插件生態

**DeepSeek Harness (DSH)** 的偉大之處在於其極致的開放性──**「一切皆插件 (Everything is a plugin)」**。然而，極致的開放必然伴隨著攻擊面的無限放大：
* 第三方惡意外掛可能企圖越權讀檔、篡改全域記憶體，或暗中將數據發往外部 C2 伺服器。
* **DROS 扮演了「開源資安與網管的領頭羊與核心定錨」**：攜手 Falco eBPF、Cilium 網路隔離與 Wazuh 審計，為全球開發者架構起完整的**立體防禦縱深**，讓每位 Agent 玩家都能安心享受開源生態的自由！

```
┌─────────────────────────────────────────────────────────────┐
│ 1. 應用程式內部層 (In-App Layer: DSH 內部插件)              │  <── 🏢 前台安檢 (Prompt Filter)
│    - NeMo / Llama-Guard: 負責對話語意審查與不良內容過濾     │
└──────────────────────────────┬──────────────────────────────┘
                               │ (通過語意審查，Agent 發起 Tool Call)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. 運行期治理閘道 (Runtime Gateway: DROS VajraClaw)          │  <── 🏛️ 金庫守衛 (Execution Identity)
│    - W3C DID 身分指紋 + 364ns 權限點陣查表                  │      指定基準測試配置下執行路徑延遲 <1 μs！
└──────────────────────────────┬──────────────────────────────┘
                               │ (放行合法的 Syscall / Egress 流量)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. 基礎設施與核心層 (Infra SecOps: OpenShip / Falco / Cilium)│  <── 🚓 特警防線 (Kernel & Network Fabric)
│    - Cilium 封鎖惡意外發；Falco eBPF 核心層捕捉容器逃逸     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧭 治理邊界：DROS 守護什麼 vs. 不守護什麼

為了維護極致嚴謹的工程界線與防禦範疇，DROS 明確劃定邊界：

| 攻擊手法與威脅情境 | 傳統語意 Guardrails | DROS VajraClaw 物理微核心 | 最終防禦效果 |
| :--- | :---: | :---: | :--- |
| **間接提示詞注入** *(網頁/PDF 夾帶指令詐騙 Agent 刪庫)* | ❌ LLM 語意混淆易被繞過 | ✅ **確定性攔截** | **確定性帶內物理熔斷** (<1μs 基準測試點陣查表) |
| **側向越權調用** *(未授權外掛偷偷呼叫 DB/付款 Tool)* | ❌ 應用層邏輯脆弱 | ✅ **密碼學阻斷** | **100% 阻斷** (在定義之威脅模型與 Capability 向量內) |
| **私自外發洩密** *(外掛私自連線外部 C2 傳輸機密)* | ❌ LLM 完全無感 | ✅ **網路微隔離** | **100% 丟包** (`internal: true` 沙盒拓撲) |
| **容器逃逸與宿主機提權** | ❌ 無主機核心視角 | ⚠️ 協同 Falco eBPF | **核心層捕捉** (`cap_drop: ALL` 特權剝奪隔離) |
| **業務邏輯錯誤與模型幻覺** | ❌ 超出資安範疇 | ❌ 超出資安範疇 | 屬 LLM 生成品質，由 Prompt 工程與 QA 流程優化 |

---

## 🔑 零信任金鑰與 Root 救援生死警示

DROS 嚴格貫徹 **零信任密碼學架構**：
1. **原廠無後門聲明 (No Backdoors)**：原廠無任何萬用金鑰。您的 Ed25519 私鑰種子 (Seed Hex) 僅存在本地記憶體，**請務必自行妥善備份至密碼庫 (1Password / Bitwarden)**。
2. **重建信任根 (Rebuilding Root of Trust)**：若遺失私鑰，唯有在保有伺服器最高 **Root / SSH 管理員權限** 的前提下，方可手動替換驗證公鑰以重建信任根。

---

## 🌐 通用多 Agent 混合工作站拓撲 (DSH + AGY + Codex + Claude)

DROS 雖以 DSH 外掛形式提供一鍵安裝，但底層是 **標準化 Docker 容器 (`localhost:8080`)**，單台開發機可同時守護多個不同平台的活躍 Agent（共用 5 個並發配額）：

## 📊 雙模式防禦對照矩陣（純外掛單機版 vs. Docker 網關版）
 
| 防護機制與能力維度 | 📦 模式 A：純外掛單機版 (預設) | ⚡ 模式 B：DROS Docker 網關版 (選配) |
| :--- | :---: | :---: |
| **運行載體** | 純 TypeScript（DSH 進程內，零外部依賴） | 本機 Docker 容器 (`localhost:8080`) |
| **支援治理之 Agent** | 專屬保護 DeepSeek Harness (DSH) | 同時聯防 DSH + Google AGY + Codex + Claude + Cursor |
| **主體身分認證 (Identity)** | 進程綁定 Agent ID | **原生 W3C `did:key` (Ed25519) 密碼學身分** |
| **工具執行閘門 (Gate)** | **DWGR-8 宣告式參數級防線 + 正則安全閥 + 本地 SHA-256 存證鏈** | **確定性 AST 點陣圖策略引擎 (<1μs)** |
| **不可否認性審計鏈** | 持久化 SHA-256 雜湊鏈 JSONL (本地磁碟) | **Ed25519 數位簽章 Merkle 雜湊鏈** |
| **RFC-010 開放護照格式** | 標準護照格式解析 | **本地完整簽署發放與跨 Agent 交互認證** |
| **執行期開銷** | 0 ms（記憶體事件直接攔截） | <1 ms（本機 Loopback HTTP / C-ABI） |
| **授權方式** | **永久完全免費 (Apache-2.0 開源)** | **個人 Hacker / 社群永久免費授權** |

---


---

## 🛡️ v2.2.0 重大更新：DWGR-8 個人版宣告式參數級治理 (Personal Proxy Gate)

在 **v2.2.0** 中，DSH 插件原生整合了 **DROS Personal (Community Edition)** 本地微核心！
您無需架設外部 Docker 網關，即可直接在專案目錄下透過宣告式 JSON 設定檔，實現 **動作白名單 (Allowed Actions)**、**危險路徑遍歷防禦 (Path Traversal Guard)** 與 **深層參數約束 (Param Constraints)**。

### 1. 快速初始化個人治理設定檔
在 DSH 工作專案目錄下執行：
```bash
# 透過 dsh-plugin-vajraclaw 提供的 CLI 快速生成設定
npx dsh-plugin-vajraclaw init
# 或手動建立 dros.personal.config.json
```

### 2. 宣告式設定檔範例 (`dros.personal.config.json`)
```json
{
  "version": "1.0.0",
  "principalId": "did:key:personal-developer",
  "mode": "strict",
  "rules": [
    {
      "toolId": "filesystem",
      "allowedActions": ["read_file", "list_directory"],
      "blockedActions": ["delete_file", "format_disk"],
      "paramConstraints": {
        "path": {
          "disallowedPatterns": ["..", "/etc/", "C:\\Windows\\", ".env", ".ssh"]
        }
      }
    },
    {
      "toolId": "sqlite",
      "allowedActions": ["read_query", "select"],
      "blockedActions": ["drop_table", "delete"],
      "paramConstraints": {
        "query": {
          "disallowedPatterns": ["DROP ", "DELETE ", "TRUNCATE ", "ALTER "]
        }
      }
    }
  ]
}
```

### 3. 核心防禦特性
* **零依賴極速執行**：純本機 TypeScript 原生密碼學計算，判定耗時 $\le 10\mu s$，零網路開銷。
* **路徑穿越防護**：精準攔截 `..`、系統機密目錄等路徑注入，防範 Agent 越界竊取機密。
* **防篡改審計鏈**：自動延續本機 SHA-256 雜湊鏈存證，確保每一次 Tool 執行的合規軌跡不可否認。
* **Fail-Safe 優雅降級**：若目錄未提供 `dros.personal.config.json`，外掛自動切換為內建高危正則安全閥，絕不干擾宿主。

## 🚀 極速上手 (Quick Start)

### 模式 A：標準單機模式（預設，零依賴，無需 Docker）
直接在 DSH 中安裝外掛，即刻啟用高危指令攔截、敏感檔案保護與本地審計鏈：
```bash
dsh plugin --profile web add dsh-plugin-vajraclaw
```
*(100% 在 DSH 進程內運作，無額外網路開銷，開箱即用)*

---

### 模式 B：進階多 Agent 工作站模式（選配，啟用 Docker 網關）
若您需要跨平台同時守護多個 Agent（DSH + Google AGY + Codex + Claude Code + Cursor），並啟用 **原生 W3C `did:key` 身分指紋、RFC-010 護照與微秒級 AST 策略查表**：

1. **啟動免費版 DROS Docker 網關**：
   ```bash
   docker run -d -p 8080:8080 --name dros-gateway dros/hacker-gateway:v1.0.0
   ```
2. **在 DSH 設定中配置網關網址**（或編輯 `cordis.patch.yml`）：
   ```yaml
   dsh-plugin-vajraclaw:
     gatewayUrl: "http://localhost:8080"
   ```
3. **連接其他外部 Agent (AGY / Codex / Claude Code / Cursor)**：
   ```bash
   export DROS_GATEWAY_URL="http://localhost:8080"
   export DROS_IDENTITY_SEED="0x1a2b3c4d..." # 本機專屬 Ed25519 私鑰種子 Hex
   ```

👉 **[📖 閱讀進階資安與多 Agent 拓撲加固手冊 (docs/ADVANCED_SECOPS_GUIDE.md)](docs/ADVANCED_SECOPS_GUIDE.md)**（獲取 `internal: true` 網路微隔離 Compose 範本、Falco eBPF 核心防逃逸與 Wazuh SIEM 整合指南）。

---



---

## 📝 如何設定安全策略？(How to Configure Vajra.md)

DROS 支援兩種極簡設定方式：**人類直覺 Markdown 格式 (`Vajra.md`)** 與 **結構化 YAML 格式 (`demo_policy.yaml`)**。

### 1. 📄 人類直覺寫法範例 (`Vajra.md`)
只需以白話 Markdown 宣告允許執行的白名單與防禦邊界：

```markdown
# 🛡️ DROS Agent 安全策略規範 (Vajra.md)

## 1. 允許執行的工具 (Allowed Capabilities)
- 允許讀取當前工作區檔案 (`file_read`)
- 允許執行一般查詢 (`search_web`, `query_db`)
- 允許終端執行唯讀指令 (`git status`, `npm test`, `cargo check`)

## 2. 嚴格禁止的邊界 (Strict Fail-Closed Boundaries)
- 禁止執行任何遞迴刪除或清空指令 (`rm -rf`, `rmdir /s`, `format`)
- 禁止存取敏感憑證檔案 (`.env`, `id_rsa`, `secrets.json`, `.aws/credentials`)
- 禁止單筆交易金額超過 1,000 元 (`amount <= 1000`)
```

---


> [!IMPORTANT]
> 🔒 **極重要安全提示：設定完成後請將 `Vajra.md` 設為唯讀 (Read-Only)！**
> 為了徹底杜絕失控或遭受提示詞注入 (Prompt Injection) 的 AI Agent 試圖「自己改寫安全策略」來為自己解鎖特權，**請在設定完成後，將該檔案權限鎖定為唯讀**：
> - **Linux / macOS**: `chmod 444 Vajra.md`
> - **Windows (PowerShell)**: `Set-ItemProperty -Path Vajra.md -Name IsReadOnly -Value $true`
> - **Docker 掛載時**: 使用唯讀掛載模式 `-v $(pwd)/Vajra.md:/app/demo_policy.yaml:ro`
> 
> *(註：DROS 內核自帶「四重不變量防禦」，任何針對核心策略檔的寫入 Syscall 都會被微秒級攔截熔斷；搭配作業系統檔案鎖可達成 100% 物理防禦！)*


### 2. 🤖 讓 AI 幫你一秒生成策略！(AI Prompt Template)

您不需要從零手寫！直接將以下**「萬用提示詞 (Prompt)」**複製給 ChatGPT、Claude 或 Cursor，AI 就會自動產出標準合規的 `Vajra.md`：

> 📋 **複製這段 Prompt 給任何 LLM / Agent：**
> 
> ```text
> 你現在是 DROS 確定性安全架構專家。請根據我的 Agent 角色，為我生成一份標準的 DROS「Vajra.md」安全策略 Markdown 檔案。
> 
> 我的 Agent 需求如下：
> - Agent 角色與場景：【例如：全端工程師 / 客服機器人 / 自動化財務助理】
> - 允許的工具與操作：【例如：讀寫代碼、執行 npm test、查詢訂單資料庫】
> - 嚴格禁止的邊界：【例如：禁止刪除根目錄、禁止讀取 .env、單次轉帳上限 500】
> 
> 請遵循 DROS「預設拒絕 (Default Fail-Closed)」白名單原則，生成清晰的 Markdown 規則區塊，包含：
> 1. 角色定義與授權範疇 (Role & Scope)
> 2. 白名單工具 (Allowed Capabilities)
> 3. 邊界條件約束 (Thresholds & Security Patterns)
> ```

---

### 3. 🔄 策略即時熱更新 (Hot Reloading)
啟動 Docker 網關時，只需將您的 `Vajra.md` 掛載進去，修改存檔後 **1 微秒內即時生效，無需重啟容器**：
```bash
docker run -d -p 8080:8080 --name dros-gateway \
  -v $(pwd)/Vajra.md:/app/demo_policy.yaml \
  dros/hacker-gateway:v1.0.0
```


## 📜 相關技術核心論文與實測驗證 (Technical Foundations & Benchmarks)

本專案之確定性執行治理、微秒級熔斷與密碼學存證機制，參考並延伸自以下核心技術論文與開源實測環境：

1. **核心架構與六大信任邊界 (Core Architecture)**:
   * *DROS-6P: A Unified Deterministic Runtime Governance Architecture Closing the Six Fundamental Trust Boundaries of Enterprise AI Agents*
   * **Zenodo DOI**: [`10.5281/zenodo.21833970`](https://doi.org/10.5281/zenodo.21833970) | **記錄典藏**: [zenodo.org/records/21833970](https://zenodo.org/records/21833970)

2. **四層深度防禦架構 (Defense-in-Depth Model)**:
   * *DROS 4-Layer Defense-in-Depth Architecture for Autonomous AI Workloads*
   * **Zenodo DOI**: [`10.5281/zenodo.21903475`](https://doi.org/10.5281/zenodo.21903475) | **記錄典藏**: [zenodo.org/records/21903475](https://zenodo.org/records/21903475)

3. **外掛 FFI 與不可否認存證模組 (Runtime Attribution Framework)**:
   * *Runtime Attribution Framework: An External C-ABI and PKI-Based Zero-Trust Infrastructure for Non-Repudiable Execution Governance in Multi-Agent Systems*
   * **Zenodo DOI**: [`10.5281/zenodo.21903687`](https://doi.org/10.5281/zenodo.21903687) | **記錄典藏**: [zenodo.org/records/21903687](https://zenodo.org/records/21903687)

4. **開源技術標準與實測基準倉 (Open Standard & Verification Sandbox)**:
   * **RFC-010 規範**: 遵循開放 Agent 身分與存證規範（W3C DID `did:key` 與 Ed25519 簽章鏈）。
   * **實測基準環境**: [DROS-VEP Lite (可復現安全評測沙盒)](https://github.com/Top-Celestial-Company-Ltd/DROS-VEP-lite)
   * **實測報告**: 涵蓋 24 小時長效多場景測試數據（160,611 次請求驗證，決策延遲 26.1μs）。

---

## 🏛️ 官方發行組織與聯繫資訊 (Official Contact)
* **發行主體**：Top-Celestial Company Ltd. (康宸園有限公司)
* **官方網站**：[https://dr-os.io](https://dr-os.io)
* **客戶服務與商務諮詢**：[service@dr-os.io](mailto:service@dr-os.io)
* **GitHub 官方組織**：[https://github.com/Top-Celestial-Company-Ltd](https://github.com/Top-Celestial-Company-Ltd)

---

## 📄 專利與法律聲明
**專利聲明：** DROS 執行治理與安全技術已申請美國臨時專利保護（U.S. Provisional Patent Application No. 64/111,973，Patent Pending）。



## 🛡️ 治理與防禦能力對照矩陣 (Defense Capability Matrix)

| 威脅防禦維度 / 核心能力 | 傳統 LLM 防護 (NeMo / 提示詞審查) | 📦 DSH 獨立 TypeScript 外掛 | 🛡️ DROS Hacker Docker 網關 | 🏢 企業版 / K8s 集群 |
| :--- | :---: | :---: | :---: | :---: |
| **運行載體 (Vehicle)** | 雲端 API / 外部大模型 | 進程內原生 JS (零外部依賴) | **本地 Docker 容器 (`:8080`)** | 企業集群 / K8s / C-ABI 微核心 |
| **保護範圍 (Scope)** | 單次對話 Session | DSH 單一本機進程 | **全生態 (Claude+Codex+Cursor+DSH+AGY)** | 跨主機節點集群 / 私有雲 |
| **執行意圖治理 (Governance)** | 🔴 僅限文字模糊比對 | 🟢 **正則表達式硬防線 (Regex Failsafe)** | 🟢 **100% 確定性 AST 語法樹熔斷 (<1µs)** | 🟢 **AST 點陣圖 ＋ eBPF 內核級攔截** |
| **破壞性指令攔截 (Destructive)** | 🔴 易遭提示注入與編碼繞過 | 🟢 **敏感路徑物理阻斷** | 🟢 **底層 Syscall 物理硬熔斷** | 🟢 **硬體 HSM 隔離 ＋ 內核檔案鎖** |
| **機密與金鑰防洩漏 (Secrets)** | 🔴 無物理安全防線 | 🟢 **敏感路徑讀取阻斷** | 🟢 **動態遮蔽 ＋ 虛擬沙箱隔離** | 🟢 **硬體 HSM ＋ 零知識微證明 (ZKP)** |
| **Agent 主體身分綁定 (Identity)** | 🔴 無身分認證 | 🟢 Session 級別識別碼 | 🟢 **原生 W3C `did:key` (Ed25519 簽章)** | 🟢 **三層 PKI `DrosIdentityToken (DIT)`** |
| **不可篡改審計存證 (Audit)** | 🔴 普通可竄改文字 Log | 🟢 **本地 SHA-256 雜湊鏈** | 🟢 **Ed25519 簽章 Merkle 雜湊鏈** | 🟢 **歐盟 AI 法案第 12 條法院級存證** |
| **RFC-010 代理通行證 (Passport)** | 🔴 不支援 | 🟢 格式解析器 | 🟢 **本地發行 ＋ 跨 Agent 密碼學驗證** | 🟢 **跨組織漫遊通行證與權限繼承** |
| **決策延遲 (Decision Latency)** | 🔴 1,000 ~ 3,000 ms (二次模型極慢) | 🟢 **<1 ms (記憶體直接攔截)** | 🟢 **<1 µs (C-ABI) / <1 ms (REST 網關)** | 🟢 **<500 ns (零拷貝常數時間查表)** |
| **授權條款 (License)** | 按 Token 計費 | **100% 免費開源 (Apache-2.0)** | **個人永久免費授權 (Free for Individuals)** | 新創版 $2,990 / 企業版 $29,990 |
