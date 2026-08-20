# ⚡ DROS™ VajraClaw for DSH (DeepSeek Harness)
### The Microsecond Execution Governance & Circuit-Breaker Standard for DSH Agents

[![Official Website](https://img.shields.io/badge/Official_Website-dr--os.io-purple.svg?style=for-the-badge)](https://dr-os.io)
[![DSH Compatible](https://img.shields.io/badge/DSH-Compatible-success)](https://github.com/deepseek-ai/dsh)
[![npm version](https://img.shields.io/npm/v/dsh-plugin-vajraclaw.svg)](https://www.npmjs.com/package/dsh-plugin-vajraclaw)
[![Patent Status](https://img.shields.io/badge/U.S._Patent-64%2F111%2C973-blue.svg)](#)

[English](#english) | [繁體中文說明](#-繁體中文說明) | [🌐 Official Website](https://dr-os.io)

The official **Deterministic Runtime Execution Governance & Security Circuit-Breaker** plugin for DSH (DeepSeek Harness) agents.

---

> 🎁 **【DSH Community Launch Special: $49/yr (67% OFF) — Automatic +365 Days Stacking】**
> 
> To celebrate our official debut on the DSH Community Marketplace, all Hacker-tier features (AST compiler, attack simulator, custom `Vajra.md`) are **100% unlocked in the Free-Trial** (up to 2 concurrent agents, 30 days).
> 
> ⚡ **No need to wait until your trial ends!**
> Purchasing now will **automatically add +365 days on top of your remaining trial** (giving you **395 full days** of protection + unlocking 5 concurrent agents immediately).
> 
> 🎟️ Use promo code at checkout: **`DSH_VAJRACLAW_LAUNCH`** ➔ **$49 / yr** (Regular $149/yr, limited to first 1,000 developers)!
> 
> 👉 **[Claim $49 Special DSH Community License on Gumroad](https://drosvajra.gumroad.com/l/vajraclaw-hacker/DSH_VAJRACLAW_LAUNCH)**

---

## 📊 DROS Product Tiers & 6-Pillar Security Feature Matrix

> 💡 **Free-Trial Notice**: The default Community Edition runs in **Free-Trial mode (Max 2 Concurrent Agents, 30-Day limit)** with 100% full Hacker security features unlocked. Purchasing the Hacker license permanently removes time limits and unlocks **5 Concurrent Agents**.

| Feature / 6-Pillar Dimension | 🟢 Hacker (DSH Edition) | 🔵 Startup | 🟣 Enterprise | 👑 Sovereign |
| :--- | :---: | :---: | :---: | :---: |
| **Target Audience** | **Individual Devs / DSH Users** | 10~50 Dev Teams | Enterprises / Listed Co. | Banking / Defense / Gov |
| **Price (USD)** | **$49/yr (Special)** ~ $149/yr | **$799/yr** | **$7,990/yr (Base Fee)** | **Contact Sales** |
| **Machine UUID Limit** | **1 UUID** | 3 UUIDs | 15 UUIDs | **Unlimited** |
| **Concurrent Agents** | **5 Agents** *(2 in Free-Trial)* | 30 Agents | 450 Agents | **Unlimited (Swarm)** |
| **Pillar 1: Principal (Identity)** | ✅ **libdros-id SDK** | ✅ **3-Tier PKI DIT** | ✅ **Cross-Domain BEC Issuance** | ✅ Hardware Dongle |
| **Pillar 2: Authorization (Deterministic)**| ✅ **Basic Scope Match** | ✅ **Zero-Heap Bitmaps** | ✅ **Custom Capability Vector**| ✅ Multi-Dim Bitmap Matrix |
| **Pillar 3: Tool Bound (Syscall Gate)** | ✅ **C-ABI Interception** | ✅ **26.1μs In-Band Fuse** | ✅ **Sub-500ns Thread Panic**| ✅ Hardware Physical Fusing |
| **Pillar 4: Policy Gate (Dynamic Control)**| ❌ *(Requires Startup)* | ✅ **Dynamic PII Masking** | ✅ **HITL Multi-Sig + ZKP** | ✅ Military Gate Matrix |
| **Pillar 5: Audit Log (Non-Repudiation)** | ✅ **Basic JSON Chain** | ✅ **Ed25519 Signatures**| ✅ **SHA-256 Merkle Tree** | ✅ Court-Admissible Proof |
| **Pillar 6: Expiry/Revocation (<1μs)** | ❌ Manual Restart | 🟡 15-min BEC Expiry | ✅ **<1μs RCU Pointer Swap** | ✅ Distributed Mesh Revoke |
| **RFC-010 Open Passport Standard** | ✅ **Signing & Issuing** | ✅ **Multi-Role DIT Sign** | ✅ **GuardVM Validation** | ✅ 3-Tier Sign Chain |
| **Add-On Compliance Packages** | ❌ *(Requires Startup)* | 💡 **Eligible for Add-Ons** | ⭐ **Eligible for Add-Ons** | ✅ Fully Included |
| **Deployment Target** | **Local PC / Docker Gateway** | **VM / NAS Docker** | K8s / GKE / Cluster | Air-Gapped / FPGA |

---

## 🌐 Official Platform & Documentation
For full interactive benchmarks, live attack demonstrations, enterprise compliance tools, and SDK guides, visit the official portal:
👉 **[https://dr-os.io](https://dr-os.io)**

---

## ⚡ Features
- **Microsecond Tool Interception**: Evaluates all Agent Tool-Calls against deterministic compile-time policies (<1μs).
- **Prompt Injection Defense**: Stops jailbreaks and context contamination before unauthorized actions take place.
- **Strict Fail-Closed**: Physical fusing prevents unauthorized external execution.
- **Zero-Friction Integration**: Connects seamlessly with the DROS Hacker/Enterprise Gateway running on Docker.

---

## 🚀 Quick Start (30 Seconds)

### Step 1: Start the DROS Docker Gateway
Run the official DROS Hacker Gateway container:
```bash
docker run -d -p 8080:8080 --name dros-gateway dros/hacker-gateway:v1.0.0
```

### Step 2: Install the Plugin in DSH
```bash
dsh plugin --profile web add dsh-plugin-vajraclaw
```

### Step 3: Run your DSH Agent
Your DSH Agents are now 100% governed by DROS execution policies! All malicious and out-of-boundary tool calls will be intercepted in under 1 microsecond.

---

## ⚙️ Configuration
In DSH Settings (or `config.json`):
- `gatewayUrl`: `http://localhost:8080` (Default)
- `strictFailClosed`: `true` (Enforce safety fallback if Gateway is unreachable)
- `licenseKey`: Enter your Gumroad Hacker Key to unlock 5 concurrent agents.

---

## 📜 Academic Papers & Whitepapers
The architecture and patent boundaries of DROS are established in **The DROS Academic Trilogy**:
1. **DROS-6P**: *A Unified Deterministic Runtime Governance Architecture Closing the Six Fundamental Trust Boundaries of Enterprise AI Agents* ([DOI: 10.5281/zenodo.21808499](https://doi.org/10.5281/zenodo.21808499))
2. **DROS 4-Layer**: *DROS 4-Layer Defense-in-Depth Architecture for Autonomous AI Workloads* ([DOI: 10.5281/zenodo.21755654](https://doi.org/10.5281/zenodo.21755654))
3. **DROS-PGM**: *Runtime Attribution Framework: An External C-ABI and PKI-Based Zero-Trust Infrastructure for Non-Repudiable Execution Governance in Multi-Agent Systems*

---

## 🏢 Enterprise Solutions & Custom Inquiries
Need cluster-wide governance, K8s mesh control planes, or HIPAA/FinRisk compliance packages?
Explore enterprise plans at **[dr-os.io/pricing](https://dr-os.io/pricing)**.

---

## 🏛️ Official Organization & Contact Information
* **Company**: Top-Celestial Company Ltd. (康宸園有限公司)
* **Official Website**: [https://dr-os.io](https://dr-os.io)
* **Customer Support & Business Inquiries**: [service@dr-os.io](mailto:service@dr-os.io)
* **GitHub Organization**: [https://github.com/Top-Celestial-Company-Ltd](https://github.com/Top-Celestial-Company-Ltd)

---

# 🇹🇼 繁體中文說明

專為 **DeepSeek Harness (DSH)** 生態打造的官方確定性運行期安全治理與工具調用熔斷外掛。

---

> 🎁 **【DSH 開發者社群首發狂歡特惠：$49 美元 / 年（天數自動無縫疊加 +365 天）】**
> 
> 為致敬 DSH 開發者生態，DROS 官方提供 **Free-Trial 滿血全功能體驗**（支援 30 天 / 2 個並發 Agent，AST 編譯器、紅隊攻擊模擬器與自訂 `Vajra.md` 零閹割完全開放！）。
> 
> ⚡ **完全不用等 30 天試用期結束！**
> 現在購買，系統會**直接在您現有的試用期上疊加 +365 天**（立即享有 **395 天完整守護** + 當場解鎖 5 個並發 Agent 與工作站權限）！
> 
> 🎟️ 結帳輸入專屬折扣碼：**`DSH_VAJRACLAW_LAUNCH`** ➔ **首發狂歡特惠價：$49 美元 / 年**（原價 $149/年，限量前 1,000 名）！
> 
> 👉 **[立即領取 $49 DSH 社群專屬授權 (Gumroad 快速結帳)](https://drosvajra.gumroad.com/l/vajraclaw-hacker/DSH_VAJRACLAW_LAUNCH)**

---

## 📊 DROS 官方產品階梯與 6-Pillar 安全防禦規格對照表

> 💡 **免費試用說明**：外掛預設以 **Free-Trial 模式（上限 2 個並發 Agent、30 天試用）** 運作，且具備 100% 完整 Hacker 級安全防護功能。輸入 Hacker 授權碼後立即解鎖為 **5 個並發 Agent** 並移除天數限制。

| 安全功能 / 6-Pillar 機制維度 | 🟢 Hacker (DSH 外掛版) | 🔵 Startup | 🟣 Enterprise | 👑 Sovereign |
| :--- | :---: | :---: | :---: | :---: |
| **目標客戶** | **個人開發者 / DSH 用戶** | 10~50人新創團隊 | 中大型企業 / 上市公司 | 金融金控 / 國防 |
| **價格 (USD)** | **$49/年 (首發特惠)** ~ $149/年 | **$799/年** | **$7,990/年 (基礎年約)** | **專案諮詢** |
| **機器授權 (UUIDs)** | **1 組 UUID** | 3 組 UUIDs | 15 組 UUIDs | **無限制** |
| **Concurrent Agents 上限** | **5 個** *(免費版為 2 個)* | 30 個 | 450 個 | **無限制 (Swarm)** |
| **Pillar 1：Principal 身份證明** | ✅ **libdros-id SDK** | ✅ **3-Tier PKI DIT** | ✅ **跨域 BEC 憑證發放** | ✅ 硬體 Dongle 印記 |
| **Pillar 2：Authorization 權限區隔**| ✅ **基礎 Scope 比對** | ✅ **零堆積 Bitmaps** | ✅ **全自訂 Capability 向量**| ✅ 動態位元圖多維矩陣 |
| **Pillar 3：Tool Bound 工具邊界** | ✅ **C-ABI 基礎攔截** | ✅ **26.1μs 帶內熔斷** | ✅ **Sub-500ns Thread Panic**| ✅ 晶片硬體級物理熔斷 |
| **Pillar 4：Policy Gate 三大門閥** | ❌ *(升級 Startup)* | ✅ **動態 PII 遮蔽** | ✅ **HITL 雙簽 + ZKP-Lite** | ✅ 軍規級門閥矩陣 |
| **Pillar 5：Audit Log 稽核追溯** | ✅ **基礎 JSON 鏈** | ✅ **Ed25519 數位簽章**| ✅ **SHA-256 Merkle 雜湊鏈** | ✅ 不可否認性法院級憑證 |
| **Pillar 6：Expiry/Revocation 秒撤**| ❌ 需手動重啟 | 🟡 15分鐘 BEC 過期 | ✅ **<1μs RCU 原子指針切換** | ✅ 分散式秒級網格撤銷 |
| **RFC-010 開放 Agent 護照格式** | ✅ **簽章與發行** | ✅ **多角色 DIT 簽署** | ✅ **企業 GuardVM 集中驗證** | ✅ 國防級 3-Tier 簽章鏈 |
| **開放彈性加購產業合規 Package** | ❌ *(升級 Startup)* | 💡 **開放彈性加購** | ⭐ **開放彈性加購** | ✅ 包含完整權限 |
| **部署載體** | **Local PC / Docker 網關** | **VM / NAS Docker** | K8s / GKE / Cluster | Air-Gapped / FPGA |

---

## ⚡ 核心功能特性
- **微秒級工具調用攔截**：在 Agent 執行任何 Tool 前進行 $\mathcal{O}(1)$ 常數時間點陣圖校驗（延遲 < 1μs）。
- **提示注入與上下文污染防禦**：在不可信任的輸入觸發實際操作前實施帶內阻斷。
- **鋼性預設拒絕 (Strict Fail-Closed)**：一旦超出安全邊界立即進行物理熔斷，絕不妥協。
- **零摩擦極速整合**：透過 Docker 容器化網關與 DSH 實現秒級無縫對接。

---

## 🚀 30 秒極速上手

### 步驟 1：啟動 DROS Docker 網關
```bash
docker run -d -p 8080:8080 --name dros-gateway dros/hacker-gateway:v1.0.0
```

### 步驟 2：在 DSH 中安裝外掛
```bash
dsh plugin --profile web add dsh-plugin-vajraclaw
```

### 步驟 3：開始安全運行您的 DSH Agent
您的 DSH Agent 現在 100% 受 DROS 執行策略保護！所有越權操作將在 1 微秒內被精準阻斷。

---

## ⚙️ 外掛設定選項
在 DSH 設定介面中：
- `gatewayUrl`: `http://localhost:8080` (預設網關位置)
- `strictFailClosed`: `true` (若網關斷線強制開啟安全防護)
- `licenseKey`: 輸入您的 Gumroad 授權碼即可解鎖 5 個並發 Agent。

---

## 📜 學術論文與技術白皮書
本系統之架構設計與專利防線奠基於 **DROS 論文三部曲 (The DROS Academic Trilogy)**：
1. **DROS-6P**: *A Unified Deterministic Runtime Governance Architecture Closing the Six Fundamental Trust Boundaries of Enterprise AI Agents* ([DOI: 10.5281/zenodo.21808499](https://doi.org/10.5281/zenodo.21808499))
2. **DROS 4-Layer**: *DROS 4-Layer Defense-in-Depth Architecture for Autonomous AI Workloads* ([DOI: 10.5281/zenodo.21755654](https://doi.org/10.5281/zenodo.21755654))
3. **DROS-PGM**: *Runtime Attribution Framework: An External C-ABI and PKI-Based Zero-Trust Infrastructure for Non-Repudiable Execution Governance in Multi-Agent Systems*

---

## 🏛️ 官方發行組織與聯繫資訊 (Official Contact)
* **發行主體**：Top-Celestial Company Ltd. (康宸園有限公司)
* **官方網站**：[https://dr-os.io](https://dr-os.io)
* **客戶服務與商務諮詢**：[service@dr-os.io](mailto:service@dr-os.io)
* **GitHub 官方組織**：[https://github.com/Top-Celestial-Company-Ltd](https://github.com/Top-Celestial-Company-Ltd)

---

## 📄 專利與法律聲明
**專利聲明：** DROS 執行治理與安全技術已申請美國臨時專利保護（U.S. Provisional Patent Application No. 64/111,973，Patent Pending）。
