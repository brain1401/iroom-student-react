import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/main/")({
  component: MainPage,
});

/**
 * 메인 페이지 컴포넌트
 * @description 피그마 디자인 기반 Tailwind 반응형 대시보드 화면
 *
 * 주요 기능:
 * - 시험 점수 및 관련 정보 표시
 * - 로그아웃 기능
 * - Tailwind CSS 반응형 디자인 (모바일 퍼스트)
 *
 * 반응형 전략:
 * - 모바일: 피그마 디자인 기반 (360x780px), 세로 스택 (기본)
 * - 태블릿: 중간 크기 카드, 읽기 편한 여백 (md: 768px+)
 * - 데스크톱: 와이드 레이아웃, 가로 배치 (lg: 1024px+)
 *
 * 피그마 디자인 기준 (모바일):
 * - 전체 크기: 360x780px
 * - 메인 카드: 312.78x570.76px
 * - 그림자: 0px 1px 6px rgba(0,0,0,0.25)
 * - 배경색: #FFFFFF
 */
function MainPage() {
  /**
   * 로그아웃 처리 함수
   * @description 사용자를 로그아웃시키고 홈 페이지로 리디렉션
   */
  const handleLogout = () => {
    // TODO: 실제 로그아웃 로직 구현
    console.log("로그아웃 처리");
    // 홈페이지로 리디렉션 또는 로그인 페이지로 이동
  };

  return (
    <>
      {/* 페이지 헤더 - 뒤로가기 버튼 없는 메인 페이지 */}
      <PageHeader title="시험 점수" showBackButton showDivider />

      {/* 메인 콘텐츠 영역 */}
      <div className="px-4 py-2 md:px-8 md:py-6 lg:mx-auto lg:max-w-4xl lg:px-12 lg:py-8">
        {/* 메인 카드 컨테이너 - Tailwind 반응형 */}
        <Card className="mx-auto min-h-[35.625rem] w-full max-w-sm overflow-hidden rounded-lg bg-white p-6 shadow-[0px_1px_6px_0px_rgba(0,0,0,0.25)] md:min-h-[37.5rem] md:max-w-md md:rounded-xl md:p-8 md:shadow-lg lg:min-h-[40.625rem] lg:max-w-2xl lg:rounded-2xl lg:p-10 lg:shadow-xl">
          {/* 시험 관련 콘텐츠 영역 */}
          <div className="space-y-6 md:space-y-8 lg:space-y-10">
            {/* 시험 정보 카드들 */}
            <div className="space-y-4 md:space-y-5 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
              {/* 시험 카드 1 */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-shadow hover:shadow-md md:p-5 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-gray-900 md:text-xl lg:text-2xl">
                      가다나 시험
                    </h3>
                    <p className="text-sm text-gray-600 md:text-base lg:text-lg">
                      최근 응시일: 2024.08.24
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600 md:text-3xl lg:text-4xl">
                      85점
                    </div>
                    <div className="text-xs text-gray-500 md:text-sm lg:text-base">
                      100점 만점
                    </div>
                  </div>
                </div>
              </div>

              {/* 시험 카드 2 */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-shadow hover:shadow-md md:p-5 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-gray-900 md:text-xl lg:text-2xl">
                      수학 문제 해결
                    </h3>
                    <p className="text-sm text-gray-600 md:text-base lg:text-lg">
                      최근 응시일: 2024.08.23
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 md:text-3xl lg:text-4xl">
                      92점
                    </div>
                    <div className="text-xs text-gray-500 md:text-sm lg:text-base">
                      100점 만점
                    </div>
                  </div>
                </div>
              </div>

              {/* 시험 카드 3 */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-shadow hover:shadow-md md:p-5 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-gray-900 md:text-xl lg:text-2xl">
                      주관식 답안 작성
                    </h3>
                    <p className="text-sm text-gray-600 md:text-base lg:text-lg">
                      최근 응시일: 2024.08.22
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600 md:text-3xl lg:text-4xl">
                      78점
                    </div>
                    <div className="text-xs text-gray-500 md:text-sm lg:text-base">
                      100점 만점
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 통계 정보 영역 */}
            <div className="border-t pt-6 md:pt-8 lg:pt-10">
              <div className="grid grid-cols-2 gap-4 text-center lg:flex lg:justify-around">
                <div className="space-y-1 lg:px-6">
                  <div className="text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
                    3
                  </div>
                  <div className="text-sm text-gray-600 md:text-base lg:text-lg">
                    총 시험 수
                  </div>
                </div>
                <div className="space-y-1 lg:px-6">
                  <div className="text-2xl font-bold text-blue-600 md:text-3xl lg:text-4xl">
                    85.0
                  </div>
                  <div className="text-sm text-gray-600 md:text-base lg:text-lg">
                    평균 점수
                  </div>
                </div>
              </div>
            </div>

            {/* 최근 활동 영역 */}
            <div className="border-t pt-6 md:pt-8 lg:pt-10">
              <h4 className="mb-3 text-lg font-semibold text-gray-900 md:text-xl lg:text-2xl">
                최근 활동
              </h4>
              <div className="space-y-2 text-sm text-gray-600 md:space-y-3 md:text-base lg:space-y-4 lg:text-lg">
                <div className="flex justify-between">
                  <span>가다나 시험 응시</span>
                  <span>2024.08.24</span>
                </div>
                <div className="flex justify-between">
                  <span>수학 문제 해결 완료</span>
                  <span>2024.08.23</span>
                </div>
                <div className="flex justify-between">
                  <span>주관식 답안 제출</span>
                  <span>2024.08.22</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 로그아웃 버튼 - Tailwind 반응형 */}
        <div className="mt-6 flex justify-start md:mt-8 md:justify-center lg:mt-10">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="min-h-[2.75rem] min-w-[2.75rem] px-0 py-2 text-2xl font-medium text-gray-400 transition-colors hover:bg-transparent hover:text-gray-500 md:px-4 md:py-3 md:text-3xl lg:px-8 lg:py-4 lg:text-4xl"
          >
            로그아웃
          </Button>
        </div>
      </div>
    </>
  );
}
