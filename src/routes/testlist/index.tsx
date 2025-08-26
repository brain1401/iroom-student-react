import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExamResultCard } from "@/components/student"; // 필요한 컴포넌트만 import
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/testlist/")({
  component: TestList,
});

// 1. 실제 API 응답과 유사한 형태의 데이터 배열을 정의
const examResultsData = [
  {
    id: 1, // 각 항목을 구분할 고유 id
    title: "2025년 8월 모의고사",
    correctCount: 10,
    incorrectCount: 5,
    accuracyRate: 66.67,
  },
  {  id: 1, // 각 항목을 구분할 고유 id
    title: "2025년 8월 모의고사",
    correctCount: 10,
    incorrectCount: 5,
    accuracyRate: 66.67,
  },
  {
    id: 2,
    title: "수학(상) 단원 평가",
    correctCount: 8,
    incorrectCount: 2,
    accuracyRate: 80.0,
  },
  {
    id: 3,
    title: "기말고사 대비 종합 시험",
    correctCount: 25,
    incorrectCount: 5,
    accuracyRate: 83.33,
  },  {
    id: 1, // 각 항목을 구분할 고유 id
  title: "2025년 8월 모의고사",
  correctCount: 10,
  incorrectCount: 5,
  accuracyRate: 66.67,
},
{
  id: 2,
  title: "수학(상) 단원 평가",
  correctCount: 8,
  incorrectCount: 2,
  accuracyRate: 80.0,
},
{
  id: 3,
  title: "기말고사 대비 종합 시험",
  correctCount: 25,
  incorrectCount: 5,
  accuracyRate: 83.33,
},
];

function TestList() {
  return (
    <div className="flex flex-col w-full h-full">
      <Card className="mt-20 mb-20 mr-8 ml-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            시험 목록
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {" "}
          {/* 아이템 사이 간격을 위해 gap 추가 */}
          {/* 2. map 함수를 사용해 배열의 각 요소를 컴포넌트로 변환 */}
          {examResultsData.map((result) => (
            <ExamResultCard
              key={result.id} // React가 목록을 효율적으로 관리하기 위한 필수 key prop
              title={result.title}
              correctCount={result.correctCount}
              incorrectCount={result.incorrectCount}
              accuracyRate={result.accuracyRate}
            />
          ))}
        </CardContent>
      </Card>
      <div className="flex-1"> </div>
      <div className="flex">
      <Button variant="ghost" className="mb-10 ml-10 font-bold text-gray-400">로그아웃</Button>
      </div>
    </div>
  );
}
