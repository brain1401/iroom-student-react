import { createFileRoute } from "@tanstack/react-router";
import { ExamList } from "@/components/student";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/main/test/")({
  component: MainTestPage,
});

function MainTestPage() {
  return (
    <div className="flex w-full flex-1 justify-center px-4 py-4 sm:px-6 md:px-8">
      <div className="flex w-full max-w-md flex-col sm:max-w-lg md:max-w-2xl">
        <Tabs defaultValue="exams" className="w-full">
          <TabsList className="mx-auto mb-3 w-full max-w-[640px] justify-start gap-6 bg-transparent p-0 border-b border-[#E5E5E5]">
            <TabsTrigger
              value="exams"
              className="h-auto rounded-none border-none bg-transparent px-0 pb-2 text-[16px] font-bold text-black shadow-none data-[state=inactive]:text-[#9A9A9A] data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent"
            >
              시험 관리
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="h-auto rounded-none border-none bg-transparent px-0 pb-2 text-[16px] font-bold text-[#9A9A9A] shadow-none data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:bg-transparent"
            >
              성적 / 리포트
            </TabsTrigger>
          </TabsList>

          <TabsContent value="exams">
            <ExamList
              items={[
                {
                  title: "가나다 시험",
                  date: "25.08.11",
                  submitted: true,
                  range: "1단원 ~ 3단원",
                  teacher: "김선생",
                  deadline: "25.08.15 23:59",
                },
                {
                  title: "가나다 시험",
                  date: "25.08.11",
                  submitted: false,
                  range: "전 범위",
                  teacher: "이선생",
                  deadline: "25.08.18 18:00",
                },
                {
                  title: "가나다 시험",
                  date: "25.08.11",
                  submitted: false,
                  range: "확률과 통계",
                  teacher: "박선생",
                  deadline: "25.08.20 23:00",
                },
                {
                  title: "가나다 시험",
                  date: "25.08.11",
                  submitted: true,
                  range: "문학 작품 해석",
                  teacher: "최선생",
                  deadline: "25.08.25 12:00",
                },
              ]}
              className="bg-[#FAFAFA]"
            />
          </TabsContent>

          <TabsContent value="reports">
            <div className="mx-auto w-full max-w-[640px]">
              <div className="divide-y divide-[#EAEAEA] overflow-hidden rounded-[10px] border border-[#D7D7D7] bg-[#FAFAFA]">
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="text-[15px] font-semibold text-[#111]">
                      수학 중간고사
                    </div>
                    <div className="text-[13px] text-[#777]">2025-08-11</div>
                  </div>
                  <div className="mt-1 text-[14px] text-[#4E4D4D]">
                    총점 92점 · 오답 다빈도: 확률과 통계, 경우의 수
                  </div>
                </div>
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="text-[15px] font-semibold text-[#111]">
                      국어 모의고사
                    </div>
                    <div className="text-[13px] text-[#777]">2025-08-03</div>
                  </div>
                  <div className="mt-1 text-[14px] text-[#4E4D4D]">
                    총점 84점 · 리포트: 현대시 해석 의미 추론 문항 취약
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// duplicate scaffold removed
