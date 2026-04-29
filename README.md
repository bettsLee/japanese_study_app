# JP-5 — 일본어 현지 문장 학습 앱

일본 현지 생활 중 접한 문장을 저장하고, 단어·한자·문법을 퀴즈로 반복 학습하는 앱입니다.

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| Frontend | Next.js 15 (TypeScript, Tailwind CSS, App Router) |
| Backend | Spring Boot 3.5 (Java 17, Gradle) |
| Database | PostgreSQL |
| Auth | Supabase Auth |
| 배포 | Vercel (프론트) · Railway (백엔드) |

## 프로젝트 구조

```
jp5/
├── frontend/               # Next.js 앱
│   ├── app/                # App Router 페이지 및 레이아웃
│   ├── components/         # 재사용 UI 컴포넌트
│   ├── lib/                # API 클라이언트, 유틸리티
│   └── types/              # TypeScript 타입 정의
│
└── backend/                # Spring Boot API 서버
    └── src/main/java/com/jp5/backend/
        ├── controller/     # REST API 컨트롤러
        ├── service/        # 비즈니스 로직
        ├── repository/     # JPA 레포지토리
        ├── domain/         # 엔티티
        ├── dto/            # 요청/응답 DTO
        ├── config/         # Security, CORS 등 설정
        └── exception/      # 예외 처리
```

## 로컬 개발 환경 세팅

### 사전 요구사항

- Java 17+
- Node.js 18+
- PostgreSQL 15+

### 1. 데이터베이스 생성

```sql
CREATE DATABASE jp5_dev;
```

### 2. 백엔드 실행

```bash
cd backend

# 환경변수 설정
cp .env.example .env
# .env 파일에 DB 정보 입력

# 실행 (local 프로파일 사용)
./gradlew bootRun --args='--spring.profiles.active=local'
```

서버가 `http://localhost:8080` 에서 실행됩니다.

### 3. 프론트엔드 실행

```bash
cd frontend

# 환경변수 설정
cp .env.example .env.local
# .env.local 파일에 값 입력

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

앱이 `http://localhost:3000` 에서 실행됩니다.

## 브랜치 전략

| 브랜치 | 용도 |
|--------|------|
| `main` | 프로덕션 배포 |
| `develop` | 통합 개발 브랜치 |
| `feature/JP-{번호}-{설명}` | 기능 개발 |
| `fix/JP-{번호}-{설명}` | 버그 수정 |

## 라이선스

Private
