import * as React from "react";

import { cn } from "@/lib/utils";

type UnitTagProps = {
  /** 단원명 */
  name: string;
  /** 강조 컬러 (파랑 실채우기 vs 연파랑 배경) */
  variant?: "solid" | "soft";
  /** 삭제 버튼 노출 여부 */
  deletable?: boolean;
  /** 삭제 클릭 콜백 */
  onDelete?: () => void;
  /** 추가 클래스명 */
  className?: string;
};

/**
 * 단원 태그
 *
 * 주요 기능:
 * - 연파랑 배경(`soft`)과 파랑 실채우기(`solid`) 2가지 변형
 * - 선택 영역 우측 상단 삭제 아이콘 배치 가능
 */
export function UnitTag({
  name,
  variant = "soft",
  deletable,
  onDelete,
  className,
}: UnitTagProps) {
  const isSolid = variant === "solid";
  return (
    <div
      className={cn(
        "relative h-[48.03px] w-[94.19px] rounded-[10px]",
        isSolid ? "bg-[#155DFC]" : "bg-[#D9E4FF]",
        className,
      )}
    >
      <div className="absolute left-0 top-[8.26px] grid h-[31.51px] w-[93.89px] place-items-center">
        <span
          className={cn(
            "text-[20px] font-extrabold",
            isSolid ? "text-white" : "text-[#155DFC]",
          )}
        >
          단원
        </span>
      </div>
      {deletable ? (
        <button
          type="button"
          className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded hover:bg-black/5"
          onClick={onDelete}
          aria-label="태그 삭제"
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
      ) : null}
    </div>
  );
}
