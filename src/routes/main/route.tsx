import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import UserProfileHeader from "@/components/layout/UserProfileHeader";
import { userDisplayInfoAtom } from "@/atoms/ui";

/**
 * 메인 페이지 공통 레이아웃
 * @description /main 경로 하위 페이지에서 공통으로 사용하는 컨테이너와 상단 사용자 영역 렌더링
 */
export const Route = createFileRoute("/main")({
  component: MainLayout,
});

/**
 * 메인 레이아웃 컴포넌트
 * @description 상단 사용자 영역이 항상 최상단에 오고, 그 아래로 각 페이지 콘텐츠 렌더링
 */
function MainLayout() {
  const { name, badgeLabel } = useAtomValue(userDisplayInfoAtom);
  return (
    <div className="w-full flex justify-center">
      <div className="max-w-2xl w-full bg-white dark:bg-white p-4 space-y-6" style={{ minHeight: 780 }}>
        <UserProfileHeader name={name} badgeLabel={badgeLabel} />
        <Outlet />
      </div>
    </div>
  );
}

