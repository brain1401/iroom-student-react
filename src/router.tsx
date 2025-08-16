import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import * as TanstackQuery from "./integrations/tanstack-query/root-provider";
import { QueryClientAtomProvider } from "jotai-tanstack-query/react";

// 생성된 라우트 트리 가져오기
import { routeTree } from "./routeTree.gen";
import { NotFound } from "@/components/errors/NotFound";

// 새로운 라우터 인스턴스 생성
export const createRouter = () => {
  const rqContext = TanstackQuery.getContext();

  const router = createTanstackRouter({
    routeTree,
    context: { ...rqContext },
    defaultPreload: "intent",
    defaultNotFoundComponent: () => <NotFound />,
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <QueryClientAtomProvider client={rqContext.queryClient}>
          {props.children}
        </QueryClientAtomProvider>
      );
    },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient: rqContext.queryClient,
  });

  return router;
};

// 타입 안전성을 위한 라우터 인스턴스 등록
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
