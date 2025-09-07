import { ExamQuestionItem } from "@/components/exam";
import { PageHeader } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { useQuery } from "@tanstack/react-query";
import { getExamById } from "@/api/exam/server-api";
import { extractApiData } from "@/api/common/types";
import type { ExamItem } from "@/api/common/server-types";
import type { ProblemStatus } from "@/components/shared/types";

/**
 * 시험 상세 정보 조회 atom
 * @description 특정 시험 ID의 상세 정보를 실제 서버에서 가져오는 atom
 */
const examDetailQueryAtom = atomWithQuery((get) => {
  // examId는 컴포넌트에서 Route.useParams()로 가져올 예정
  return {
    queryKey: ["exam", "detail", "placeholder"],
    queryFn: async (): Promise<ExamItem | null> => null,
    enabled: false, // 기본적으로 비활성화, 컴포넌트에서 examId로 활성화
  };
});

/**
 * examId를 받아서 해당 시험 상세 정보를 조회하는 함수
 * @param examId 시험 ID
 * @returns React Query 옵션
 */
const createExamDetailQuery = (examId: string) => ({
  queryKey: ["exam", "detail", examId],
  queryFn: async (): Promise<ExamItem> => {
    const response = await getExamById(examId);
    return extractApiData(response);
  },
  staleTime: 10 * 60 * 1000, // 10분간 캐시 유지
  gcTime: 30 * 60 * 1000, // 30분간 가비지 컬렉션 방지
  enabled: Boolean(examId && examId !== "placeholder"),
});

export const Route = createFileRoute("/main/exam/$examId/")({
  // SSR 데이터 프리로딩
  loader: async ({ context, params }) => {
    const { examId } = params;
    
    if (examId && examId !== "placeholder") {
      // 서버에서 시험 상세 데이터를 미리 로드
      await context.queryClient.ensureQueryData({
        queryKey: ["exam", "detail", examId],
        queryFn: async (): Promise<ExamItem> => {
          const response = await getExamById(examId);
          return extractApiData(response);
        },
        staleTime: 10 * 60 * 1000,
      });
    }
  },
  component: RouteComponent,
});

export type ExamQuestion = {
  id: string;
  questionNumber: number;
  category: string;
  type: string;
  difficulty: string;
  status: ProblemStatus;
  // 답안 상세 정보 추가
  questionText?: string;
  studentAnswer?: string;
  correctAnswer?: string;
  isCorrect?: boolean;
  score?: number; // 배점
  earnedScore?: number; // 획득 점수
  // 추가 정보
  solution?: string;
  isSubjective?: boolean;
};

// Mock 데이터 제거됨 - 실제 서버 데이터 사용

// examInfo mock 데이터 제거됨 - 실제 서버 데이터 사용

const handleQuestionNavigate = (questionId: string) => {
  alert(`${questionId}번 문제에서 뒤로가기`);
};

function RouteComponent() {
  const { examId } = Route.useParams();
  
  // useQuery 직접 사용 (atomWithQuery 대신 간단하게)
  const { data: examData, isPending, isError, error } = useQuery(createExamDetailQuery(examId));

  // 로딩 상태
  if (isPending) {
    return (
      <div>
        <PageHeader title="시험 로딩 중..." shouldShowBackButton={true} />
        <div className="px-4 mt-6">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-64" />
        </div>
      </div>
    );
  }

  // 에러 상태
  if (isError || !examData) {
    return (
      <div>
        <PageHeader title="시험을 찾을 수 없음" shouldShowBackButton={true} />
        <div className="px-4 mt-6">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 text-center">
            <p className="text-red-600 dark:text-red-400">
              시험 정보를 불러올 수 없습니다.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {error?.message || "알 수 없는 오류가 발생했습니다."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={examData.examName} shouldShowBackButton={true} />

      {/* 시험 요약정보 카드 */}
      <div className="px-4 mt-6">
        <div className="bg-white rounded-lg border border-purple-500 shadow-sm p-6">
          <div className="space-y-4">
            {/* 시험명 */}
            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 w-16">
                시험명 :
              </span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {examData.examName}
              </span>
            </div>

            {/* 학년 */}
            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 w-16">
                학년 :
              </span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {examData.grade}학년
              </span>
            </div>

            {/* 총 문항 수 (examSheetInfo에서 가져오기) */}
            {examData.examSheetInfo && (
              <>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400 w-16">
                    총문항 :
                  </span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {examData.examSheetInfo.totalQuestions}문항
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400 w-16">
                    총점 :
                  </span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {examData.examSheetInfo.totalPoints}점
                  </span>
                </div>
              </>
            )}

            {/* 시험 설명 */}
            {examData.content && (
              <div className="flex items-start">
                <span className="text-sm text-gray-500 dark:text-gray-400 w-16 mt-1">
                  설명 :
                </span>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white">
                    {examData.content}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 시험 안내 메시지 */}
      <div className="px-4 mt-6 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
          <p className="text-blue-600 dark:text-blue-400 font-medium">
            이 시험은 현재 정보 확인만 가능합니다
          </p>
          <p className="text-sm text-blue-500 dark:text-blue-300 mt-1">
            문제 풀이 기능은 추후 개발 예정입니다
          </p>
        </div>
      </div>
    </div>
  );
}
