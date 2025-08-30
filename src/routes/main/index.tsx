import { PageHeader } from "@/components/layout";
import { ExamResultCard, RecentSubmission } from "@/components/student";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import type { RecentSubmission as RecentSubmissionType } from "@/api/student/types";

/**
 * 메인 홈 라우트
 * @description 로그인 이후 진입하는 홈 화면 라우트
 */
export const Route = createFileRoute("/main/")({
  component: TestList,
});

type ExamResult = {
  id: string;
  title: string;
  correctCount: number;
  incorrectCount: number;
  accuracyRate: number;
};

// UUID import 제거 - SSR hydration mismatch 해결을 위해 정적 ID 사용

// 1. 실제 API 응답과 유사한 형태의 데이터 배열을 정의
const examResultsData: ExamResult[] = [
  {
    id: "exam-2025-08-mock-1", // 정적 ID로 hydration mismatch 방지
    title: "2025년 8월 모의고사",
    correctCount: 10,
    incorrectCount: 5,
    accuracyRate: 66.67,
  },
  {
    id: "exam-2025-08-mock-2", // 정적 ID로 hydration mismatch 방지
    title: "2025년 8월 모의고사",
    correctCount: 10,
    incorrectCount: 5,
    accuracyRate: 66.67,
  },
  {
    id: "exam-math-chapter-1",
    title: "수학(상) 단원 평가",
    correctCount: 8,
    incorrectCount: 2,
    accuracyRate: 80.0,
  },
  {
    id: "exam-final-comprehensive-1",
    title: "기말고사 대비 종합 시험",
    correctCount: 25,
    incorrectCount: 5,
    accuracyRate: 83.33,
  },
  {
    id: "exam-2025-08-mock-3", // 정적 ID로 hydration mismatch 방지
    title: "2025년 8월 모의고사",
    correctCount: 10,
    incorrectCount: 5,
    accuracyRate: 66.67,
  },
  {
    id: "exam-math-chapter-2",
    title: "수학(상) 단원 평가",
    correctCount: 8,
    incorrectCount: 2,
    accuracyRate: 80.0,
  },
  {
    id: "exam-final-comprehensive-2",
    title: "기말고사 대비 종합 시험",
    correctCount: 25,
    incorrectCount: 5,
    accuracyRate: 83.33,
  },
];

// RecentSubmission 타입에 맞는 가데이터 생성
const recentSubmissionData: RecentSubmissionType[] = [
  {
    examId: "exam-2025-08-mock-1",
    examTitle: "2025년 8월 모의고사",
    totalQuestions: 15,
    chapterName: "수학(상) - 다항식",
    submittedAt: "2025-01-15T10:30:00Z",
    examType: "mock",
  },
  {
    examId: "exam-math-chapter-1",
    examTitle: "수학(상) 단원 평가",
    totalQuestions: 20,
    chapterName: "수학(상) - 방정식",
    submittedAt: "2025-01-14T14:20:00Z",
    examType: "chapter",
  },
  {
    examId: "exam-final-comprehensive-1",
    examTitle: "기말고사 대비 종합 시험",
    totalQuestions: 30,
    chapterName: "수학(상) - 전체 단원",
    submittedAt: "2025-01-13T09:15:00Z",
    examType: "comprehensive",
  },
  {
    examId: "exam-2025-08-mock-2",
    examTitle: "2025년 8월 모의고사",
    totalQuestions: 15,
    chapterName: "수학(상) - 함수",
    submittedAt: "2025-01-12T16:45:00Z",
    examType: "mock",
  },
  {
    examId: "exam-math-chapter-2",
    examTitle: "수학(상) 단원 평가",
    totalQuestions: 18,
    chapterName: "수학(상) - 도형",
    submittedAt: "2025-01-11T11:30:00Z",
    examType: "chapter",
  },
];

function TestList() {
  return (
    <>
      {/* 최근 제출 시험 */}
      <RecentSubmission submissions={recentSubmissionData} />

      {/* 시험 목록 */}
      <div className="mt-8 mb-20 mr-8 ml-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            시험 목록
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            응시한 시험들의 결과를 확인해보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {examResultsData.map((result) => (
            <ExamResultCard
              key={result.id}
              exam={{
                examId: result.id,
                title: result.title,
                correctCount: result.correctCount,
                incorrectCount: result.incorrectCount,
                accuracyRate: result.accuracyRate,
              }}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-200 hover:border-blue-300"
            />
          ))}
        </div>
      </div>

      <div className="flex">
        <Button variant="ghost" className="mb-10 ml-10 font-bold text-gray-400">
          로그아웃
        </Button>
      </div>
    </>
  );
}
