# 🗾 Japanese Study App

> 일본 현지 생활 중 접한 문장을 저장하고, 단어·한자·문법을 퀴즈로 반복 학습하는 앱

[![Frontend](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://japanese-study-app-front-dev.vercel.app/login)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)](https://japanese-study-app.onrender.com/health)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.8-black?logo=next.js)](https://nextjs.org)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?logo=springboot)](https://spring.io/projects/spring-boot)

---

## 📱 서비스 소개

일본 현지에서 접한 문장을 빠르게 저장하고, 저장된 문장에서 단어·한자·문법을 태깅해 매일 퀴즈로 반복 학습하는 일본어 학습 앱입니다.

---

## 🏗️ 아키텍처

```
[사용자]
   │
   ├── 프론트엔드 (Next.js 15)
   │       └── Vercel 배포
   │               └── Supabase Auth (Google OAuth)
   │
   └── 백엔드 (Spring Boot 3.5)
           └── Render 배포
                   └── Supabase PostgreSQL
```

---

## 🛠️ 기술 스택

| 구분 | 기술 |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | Spring Boot 3.5, Java 17, Gradle |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth (Google OAuth) |
| Hosting | Vercel (프론트) + Render (백엔드) |
| 협업 도구 | Jira, Notion, GitHub |

---

## 🚀 배포 URL

| 환경 | URL |
|---|---|
| 프론트엔드 | https://japanese-study-app-front-dev.vercel.app/login |
| 백엔드 헬스체크 | https://japanese-study-app.onrender.com/health |

---

## 📁 폴더 구조

```
japanese_study_app/
├── frontend/          # Next.js 프로젝트
│   ├── app/
│   │   ├── login/     # 로그인 페이지
│   │   └── auth/      # OAuth 콜백
│   └── lib/
│       └── supabase/  # Supabase 클라이언트
└── backend/           # Spring Boot 프로젝트
    ├── src/
    │   └── main/java/com/jp5/backend/
    │       ├── controller/  # REST API
    │       └── config/      # Security 설정
    └── Dockerfile
```

---

## ⚙️ 로컬 개발 환경 설정

### Frontend

```bash
cd frontend
cp .env.example .env.local
# .env.local에 Supabase 키 입력
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

### 환경변수

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

## 📋 브랜치 전략

```
main        ← 배포용 (직접 커밋 금지)
develop     ← 개발 통합
feature/JP-이슈번호-작업명  ← 기능 개발
```

---

## 📌 스프린트 현황

| 이슈 | 작업 | 상태 |
|---|---|---|
| JP-5 | 프로젝트 초기 세팅 | ✅ 완료 |
| JP-6 | 로그인 화면 UI | ✅ 완료 |
| JP-8 | 문장 저장 기능 | 🔜 예정 |
| JP-9 | 단어/한자/문법 태깅 | 🔜 예정 |
| JP-10 | 퀴즈 기능 | 🔜 예정 |

---

## 👥 팀

| 역할 | 담당 |
|---|---|
| PM / QA | 이상권 |
| Full Stack 개발 | Claude Code AI |
| 디자인 | Visily AI |
