import { ExamQuestionItem } from "@/components/exam";
import { PageHeader } from "@/components/layout";
import { createFileRoute } from "@tanstack/react-router";
import type { ProblemStatus } from "@/components/exam/types";

export const Route = createFileRoute("/main/exam/$examId/")({
  component: RouteComponent,
});

export type ExamQuestion = {
  id: string;
  questionNumber: number;
  category: string;
  type: string;
  difficulty: string;
  status: ProblemStatus;
};

const examQuestions: ExamQuestion[] = [
  {
    id: "0198e5a3-4931-768e-a519-4bade610257c",
    questionNumber: 1,
    category: "다항식의 덧셈·뺄셈",
    type: "계산",
    difficulty: "중" as const,
    status: "active" as const,
  },
  {
    id: "233a1234-4931-768e-a519-fhgujysdf",
    questionNumber: 2,
    category: "영문법 기초",
    type: "객관식",
    difficulty: "하" as const,
    status: "completed" as const,
  },
  {
    id: "393a1234-kfgy-sdss-dfd-2sdfsdf3asd",
    questionNumber: 3,
    category: "물리학 실험",
    type: "서술형",
    difficulty: "상" as const,
    status: "locked" as const,
  },
  {
    id: "fg4rds-fs3g-768e-a519-gjjkdfefs",
    questionNumber: 4,
    category: "한국사 근현대",
    type: "논술",
    difficulty: "상" as const,
    status: "active" as const,
  },
  {
    id: "555a1234-4931-768e-a519-4bade610257c",
    questionNumber: 5,
    category: "화학 반응식",
    type: "계산",
    difficulty: "중" as const,
    status: "completed" as const,
  },
];

const handleQuestionNavigate = (questionId: string) => {
  alert(`${questionId}번 문제에서 뒤로가기`);
};

function RouteComponent() {
  const { examId } = Route.useParams();
  return (
    <div>
      <PageHeader title="가나다 시험" showBackButton={true} />

      {/* 그래프 공간 */}

      <div className="mt-5 mb-5 flex h-60 justify-center rounded-2xl bg-gray-300"></div>

      <div className="space-y-3">
        <div>
          {examQuestions.map((question) => (
            <ExamQuestionItem
              key={question.id}
              question={question}
              examId={examId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
