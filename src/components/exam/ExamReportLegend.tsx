import * as React from "react";

type LegendItem = {
  /** 항목 라벨 */
  label: string;
  /** 색상 값 */
  color: string;
};

type ExamReportLegendProps = {
  /** 범례 항목 목록 */
  items: LegendItem[];
  /** 추가 클래스명 */
  className?: string;
};

/**
 * 리포트 범례 컴포넌트
 * @description 우수/보통/노력 필요 등 범례 표시용 간단 컴포넌트
 */
export function ExamReportLegend({ items, className }: ExamReportLegendProps) {
  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-3 text-xs">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className="size-2.5 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
