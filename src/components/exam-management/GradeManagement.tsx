/**
 * 성적 관리 컴포넌트
 * @description 시험 결과 및 성적 분석 기능 제공
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * 성적 관리 컴포넌트
 * @description 성적 분석, 리포트 생성 등의 기능
 */
export function GradeManagement() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">성적 / 리포트</h2>
        <p className="text-muted-foreground">
          시험 결과를 분석하고 리포트를 생성합니다
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            성적 분석
            <Badge variant="secondary">개발 예정</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-semibold mb-2">성적 관리 기능</h3>
            <p className="text-sm max-w-md mx-auto">
              이 기능은 곧 개발될 예정입니다. 
              성적 분석, 통계, 리포트 생성 기능을 제공할 예정입니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}