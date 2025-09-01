import { PageHeader } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import type { StudentProfile } from "@/api/student/types";

export const Route = createFileRoute("/main/mypage/")({
  component: RouteComponent,
});

const profile: StudentProfile = {
  name: "윤아연",
  phone: "010-9185-8023",
  birth: "2008-01-01",
  grade: "1",
};

function RouteComponent() {
  return (
    <div>
      <PageHeader title="마이페이지" shouldShowBackButton={true} />
      <div className="px-4 mt-6">
        <Card className="p-6 border-2 border-main-200 bg-main-50/30 shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-main-800">내 정보</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between py-3 border-b border-main-200">
                <span className="text-main-700">이름</span>
                <span className="font-medium text-main-900">
                  {profile.name}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-main-200">
                <span className="text-main-700">전화번호</span>
                <span className="font-medium text-main-900">
                  {profile.phone}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-main-200">
                <span className="text-main-700">생년월일</span>
                <span className="font-medium text-main-900">
                  {profile.birth}
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-main-700">학년</span>
                <span className="font-medium text-main-900">
                  {profile.grade}학년
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
