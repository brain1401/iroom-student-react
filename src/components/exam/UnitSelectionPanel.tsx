import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type UnitSelectionPanelProps = {
  /** 제목 라벨 (기본값: "단원 선택") */
  title?: string;
  /** 왼쪽 패널 단원 목록 */
  units: string[];
  /** 현재 선택된 단원들 */
  selectedUnits: string[];
  /** 선택 변경 콜백 */
  onChange: (nextSelected: string[]) => void;
  /** 적용 버튼 클릭 콜백 */
  onApply?: () => void;
  /** 추가 클래스명 */
  className?: string;
};

/**
 * 단원 선택 패널
 *
 * 주요 기능:
 * - 좌측: 단원 목록
 * - 우측: 선택된 단원 태그 리스트 + 삭제 및 적용 버튼
 */
export function UnitSelectionPanel({
  title = "단원 선택",
  units,
  selectedUnits,
  onChange,
  onApply,
  className,
}: UnitSelectionPanelProps) {
  const toggle = (unit: string) => {
    const has = selectedUnits.includes(unit);
    onChange(
      has ? selectedUnits.filter((u) => u !== unit) : [...selectedUnits, unit],
    );
  };

  return (
    <div className={cn("grid grid-cols-[1fr_1fr] gap-6", className)}>
      <div className="rounded-[10px] border-2 border-[#D7D7D7] p-4">
        <div className="mb-3 text-[30px]/[1] font-bold text-[#155DFC]">
          {title}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {units.map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => toggle(u)}
              className={cn(
                "h-[48.03px] w-[94.19px] rounded-[10px] text-[20px] font-extrabold",
                selectedUnits.includes(u)
                  ? "bg-[#155DFC] text-white"
                  : "bg-[#D9E4FF] text-[#155DFC]",
              )}
            >
              단원
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[10px] border-2 border-[#D7D7D7] p-4">
        <div className="mb-3 text-[30px]/[1] font-bold text-[#155DFC]">
          선택 단원
        </div>
        <div className="flex flex-wrap gap-3">
          {selectedUnits.map((u) => (
            <div key={u} className="relative">
              <div className="h-[48.03px] w-[450.54px] rounded-[10px] bg-white/0" />
              <div className="absolute left-0 top-0 flex w-[450.54px] items-center justify-between px-2 py-1.5">
                <span className="text-[20px]/[1.19] text-[#1C1C1E]">{u}</span>
                <button
                  type="button"
                  className="inline-grid size-7 place-items-center rounded hover:bg-black/5"
                  onClick={() => onChange(selectedUnits.filter((x) => x !== u))}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="size-4 text-black"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <Button
            onClick={onApply}
            className={cn(
              "h-[38.03px] rounded-md bg-[#454545] px-4 text-[20px] font-normal text-white hover:bg-[#454545]/90",
            )}
          >
            선택한 단원 적용
          </Button>
        </div>
      </div>
    </div>
  );
}
