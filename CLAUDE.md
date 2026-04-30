# CLAUDE.md

## 프로젝트 개요
일본 현지 생활 중 접한 문장을 저장하고,
단어/한자/문법을 퀴즈로 반복 학습하는 앱

## 기술 스택
- Frontend: Next.js 15 (TypeScript) + Tailwind CSS
- Backend: Spring Boot 3.5 (Java 17) + Gradle
- Database: PostgreSQL
- Auth: Supabase Auth
- Hosting: Vercel (프론트) + Render (백엔드)

## 폴더 구조
- frontend/ → Next.js 프로젝트
- backend/ → Spring Boot 프로젝트

## 브랜치 전략
- main: 배포용 (직접 커밋 금지)
- develop: 개발 통합 브랜치
- feature/JP-이슈번호-작업명: 기능별 브랜치

## 코드 규칙
- 커밋 메시지: [JP-번호] 작업내용
- PR 제목: [JP-번호] 작업내용
- 주석은 한국어로 작성
- 환경변수는 .env.example에 키만 추가 (값은 절대 커밋 금지)

## 완료 조건
모든 작업 완료 후 아래 순서로 마무리:
1. feature/JP-이슈번호 브랜치에 커밋
2. gh pr create --base develop \
   --title "[JP-이슈번호] 작업제목" \
   --body "작업 내용 요약" 으로 PR 생성

## 참고
- Jira 보드: https://lsk941017.atlassian.net/jira/software/projects/JP/boards/1
- GitHub: https://github.com/bettsLee/japanese_study_app
