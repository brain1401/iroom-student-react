import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import type { QueryClient } from "@tanstack/react-query";
import appCss from "@/css/root.css?url";
import { useAtomValue } from "jotai";
import { mainExtraCombinedClassAtom } from "@/atoms/ui";
import { cn } from "@/lib/utils";
import { detectDevice } from "@/api/device";

/**
 * 라우터 컨텍스트 타입 정의
 *
 * TanStack Router의 모든 라우트에서 공유하는 타입 안전한 컨텍스트
 * QueryClient를 포함하여 서버 상태 관리를 위한 React Query 통합 제공
 *
 * @property queryClient - React Query의 QueryClient 인스턴스로 데이터 캐싱과 서버 상태 관리 담당
 *
 * 참고: deviceInfo는 beforeLoad에서 동적으로 추가되므로 초기 컨텍스트 타입에 포함하지 않음
 */
type MyRouterContext = {
  queryClient: QueryClient;
};

/**
 * TanStack Router 루트 라우트 정의
 *
 * createRootRouteWithContext를 사용하여 타입 안전한 컨텍스트가 있는 루트 라우트 생성
 * 애플리케이션의 최상위 라우트로서 모든 하위 라우트의 부모 역할
 *
 * - head: HTML head 영역의 메타데이터, 스타일시트, 폰트 등 설정
 * - component: 메인 레이아웃을 담당하는 RootComponent 지정
 * - shellComponent: HTML 문서 전체 구조를 담당하는 RootDocument 지정
 */
export const Route = createRootRouteWithContext<MyRouterContext>()({
  /**
   * 라우트 로드 전 사전 처리
   * @description 서버 함수로 디바이스 정보를 미리 감지하여 라우트 컨텍스트에 제공
   *
   * 장점:
   * - SSR 시점부터 올바른 디바이스 정보 제공
   * - Hydration mismatch 완전 해결
   * - 레이아웃 시프트(CLS) 방지
   * - 모든 하위 라우트에서 안정적인 디바이스 정보 접근 가능
   */
  beforeLoad: async () => {
    // 서버 함수로 디바이스 정보 감지
    const deviceInfo = await detectDevice();
    return { deviceInfo };
  },
  head: () => ({
    // HTML 메타데이터 설정 (charset, viewport, title, description)
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "이룸 클래스",
      },
      {
        name: "description",
        content: "이룸 클래스",
      },
    ],
    // 스타일시트와 폰트 로딩을 위한 링크 설정
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap",
      },
    ],
  }),

  component: RootComponent,
  shellComponent: RootDocument,
});

/**
 * 루트 컴포넌트 - 애플리케이션 메인 레이아웃
 * @description 모든 페이지에서 공통으로 보이는 반응형 레이아웃 정의
 *
 * 주요 변경사항:
 * - 상단 네비게이션 바 제거 (모바일 중심 UI로 변경)
 * - User Agent 기반 디바이스 감지 적용
 * - 모바일 퍼스트 반응형 디자인 구현
 * - 디바이스별 레이아웃 최적화
 *
 * 레이아웃 구조:
 * - main: 전체 화면 메인 콘텐츠 영역
 * - Outlet: 현재 활성화된 라우트 컴포넌트 렌더링
 *
 * 반응형 전략:
 * - 모바일: 전체 화면 활용, 최소 패딩
 * - 태블릿: 중간 패딩, 읽기 편한 여백
 * - 데스크톱: 최대 너비 제한, 중앙 정렬
 */
function RootComponent() {
  /**
   * 📌 useAtomValue 사용 이유: 값만 읽기 (read-only)
   * - mainBgExtraCombinedClassAtom의 값만 필요하고 변경할 필요 없음
   * - useAtom 대신 useAtomValue 사용으로 불필요한 setter 함수 제거
   * - 성능 최적화: 값 변경 기능이 없어 더 가벼운 훅 사용
   */
  const extraClasses = useAtomValue(mainExtraCombinedClassAtom);

  /**
   * 라우트 컨텍스트에서 디바이스 정보 가져오기
   * @description 서버에서 미리 감지된 안정적인 디바이스 정보 사용
   * - beforeLoad에서 서버 함수로 감지된 정보
   * - SSR부터 일관된 값 제공으로 hydration mismatch 방지
   * - 레이아웃 시프트(CLS) 완전 해결
   */
  const { deviceInfo } = Route.useRouteContext();
  const { isPC } = deviceInfo;

  console.log("isPC (from server):", isPC);

  /**
   * Tailwind 반응형 클래스 기반 메인 콘텐츠 스타일링
   * @description 모바일 퍼스트 + PC 최대 너비 제한 접근법
   *
   * 스타일 구성:
   * - 모바일: 전체 화면 활용, 패딩 없음, 작은 폰트 (기본)
   * - 태블릿: md: 중간 패딩, 읽기 편한 여백, 중간 폰트
   * - 데스크톱: lg: 넉넉한 여백, 큰 폰트
   * - PC 최대 너비: User Agent로 PC 감지 시 최대 너비 제한
   */
  const mainClasses = cn(
    // 공통 기본 스타일 + 모바일 퍼스트
    "h-full w-full bg-background-400 dark:bg-background-900",
    "p-0 text-sm", // 모바일 기본값

    // Tailwind 반응형 클래스 (md: 768px 이상, lg: 1024px 이상)
    "md:p-4 md:pt-6 md:text-base", // 태블릿 이상
    "lg:px-8 lg:py-8 lg:text-lg", // 데스크톱 이상

    // PC에서만 최대 너비 제한 (User Agent 기반)
    isPC && "max-w-6xl mx-auto",

    // 추가 클래스 (Atom에서 가져온 동적 스타일)
    extraClasses,
  );

  return (
    <main className={mainClasses}>
      {/* 
        하위 라우트가 렌더링되는 위치
        - 각 라우트 컴포넌트가 자체적으로 레이아웃 구성
        - PageHeader 같은 컴포넌트에서 개별적으로 네비게이션 처리
        - Tailwind 반응형으로 최적화된 레이아웃 제공
      */}
      <Outlet />
    </main>
  );
}

/**
 * 루트 문서 컴포넌트 - HTML 문서 전체 구조
 *
 * TanStack Start의 shellComponent로 사용되어 HTML 문서의 전체 구조 정의
 * SSR(Server-Side Rendering) 환경에서 초기 HTML 문서 생성 시 사용
 *
 * @param children - 애플리케이션의 메인 콘텐츠 (RootComponent 전달)
 *
 * 구성 요소:
 * - html: 한국어 설정, 전체 높이 클래스, 하이드레이션 경고 억제
 * - head: HeadContent를 통해 메타데이터와 스타일시트 삽입
 * - body: 전체 높이, flex 레이아웃, Noto Sans KR 폰트 적용
 * - TanStackDevtools: 개발 환경에서 라우터와 쿼리 상태 모니터링 도구
 * - Scripts: TanStack Start에서 필요한 클라이언트 스크립트 삽입
 */
function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full" suppressHydrationWarning>
      <head>
        {/* RouteOptions.head에서 설정된 메타데이터와 링크를 렌더링 */}
        <HeadContent />
      </head>
      <body className="font-noto-sans-kr h-full w-full">
        {/* 메인 애플리케이션 콘텐츠 */}
        {children}

        {/* 개발 도구 - 라우터와 쿼리 상태 모니터링 */}
        <TanStackDevtools
          config={{
            position: "bottom-left",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        {/* 클라이언트 사이드 스크립트 (하이드레이션, 이벤트 핸들러 등) */}
        <Scripts />
      </body>
    </html>
  );
}
