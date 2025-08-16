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
import NavigationBar from "@/components/layout/NavigationBar";
import { useAtomValue } from "jotai";
import { mainBgExtraCombinedClassAtom } from "@/atoms/ui";
import { cn } from "@/lib/utils";

type MyRouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
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

function RootComponent() {
  const extra = useAtomValue(mainBgExtraCombinedClassAtom);
  return (
    <>
      <NavigationBar />
      <main
        className={cn(
          "flex flex-1 bg-background-400 dark:bg-background-900",
          extra,
        )}
      >
        <Outlet />
      </main>
    </>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="h-full w-full flex flex-col font-[Noto_Sans_KR]">
        {children}

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
        <Scripts />
      </body>
    </html>
  );
}
