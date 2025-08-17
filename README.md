# 🎓 이룸클래스 React 학습 프로젝트

**React 초보자를 위한 현대적인 웹 애플리케이션 학습 프로젝트**

이 프로젝트는 React 초보자가 최신 React 생태계를 학습할 수 있도록 설계된 포켓몬 도감 애플리케이션입니다. 실무에서 사용되는 최신 기술들을 단계별로 학습하면서 현대적인 React 개발 패턴을 익힐 수 있습니다.

## 🎯 학습 목표

- **React 19의 새로운 기능들** 체험하기
- **파일 기반 라우팅**으로 직관적인 페이지 구조 이해하기
- **원자 단위 상태 관리(Atomic State)**로 복잡한 상태를 간단하게 관리하기
- **TypeScript**로 안전한 코드 작성하기
- **현대적인 UI 컴포넌트** 시스템 활용하기
- **팀 협업을 위한 개발 컨벤션** 익히기

## 🚀 빠른 시작

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (포트 3011)
npm run dev

# 프로젝트 열기
http://localhost:3011
```

## 🚨 필수 준수사항

> **⚠️ 팀 협업을 위해 반드시 지켜야 할 규칙들입니다.**

### 1. API 호출 규칙

```typescript
// ❌ 절대 금지: fetch 직접 사용
const response = await fetch("/api/data");

// ✅ 필수: API 클라이언트 사용
import { baseApiClient, authApiClient } from "@/api/client";

// 인증 불필요한 공개 API
const pokemonData = await baseApiClient.get("/api/v2/pokemon/25");

// 인증 필요한 API (httpOnly 쿠키 포함)
const userData = await authApiClient.get("/api/user/profile");
```

### 2. 주석 작성 규칙

- 모든 주석은 **한국어 명사형** (존댓말 사용 안함)
- TSDoc 형식 적극 활용 (`@description`, `@param`, `@returns`, `@example`)
- bullet point로 가독성 향상
- React 기초 수준 개발자도 이해 가능하도록 상세 설명

### 3. 타입 정의 규칙

```typescript
// ✅ type 사용 (일관성)
type PokemonCardProps = {
  /** 포켓몬 이름 */
  name: string;
  /** 포켓몬 API URL */
  url: string;
};

// ❌ interface 사용 금지
interface PokemonCardProps {
  name: string;
  url: string;
}
```

## 🔧 개발 명령어

| 명령어           | 설명                                   |
| ---------------- | -------------------------------------- |
| `npm run dev`    | 개발 서버 실행 (포트 3011)             |
| `npm run build`  | 프로덕션 빌드 (.output 디렉토리)       |
| `npm run test`   | 테스트 실행 (Vitest)                   |
| `npm run lint`   | 코드 검사 (ESLint)                     |
| `npm run format` | 코드 포맷팅 (Prettier)                 |
| `npm run check`  | 린트 + 포맷팅 통합 실행 (커밋 전 필수) |

### 컴포넌트 추가

```bash
# shadcn/ui 컴포넌트 추가
pnpx shadcn@latest add [컴포넌트명]
```

## 🏗️ 기술 스택

### Frontend Framework

- **React 19 + TypeScript (strict)**: 최신 React 기능과 타입 안전성
- **TanStack Start**: React 19 기반 SSR 프레임워크 (Next.js 대안)
- **TanStack Router**: 파일 기반 + 타입 안전한 라우팅

### 상태 관리

- **Jotai + TanStack Query**: 원자적 상태 관리와 서버 상태 분리
- **atomWithQuery**: 서버 상태와 클라이언트 상태 통합
- **atomWithStorage**: localStorage 연동 (사용자 설정)

### 스타일링 & UI

- **Tailwind CSS v4**: 차세대 CSS 프레임워크
- **shadcn/ui**: 복사해서 커스터마이징 가능한 고품질 컴포넌트
- **Radix UI**: 접근성이 우수한 headless 컴포넌트

### 개발 도구

- **Vite**: 빠른 개발 서버와 빌드 도구 (포트 3011)
- **Vitest + Testing Library**: Jest 호환 테스트 프레임워크
- **ESLint + Prettier**: 코드 품질 및 포맷팅

## 📁 프로젝트 구조

```
src/
├── 📄 api/                    # API 레이어
│   ├── client/               # HTTP 클라이언트 (baseClient, authClient)
│   │   ├── index.ts          # 클라이언트 export
│   │   ├── baseClient.ts     # 기본 API 클라이언트
│   │   ├── authClient.ts     # 인증 API 클라이언트
│   │   └── interceptors.ts   # 공통 인터셉터
│   └── [domain]/             # 도메인별 API
│       ├── api.ts            # API 함수들
│       ├── types.ts          # 응답 타입 정의
│       └── query.ts          # React Query 옵션
│
├── 📄 atoms/                 # 상태 관리 레이어 (Jotai)
│   ├── pokemon.ts            # 포켓몬 관련 상태들
│   ├── health-check.ts       # 헬스체크 상태
│   └── ui.ts                 # UI 관련 상태들
│
├── 📄 components/            # 컴포넌트 레이어
│   ├── ui/                   # 기본 UI 컴포넌트 (shadcn/ui)
│   ├── layout/               # 레이아웃 컴포넌트
│   └── [domain]/             # 도메인별 컴포넌트
│       ├── list/             # 목록 관련
│       ├── detail/           # 상세 관련
│       └── index.ts          # export 통합
│
├── 📄 hooks/                 # 커스텀 훅 레이어
│   ├── [domain]/             # 도메인별 훅
│   └── ui/                   # UI 관련 훅
│
├── 📄 routes/                # 라우팅 레이어 (파일 기반)
│   ├── __root.tsx            # 루트 레이아웃
│   ├── index.tsx             # 홈 페이지 (/)
│   └── examples/             # 예시 페이지들
│       └── pokemon/
│           ├── index.tsx     # 포켓몬 목록 (/examples/pokemon)
│           └── $id/
│               └── index.tsx # 포켓몬 상세 (/examples/pokemon/[id])
│
├── 📄 utils/                 # 유틸리티 레이어
│   ├── [domain]/             # 도메인별 유틸리티
│   └── errorHandling.ts      # 공통 에러 처리
│
└── 📄 css/                   # 스타일 레이어
    ├── root.css              # 전역 스타일
    ├── colors.css            # 색상 정의
    └── font.css              # 폰트 설정
```

### 폴더 구조 원칙

1. **도메인별 분리**: 각 비즈니스 도메인(pokemon, health-check)별로 코드 구성
2. **레이어별 구성**: API, 상태, 컴포넌트, 라우팅 등 레이어별 분리
3. **index.ts 통합**: 각 폴더에서 깔끔한 export 관리
4. **확장성 고려**: 새로운 도메인 추가 시 일관된 구조 유지

## 🧠 핵심 아키텍처 패턴

### 1. API 클라이언트 시스템

```typescript
// src/api/client/index.ts에서 두 종류의 클라이언트 제공

// 기본 API 클라이언트 (인증 불필요)
export const baseApiClient = createBaseApiClient();

// 인증용 API 클라이언트 (httpOnly 쿠키 포함)
export const authApiClient = createAuthApiClient();
```

**중요**: fetch 대신 반드시 이 클라이언트들을 사용하세요.

### 2. 상태 관리 패턴 (Jotai + React Query)

```typescript
// 클라이언트 상태 (UI 상태, 임시 데이터)
export const pokemonPageAtom = atom<number>(1);

// 영구 상태 (localStorage 연동)
export const pokemonLimitAtom = atomWithStorage("pokemon-limit", 24);

// 서버 상태 (React Query + Jotai 통합)
export const pokemonListQueryAtom = atomWithQuery((get) => {
  const page = get(pokemonPageAtom);
  const limit = get(pokemonLimitAtom);
  return pokemonListQueryOptions({ page, limit });
});

// 계산된 상태 (derived atom - 컴포넌트 useMemo 대신)
export const filteredPokemonListAtom = atom((get) => {
  const { data, isPending, isError } = get(pokemonListQueryAtom);
  return {
    results: data?.results || [],
    isPending,
    isError,
  };
});
```

### 3. 라우팅 구조 (파일 기반)

```
src/routes/
├── __root.tsx              # 모든 페이지의 기본 레이아웃
├── index.tsx               # 홈페이지 (/)
├── examples/
│   └── pokemon/
│       ├── index.tsx       # 포켓몬 목록 (/examples/pokemon)
│       ├── route.tsx       # 공통 레이아웃
│       └── $id/
│           └── index.tsx   # 포켓몬 상세 (/examples/pokemon/[id])
└── signup/
    └── index.tsx           # 회원가입 (/signup)
```

**특징**:

- **파일 구조 = URL 구조**: 직관적인 라우팅
- **타입 안전성**: 자동 생성된 타입으로 안전한 네비게이션
- **데이터 로더**: SSR 최적화와 이미지 preload

## 💡 개발 가이드

### 컴포넌트 개발 패턴

```typescript
// 1. Props 타입 정의 (type 사용, interface 금지)
type PokemonCardProps = {
  /** 포켓몬 이름 */
  name: string;
  /** 포켓몬 API URL */
  url: string;
  /** 카드 클릭 시 이동할 경로 */
  href?: string;
};

// 2. 컴포넌트 주석 (한국어 명사형)
/**
 * 포켓몬 카드 컴포넌트
 * 이미지, 이름, 번호를 표시하는 현대적인 카드 UI
 *
 * 설계 원칙:
 * - 목록에서는 기본 정보만 표시
 * - 커스텀 훅으로 복잡한 로직 캡슐화
 * - asChild 패턴으로 컴포넌트 합성
 */
export function PokemonCard({ name, url, href }: PokemonCardProps) {
  // 3. 커스텀 훅으로 복잡한 로직 분리
  const { finalImageUrl, isLoading, hasError } = usePokemonCardImage({ name, url });

  return (
    <Card className={cn("hover:shadow-2xl transition-shadow")}>
      {/* JSX 내용 */}
    </Card>
  );
}
```

### 스타일링 패턴

```typescript
import { cn } from "@/lib/utils";

// cn() 함수로 조건부 className 관리
<Card
  className={cn(
    "base-styles",                    // 기본 스타일
    isActive && "active-styles",      // 조건부 스타일
    hasError && "error-styles",       // 에러 상태
    className                         // 외부 전달 클래스
  )}
>

// asChild 패턴으로 컴포넌트 합성
<Button variant="ghost" asChild>
  <Link to="/examples/pokemon">포켓몬</Link>
</Button>
```

## 📋 개발 워크플로우

### 새 기능 개발 체크리스트

#### 개발 시작 전

- [ ] 기존 패턴 및 라이브러리 확인
- [ ] 도메인별 폴더 구조 준수 계획
- [ ] API 클라이언트 사용 방법 확인

#### 개발 중

- [ ] 한국어 명사형 주석 + TSDoc 작성
- [ ] `type` 사용 (`interface` 금지)
- [ ] `baseApiClient`/`authApiClient` 사용 (fetch 금지)
- [ ] 커스텀 훅으로 복잡한 로직 분리
- [ ] `cn()` 함수로 스타일링
- [ ] 함수 컴포넌트만 사용

#### 완료 후

- [ ] `npm run check` 통과 (필수)
- [ ] 타입 에러 해결
- [ ] 에러 처리 및 로딩 상태 포함
- [ ] 접근성 고려 (alt 텍스트, 키보드 네비게이션)
- [ ] 반응형 디자인 적용
- [ ] 커밋 메시지에 Claude 서명 제거

### Git 워크플로우

```bash
# 1. 작업 브랜치 생성
git checkout -b feature/새기능명

# 2. 개발 진행
# ... 코딩 ...

# 3. 코드 품질 검사 (필수)
npm run check

# 4. 커밋 (Claude 서명 추가 금지)
git add .
git commit -m "feat: 새로운 기능 추가

- 기능 상세 설명
- 구현된 내용
- 테스트 방법"

# 5. 푸시 및 PR 생성
git push origin feature/새기능명
```

## 🔧 문제 해결

### 자주 발생하는 문제들

**Q: 개발 서버가 시작되지 않아요**

```bash
# 포트 3011이 사용중인 경우
npm run dev -- --port 3012
```

**Q: 타입 에러가 발생해요**

```bash
# TypeScript 타입 검사
npm run check
```

**Q: API 호출이 실패해요**

- `fetch` 대신 `baseApiClient` 또는 `authApiClient` 사용 확인
- CORS 설정 확인
- 네트워크 연결 상태 확인

**Q: Tailwind 클래스가 적용되지 않아요**

- `src/css/root.css`에 Tailwind 지시어 확인
- `cn()` 함수 사용 여부 확인
- 브라우저 캐시 정리

**Q: 라우팅이 작동하지 않아요**

- `src/routeTree.gen.ts` 파일이 자동 생성되었는지 확인
- 파일명이 TanStack Router 규칙을 따르는지 확인

## 📚 학습 자료 및 문서

### 프로젝트 문서

- **[docs/README.md](./docs/README.md)** - 프로젝트 문서 개요
- **[docs/collaboration-guide.md](./docs/collaboration-guide.md)** - 팀 협업 가이드
- **[docs/coding-conventions.md](./docs/coding-conventions.md)** - 코딩 컨벤션
- **[docs/architecture.md](./docs/architecture.md)** - 프로젝트 아키텍처
- **[docs/component-guide.md](./docs/component-guide.md)** - 컴포넌트 개발 가이드
- **[docs/state-management.md](./docs/state-management.md)** - 상태 관리 가이드
- **[docs/styling-guide.md](./docs/styling-guide.md)** - 스타일링 가이드
- **[docs/troubleshooting.md](./docs/troubleshooting.md)** - 트러블슈팅 가이드

### 공식 문서

- [React 19 공식 문서](https://react.dev/blog/2024/12/05/react-19)
- [TanStack Start](https://tanstack.com/start/latest)
- [TanStack Router](https://tanstack.com/router/latest)
- [Jotai](https://jotai.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

### 추천 학습 순서

1. **[협업 가이드](./docs/collaboration-guide.md)** - 프로젝트 개요와 필수 규칙
2. **[코딩 컨벤션](./docs/coding-conventions.md)** - 코드 스타일과 작성 규칙
3. **[아키텍처 가이드](./docs/architecture.md)** - 프로젝트 구조와 설계 원칙
4. **[컴포넌트 가이드](./docs/component-guide.md)** - 컴포넌트 개발 패턴
5. **[상태 관리 가이드](./docs/state-management.md)** - Jotai + React Query 패턴
6. **[스타일링 가이드](./docs/styling-guide.md)** - Tailwind CSS + shadcn/ui 활용
7. **실전 프로젝트** - 새로운 기능 추가해보기

## 🤝 기여하기

1. 코드 작성 시 **한국어 주석**을 명사형으로 작성해주세요
2. React 초보자도 이해할 수 있도록 **충분한 설명**을 포함해주세요
3. 새로운 개념을 사용할 때는 **기존 방식과의 비교**를 포함해주세요
4. 반드시 `npm run check` 통과 후 커밋해주세요
5. 커밋 메시지에 Claude 관련 서명은 추가하지 마세요

## 🆘 도움이 필요할 때

1. **프로젝트 문서**: [docs/](./docs/) 폴더의 해당 가이드 문서 참조
2. **팀 채널**: 질문이나 개선 제안사항 논의
3. **트러블슈팅**: [docs/troubleshooting.md](./docs/troubleshooting.md) 확인

---

**🎯 목표:** 이 프로젝트를 통해 현대적인 React 개발 패턴을 익히고, 실무에서 바로 활용할 수 있는 역량을 기르세요!

**💬 질문이나 도움이 필요하면 언제든 물어보세요!**
