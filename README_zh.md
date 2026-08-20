# ⚡ DROS™ VajraClaw for DSH (DeepSeek Harness)
### DSH Agent 確定性執行治理與微秒級安全熔斷外掛

[![Official Website](https://img.shields.io/badge/官方網站-dr--os.io-purple.svg?style=for-the-badge)](https://dr-os.io)
[![DSH Compatible](https://img.shields.io/badge/DSH-Compatible-success)](https://github.com/deepseek-ai/dsh)
[![npm version](https://img.shields.io/npm/v/dsh-plugin-vajraclaw.svg)](https://www.npmjs.com/package/dsh-plugin-vajraclaw)
[![Patent Status](https://img.shields.io/badge/U.S._Patent-64%2F111%2C973-blue.svg)](#)

[English](https://github.com/Top-Celestial-Company-Ltd/dsh-dros-vajraclaw/blob/main/README.md) | [繁體中文](https://github.com/Top-Celestial-Company-Ltd/dsh-dros-vajraclaw/blob/main/README_zh.md) | [🌐 官方網站 (dr-os.io)](https://dr-os.io)

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

## 🏢 企業方案與大量部署
若您的企業需要私有化叢集、K8s Mesh 控制平面或醫療/金融專屬合規套裝包，請參閱：
👉 **[dr-os.io/pricing](https://dr-os.io/pricing)**

---

## 🏛️ 官方發行組織與聯繫資訊 (Official Contact)
* **發行主體**：Top-Celestial Company Ltd. (康宸園有限公司)
* **官方網站**：[https://dr-os.io](https://dr-os.io)
* **客戶服務與商務諮詢**：[service@dr-os.io](mailto:service@dr-os.io)
* **GitHub 官方組織**：[https://github.com/Top-Celestial-Company-Ltd](https://github.com/Top-Celestial-Company-Ltd)

---

## 📄 專利與法律聲明
**專利聲明：** DROS 執行治理與安全技術已申請美國臨時專利保護（U.S. Provisional Patent Application No. 64/111,973，Patent Pending）。
