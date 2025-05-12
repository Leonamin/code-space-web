# CodeSpace Web

경량 코드 공유 플랫폼 **CodeSpace**의 프론트엔드 프로젝트입니다.  
CodeSpace는 사용자가 코드 스페이스를 생성하고, 유저들과 코드 조각을 공유·비교할 수 있는 플랫폼입니다.

## 🎨 브랜드 가이드

| 역할        | 컬러명          | HEX 코드  |
|-------------|-----------------|-----------|
| Primary     | Cool Lavender    | `#7C83FD` |
| Secondary   | Soft Sand        | `#F4F1DE` |
| Accent      | Coral Peach      | `#FF7F50` |
| Background  | Off White        | `#FFFDF9` |

## 📦 프로젝트 구조
```
src/
├─ components/ # 공통 컴포넌트
├─ pages/ # 화면 페이지
├─ services/ # API 호출 모듈
├─ hooks/ # 커스텀 훅
├─ styles/ # 전역 스타일
└─ utils/ # 유틸리티
```

## 🖥️ 주요 화면 및 기능

### ✅ 홈 화면
- CodeSpace 목록 카드형 표시
- 무한스크롤 지원 (데스크탑 4열 / 태블릿 2열 / 모바일 1열)
- FAB 클릭 시 CodeSpace 생성 화면 이동

### ✅ CodeSpace 생성 화면
- 이름, 설명, 소유자 이름, 비밀번호 입력 (설명 제외 필수)
- 생성 성공 시 홈으로 이동 및 목록 새로고침

### ✅ CodeSpace 상세 화면
- CodePiece 카드형 목록 표시
- 다중 선택 → 비교 모드 진입
- FAB를 통해 CodePiece 생성 화면 이동

### ✅ CodePiece 생성 화면
- 언어 선택 및 기타 언어 입력 지원
- 언어 기반 Syntax Highlight 에디터
- 생성 성공 시 CodeSpace 화면으로 이동

### ✅ CodePiece 상세 화면
- 제목, 설명, 언어, 코드 표시 (Lint 지원)

### ✅ CodePiece 비교 화면
- 2~4개 코드 비교 레이아웃
- 모바일 탭 전환 지원

## 🔗 API 명세

Base URL: `https://api-codespace.cuteshrew.com`

| 기능              | Method & Endpoint                             |
|-------------------|-----------------------------------------------|
| CodeSpace 목록 조회 | `GET /api/codespaces?page=0`                    |
| CodeSpace 생성     | `POST /api/codespaces`                          |
| CodePiece 목록 조회| `GET /api/codepieces?page=0&space_id=1`         |
| CodePiece 생성     | `POST /api/codepieces`                          |
| CodePiece 상세 조회| `GET /api/codepieces/{piece_id}`                |
| CodePiece 비교 조회| `GET /api/codepieces/compare?ids=1,2,3`         |

## ⚠️ 개발자 유의사항

- **생성 완료 시 자동 뒤로가기 및 목록 새로고침** UX 필요
- **쿼리 파라미터 기반 다중 조회(`?ids=1,2,3`)** 지원
- **데스크탑, 태블릿, 모바일 반응형 레이아웃** 구현 필수
- **코드 에디터 Lint 및 Syntax Highlight** 라이브러리 적용 권장

## 🚀 로컬 개발 실행 방법

```bash
git clone https://github.com/Leonamin/code-space-web.git
cd code-space-web
npm install
npm run dev
