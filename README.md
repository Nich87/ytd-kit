# ytd-kit

YouTubeダウンローダーキット - シンプルで高機能なYouTube動画ダウンローダー

## 🚀 特徴

- **動画ダウンロード**: YouTube動画を高品質でダウンロード
- **音声抽出**: 動画から音声のみを抽出してダウンロード
- **プレイリスト対応**: YouTube プレイリスト全体のダウンロード
- **検索機能**: キーワードでYouTube動画を検索
- **レスポンシブデザイン**: モバイルとデスクトップに対応

## 🛠️ 技術スタック

- **フレームワーク**: SvelteKit
- **スタイリング**: TailwindCSS + DaisyUI
- **YouTube API**: youtubei.js
- **型安全性**: TypeScript
- **パッケージマネージャー**: pnpm

## 📁 プロジェクト構造

```
src/
├── lib/
│   ├── components/
│   │   ├── ui/                 # 再利用可能UIコンポーネント
│   │   │   ├── Header.svelte
│   │   │   ├── Footer.svelte
│   │   │   ├── Spinner.svelte
│   │   │   └── modals/         # モーダル関連
│   │   └── features/           # 機能別コンポーネント
│   │       └── tabs/           # タブ機能
│   ├── services/
│   │   └── youtube.ts          # YouTube API サービス
│   ├── stores/
│   │   └── ui.ts              # UI状態管理
│   ├── utils/
│   │   ├── formatters.ts      # フォーマット関数
│   │   └── url-parser.ts      # URL解析
│   └── types/
│       └── youtube.ts         # 型定義
├── routes/
│   ├── api/ytdl/              # YouTube API エンドポイント
│   │   ├── info/              # 動画情報取得
│   │   ├── download/          # ダウンロード
│   │   ├── playlist/          # プレイリスト
│   │   └── search/            # 検索・候補
│   └── +page.svelte           # メインページ
└── app.html
```

## 🔧 開発

### 前提条件

- Node.js 22.x以上
- pnpm

### セットアップ

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev

# 本番ビルド
pnpm build

# プレビュー
pnpm preview
```

### 開発コマンド

```bash
# 型チェック
pnpm check

# リント
pnpm lint

# フォーマット
pnpm format

# テスト実行
pnpm test
```

## 📋 リファクタリング内容

### ✅ 完了した改善

1. **フォルダ構造の再編成**
   - コンポーネントを機能別・UI別に分類
   - utilsフォルダでヘルパー関数を整理
   - servicesフォルダでAPI処理を統一

2. **コード重複の削除**
   - YouTubeサービスクラスでInnertube処理を統一
   - エラーハンドリングの標準化
   - 不要なアダプターの削除

3. **型安全性の向上**
   - 型定義ファイルの整理
   - より具体的な型名に変更

4. **コードクリーンアップ**
   - コメントアウトされたコードの削除
   - 未使用ファイルの削除
   - 関数名の統一

### 🔄 アーキテクチャの改善

- **シングルトンパターン**: YouTubeサービスでInnertubeインスタンスを統一管理
- **関心の分離**: UI、ビジネスロジック、ユーティリティを明確に分離
- **エラーハンドリング**: 各APIエンドポイントで一貫したエラー処理

## 📄 ライセンス

MIT License

## 🤝 貢献

プルリクエストや Issue の報告を歓迎します。

## 📞 サポート

問題や質問がある場合は、GitHub Issues をご利用ください。
