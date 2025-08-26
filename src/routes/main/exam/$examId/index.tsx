import { ExamQuestionItem } from "@/components/exam";
import { PageHeader } from "@/components/layout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/main/exam/$examId/")({
  component: RouteComponent,
});

const examQuestions = [
  {
    id: "1",
    questionNumber: 1,
    category: "다항식의 덧셈·뺄셈",
    type: "계산",
    difficulty: "중" as const,
    status: "active" as const,
  },
  {
    id: "2",
    questionNumber: 2,
    category: "영문법 기초",
    type: "객관식",
    difficulty: "하" as const,
    status: "completed" as const,
  },
  {
    id: "3",
    questionNumber: 3,
    category: "물리학 실험",
    type: "서술형",
    difficulty: "상" as const,
    status: "locked" as const,
  },
  {
    id: "4",
    questionNumber: 4,
    category: "한국사 근현대",
    type: "논술",
    difficulty: "상" as const,
    status: "active" as const,
  },
  {
    id: "5",
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
  const {examId} = Route.useParams()
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
              questionNumber={question.questionNumber}
              category={question.category}
              type={question.type}
              difficulty={question.difficulty}
              status={question.status}
              examId={examId}
              onNavigate={() => handleQuestionNavigate(question.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
