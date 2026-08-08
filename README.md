# 🗾 日本語学習アプリ

> 日本現地生活中に出会った文章を保存し、単語・漢字・文法をクイズで繰り返し学習するアプリ。日本在住で、教材の例文ではなく実生活で出会った表現を学習したい日本語学習者(自身を含む)を対象としている。

[![Frontend](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://japanese-study-app-front-dev.vercel.app/login)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)](https://japanese-study-app.onrender.com/health)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.8-black?logo=next.js)](https://nextjs.org)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?logo=springboot)](https://spring.io/projects/spring-boot)

---

## 🎯 プロダクト企画・意思決定

これまでAI/LLMを実プロダクト機能として扱った経験、および事業背景なしに個人でゼロから企画・意思決定を行った経験がなかったため、この2点を補うために本プロジェクトを立ち上げた。

複数の機能候補(自動タグ付け、類似文章レコメンド、チャットボットQ&A、音声認識など)を比較検討し、最もImpactが大きく取り組みやすい「LLM自動タグ付けパイプライン」を最優先で進めることに決定。今後はRAGベースの類似文章レコメンドや評価(Eval)プロセスの構築まで取り組む予定。

**開発者として得られるもの**
- LLM API連携・Structured Output設計など、AIを実サービスに統合するバックエンドエンジニアリング経験
- キャッシュ・障害対応など既存のエンジニアリング原則をAIという新しい領域に応用する力
- RAG(ベクトル検索)・評価(Eval)パイプラインなど、採用市場で求められる最新のAIバックエンドパターンを直接実装する経験
- Claude Codeなど AIコーディングツールを活用し、一人でもフルスタック開発をやり遂げる生産的な開発ワークフロー

**PMとして得られるもの**
- 事業背景なしに自ら課題を定義し企画する、ゼロベースの企画力
- 複数の機能候補を比較し優先順位を決め、その根拠を残す意思決定プロセス
- 機能を作る前に仮説を立て、リリース後にデータで検証する仮説駆動思考
- 「何をもって成功とするか」を事前に定義し、測定可能な指標に落とし込む力
- 何をやらないかを判断し、その理由を記録するスコープ管理力

---

## 🛠️ 技術スタック

| 区分 | 技術 |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | Spring Boot 3.5, Java 17, Gradle |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth (Google OAuth) |
| Hosting | Vercel (フロント) + Render (バックエンド) |
| 協業ツール | Jira, Notion, GitHub |

---

## 📋 ブランチ戦略

main ← デプロイ用（直接コミット禁止）
develop ← 開発統合
feature/JP-課題番号-作業名 ← 機能開発


---

## 🗺️ ロードマップ

| 状態 | 機能 | 判断根拠 |
|---|---|---|
| ✅ 完了 | ログイン/認証 | - |
| ✅ 完了 | 文章保存機能 | - |
| ✅ 完了 | クイズ機能 | - |
| 📝 企画完了 | LLM自動タグ付けパイプライン | Impact最大、Effort中 → 最優先着手(Redisキャッシング・Circuit Breakerで安定性確保) |
| 🔜 予定 | RAGベース類似文章レコメンド | pgvector活用、次点優先 |
| 🔜 予定 | 評価(Eval)プロセス | golden datasetでタグ精度を検証 |

---

## 👥 チーム

| 役割 | 担当 |
|---|---|
| PM / QA | イ・サンクォン |
| フルスタック開発 | Claude Code AI |
| デザイン | Visily AI |
