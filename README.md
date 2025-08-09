# 智能禱告生成器 🙏

一個現代化的禱告內容生成應用程式，幫助用戶創造個人化的禱告內容，支援雲端同步和社群分享功能。

![Prayer Generator](https://img.shields.io/badge/Prayer-Generator-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-3178C6?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-10.7.1-FFCA28?style=for-the-badge&logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.3-06B6D4?style=for-the-badge&logo=tailwindcss)

## ✨ 功能特色

### 🤖 智能禱告生成
- 支援 7 種禱告類型：感恩、祈求、懺悔、讚美、代禱、保護、引導
- 可調整禱告長度和語調
- 支援特殊需求自定義
- 智能內容組合算法

### ☁️ 雲端同步
- Firebase 身份驗證
- 即時雲端資料同步
- 離線模式支援
- 跨設備數據一致性

### 👥 社群功能
- 禱告內容分享
- 社群互動（點讚、評論）
- 公開禱告瀏覽
- 用戶隱私保護

### 📱 現代化 UI/UX
- 響應式設計
- 深色/淺色主題切換
- 流暢的動畫效果
- 無障礙設計

### 💾 資料管理
- 本地存儲備份
- 禱告歷史記錄
- 收藏功能
- 資料匯出

## 🚀 快速開始

### 前置要求

- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器
- 現代瀏覽器（Chrome, Firefox, Safari, Edge）

### 安裝步驟

1. **克隆專案**
   ```bash
   git clone https://github.com/your-username/prayer-generator-app.git
   cd prayer-generator-app
   ```

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **配置 Firebase**
   
   在 `src/services/firebase.ts` 中更新 Firebase 配置：
   ```typescript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

4. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

5. **開啟瀏覽器**
   
   訪問 `http://localhost:3000`

## 📦 建置和部署

### 建置生產版本
```bash
npm run build
```

### 預覽建置結果
```bash
npm run preview
```

### 部署選項

#### Vercel 部署
```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

#### Netlify 部署
```bash
# 建置
npm run build

# 上傳 dist 目錄到 Netlify
```

#### Firebase Hosting
```bash
# 安裝 Firebase CLI
npm install -g firebase-tools

# 登入 Firebase
firebase login

# 初始化專案
firebase init hosting

# 部署
firebase deploy
```

## 🏗️ 專案結構

```
prayer-generator-app/
├── public/                 # 靜態資源
├── src/
│   ├── components/        # React 組件
│   │   ├── AuthModal.tsx     # 身份驗證模態框
│   │   ├── CommunityPrayers.tsx # 社群禱告
│   │   ├── Navigation.tsx    # 導航組件
│   │   ├── PrayerCard.tsx    # 禱告卡片
│   │   ├── PrayerGenerator.tsx # 禱告生成器
│   │   ├── PrayerHistory.tsx # 禱告歷史
│   │   └── UserProfile.tsx   # 用戶資料
│   ├── hooks/             # 自定義 Hooks
│   │   ├── useAuth.ts        # 身份驗證 Hook
│   │   └── usePrayerStorage.ts # 存儲 Hook
│   ├── services/          # 服務層
│   │   ├── authService.ts    # 身份驗證服務
│   │   ├── cloudStorage.ts   # 雲端存儲服務
│   │   └── firebase.ts       # Firebase 配置
│   ├── types/             # TypeScript 類型定義
│   │   └── index.ts
│   ├── utils/             # 工具函數
│   │   └── prayerTemplates.ts # 禱告模板
│   ├── App.tsx            # 主應用組件
│   ├── main.tsx           # 應用入口
│   └── index.css          # 全域樣式
├── index.html             # HTML 模板
├── package.json           # 專案配置
├── tailwind.config.js     # Tailwind CSS 配置
├── tsconfig.json          # TypeScript 配置
└── vite.config.ts         # Vite 配置
```

## 🛠️ 技術棧

### 前端框架
- **React 18** - 用戶界面框架
- **TypeScript** - 類型安全的 JavaScript
- **Vite** - 快速的建置工具

### UI/UX
- **Tailwind CSS** - 實用優先的 CSS 框架
- **Lucide React** - 美觀的圖標庫
- **React Hot Toast** - 優雅的通知組件

### 後端服務
- **Firebase Auth** - 身份驗證
- **Firestore** - 雲端資料庫
- **Firebase Hosting** - 靜態網站託管

### 開發工具
- **ESLint** - 代碼檢查
- **Prettier** - 代碼格式化
- **Husky** - Git hooks

## 📖 API 文檔

### 禱告生成 API

```typescript
// 生成禱告
function generatePrayer(request: PrayerRequest): string

interface PrayerRequest {
  category: PrayerCategory;
  specificNeeds?: string;
  length: 'short' | 'medium' | 'long';
  tone: 'formal' | 'casual' | 'traditional';
}
```

### 雲端存儲 API

```typescript
// 保存禱告
async savePrayer(prayer: Prayer): Promise<string>

// 獲取用戶禱告
async getUserPrayers(): Promise<Prayer[]>

// 分享禱告
async sharePrayer(prayerId: string, userName: string): Promise<void>
```

## 🤝 貢獻指南

我們歡迎社群貢獻！請遵循以下步驟：

1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

### 代碼規範

- 使用 TypeScript 進行類型檢查
- 遵循 ESLint 規則
- 編寫有意義的提交訊息
- 添加適當的註釋

## 🐛 問題回報

如果您發現任何問題，請在 [GitHub Issues](https://github.com/your-username/prayer-generator-app/issues) 中回報。

回報時請包含：
- 問題描述
- 重現步驟
- 預期行為
- 實際行為
- 瀏覽器和版本資訊

## 📄 授權

本專案採用 MIT 授權 - 詳見 [LICENSE](LICENSE) 文件。

## 🙏 致謝

- 感謝所有貢獻者的努力
- 特別感謝開源社群的支持
- 靈感來源於對信仰生活的熱愛

## 📞 聯繫我們

- 專案維護者：[Your Name](mailto:your.email@example.com)
- 專案首頁：[https://prayer-generator.app](https://prayer-generator.app)
- 問題回報：[GitHub Issues](https://github.com/your-username/prayer-generator-app/issues)

---

**願神祝福您的每一個禱告時光！** 🙏✨
