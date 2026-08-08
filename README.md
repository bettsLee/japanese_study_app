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

## 📁 フォルダ構成

```
japanese_study_app/
├── frontend/          # Next.jsプロジェクト
│   ├── app/
│   │   ├── login/     # ログインページ
│   │   └── auth/      # OAuthコールバック
│   └── lib/
│       └── supabase/  # Supabaseクライアント
└── backend/           # Spring Bootプロジェクト
    ├── src/
    │   └── main/java/com/jp5/backend/
    │       ├── controller/  # REST API
    │       └── config/      # Security設定
    └── Dockerfile
```

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

## 📌 スプリント状況

| 課題 | 作業 | 状態 |
|---|---|---|
| JP-5 | プロジェクト初期セットアップ | ✅ 完了 |
| JP-6 | ログイン画面UI | ✅ 完了 |
| JP-8 | 文章保存機能 | 🔜 予定 |
| JP-9 | 単語/漢字/文法タグ付け | 🔜 予定 |
| JP-10 | クイズ機能 | 🔜 予定 |

---

## 🗺️ ロードマップ

| 状態 | 機能 | 判断根拠 |
|---|---|---|
| ✅ 完了 | ログイン/認証 | - |
| 📝 企画完了 | LLM自動タグ付けパイプライン | Impact最大、Effort中 → 最優先着手 |
| 🔜 予定 | 文章保存機能 | タグ付け機能と同時実装 |
| ⏸️ 保留 | チャットボットQ&A (RAG) | Impact対比Effortが大きく後回しと判断 |
| ⏸️ 保留 | 音声認識(STT) | コア学習ループ完成後に着手予定 |

## 💡 次期開発: LLM自動タグ付けパイプライン（企画中）
- 目標: 保存した文章から単語・漢字・文法要素をLLMで自動抽出・タグ付け
- 設計方針: Redisキャッシングで重複リクエストのコストを削減、Circuit Breaker(Resilience4j)でAPI障害に対応
- 成功指標（測定予定）: タグ付け精度 / キャッシュヒット率 / 平均応答速度 / 月間APIコスト

---

## 👥 チーム

| 役割 | 担当 |
|---|---|
| PM / QA | イ・サンクォン |
| フルスタック開発 | Claude Code AI |
| デザイン | Visily AI |
