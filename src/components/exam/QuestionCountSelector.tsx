import * as React from "react";

import { cn } from "@/lib/utils";

type Level = "상" | "중" | "하";

type QuestionCountSelectorProps = {
  /** 구역 제목 (예: "객관식", "주관식") */
  title: string;
  /** 각 난이도별 초기 값 */
  value: Record<Level, number>;
  /** 값 변경 콜백 */
  onChange: (value: Record<Level, number>) => void;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 추가 클래스명 */
  className?: string;
};

/**
 * 난이도별 문항 수 선택 컴포넌트
 *
 * 주요 기능:
 * - 상/중/하 3개 슬롯으로 구성
 * - 숫자 입력 및 화살표 증감 버튼 제공
 * - 비활성화 상태 지원
 */
export function QuestionCountSelector({
  title,
  value,
  onChange,
  disabled,
  className,
}: QuestionCountSelectorProps) {
  const handleChange = (level: Level, next: number) => {
    const safe = Math.max(0, Math.min(99, Number.isFinite(next) ? next : 0));
    onChange({ ...value, [level]: safe });
  };

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className="text-[25px]/[1.19] font-medium text-[#1C1C1E] w-[65px]">
        {title}
      </span>
      <div className="flex items-center gap-3">
        {(
          [
            ["상", "#D9E4FF"] as const,
            ["중", "#FFFFFF"] as const,
            ["하", "#FFFFFF"] as const,
          ] satisfies ReadonlyArray<readonly [Level, string]>
        ).map(([level, bg]) => (
          <div key={level} className="flex items-center gap-1.5">
            <div
              className={cn(
                "h-[34px] w-[36.87px] rounded-[5px] border",
                "border-[#999797] bg-white grid place-items-center text-[20px]/[1.19] text-[#1C1C1E]",
              )}
            >
              {level}
            </div>
            <div
              className={cn(
                "h-[34px] w-[36.87px] rounded-[5px] border grid place-items-center",
                "text-[20px]/[1.19] text-[#1C1C1E]",
                bg === "#D9E4FF"
                  ? "bg-[#D9E4FF] border-[#D7D7D7]"
                  : "bg-white border-[#D7D7D7]",
              )}
            >
              {value[level]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
