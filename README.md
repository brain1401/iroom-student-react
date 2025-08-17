# 🎓 이룸 React 학습 프로젝트

**React 초보자를 위한 현대적인 웹 애플리케이션 학습 프로젝트**

이 프로젝트는 React 초보자가 최신 React 생태계를 학습할 수 있도록 설계된 포켓몬 도감 애플리케이션입니다. 실무에서 사용되는 최신 기술들을 단계별로 학습하면서 현대적인 React 개발 패턴을 익힐 수 있습니다.

## 🎯 학습 목표

- **React 19의 새로운 기능들** 체험하기
- **파일 기반 라우팅**으로 직관적인 페이지 구조 이해하기
- **원자 단위 상태 관리(Atomic State)**로 복잡한 상태를 간단하게 관리하기
- **TypeScript**로 안전한 코드 작성하기
- **현대적인 UI 컴포넌트** 시스템 활용하기

## 🚀 빠른 시작

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (포트 3005)
npm run dev

# 프로젝트 열기
http://localhost:3005
```

## 🔧 개발 명령어

| 명령어           | 설명                             |
| ---------------- | -------------------------------- |
| `npm run dev`    | 개발 서버 실행 (포트 3005)       |
| `npm run build`  | 프로덕션 빌드 (.output 디렉토리) |
| `npm run test`   | 테스트 실행 (Vitest)             |
| `npm run lint`   | 코드 검사 (ESLint)               |
| `npm run format` | 코드 포맷팅 (Prettier)           |
| `npm run check`  | 린트 + 포맷팅 통합 실행          |

## 🏗️ 기술 스택 소개

### ⚛️ React 19 + TanStack Start

**왜 선택했나요?**

- **React 19**: 최신 기능들 (use API, useActionState 등)을 학습할 수 있습니다
- **TanStack Start**: Next.js보다 단순하면서도 SSR을 지원하는 풀스택 프레임워크입니다

**기존 방식과의 차이점:**

```javascript
// 기존 방식 (React 18)
function Component() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);
}

// React 19 방식 (use API 활용)
function Component() {
  const data = use(dataPromise); // Suspense와 함께 사용
}
```

### 🗺️ TanStack Router (파일 기반 라우팅)

**왜 선택했나요?**

- **직관적**: 파일 구조 = URL 구조
- **타입 안전**: TypeScript와 완벽 통합
- **성능**: 자동 코드 분할

**폴더 구조와 라우팅:**

```
src/routes/
├── __root.tsx        → 모든 페이지의 기본 레이아웃
├── index.tsx         → / (홈페이지)
├── examples/
│   └── pokemon/
│       ├── index.tsx → /examples/pokemon (목록)
│       └── $id/
│           └── index.tsx → /examples/pokemon/25 (상세)
```

**React Router와의 차이점:**

```javascript
// React Router 방식
<BrowserRouter>
  <Routes>
    <Route path="/pokemon" element={<PokemonList />} />
    <Route path="/pokemon/:id" element={<PokemonDetail />} />
  </Routes>
</BrowserRouter>

// TanStack Router 방식 (파일 기반)
// 파일만 만들면 자동으로 라우팅됨!
// src/routes/pokemon/index.tsx → /pokemon
// src/routes/pokemon/$id/index.tsx → /pokemon/:id
```

### ⚛️ Jotai (원자 단위 상태 관리)

**왜 선택했나요?**

- **단순함**: useState처럼 쉽지만 전역에서 사용 가능
- **성능**: 필요한 컴포넌트만 리렌더링
- **확장성**: 작은 상태 조각들을 조합해서 복잡한 상태 생성

**기존 방식과의 비교:**

```javascript
// 기존 방식 (Redux)
// 1. store 설정
// 2. reducer 작성
// 3. action 정의
// 4. provider 설정
// 5. useSelector, useDispatch 사용

// Jotai 방식
const countAtom = atom(0); // 상태 정의

function Counter() {
  const [count, setCount] = useAtom(countAtom); // 사용
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

**Context API와의 차이점:**

```javascript
// Context API (복잡함)
const CountContext = createContext();
function CountProvider({ children }) {
  const [count, setCount] = useState(0);
  return (
    <CountContext.Provider value={{ count, setCount }}>
      {children}
    </CountContext.Provider>
  );
}

// Jotai (간단함)
const countAtom = atom(0);
// Provider 불필요! 바로 사용 가능
```

### 🎨 Tailwind CSS v4 + shadcn/ui

- **Tailwind CSS v4**: 차세대 CSS 프레임워크
- **shadcn/ui**: 복사해서 커스터마이징 가능한 고품질 컴포넌트

## 📁 프로젝트 구조

```
src/
├── 📄 routes/              # 🗺️ 페이지들 (파일 = URL)
│   ├── __root.tsx         # 모든 페이지의 기본 틀
│   ├── index.tsx          # 홈페이지 (/)
│   └── examples/pokemon/  # 포켓몬 관련 페이지들
│
├── 📄 atoms/              # ⚛️ 전역 상태 관리 (Jotai)
│   ├── pokemon.ts         # 포켓몬 관련 상태들
│   └── ui.ts              # UI 관련 상태들
│
├── 📄 api/                # 🌐 서버 통신
│   ├── client/            # HTTP 클라이언트 설정
│   └── pokemon/           # 포켓몬 API 관련
│
├── 📄 components/         # 🧩 재사용 가능한 UI 컴포넌트
│   ├── ui/                # 기본 UI 컴포넌트 (shadcn/ui)
│   ├── layout/            # 레이아웃 컴포넌트
│   └── pokemon/           # 포켓몬 전용 컴포넌트
│
├── 📄 hooks/              # 🎣 커스텀 훅들
│   ├── pokemon/           # 포켓몬 관련 로직
│   └── ui/                # UI 관련 로직
│
└── 📄 utils/              # 🛠️ 유틸리티 함수들
    └── pokemon/           # 포켓몬 관련 헬퍼 함수들
```

## 📚 핵심 개념 학습 가이드

### 1️⃣ 원자 단위 상태 관리 (Jotai)

**기본 원리:**
상태를 작은 '원자(atom)'들로 나누어 관리합니다.

```javascript
// src/atoms/pokemon.ts
// 포켓몬 목록을 위한 여러 원자들
export const pokemonPageAtom = atom(1); // 현재 페이지
export const pokemonLimitAtom = atom(24); // 페이지당 개수
export const pokemonListFiltersAtom = atom({}); // 검색 필터
```

**장점:**

- 🎯 **필요한 것만 리렌더링**: 페이지가 바뀌어도 검색창은 리렌더링 안됨
- 🔧 **조합 가능**: 여러 원자를 조합해서 새로운 상태 생성
- 📦 **타입 안전**: TypeScript와 완벽 통합

### 2️⃣ 파일 기반 라우팅

**기본 원리:**
파일 구조가 곧 URL 구조입니다.

```
src/routes/examples/pokemon/$id/index.tsx
                    ↓
         /examples/pokemon/25
```

**특별한 파일명들:**

- `index.tsx`: 해당 경로의 기본 페이지
- `$id.tsx`: 동적 경로 (파라미터)
- `__root.tsx`: 모든 페이지의 공통 레이아웃

### 3️⃣ 서버 상태와 클라이언트 상태 분리

```javascript
// 서버 상태 (React Query + Jotai)
export const pokemonListQueryAtom = atomWithQuery((get) => {
  const page = get(pokemonPageAtom);
  return pokemonListQueryOptions({ page });
});

// 클라이언트 상태 (순수 Jotai)
export const pokemonPageAtom = atom(1);
```

## 💡 주석 작성 가이드

이 프로젝트는 **React 초보자도 이해할 수 있는 주석**을 목표로 합니다.

### ✅ 좋은 주석 예시 (`src/atoms/pokemon.ts`)

````javascript
/**
 * Jotai란?
 * - 전역 상태 관리 라이브러리 (Redux, Zustand와 비슷한 역할)
 * - useState와 비슷하지만 여러 컴포넌트에서 공유 가능
 * - atom이라는 작은 상태 단위로 관리
 */

/**
 * 포켓몬 목록 조회 시 표시할 개수를 관리하는 atom
 * @description 사용자별 개인화된 설정으로 localStorage에 저장
 *
 * 기존 useState와 비교:
 * ```typescript
 * // 기존 방식 (각 컴포넌트마다 따로 관리)
 * const [limit, setLimit] = useState(24);
 *
 * // Jotai 방식 (전역에서 공유)
 * const [limit, setLimit] = useAtom(pokemonLimitAtom);
 * ```
 */
export const pokemonLimitAtom = atomWithStorage("pokemon-limit", 20);
````

## 📖 추가 학습 자료

### 공식 문서

- [React 19 공식 문서](https://react.dev/blog/2024/12/05/react-19)
- [TanStack Router](https://tanstack.com/router)
- [Jotai](https://jotai.org/)
- [shadcn/ui](https://ui.shadcn.com/)

### 추천 학습 순서

1. **React 기초** → useState, useEffect, 컴포넌트 패턴
2. **TanStack Router** → 파일 기반 라우팅 이해
3. **Jotai** → 원자 단위 상태 관리
4. **실전 프로젝트** → 새로운 기능 추가해보기

## 🤝 기여하기

1. 코드 작성 시 **한국어 주석**을 명사형으로 작성해주세요
2. React 초보자도 이해할 수 있도록 **충분한 설명**을 포함해주세요
3. 새로운 개념을 사용할 때는 **기존 방식과의 비교**를 포함해주세요

## 📝 문제 해결

### 자주 발생하는 문제들

**Q: 개발 서버가 시작되지 않아요**

```bash
# 포트 3005가 사용중인 경우
npm run dev -- --port 3006
```

**Q: 타입 에러가 발생해요**

```bash
# TypeScript 타입 검사
npm run typecheck
```

**Q: 라우팅이 작동하지 않아요**

- `src/routeTree.gen.ts` 파일이 자동 생성되었는지 확인
- 파일명이 TanStack Router 규칙을 따르는지 확인

---

**🎯 목표:** 이 프로젝트를 통해 현대적인 React 개발 패턴을 익히고, 실무에서 바로 활용할 수 있는 역량을 기르세요!

**💬 질문이나 도움이 필요하면 언제든 물어보세요!**
