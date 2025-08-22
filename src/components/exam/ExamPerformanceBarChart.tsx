import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type CountByCategory = {
  /** 카테고리명 */
  category: string;
  /** 문제 수 */
  count: number;
};

type ExamPerformanceBarChartProps = {
  /** 카테고리별 문제 수 데이터 */
  data: CountByCategory[];
  /** 막대 클릭 시 호출되는 핸들러 (카테고리명 인자 전달) */
  onBarClick?: (category: string) => void;
  /** 추가 클래스명 */
  className?: string;
};

/**
 * 항목별 문제 수 막대 차트
 * @description 카테고리별 문제 수를 표시하고, 막대 클릭으로 카테고리 선택 상호작용 제공
 */
export function ExamPerformanceBarChart({
  data,
  onBarClick,
  className,
}: ExamPerformanceBarChartProps) {
  const chartConfig = React.useMemo<ChartConfig>(
    () => ({
      count: {
        label: "문제 수",
        color: "hsl(var(--chart-1))",
      },
    }),
    [],
  );

  return (
    <ChartContainer config={chartConfig} className={className}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: 12, bottom: 8 }}>
        <CartesianGrid vertical={false} stroke="#e5e7eb" />
        <XAxis
          dataKey="category"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip
          cursor={{ fill: "rgba(0,0,0,0.04)" }}
          content={<ChartTooltipContent />}
        />
        <Bar
          dataKey="count"
          fill="var(--color-count)"
          radius={[4, 4, 0, 0]}
          onClick={(data, index) => {
            if (!onBarClick) return;
            const category = (
              data && typeof data === "object" && "category" in data
                ? (data as CountByCategory).category
                : undefined
            ) as string | undefined;
            if (category) onBarClick(category);
          }}
        />
      </BarChart>
    </ChartContainer>
  );
}
