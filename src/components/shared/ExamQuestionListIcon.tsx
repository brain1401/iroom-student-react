import { Circle, X } from "lucide-react";
import type { ProblemStatus } from "./types";
import { cn } from "@/lib/utils";

type Props = {
  status: ProblemStatus;
  className?: string;
  thickness?: number;
};

const ICON_CLASSNAME = "h-full w-full";

/**
 * 시험 문제 상태 아이콘 컴포넌트
 * @description 문제 상태에 따라 다른 아이콘과 색상을 표시하는 컴포넌트
 *
 * 상태별 아이콘:
 * - active: 빨간색 원 (진행 중인 문제)
 * - completed: 초록색 원 (정답 처리된 문제)
 * - locked: 회색 X (오답 처리된 문제)
 */
export function ExamQuestionListIcon({
  status,
  className,
  thickness = 4,
}: Props) {
  switch (status) {
    case "active":
      return (
        <div className={className}>
          <Circle
            strokeWidth={thickness}
            className={cn("text-[#FF6A71]", ICON_CLASSNAME)}
            aria-label="진행 중인 문제"
          />
        </div>
      );
    case "completed":
      return (
        <div className={className}>
          <Circle
            className={cn("text-green-500", ICON_CLASSNAME)}
            aria-label="정답 처리된 문제"
            strokeWidth={thickness}
          />
        </div>
      );
    case "locked":
      return (
        <div className={className}>
          <X
            className={cn("text-gray-400", ICON_CLASSNAME)}
            aria-label="오답 처리된 문제"
            strokeWidth={thickness}
          />
        </div>
      );
  }
}
