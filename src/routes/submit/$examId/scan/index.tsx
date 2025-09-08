import { PageHeader } from "@/components/layout/PageHeader";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ObjectiveTab } from "@/components/student/ObjectiveTab";
import { SubjectiveTab } from "@/components/student/SubjectiveTab";
import { cn } from "@/lib/utils";
import { useAtomValue, useSetAtom } from "jotai";
import {
  currentExamIdAtom,
  examTabStateAtom,
  examDetailDataAtom,
  objectiveAnswersAtom,
} from "@/atoms/student";

export const Route = createFileRoute("/submit/$examId/scan/")({
  component: RouteComponent,
});

/**
 * 시험 스캔 페이지 컴포넌트
 * @description 시험 문제 유형에 따라 동적으로 탭을 표시/숨김 처리하는 페이지
 *
 * 주요 기능:
 * - URL에서 examId 추출하여 상태 관리
 * - 객관식/주관식 문제 수에 따른 동적 탭 제어
 * - 시험 상세 정보 로딩 및 에러 처리
 * - 탭별 컨텐츠 애니메이션 전환
 */
function RouteComponent() {
  const { examId } = Route.useParams();

  // Atom 상태 관리
  const setCurrentExamId = useSetAtom(currentExamIdAtom);
  const resetObjectiveAnswers = useSetAtom(objectiveAnswersAtom);
  const tabState = useAtomValue(examTabStateAtom);
  const examData = useAtomValue(examDetailDataAtom);

  // 로컬 탭 상태 (사용자가 수동으로 선택한 탭)
  const [activeTab, setActiveTab] = useState<"objective" | "subjective" | null>(
    null,
  );

  /**
   * examId 설정 및 초기 탭 상태 설정
   */
  useEffect(() => {
    if (examId) {
      setCurrentExamId(examId);
    }
  }, [examId, setCurrentExamId]);

  /**
   * 객관식 답안 초기화
   * @description 다른 시험에서 남아있던 선택값이 보이지 않도록 examId 변경 시 초기화
   */
  useEffect(() => {
    resetObjectiveAnswers({});
  }, [examId, resetObjectiveAnswers]);

  /**
   * 시험 데이터 로딩 완료 후 기본 탭 설정
   * @description tabState.defaultActiveTab이 변경되면 즉시 반영
   */
  useEffect(() => {
    // 로딩 완료 후 defaultActiveTab이 설정되고, 현재 activeTab이 null이거나 유효하지 않은 경우
    if (
      tabState.defaultActiveTab &&
      (activeTab === null || !tabState.availableTabs.includes(activeTab))
    ) {
      console.log(`[ScanPage] 기본 탭 설정: ${tabState.defaultActiveTab}`);
      setActiveTab(tabState.defaultActiveTab);
    }
  }, [tabState.defaultActiveTab, tabState.availableTabs, activeTab]);

  /**
   * 로딩 상태 처리
   */
  if (examData.isPending) {
    return (
      <div className="container mx-auto flex flex-1 h-full max-w-6xl flex-col items-center justify-center space-y-6 p-4">
        <PageHeader title="시험 정보 로딩 중..." shouldShowBackButton={true} />
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-gray-600">
            시험 정보를 불러오고 있습니다...
          </span>
        </div>
      </div>
    );
  }

  /**
   * 에러 상태 처리
   */
  if (examData.isError) {
    return (
      <div className="container mx-auto flex flex-1 h-full max-w-6xl flex-col items-center justify-center space-y-6 p-4">
        <PageHeader title="시험 정보 로딩 실패" shouldShowBackButton={true} />
        <div className="text-center space-y-4">
          <div className="text-red-600 text-lg font-medium">
            시험 정보를 불러올 수 없습니다
          </div>
          <div className="text-gray-600">
            {examData.error?.message || "네트워크 오류가 발생했습니다"}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  /**
   * 현재 활성 탭 결정
   * @description 우선순위: 사용자 선택 탭 > 기본 탭 > 사용 가능한 첫 번째 탭
   */
  const currentActiveTab = activeTab || tabState.defaultActiveTab;

  /**
   * 탭이 결정되지 않은 경우 (로딩 중이거나 탭이 없음)
   */
  if (!currentActiveTab || tabState.availableTabs.length === 0) {
    return (
      <div className="container mx-auto flex flex-1 h-full max-w-6xl flex-col items-center justify-center space-y-6 p-4">
        <PageHeader title="시험 정보 없음" shouldShowBackButton={true} />
        <div className="text-center space-y-4">
          <div className="text-yellow-600 text-lg font-medium">
            이 시험에는 문제가 없습니다
          </div>
          <div className="text-gray-600">
            객관식 문제 수: {tabState.tabCounts.objective}개<br />
            주관식 문제 수: {tabState.tabCounts.subjective}개
          </div>
        </div>
      </div>
    );
  }

  console.log(`[ScanPage] 탭 상태:`, {
    activeTab,
    defaultActiveTab: tabState.defaultActiveTab,
    availableTabs: tabState.availableTabs,
    currentActiveTab,
    shouldShowObjectiveTab: tabState.shouldShowObjectiveTab,
    shouldShowSubjectiveTab: tabState.shouldShowSubjectiveTab,
  });

  /**
   * 탭 전환 핸들러
   */
  const handleTabChange = (newTab: "objective" | "subjective") => {
    if (tabState.availableTabs.includes(newTab)) {
      setActiveTab(newTab);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="container mx-auto flex flex-1 h-full max-w-6xl flex-col items-center space-y-6 p-4">
      <PageHeader
        title={examData.examDetail.examName || "시험"}
        shouldShowBackButton={true}
      />

      {/* 시험 정보 요약 (개발 확인용)
      {process.env.NODE_ENV === "development" && (
        <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700 w-full max-w-4xl">
          <div className="font-semibold mb-2">📊 시험 정보</div>
          <div className="flex gap-4">
            <div>객관식: {tabState.tabCounts.objective}문제</div>
            <div>주관식: {tabState.tabCounts.subjective}문제</div>
            <div>총 문제: {examData.totalQuestions}문제</div>
            
          </div>
        </div>
      )} */}

      {/* 동적 탭 버튼들 */}
      <div className="flex border-b border-gray-200 mb-6 w-full max-w-4xl">
        {/* 객관식 탭 - 객관식 문제가 있을 때만 표시 */}
        {tabState.shouldShowObjectiveTab && (
          <button
            onClick={() => handleTabChange("objective")}
            className={cn(
              "px-6 py-3 text-sm font-medium border-b-2 transition-all duration-300 ease-in-out",
              currentActiveTab === "objective"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700",
            )}
          >
            객관식 ({tabState.tabCounts.objective}문제)
          </button>
        )}

        {/* 주관식 탭 - 주관식 문제가 있을 때만 표시 */}
        {tabState.shouldShowSubjectiveTab && (
          <button
            onClick={() => handleTabChange("subjective")}
            className={cn(
              "px-6 py-3 text-sm font-medium border-b-2 transition-all duration-300 ease-in-out",
              currentActiveTab === "subjective"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700",
            )}
          >
            주관식 ({tabState.tabCounts.subjective}문제)
          </button>
        )}
      </div>

      {/* 동적 탭 컨텐츠 - 조건부 렌더링 및 부드러운 전환 애니메이션 */}
      <div className="w-full relative">
        {/* 다중 탭일 때 - 애니메이션과 함께 렌더링 */}
        {tabState.availableTabs.length > 1 && (
          <>
            {/* 객관식 탭 - 객관식 문제가 있을 때만 렌더링 */}
            {tabState.shouldShowObjectiveTab && (
              <div
                className={cn(
                  "transition-all duration-500 ease-in-out",
                  currentActiveTab === "objective"
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-full absolute top-0 left-0 w-full pointer-events-none",
                )}
              >
                <ObjectiveTab
                  examDetail={examData.examDetail}
                  onNext={() => {
                    // 주관식 탭이 있으면 주관식으로, 없으면 텍스트 인식으로 이동
                    if (tabState.shouldShowSubjectiveTab) {
                      handleTabChange("subjective");
                    } else {
                      // 주관식이 없으면 바로 텍스트 인식 페이지로
                      window.location.href = `/submit/${examId}/text-recongnition`;
                    }
                  }}
                />
              </div>
            )}

            {/* 주관식 탭 - 주관식 문제가 있을 때만 렌더링 */}
            {tabState.shouldShowSubjectiveTab && (
              <div
                className={cn(
                  "transition-all duration-500 ease-in-out",
                  currentActiveTab === "subjective"
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-full absolute top-0 left-0 w-full pointer-events-none",
                )}
              >
                <SubjectiveTab
                  examDetail={examData.examDetail}
                  onNext={() => {
                    // 텍스트 인식 페이지로 이동
                    window.location.href = `/submit/${examId}/text-recongnition`;
                  }}
                />
              </div>
            )}
          </>
        )}

        {/* 단일 탭일 때 - 애니메이션 없이 바로 표시 */}
        {tabState.availableTabs.length === 1 && (
          <div>
            {tabState.shouldShowObjectiveTab &&
              currentActiveTab === "objective" && (
                <ObjectiveTab
                  examDetail={examData.examDetail}
                  onNext={() => {
                    window.location.href = `/submit/${examId}/text-recongnition`;
                  }}
                />
              )}

            {tabState.shouldShowSubjectiveTab &&
              currentActiveTab === "subjective" && (
                <SubjectiveTab
                  examDetail={examData.examDetail}
                  onNext={() => {
                    window.location.href = `/submit/${examId}/text-recongnition`;
                  }}
                />
              )}
          </div>
        )}
      </div>
    </div>
  );
}
