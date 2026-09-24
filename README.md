<div align="center">
  <img src="characters/NAVELY.jpg" alt="TWICE LOVELYS" width="100" style="border-radius: 50%; box-shadow: 0 4px 12px rgba(255, 92, 141, 0.3);" />
  <h1>TWICE LOVELYS えほん</h1>
  <p><strong>ラブリーフルーツをさがして（尋找 Lovely 水果）</strong></p>
  <p>以 Hugo Framework 構建的 TWICE LOVELYS 日中雙語對照繪本靜態網站</p>

  <p>
    <a href="https://lovely-book.vercel.app"><img src="https://img.shields.io/badge/Demo-lovely--book.vercel.app-ff5c8d?style=flat-square&logo=vercel" alt="Live Demo" /></a>
    <img src="https://img.shields.io/badge/Hugo-v0.166.0-ff4088?style=flat-square&logo=hugo" alt="Hugo" />
    <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel" alt="Vercel" />
    <img src="https://img.shields.io/badge/Language-日中雙語對照-blue?style=flat-square" alt="Language" />
  </p>
</div>

---

## 專案簡介

本專案將 TWICE 官方可愛角色繪本故事《ラブリーフルーツをさがして（尋找 Lovely 水果）》數位化，以靜態網站形式提供沉浸式日語學習與雙語對照閱讀體驗。

全書收錄 22 話冒險故事，透過清新溫暖的日系兒童繪本視覺風格，結合動態收折卡片與翻頁繪本模式，讓讀者輕鬆欣賞 LOVELYS 的尋果冒險旅程。

> [!NOTE]
> 線上展示版本已部署於 Vercel：[https://lovely-book.vercel.app](https://lovely-book.vercel.app)

---

## 主要特色

- **日中雙語對照閱讀**：完整收錄全 22 節故事，每節皆包含日本語原文與繁體中文翻譯，支援對話框強調排版。
- **可收折章節卡片**：各故事章節可獨立點擊展開或收折，並提供「全部展開 / 全部收折」全域控制。
- **語言視圖切換**：提供「日中對照」、「僅日文」、「僅繁中」三種視圖模式，滿足不同學習與閱讀偏好。
- **9 隻 LOVELYS 角色專區**：詳載 9 位成員專屬代表色、日中文性格特質與頭像，支援點擊角色即時跳轉至該角色登場的故事章節。
- **沉浸式翻頁繪本模式 (Modal Reader)**：提供全螢幕單頁繪本閱讀視窗，支援滑鼠點擊翻頁與鍵盤方向鍵快捷操作（`←` / `→` / `ESC`）。
- **響應式日系繪本設計**：整合 Google Fonts `Zen Maru Gothic` 圓體字形、微動畫星光漂浮粒子與細緻的行動端適配。

---

## 9 隻 LOVELYS 角色陣容

| 角色名稱 | 代表成員 | 官方代表色 | 特質簡介（日 / 中） |
| :--- | :--- | :--- | :--- |
| **ナブリー (NAVELY)** | 娜璉 (Nayeon) | `#FF5C8D` | 子どもが大好き / 最喜歡小孩子 |
| **ジョンブリー (JEONGVELY)** | 定延 (Jeongyeon) | `#8ED752` | きれい好き / 愛乾淨、喜歡整潔 |
| **モブリー (MOVELY)** | Momo | `#FFA06D` | ダンス大好き / 最喜歡跳舞 |
| **サブリー (SAVELY)** | Sana | `#BA82E6` | てんしんらんまん / 天真爛漫 |
| **ジブリー (JIVELY)** | 志效 (Jihyo) | `#FFBF2B` | 歌うの大好き / 最喜歡唱歌 |
| **ミブリー (MIVELY)** | Mina | `#4BC5B8` | もくもく努力家 / 默默耕耘的努力家 |
| **ダブリー (DAVELY)** | 多賢 (Dahyun) | `#9F92E5` | もりあげ隊長 / 氣氛帶動隊長 |
| **チェンブリー (CHAENGVELY)** | 彩瑛 (Chaeyoung) | `#FF3366` | いちご大好き / 最喜歡草莓 |
| **ツブリー (TZUVELY)** | 子瑜 (Tzuyu) | `#2B76E6` | 走るの大好き / 最喜歡跑步 |

---

## 技術架構

- **靜態網站生成器**：[Hugo](https://gohugo.io/) (Extended Edition)
- **結構與佈局**：HTML5 Semantic Elements + Hugo Go Templates
- **樣式設計**：Vanilla CSS（CSS Variables、CSS Grid、Flexbox、自訂繪本設計系統）
- **互動邏輯**：Vanilla JavaScript（DOM 階層解析、閱讀器狀態管理、鍵盤事件綁定）
- **託管與佈署**：[Vercel](https://vercel.com/) (Edge Network)

---

## 快速開始

### 環境需求

- [Hugo Extended](https://gohugo.io/installation/) (`v0.150.0` 或更高版本)
- [Node.js](https://nodejs.org/) (`v18+`，如需使用 Vercel CLI 佈署)

### 本地開發

1. 複製專案庫：
   ```bash
   git clone https://github.com/kylhuang/twice-lovely-picture-book.git
   cd twice-lovely-picture-book
   ```

2. 啟動 Hugo 本地開發伺服器：
   ```bash
   hugo server
   ```

3. 在瀏覽器開啟：`http://localhost:1313/`，伺服器支援即時熱重載 (Fast Render)。

### 編譯生產版本

生成靜態網站產物至 `public/` 目錄：

```bash
hugo --gc --minify
```

---

## 佈署指南

專案已內建 [vercel.json](vercel.json) 設定，可直接使用 Vercel 進行全自動化佈署。

### 使用 Vercel CLI

```bash
# 登入 Vercel 帳號
vercel login

# 連結專案並部署至生產環境
vercel deploy --prod
```

> [!TIP]
> 若透過 GitHub 連接 Vercel，推送到 `main` 分支時將自動觸發 CI/CD 構建並發布。

---

## 專案結構

```text
twice-lovely-picture-book/
├── .agents/               # 智慧助理與 MCP 設定檔
│   └── mcp_config.json
├── characters/            # 9 隻 LOVELYS 原始圖片
├── content/               # 繪本 Markdown 文本內容
│   └── _index.md
├── data/                  # 結構化資料 (角色資訊、顏色、章節關聯)
│   └── lovelys.json
├── layouts/               # Hugo 版型樣板
│   ├── _default/
│   │   └── baseof.html    # 全站基礎 HTML 骨架
│   ├── partials/
│   │   ├── header.html    # 頂部導覽列
│   │   └── footer.html    # 頁尾說明
│   └── index.html         # 繪本首頁主體 (展示區、角色、收折故事卡片)
├── static/                # 靜態資源 (編譯時直接複製至輸出目錄)
│   ├── characters/        # 角色頭像圖片
│   ├── css/
│   │   └── style.css      # 繪本主題樣式表
│   └── js/
│   │   └── main.js        # 收折卡片轉化、翻頁閱讀器、互動邏輯
├── content.md             # 原始中日翻譯草稿存檔
├── hugo.toml              # Hugo 專案核心設定檔
└── vercel.json            # Vercel 雲端佈署配置
```
