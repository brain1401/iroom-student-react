import { MathQuestionCard } from "@/components/shared";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/submit/$examId/text-recongnition/")({
  component: RouteComponent,
});

type Question = {
  id: number;
  questionNumber: number;
  state: "completed" | "error" | "idle" | "loading";
};

// 1. 각 문제의 상태를 담은 데이터 배열 생성
const questionsData: Question[] = [
  { id: 1, questionNumber: 1, state: "completed" },
  { id: 2, questionNumber: 2, state: "completed" },
  { id: 3, questionNumber: 3, state: "completed" },
  { id: 4, questionNumber: 4, state: "completed" },
  { id: 5, questionNumber: 5, state: "completed" },
  { id: 6, questionNumber: 6, state: "completed" },
  { id: 7, questionNumber: 7, state: "completed" },
  { id: 8, questionNumber: 8, state: "completed" },
  { id: 9, questionNumber: 9, state: "error" },
  { id: 10, questionNumber: 10, state: "idle" },
  { id: 11, questionNumber: 11, state: "loading" },
  { id: 12, questionNumber: 12, state: "completed" },
  { id: 13, questionNumber: 13, state: "completed" },
];

function RouteComponent() {
  return (
    <div className="container mx-auto flex h-full max-w-6xl flex-1 flex-col items-center space-y-6 overflow-y-scroll p-4">
      <PageHeader title="가나다 시험" shouldShowBackButton={true} />
      <div className="flex w-full flex-col gap-4">
        {/* 2. map 함수로 배열을 순회하며 MathQuestionCard 렌더링 */}
        {questionsData.map((question) => (
          <MathQuestionCard
            key={question.id}
            questionNumber={question.questionNumber}
            state={question.state}
          />
        ))}
      </div>

      <div className="flex-1" />

      <Button className="w-[80%]">제출하기</Button>
    </div>
  );
}
