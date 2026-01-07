# Barbie Virtual Fitting Experience ✨

バービー風バーチャル試着体験Webアプリケーション

## 概要

ユーザーが自分を録画し、選択した服を着た動画を生成するイベント用システムです。バービーをテーマにした可愛らしいデザインで、楽しい体験を提供します。

## 機能

### 実装済み機能

1. **ホーム画面** - バービー風のウェルカム画面
2. **カメラ録画** - 4秒間の動画録画機能
   - カメラアクセス管理
   - 人物ガイド表示
   - カウントダウン機能
3. **服選択** - 複数の服から選択
   - グリッドレイアウト
   - 視覚的フィードバック
4. **アップロード** - S3への動画アップロード
   - Presigned URL取得
   - 進捗表示
5. **動画生成** - AI動画生成リクエスト
   - ステータスポーリング
   - ローディングアニメーション
6. **結果表示** - 生成された動画の再生
   - 自動再生・ループ
   - やり直し機能

### デザイン特徴

- ピンク系カラーパレット
- バービー風の装飾要素（星、ハート、リボン）
- レスポンシブデザイン
- スムーズなアニメーション

## 技術スタック

- **フロントエンド**: React 18 + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: shadcn/ui
- **ルーティング**: React Router v6
- **動画録画**: MediaRecorder API
- **カメラアクセス**: getUserMedia API

## セットアップ

### 前提条件

- Node.js 20.19+ または 22.12+
- npm または yarn

### インストール

```bash
# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集してAPI URLを設定
```

### 開発

```bash
# 開発サーバー起動
npm run dev

# ブラウザで http://localhost:5173 を開く
```

### ビルド

```bash
# プロダクションビルド
npm run build

# ビルドのプレビュー
npm run preview
```

## API統合

このアプリケーションは以下のAPIエンドポイントを必要とします：

### 1. Presigned URL取得
```
POST /api/upload/presigned-url
Body: { fileName: string, contentType: string }
Response: { uploadUrl: string, videoKey: string, expiresIn: number }
```

### 2. 動画生成開始
```
POST /api/generate
Body: { videoKey: string, clothingId: string }
Response: { jobId: string, status: 'processing' }
```

### 3. 生成ステータス確認
```
GET /api/generate/status/:jobId
Response: { status: 'processing' | 'completed' | 'failed', videoUrl?: string, error?: string }
```

## ブラウザ対応

- Google Chrome (推奨)
- Microsoft Edge
- Mozilla Firefox
- Safari (macOS/iOS)

必要な機能：
- getUserMedia API (カメラアクセス)
- MediaRecorder API (動画録画)

## プロジェクト構造

```
barbie-virtual-fitting/
├── src/
│   ├── api/              # API クライアント
│   ├── components/       # Reactコンポーネント
│   │   ├── decorations/  # 装飾要素
│   │   └── ui/           # UIコンポーネント
│   ├── context/          # グローバルステート管理
│   ├── data/             # データ定義
│   ├── screens/          # 画面コンポーネント
│   ├── utils/            # ユーティリティ関数
│   ├── App.tsx           # メインアプリ
│   └── main.tsx          # エントリーポイント
├── .kiro/
│   └── specs/            # 仕様書
└── public/               # 静的ファイル
```

## 開発ガイドライン

### コーディング規約

- TypeScript strict mode
- ESLint + Prettier
- コンポーネントは関数コンポーネント
- Tailwind CSS for styling

### ステート管理

- React Context API for global state
- useState for local state
- Custom hooks for reusable logic

## トラブルシューティング

### カメラが起動しない

1. ブラウザのカメラ権限を確認
2. HTTPSまたはlocalhostで実行していることを確認
3. 他のアプリケーションがカメラを使用していないか確認

### ビルドエラー

```bash
# キャッシュをクリア
rm -rf node_modules/.vite
rm -rf dist

# 再インストール
npm install
npm run build
```

## ライセンス

MIT

## 貢献

プルリクエストを歓迎します！

## サポート

問題が発生した場合は、GitHubのIssuesで報告してください。
