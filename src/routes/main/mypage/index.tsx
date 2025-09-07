import { PageHeader } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue, useSetAtom } from "jotai";
import { studentProfileDataAtom, refreshStudentProfileAtom } from "@/atoms/studentProfile";

export const Route = createFileRoute("/main/mypage/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { profile, isPending, isError, error, isLoggedIn } = useAtomValue(studentProfileDataAtom);
  const refreshProfile = useSetAtom(refreshStudentProfileAtom);

  // 로그인되지 않은 경우 처리
  if (!isLoggedIn) {
    return (
      <div>
        <PageHeader title="마이페이지" shouldShowBackButton={true} />
        <div className="px-4 mt-6">
          <Card className="p-6 border-2 border-main-200 bg-main-50/30 shadow-lg">
            <div className="text-center text-main-700">
              로그인이 필요합니다.
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // 로딩 상태 처리
  if (isPending) {
    return (
      <div>
        <PageHeader title="마이페이지" shouldShowBackButton={true} />
        <div className="px-4 mt-6">
          <Card className="p-6 border-2 border-main-200 bg-main-50/30 shadow-lg">
            <div className="text-center text-main-700">
              학생 정보를 불러오는 중...
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (isError || !profile) {
    return (
      <div>
        <PageHeader title="마이페이지" shouldShowBackButton={true} />
        <div className="px-4 mt-6">
          <Card className="p-6 border-2 border-red-200 bg-red-50/30 shadow-lg">
            <div className="space-y-4">
              <div className="text-center text-red-700">
                학생 정보를 불러올 수 없습니다.
              </div>
              {error && (
                <div className="text-sm text-red-600 text-center">
                  {error.message}
                </div>
              )}
              <div className="text-center">
                <button
                  onClick={() => refreshProfile()}
                  className="px-4 py-2 bg-main-500 text-white rounded hover:bg-main-600"
                >
                  다시 시도
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // 성공적으로 프로필을 불러온 경우
  return (
    <div>
      <PageHeader title="마이페이지" shouldShowBackButton={true} />
      <div className="px-4 mt-6">
        <Card className="p-6 border-2 border-main-200 bg-main-50/30 shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-main-800">내 정보</h2>
              <button
                onClick={() => refreshProfile()}
                className="text-sm text-main-600 hover:text-main-700"
                title="정보 새로고침"
              >
                🔄 새로고침
              </button>
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

              <div className="flex items-center justify-between py-3 border-b border-main-200">
                <span className="text-main-700">학년</span>
                <span className="font-medium text-main-900">
                  {profile.grade}
                </span>
              </div>

              {/* 추가 정보가 있는 경우 표시 */}
              {profile.studentNumber && (
                <div className="flex items-center justify-between py-3 border-b border-main-200">
                  <span className="text-main-700">학번</span>
                  <span className="font-medium text-main-900">
                    {profile.studentNumber}
                  </span>
                </div>
              )}

              {profile.email && (
                <div className="flex items-center justify-between py-3 border-b border-main-200">
                  <span className="text-main-700">이메일</span>
                  <span className="font-medium text-main-900">
                    {profile.email}
                  </span>
                </div>
              )}

              {profile.parentPhone && (
                <div className="flex items-center justify-between py-3">
                  <span className="text-main-700">학부모 연락처</span>
                  <span className="font-medium text-main-900">
                    {profile.parentPhone}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
