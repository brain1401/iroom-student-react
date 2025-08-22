import * as React from "react";

import { cn } from "@/lib/utils";

type ExamBuilderHeaderProps = {
  /** 상단 제목 (기본값: "시험지 목록") */
  title?: string;
  /** 서브액션 라벨 (기본값: "시험지 등록") */
  actionLabel?: string;
  /** 서브액션 클릭 콜백 */
  onActionClick?: () => void;
  /** 총 문항 수 텍스트 (예: "총 20문제 (최대30문항)") */
  summary?: string;
  /** 추가 클래스명 */
  className?: string;
};

/**
 * 시험지 빌더 상단 헤더
 *
 * 주요 기능:
 * - 좌측 타이틀 + 파란 언더라인 포커스 바 표현
 * - 우측 액션 버튼 및 요약 텍스트 영역
 */
export function ExamBuilderHeader({
  title = "시험지 목록",
  actionLabel = "시험지 등록",
  onActionClick,
  summary,
  className,
}: ExamBuilderHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between", className)}>
      <div>
        <div className="text-[25px]/[1.19] font-medium text-[#9F9F9F]">
          {title}
        </div>
        <div className="mt-2 h-0 border-b-2 border-[#D7D7D7]">
          <div className="ml-[228px] h-0 border-b-4 border-[#155DFC]" />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {summary ? (
          <div className="text-[25px]/[1.19] text-[#1C1C1E]">{summary}</div>
        ) : null}
        <button
          type="button"
          onClick={onActionClick}
          className="text-[25px]/[1.19] font-bold text-[#155DFC]"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
