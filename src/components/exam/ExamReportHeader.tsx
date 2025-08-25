import * as React from "react";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ExamReportHeaderProps = {
  /** 상단 좌측 상위 섹션명 (예: 시험 관리) */
  parentLabel?: string;
  /** 현재 페이지 타이틀 (예: 성적 / 리포트) */
  title?: string;
  /** 뒤로가기 버튼 표시 여부 */
  showBack?: boolean;
  /** 뒤로가기 클릭 핸들러 */
  onBackClick?: () => void;
  /** 추가 클래스명 */
  className?: string;
};

/**
 * 리포트 상단 헤더 컴포넌트
 * @description 리포트 화면 상단의 뒤로가기, 브레드크럼, 타이틀 영역 구성 컴포넌트
 *
 * 주요 기능:
 * - 뒤로가기 버튼 표시 및 클릭 핸들러 연동
 * - 상위 섹션명과 현재 타이틀 표시
 * - 컴포넌트 외부 클래스 확장 지원
 *
 * @example
 * ```tsx
 * <ExamReportHeader parentLabel="시험 관리" title="성적 / 리포트" showBack onBackClick={() => navigate(-1)} />
 * ```
 */
export function ExamReportHeader({
  parentLabel = "시험 관리",
  title = "성적 / 리포트",
  showBack = true,
  onBackClick,
  className,
}: ExamReportHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <div className="flex items-center gap-2">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="뒤로가기"
            onClick={onBackClick}
          >
            <ArrowLeft className="size-5" />
          </Button>
        )}
        <div className="flex flex-col leading-tight">
          <span className="text-muted-foreground text-base font-medium">
            {parentLabel}
          </span>
          <span className="text-foreground text-xl font-bold">{title}</span>
        </div>
      </div>
    </div>
  );
}
