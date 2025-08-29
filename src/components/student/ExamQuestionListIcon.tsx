import { Circle, X } from "lucide-react";
import type { ProblemStatus } from "./type";
import { cn } from "@/lib/utils";

type Props = {
  status: ProblemStatus;
  className?: string;
  thickness?: number;
};

const ICON_CLASSNAME = "h-full w-full";

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
