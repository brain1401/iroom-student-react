/**
 * 최근 응시 시험 섹션 컴포넌트
 * @description 로그인한 학생의 최근 응시 시험 목록을 표시
 *
 * 주요 기능:
 * - 학생 인증 정보 기반 최근 시험 조회
 * - 로딩, 에러, 빈 상태 처리
 * - 시험 카드 그리드 레이아웃
 * - 페이징 기능
 */

import { useAtomValue, useSetAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { RecentExamCard } from "@/components/student";
import { loggedInStudentAtom } from "@/atoms/auth";
import {
  studentRecentSubmissionsDataAtom,
  studentRecentSubmissionsPageAtom,
  studentRecentSubmissionsActionsAtom,
} from "@/atoms/student";

export function RecentExamsSection() {
  const loggedInStudent = useAtomValue(loggedInStudentAtom);
  const recentExamsData = useAtomValue(studentRecentSubmissionsDataAtom);
  const currentPage = useAtomValue(studentRecentSubmissionsPageAtom);
  const actionsSetAtom = useSetAtom(studentRecentSubmissionsActionsAtom);
  const actions = actionsSetAtom();

  // 로그인하지 않은 경우
  if (!recentExamsData.isLoggedIn) {
    return (
      <section id="recent-exams" className="mt-8 mb-20 mx-8">
        <header className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            최근 응시 시험
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            로그인하여 최근 응시한 시험 내역을 확인해보세요
          </p>
        </header>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            로그인이 필요한 서비스입니다.
          </p>
        </div>
      </section>
    );
  }

  // 로딩 상태 처리
  if (recentExamsData.isPending) {
    return (
      <section id="recent-exams" className="mt-8 mb-20 mx-8">
        <header className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            최근 응시 시험
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {loggedInStudent?.name}님이 최근에 응시한 시험 내역을 불러오는 중...
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {/* 로딩 스켈레톤 */}
          {Array.from(
            { length: 6 },
            (_, index) => `skeleton-${index}-${Date.now()}`,
          ).map((skeletonKey) => (
            <div
              key={skeletonKey}
              className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-48"
            />
          ))}
        </div>
      </section>
    );
  }

  // 에러 상태 처리
  if (recentExamsData.isError) {
    return (
      <section id="recent-exams" className="mt-8 mb-20 mx-8">
        <header className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            최근 응시 시험
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            최근 응시 시험 내역을 불러오는 중 오류가 발생했습니다
          </p>
        </header>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            시험 내역을 불러올 수 없습니다. 다시 시도해주세요.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            다시 시도
          </Button>
        </div>
      </section>
    );
  }

  const { recentSubmissions, totalCount } = recentExamsData;

  return (
    <section id="recent-exams" className="mt-8 mb-12 mx-8">
      {/* 섹션 헤더 */}
      <header className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          최근 응시한 시험
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {loggedInStudent?.name}님이 최근에 응시한 시험 내역입니다
        </p>
      </header>

      {/* 최근 시험 카드 그리드 */}
      {recentSubmissions && recentSubmissions.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {recentSubmissions.map((submission) => (
              <RecentExamCard
                key={`${submission.examName}-${submission.submittedAt}`}
                submission={submission}
              />
            ))}
          </div>

          {/* 페이징 */}
          <div className="flex justify-center mt-8 gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 0}
              onClick={actions.prevPage}
            >
              이전
            </Button>
            <span className="flex items-center px-4 text-sm text-gray-600 dark:text-gray-400">
              {currentPage + 1} 페이지
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={recentSubmissions.length < 10} // 페이지 크기보다 작으면 다음 페이지 없음
              onClick={actions.nextPage}
            >
              다음
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            아직 응시한 시험이 없습니다.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            시험에 응시하시면 여기에서 확인할 수 있습니다.
          </p>
        </div>
      )}
    </section>
  );
}