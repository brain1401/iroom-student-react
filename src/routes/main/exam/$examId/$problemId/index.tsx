import { PageHeader } from "@/components/layout";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { MdCheckCircleOutline } from "react-icons/md";

export const Route = createFileRoute("/main/exam/$examId/$problemId/")({
  component: RouteComponent,
});

const examResultsTest = {
  id: "1",
  number: "1",
  text: "(3x-4)(x+6)를 전개하시오.",
  Answer: "3x² + 14x - 24",
  userAnswer: "3x² + 14x - 24",
};

function RouteComponent() {
  const { problemId } = Route.useParams();
  const router = useRouter();

  return (
    <div>
      <PageHeader
        title={`가나다 시험 ${problemId}번 문제`}
        showBackButton={true}
        onBack={router.history.back}
      />

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm mt-5">
        <h2 className="text-xl font-semibold">문제{examResultsTest.number}</h2>
        <div className="mt-2 text-xl ">
          <p>{examResultsTest.text}</p>
        </div>
      </div>

      <div className="mt-5 p-3 flex items-center gap-2">
        <MdCheckCircleOutline className="h-6 w-6 text-blue-500"></MdCheckCircleOutline>
        <h2 className="text-xl font-bold text-slate-700">채점 결과</h2>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* 1개 세로줄 가진 격자판
      md : 화면이 넗어지면 세로줄을 2개로 변경 */}

        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h3 className="text-base font-medium  ">정답</h3>
          <p className="mt-2 text-xl font-bold text-blue-500">
            {examResultsTest.Answer}
          </p>
        </div>

        <div className="rounded-lg border border-green-600 bg-green-50 p-5">
          <h3 className="text-base font-medium ">나의 답안</h3>
          <p className="mt-2 text-xl font-bold text-green-700">
            {examResultsTest.userAnswer}
          </p>
        </div>
      </div>
    </div>
  );
}
