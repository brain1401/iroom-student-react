import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { userDisplayInfoAtom } from "@/atoms/ui";
import UserProfileHeader from "@/components/layout/UserProfileHeader";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/exam-management")({
  component: ExamManagementLayout,
});

function ExamManagementLayout() {
  const { name, badgeLabel } = useAtomValue(userDisplayInfoAtom);
  return (
    <div className="w-full flex justify-center">
      <div
        id="mobile-container"
        className={cn(
          "relative w-[360px] bg-white p-4 space-y-4 overflow-hidden",
        )}
        style={{ minHeight: 780 }}
      >
        <UserProfileHeader name={name} badgeLabel={badgeLabel} />
        <Outlet />
      </div>
    </div>
  );
}
