import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
} from "recharts";


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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 캐러셀 상태
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  useEffect(() => {
    if (!carouselApi) return;
    const handleSelect = () =>
      setCarouselIndex(carouselApi.selectedScrollSnap());
    handleSelect();
    carouselApi.on("select", handleSelect);
    return () => {
      carouselApi.off("select", handleSelect);
    };
  }, [carouselApi]);

  return (
    <div className={cn("w-full flex justify-center")}>
      <div
        className={cn("w-[360px] bg-white dark:bg-white p-4 space-y-6")}
        style={{ minHeight: 780 }}
      >
        {/* 상단 사용자 영역: /main/route.tsx에서 공통 렌더링 */}

        {/* 피그마 배너 캐러셀 섹션 */}
        <div className="mx-auto w-[318px]">
          <Carousel setApi={setCarouselApi} opts={{ align: "start", loop: true }}>
            <CarouselContent>
              {[0, 1, 2].map((i) => (
                <CarouselItem key={i} className="basis-full">
                  <div className="w-[318px] rounded-[10px] bg-[#EDD5FF] px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-[18.13px] px-3 rounded-full border border-black flex items-center justify-center">
                          <span className="text-[10.43px] leading-[1] text-[#000]">
                            D-1
                          </span>
                        </div>
                        <span className="text-[11.47px] leading-[1] text-[#000]">
                          25.08.11 (월) 18:00
                        </span>
                      </div>
                      <Button
                        type="button"
                        className="rounded-[10px] bg-[#9810FA] px-[10px] py-[10px] text-[15px] leading-[1.193] text-white"
                        aria-label="제출하기"
                      >
                        제출하기
                      </Button>
                    </div>
                    <div className="mt-2 text-[14.6px] leading-[1] text-[#000]">
                      뭐시기 뭐뭐 시험 제출
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="mt-2 flex items-center justify-center gap-[14.35px]">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: "8.34px",
                  height: "8.34px",
                  backgroundColor: carouselIndex === i ? "#615959" : "#D9D9D9",
                }}
              />
            ))}
          </div>
        </div>

        {/* 최근 성적 */}
        <section className="space-y-0">
          <h2 className="text-[25px] font-medium leading-[1.19] text-[#000]">
            최근 성적
          </h2>
          <Card className="shadow-md border border-[#E4E4E4] rounded-[10px] w-full mt-2 py-4">
            <CardContent className="px-3 py-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-[20px] font-bold leading-[1.19] text-[#000]">
                    가나다 시험
                  </div>
                  <span className="inline-flex items-center rounded-full border border-black px-2.5 py-0.5 text-[10.5px] leading-none text-black">
                    항목별
                  </span>
                  <span className="text-[12px] leading-[1.19] text-[#4E4D4D]">
                    25.08.11
                  </span>
                </div>
                <Link
                  to="/main/report"
                  className="text-[12px] leading-[1.19] text-[#4E4D4D] underline"
                >
                  상세보기
                </Link>
              </div>

              {/* 정답률 라벨 */}
              <div className="mt-3 text-[10.43px] leading-[1] text-[#000]">
                정답률(%)
              </div>

              {/* 정답률 그래프 */}
              <div className="w-full mt-1 relative" style={{ height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
                  >
                    <YAxis
                      domain={[0, 100]}
                      ticks={[0, 20, 40, 60, 80, 100]}
                      width={24}
                      tick={{ fontSize: 10 }}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      interval={0}
                      height={26}
                    />
                    <Bar dataKey="rate" radius={[4, 4, 0, 0]} barSize={26}>
                      {chartData.map((d, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={barColors[index % barColors.length]}
                          className="cursor-pointer"
                          onClick={() => setSelectedCategory(d.name)}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                {/* 성취 레전드: 그래프 내부 우측 상단 오버레이 */}
                <div className="absolute right-0 top-0 flex flex-col items-end gap-2 pr-2 pt-1">
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: 7.8,
                        height: 7.8,
                        backgroundColor: "#9810FA",
                        borderRadius: 2,
                      }}
                    />
                    <span className="text-[10.43px] leading-[1] text-[#000]">
                      우수
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: 7.8,
                        height: 7.8,
                        backgroundColor: "#D499FF",
                        borderRadius: 2,
                      }}
                    />
                    <span className="text-[10.43px] leading-[1] text-[#000]">
                      보통
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        width: 7.8,
                        height: 7.8,
                        backgroundColor: "#EDD5FF",
                        borderRadius: 2,
                      }}
                    />
                    <span className="text-[10.43px] leading-[1] text-[#000]">
                      노력 필요
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 맞춤 공부 */}
        <section className="space-y-0">
          <h2 className="text-[25px] font-medium leading-[1.19] text-[#000]">
            맞춤 공부
          </h2>
          <Card className="shadow-md border border-[#E4E4E4] rounded-[10px] w-full mt-2 py-2">
            <CardContent className="px-3 py-0">
              <div className="flex flex-col gap-2">
                {(selectedCategory
                  ? Array.from({ length: 1 }).map((_, i) => ({
                      id: String(i + 101),
                      title: `${selectedCategory} 관련 문제 ${i + 1}`,
                      unit: selectedCategory,
                      type: "유형 : 계산",
                      level: "난이도 : 중",
                    }))
                  : Array.from({ length: 5 }).map((_, i) => ({
                      id: String(i + 1),
                      title: `가다나 시험 ${i + 1}번`,
                      unit: "# 1. 식의 계산 - 다항식의 곱셈",
                      type: "유형 : 계산",
                      level: "난이도 : 중",
                    }))
                ).map((item, idx, arr) => (
                  <div key={idx}>
                    <div className="flex items-start justify-between py-1.5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[13px] font-bold leading-[1.19] text-[#000]">
                          {item.title}
                        </span>
                        <span className="text-[13px] leading-[1.19] text-[#427BFF]">
                          {item.unit}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] leading-[1.19] text-[#000]">
                            {item.type}
                          </span>
                          <span className="text-[11px] leading-[1.19] text-[#000]">
                            {item.level}
                          </span>
                        </div>
                      </div>
                      <Link
                        to="/main/problem/$id"
                        params={{ id: item.id }}
                        className="inline-flex"
                        aria-label="문제 상세 보기"
                      >
                        <ChevronRight className="h-11 w-5 text-[#1C1C1E]" />
                      </Link>
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
