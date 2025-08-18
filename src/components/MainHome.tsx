import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import UserProfileHeader from "@/components/layout/UserProfileHeader";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell } from "recharts";


/**
 * 메인 홈 화면 컴포넌트
 * @description 피그마 모바일 프레임 기반 홈 요약 화면 구성
 *
 * 주요 섹션:
 * - 사용자 정보 헤더
 * - 최근 성적 카드
 * - 맞춤 공부 목록
 */
export function MainHome() {
  // 그래프 데이터 설정
  const chartData = [
    { name: "덧셈·뺄셈", rate: 100 },
    { name: "곱셈", rate: 70 },
    { name: "전개", rate: 50 },
    { name: "인수분해", rate: 30 },
    { name: "응용", rate: 50 },
  ];
  const barColors = ["#9810FA", "#D499FF", "#D499FF", "#EDD5FF", "#D499FF"];

  return (
    <div className={cn("w-full flex justify-center")}>
      <div
        className={cn(
          "w-[360px] bg-white dark:bg-white p-4 space-y-6",
        )}
        style={{ minHeight: 780 }}
      >
      {/* 상단 사용자 영역 */}
      <UserProfileHeader name="김체리" badgeLabel="중등 B반" />

      {/* 최근 성적 */}
      <section className="space-y-0">
        <h2 className="text-[25px] font-medium leading-[1.19] text-[#000]">최근 성적</h2>
        <Card className="shadow-md border border-[#E4E4E4] rounded-[10px] w-[312.78px]">
          <CardContent className="px-3 py-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-[20px] font-bold leading-[1.19] text-[#000]">가나다 시험</div>
                <span className="inline-flex items-center rounded-full border border-black px-2.5 py-0.5 text-[10.5px] leading-none text-black">
                  항목별
                </span>
                <span className="text-[12px] leading-[1.19] text-[#4E4D4D]">25.08.11</span>
              </div>
              <button className="text-[12px] leading-[1.19] text-[#4E4D4D] underline">상세보기</button>
            </div>

            {/* 정답률 그래프 */}
            <div className="w-full" style={{ height: 120 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                  <YAxis domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} width={24} tick={{ fontSize: 10 }} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} height={24} />
                  <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

          


          </CardContent>
        </Card>
      </section>

      {/* 맞춤 공부 */}
      <section className="space-y-0">
        <h2 className="text-[25px] font-medium leading-[1.19] text-[#000]">맞춤 공부</h2>
        <Card className="shadow-md border border-[#E4E4E4] rounded-[10px] w-[312.78px]">
          <CardContent className="px-3 py-1">
            <div className="flex flex-col gap-2">
              {[
                "내용1",
                "내용1",
                "내용1",
                "내용1",
                "내용1",
              ].map((label, idx, arr) => (
                <div key={idx} className="">
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-[20px] font-medium text-[#000]">{label}</span>
                    <ChevronRight className="h-5 w-5 text-[#1C1C1E]" />
                  </div>
                  {idx < arr.length - 1 && (
                    <div className="h-px w-full bg-[#E4E4E4]" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
      </div>
    </div>
  );
}

export default MainHome;


