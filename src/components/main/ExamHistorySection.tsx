/**
 * 시험 이력 섹션 컴포넌트
 * @description 학생이 응시한 전체 시험 이력을 페이지네이션과 함께 표시
 *
 * 주요 기능:
 * - 전체 시험 이력 조회
 * - 페이지네이션 기능
 * - 카드 레이아웃으로 시험 정보 표시
 * - 로딩, 에러, 빈 상태 처리
 */

import { useAtomValue, useSetAtom } from "jotai";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { examHistoryDataAtom, examHistoryActionsAtom } from "@/atoms/main";
import { loggedInStudentAtom } from "@/atoms/auth";

/**
 * 시험 이력 카드 컴포넌트
 * @description 개별 시험 이력을 카드 형태로 표시
 */
function ExamHistoryCard({
  examName,
  submittedAt,
  totalQuestions,
  totalScore,
}: {
  examName: string;
  submittedAt: string;
  totalQuestions: number;
  totalScore: number | null;
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isGraded = totalScore !== null;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{examName}</CardTitle>
          <Badge variant={isGraded ? "default" : "secondary"}>
            {isGraded ? "채점완료" : "채점대기"}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1 mt-2">
          <Calendar className="w-4 h-4" />
          {formatDate(submittedAt)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <FileText className="w-4 h-4" />
              문제 수
            </span>
            <span className="font-medium">{totalQuestions}문제</span>
          </div>
          {isGraded && (
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                {totalScore >= 60 ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                점수
              </span>
              <span
                className={cn(
                  "font-bold",
                  totalScore >= 60 ? "text-green-600" : "text-red-600",
                )}
              >
                {totalScore}점
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 시험 이력 섹션 컴포넌트
 * @description 전체 시험 이력을 페이지네이션과 함께 표시
 */
export function ExamHistorySection() {
  const loggedInStudent = useAtomValue(loggedInStudentAtom);
  const examHistoryData = useAtomValue(examHistoryDataAtom);
  const setActions = useSetAtom(examHistoryActionsAtom);
  const actions = setActions();

  // 로그인하지 않은 경우
  if (!examHistoryData.isLoggedIn) {
    return (
      <section id="exam-history" className="mt-12 mb-20 mx-8">
        <header className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            전체 시험 이력
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            로그인하여 모든 시험 응시 이력을 확인해보세요
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
  if (examHistoryData.isPending) {
    return (
      <section id="exam-history" className="mt-12 mb-20 mx-8">
        <header className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            전체 시험 이력
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {loggedInStudent?.name}님의 전체 시험 이력을 불러오는 중...
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* 로딩 스켈레톤 */}
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={`skeleton-${i}`}
              className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-48"
            />
          ))}
        </div>
      </section>
    );
  }

  // 에러 상태 처리
  if (examHistoryData.isError) {
    return (
      <section id="exam-history" className="mt-12 mb-20 mx-8">
        <header className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            전체 시험 이력
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            시험 이력을 불러오는 중 오류가 발생했습니다
          </p>
        </header>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            시험 이력을 불러올 수 없습니다. 다시 시도해주세요.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            다시 시도
          </Button>
        </div>
      </section>
    );
  }

  const {
    examHistory,
    totalElements,
    totalPages,
    currentPage,
    isFirstPage,
    isLastPage,
    isEmpty,
  } = examHistoryData;

  console.log("examHistory :", examHistory);

  return (
    <section id="exam-history" className="mt-12 mb-20 mx-8">
      {/* 섹션 헤더 */}
      <header className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          전체 시험 이력
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {loggedInStudent?.name}님이 지금까지 응시한 모든 시험 ({totalElements}
          개)
        </p>
      </header>

      {/* 시험 이력 카드 그리드 */}
      {examHistory.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {examHistory.map((exam, index) => (
              <ExamHistoryCard
                key={`${exam.examId}-${exam.submittedAt}-${index}`}
                examName={exam.examName}
                submittedAt={exam.submittedAt}
                totalQuestions={exam.totalQuestions}
                totalScore={exam.totalScore}
              />
            ))}
          </div>

          {/* 페이지네이션 */}
          <div className="flex justify-center items-center mt-8 gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isFirstPage}
              onClick={actions.prevPage}
            >
              이전
            </Button>

            <div className="flex items-center gap-1 px-2">
              {/* 페이지 번호 표시 (최대 5개) */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i;
                if (totalPages > 5) {
                  if (currentPage < 3) {
                    pageNum = i;
                  } else if (currentPage > totalPages - 3) {
                    pageNum = totalPages - 5 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "ghost"}
                    size="sm"
                    onClick={() => actions.goToPage(pageNum)}
                    className="min-w-[40px]"
                  >
                    {pageNum + 1}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={isLastPage}
              onClick={actions.nextPage}
            >
              다음
            </Button>
          </div>

          {/* 페이지 정보 */}
          <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
            전체 {totalPages}페이지 중 {currentPage + 1}페이지
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            아직 응시한 시험이 없습니다.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            시험에 응시하시면 여기에서 이력을 확인할 수 있습니다.
          </p>
        </div>
      )}
    </section>
  );
}
