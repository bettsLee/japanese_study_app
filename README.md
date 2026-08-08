# 🗾 日本語学習アプリ

> 日本現地生活中に出会った文章を保存し、単語・漢字・文法をクイズで繰り返し学習するアプリ

[![Frontend](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://japanese-study-app-front-dev.vercel.app/login)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)](https://japanese-study-app.onrender.com/health)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.8-black?logo=next.js)](https://nextjs.org)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?logo=springboot)](https://spring.io/projects/spring-boot)

---

## 📱 サービス紹介

日本現地で出会った文章を素早く保存し、保存した文章から単語・漢字・文法をタグ付けして毎日クイズで繰り返し学習する日本語学習アプリです。

---

## 🏗️ アーキテクチャ

```
[ユーザー]
   │
   ├── フロントエンド (Next.js 15)
   │       └── Vercelデプロイ
   │               └── Supabase Auth (Google OAuth)
   │
   └── バックエンド (Spring Boot 3.5)
           └── Renderデプロイ
                   └── Supabase PostgreSQL
```

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

## 🚀 デプロイURL

| 環境 | URL |
|---|---|
| フロントエンド | https://japanese-study-app-front-dev.vercel.app/login |
| バックエンドヘルスチェック | https://japanese-study-app.onrender.com/health |

---

## ⚙️ ローカル開発環境セットアップ

### Frontend

```bash
cd frontend
cp .env.example .env.local
# .env.localにSupabaseキーを入力
npm install
npm run dev
```

### Backend

```bash
cd backend
export DATABASE_URL=jdbc:postgresql://...
export DATABASE_USERNAME=...
export DATABASE_PASSWORD=...
./gradlew bootRun
```

### 環境変数

**frontend/.env.local**
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**backend**
```
DATABASE_URL=
DATABASE_USERNAME=
DATABASE_PASSWORD=
```

---

## 📋 ブランチ戦略

```
main        ← デプロイ用（直接コミット禁止）
develop     ← 開発統合
feature/JP-課題番号-作業名  ← 機能開発
```

---

## 🗺️ ロードマップ

| 状態 | 機能 | 判断根拠 |
|---|---|---|
| ✅ 完了 | ログイン/認証 | - |
| 📝 企画完了 | LLM自動タグ付けパイプライン | Impact最大、Effort中 → 最優先着手 |
| 🔜 予定 | 文章保存機能 | タグ付け機能と同時実装 |
| 🔜 予定 | クイズ機能 | タグ付け完了後に着手 |
| 🔜 予定 | RAGベース類似文章レコメンド | pgvector活用、次点優先 |
| 🔜 予定 | 評価(Eval)プロセス | golden datasetでタグ精度を検証 |

## 💡 次期開発: LLM自動タグ付けパイプライン（企画中）
- 目標: 保存した文章から単語・漢字・文法要素をLLMで自動抽出・タグ付け
- 設計方針: Redisキャッシングで重複リクエストのコストを削減、Circuit Breaker(Resilience4j)でAPI障害に対応
- 成功指標（測定予定）: タグ付け精度 / キャッシュヒット率 / 平均応答速度 / 月間APIコスト

---

## 🎯 プロダクト企画・意思決定

### 背景・課題意識

これまでの実務経験は、キャッシュ設計・分散ロック・アーキテクチャパターン・イベント駆動・サーバーレスなど、
伝統的なバックエンド領域に集中していた。一方で、AI/LLMを実際のプロダクト機能として設計・実装した経験が
なく、「AI活用」はAIコーディングツール(Claude Code)を用いた開発支援の範囲にとどまっていた。

また、これまでの案件は会社側にすでに存在する事業課題(外注費用、顧客離脱など)を起点に企画を主導した
ものであり、事業背景やリソースなしに個人が最初から課題を定義し、プロダクトを設計する経験は持っていな
かった。本プロジェクトは、この2点を補うために個人開発として立ち上げた。

### プロダクト概要

日本での実生活の中で出会った日本語の文章を保存し、単語・漢字・文法をタグ付けして反復学習できる学習
アプリ。自身の日本語学習ニーズを起点に企画・設計・実装まで単独で担当している。

- **ターゲットユーザー**: 日本在住で、教材の例文ではなく実生活で出会った表現を学習したい日本語学習者(自身を含む)
- **成功基準**: 保存した文章から学習に必要なタグ付けが自動化され、日々の反復学習(クイズ)につながる状態を作ること

### 企画プロセス

開発着手前に、以下を明文化した上でスコープを決定した。

- 課題定義・ターゲットユーザー・成功基準を整理したミニPRDを作成
- 検討した機能候補(自動タグ付け、類似文章レコメンド、チャットボットQ&A、音声認識など)をImpact/Effortの2軸で評価
- Impact最大・Effort中程度となった「LLM自動タグ付けパイプライン」を最優先機能として選定
- 実装を見送った機能(チャットボットQ&A、音声認識など)についても、見送った理由を含めて記録・公開

### 主要な意思決定

**AS-IS**
- LLM/生成AIを実プロダクト機能として組み込んだ経験がない
- 事業背景なしに個人でゼロから課題定義・機能設計を行った経験がない

**判断理由**
- AI関連サービスの統合力が採用市場で求められる中核スキルとなっており、LLM API連携・コスト最適化・
  障害対応といったAIバックエンドエンジニアリング力を実践的に養う必要があると判断
- 複数のAI機能候補をImpact/Effort観点で比較・判断するプロセス自体を通じて、実装力だけでなくプロダクト
  の優先順位を決定する力も併せて養うことを意図
- 既存の強み(Redisキャッシュ、障害対応アーキテクチャ)をAI API連携という新領域に適用することで、既存の
  エンジニアリング原則がAIシステムにも同様に通用するかを検証・拡張することを意図
- コード実装に先立って意思決定文書(ロードマップ、優先順位マトリクス)を残す習慣を自らに課すことで、
  企画力と実装力を同時に鍛えることを意図

**TO-BE**
- LLM API連携による自動タグ付けパイプラインの構築
- Redisキャッシュ・Circuit Breakerによるコスト最適化と障害耐性の確保
- pgvectorを用いたRAGベースの類似文章レコメンド
- golden datasetに基づく評価(Eval)プロセスの設計・実行

---

## 👥 チーム

| 役割 | 担当 |
|---|---|
| PM / QA | イ・サンクォン |
| フルスタック開発 | Claude Code AI |
| デザイン | Visily AI |
