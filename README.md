# 🗾 日本語学習アプリ

> 日本現地生活中に出会った文章を保存し、単語・漢字・文法をクイズで繰り返し学習するアプリ

[![Frontend](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://japanese-study-app-front-dev.vercel.app/login)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)](https://japanese-study-app.onrender.com/health)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.8-black?logo=next.js)](https://nextjs.org)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?logo=springboot)](https://spring.io/projects/spring-boot)

---

## 📱 サービス紹介

日本現地で出会った文章を素早く保存し、保存した文章から単語・漢字・文法をタグ付けして毎日クイズで繰り返し学習する日本語学習アプリです。
日本在住で、教材の例文ではなく実生活で出会った表現を学習したい日本語学習者(自身を含む)を対象としている。

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
| ✅ 完了 | 文章保存機能 | - |
| ✅ 完了 | クイズ機能 | - |
| 📝 企画完了 | LLM自動タグ付けパイプライン | Impact最大、Effort中 → 最優先着手 |
| 🔜 予定 | RAGベース類似文章レコメンド | pgvector活用、次点優先 |
| 🔜 予定 | 評価(Eval)プロセス | golden datasetでタグ精度を検証 |

**プロダクト指標**: コアループ完走率・リテンション・学習頻度(機能導入前後で比較)
**PM計画**: Impact/Effortマトリクス・ミニPRD文書化 → 仮説検証 → ベータフィードバック収集 → コスト・競合分析

---

## 🎯 プロダクト企画・意思決定

これまでAI/LLMを実プロダクト機能として扱った経験、および事業背景なしに個人でゼロから企画・意思決定を行った経験がなかったため、この2点を補うために本プロジェクトを立ち上げた。

複数の機能候補(自動タグ付け、類似文章レコメンド、チャットボットQ&A、音声認識など)を比較検討し、最もImpactが大きく取り組みやすい「LLM自動タグ付けパイプライン」を最優先で進めることに決定。今後はRAGベースの類似文章レコメンドや評価(Eval)プロセスの構築まで取り組む予定。

このプロセスを通じて、AIバックエンドエンジニアリング力(LLM API連携・コスト最適化・障害対応)と、ゼロから優先順位を判断するプロダクト思考の両方を実践的に養うことを目指している。

---

## 👥 チーム

| 役割 | 担当 |
|---|---|
| PM / QA | イ・サンクォン |
| フルスタック開発 | Claude Code AI |
| デザイン | Visily AI |
