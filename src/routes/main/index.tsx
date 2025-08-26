import { PageHeader } from "@/components/layout";
import { ExamResultCard } from "@/components/student";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";

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

function TestList() {
  return (
    <>
      <Card className="mt-20 mb-20 mr-8 ml-8 p-5 px-10">
        <div className="flex flex-col gap-4">
          <PageHeader title="시험 목록" showBackButton={false} />
          <CardContent className="flex flex-col gap-4 px-0">
            {/* 아이템 사이 간격을 위해 gap 추가 */}
            {/* 2. map 함수를 사용해 배열의 각 요소를 컴포넌트로 변환 */}
            {examResultsData.map((result, index) => {
              const isLastItem = index === examResultsData.length - 1;

              return (
                <div
                  className="flex flex-col gap-4"
                  key={result.id} // React가 목록을 효율적으로 관리하기 위한 필수 key prop
                >
                  <ExamResultCard
                    exam={{
                      examId: result.id,
                      title: result.title,
                      correctCount: result.correctCount,
                      incorrectCount: result.incorrectCount,
                      accuracyRate: result.accuracyRate,
                    }}
                  />
                  {!isLastItem && <div className="h-px w-full bg-zinc-400" />}
                </div>
              );
            })}
          </CardContent>
          <div className="flex-1" />
        </div>
      </Card>

      <div className="flex">
        <Button variant="ghost" className="mb-10 ml-10 font-bold text-gray-400">
          로그아웃
        </Button>
      </div>
    </>
  );
}
