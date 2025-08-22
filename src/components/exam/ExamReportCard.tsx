import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ExamReportCardProps = {
  /** 카드 타이틀 */
  title: string;
  /** 카드 내용 */
  children: React.ReactNode;
  /** 추가 클래스명 */
  className?: string;
};

/**
 * 리포트 공용 카드
 * @description 리포트 화면에서 사용하는 공용 카드 래퍼
 */
export function ExamReportCard({
  title,
  children,
  className,
}: ExamReportCardProps) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="py-3">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}
