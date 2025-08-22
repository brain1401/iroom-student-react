import * as React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type ScoreByCategory = {
  /** 카테고리명 (예: 덧셈·뺄셈) */
  category: string;
  /** 정답률(%) */
  accuracy: number;
};

type ExamPerformanceChartProps = {
  /** 카테고리별 정답률 데이터 */
  data: ScoreByCategory[];
  /** 그래프 높이 클래스 (Tailwind) */
  heightClassName?: string;
  /** 추가 클래스명 */
  className?: string;
};

/**
 * 항목별 정답률 라인 차트
 * @description 카테고리별 정답률(%)을 0~100 스케일로 표시하는 라인 차트
 *
 * 주요 기능:
 * - 0,20,40,60,80,100 기준선 표시
 * - 커스텀 툴팁 및 범례 제공
 * - 접근성 고려된 포커스 처리
 *
 * @example
 * ```tsx
 * <ExamPerformanceChart data={[{ category: "덧셈·뺄셈", accuracy: 72 }]} />
 * ```
 */
export function ExamPerformanceChart({
  data,
  heightClassName = "h-56",
  className,
}: ExamPerformanceChartProps) {
  const chartConfig = React.useMemo<ChartConfig>(
    () => ({
      accuracy: {
        label: "정답률(%)",
        color: "#155DFC",
      },
    }),
    [],
  );

  return (
    <ChartContainer config={chartConfig} className={className}>
      <div className={heightClassName}>
        <LineChart
          data={data}
          margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis
            dataKey="category"
            tickLine={false}
            axisLine={false}
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            tick={{ fontSize: 12 }}
          />
          {[0, 20, 40, 60, 80, 100].map((y) => (
            <ReferenceLine
              key={y}
              y={y}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth={1}
            />
          ))}
          <Line
            dataKey="accuracy"
            type="monotone"
            stroke="var(--color-accuracy)"
            strokeWidth={2}
            dot={{ r: 3 }}
            isAnimationActive={false}
            name="정답률(%)"
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent nameKey="category" />}
          />
          <ChartLegend verticalAlign="top" content={<ChartLegendContent />} />
        </LineChart>
      </div>
    </ChartContainer>
  );
}
