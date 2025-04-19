# CLIB Monorepo

CLIB(Contract Library) 서비스의 레포지토리입니다.
프로젝트는 Java 기반 백엔드와 React 기반 프론트엔드를 포함한 모노레포 구조로 구성되어 있습니다.

본 프로젝트는 누구나 열람할 수 있도록 공개되어 있고, 기술 구조나 코드 참고용으로 자유롭게 활용 가능합니다.

다만, 실제 서비스와 연결된 데이터베이스 및 인증 서버 등은 회사 내부 인프라로 운영되고 있어,  
외부에서 클론한 코드만으로는 **정상적인 전체 서비스 실행은 불가능**합니다.

- `.env` 파일은 회사 내부에서만 제공되며, 운영용 DB/비밀키 정보는 포함되어 있지 않습니다.
- 로컬 실행은 구조 파악 및 프론트·백엔드 UI 테스트 정도까지만 가능합니다.

## 📋 프로젝트 구조

```
clib-monorepo/
├── apps/                                # 애플리케이션 디렉토리
│   ├── api/                             # 백엔드 API 서버 (Spring Boot)
│   │   ├── src/
│   │   │   └── main/
│   │   │       ├── java/com/clib/
│   │   │       │   ├── domain/          # 도메인 계층 (DDD 패턴)
│   │   │       │   │   ├── contract/    # 계약서 관련 도메인
│   │   │       │   │   │   ├── api/     # 컨트롤러
│   │   │       │   │   │   ├── application/ # 서비스
│   │   │       │   │   │   ├── domain/  # 엔티티
│   │   │       │   │   │   ├── dto/     # 데이터 전송 객체
│   │   │       │   │   │   └── repository/ # 리포지토리
│   │   │       │   │   ├── clause/      # 조항 관련 도메인
│   │   │       │   │   └── upload/      # 업로드 관련 도메인
│   │   │       │   ├── global/          # 전역 설정 및 공통 코드
│   │   │       │   │   └── config/      # 애플리케이션 설정
│   │   │       │   ├── infra/           # 인프라 계층
│   │   │       │   │   ├── persistence/ # 영속성 관련 구현
│   │   │       │   │   └── external/    # 외부 서비스 통합
│   │   │       │   └── ClibApplication.java # 메인 애플리케이션 클래스
│   │   │       └── resources/           # 설정 파일 및 리소스
│   │   ├── pom.xml                      # Maven 구성 파일
│   │   └── .env                         # 환경 변수 (로컬 개발용)
│   │
│   └── web/                             # 프론트엔드 웹 애플리케이션 (React + Vite)
│       ├── src/
│       │   ├── components/              # 재사용 가능한 UI 컴포넌트
│       │   │   ├── common/              # 공통 컴포넌트
│       │   │   ├── layout/              # 레이아웃 컴포넌트
│       │   │   └── contract/            # 계약서 관련 컴포넌트
│       │   ├── pages/                   # 페이지 컴포넌트
│       │   ├── hooks/                   # 커스텀 React 훅
│       │   ├── services/                # API 통신 서비스
│       │   ├── api/                     # API 클라이언트
│       │   ├── utils/                   # 유틸리티 함수
│       │   ├── lib/                     # 외부 라이브러리 래퍼
│       │   ├── assets/                  # 정적 자산
│       │   └── styles/                  # 스타일 파일
│       ├── package.json                 # 의존성 관리
│       └── vite.config.ts               # Vite 구성
│
├── packages/                            # 공유 패키지 디렉토리
│   ├── ui/                              # 공유 UI 컴포넌트 라이브러리
│   ├── eslint-config/                   # ESLint 공유 설정
│   └── tsconfig/                        # TypeScript 공유 설정
│
├── docker/                              # Docker 관련 설정 파일
│   └── .env.directus.example           # Directus CMS 환경 변수 예시
│
├── .env.example                         # 환경 변수 예시 파일
├── docker-compose.yml                   # Docker Compose 구성 파일
├── package.json                         # 루트 패키지 설정
└── turbo.json                           # Turborepo 설정
```

### 백엔드 (Spring Boot) 구조 상세 설명

백엔드는 도메인 주도 설계(DDD) 패턴을 따르는 Spring Boot 애플리케이션으로 구성되어 있습니다:

#### 1. 도메인 계층 (Domain Layer)

- **contract 도메인**: 계약서 관련 핵심 기능

  - `api`: 컨트롤러 (HTTP 요청 처리)
  - `application`: 서비스 (비즈니스 로직)
  - `domain`: 엔티티 (JPA 모델)
  - `dto`: 데이터 전송 객체
  - `repository`: 데이터 액세스 인터페이스

- **clause 도메인**: 계약 조항 관리 기능

  - 조항 생성, 수정, 삭제, 조회
  - 조항 템플릿 관리

- **upload 도메인**: 파일 업로드 처리 기능
  - 계약서 첨부 파일 관리
  - 이미지 및 문서 처리

#### 2. 글로벌 계층 (Global Layer)

- **config**: 애플리케이션 설정
  - 보안 설정 (Spring Security)
  - 데이터베이스 설정
  - 웹 설정 (CORS, 인터셉터 등)

#### 3. 인프라 계층 (Infrastructure Layer)

- **persistence**: 영속성 관련 구현
  - Repository 구현체
  - ORM 관련 설정
- **external**: 외부 서비스 통합
  - 클라우드 스토리지 연동
  - 외부 API 클라이언트

### 프론트엔드 (React + Vite) 구조 상세 설명

프론트엔드는 React와 Vite를 기반으로 구현되었습니다:

#### 1. 컴포넌트 구조

- **components**: 재사용 가능한 UI 컴포넌트
  - `common`: 버튼, 입력 필드, 모달 등 공통 UI 요소
  - `layout`: 헤더, 푸터, 사이드바 등 레이아웃 관련 컴포넌트
  - `contract`: 계약서 편집기, 미리보기, 조항 선택기 등

#### 2. 상태 관리 및 로직

- **hooks**: 커스텀 React 훅
  - 상태 관리 로직
  - 폼 관리
  - API 통신 로직
- **services**: API 통신 서비스
  - 백엔드 API 연동
  - 데이터 변환 및 처리

#### 3. 유틸리티 및 헬퍼

- **utils**: 유틸리티 함수
  - 날짜 처리
  - 문자열 조작
  - 계약서 관련 연산
- **lib**: 외부 라이브러리 래퍼
  - 인증 관련 유틸리티
  - API 클라이언트 설정

## 🚀 시작하기

### 요구사항

- Node.js 18.0.0 이상
- npm 또는 yarn
- Docker 및 Docker Compose (선택 사항)

### 설치 방법

1. 저장소를 클론합니다

```bash
git clone https://github.com/doyeondev/clib-monorepo.git
cd clib-monorepo
```

2. 종속성을 설치합니다

```bash
npm install
# 또는
yarn
```

3. 환경 변수를 설정합니다

```bash
cp .env.example .env
# .env 파일을 편집하여 환경 변수를 설정하세요
```

4. 개발 서버를 실행합니다

```bash
npm run dev
# 또는
yarn dev
```

## 🛠️ 개발

### 애플리케이션 및 패키지

- **apps/api**: 백엔드 API 서버
- **apps/web**: 프론트엔드 웹 애플리케이션

### 주요 명령어

```bash
# 모든 애플리케이션 및 패키지 개발 모드 실행
npm run dev

# 모든 애플리케이션 및 패키지 빌드
npm run build

# 모든 애플리케이션 및 패키지 린트 검사
npm run lint

# 모든 애플리케이션 및 패키지 테스트 실행
npm run test

# 캐시 및 node_modules 삭제
npm run clean

# 코드 형식 지정
npm run format
```

### Docker 사용

Docker Compose를 사용하여 필요한 서비스를 실행할 수 있습니다:

```bash
docker-compose up -d
```

이 명령어는 다음 서비스를 실행합니다:

- Directus CMS (포트: 8056)
- Redis (포트: 6379)
- Redis Commander (포트: 8090)

## 📝 워크플로우

CLIB 모노레포에서는 다음과 같은 워크플로우를 권장합니다:

1. 기능 브랜치 생성 (`feature/my-feature`)
2. 코드 작성 및 테스트
3. 커밋 및 푸시
4. Pull Request 생성
5. 코드 리뷰 후 메인 브랜치에 병합

## 기여하기

1. 이 저장소를 포크합니다
2. 새 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📄 라이센스

이 프로젝트는 [MIT 라이센스](LICENSE)에 따라 배포됩니다.
