/**
 * 시험 관리 컴포넌트
 * @description 생성된 시험지들의 관리 기능 제공
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * 시험 관리 컴포넌트
 * @description 시험지 목록 조회, 수정, 삭제 등의 기능
 */
export function ExamManagement() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">시험 관리</h2>
        <p className="text-muted-foreground">
          생성된 시험지들을 관리합니다
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            시험지 목록
            <Badge variant="secondary">개발 예정</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold mb-2">시험 관리 기능</h3>
            <p className="text-sm max-w-md mx-auto">
              이 기능은 곧 개발될 예정입니다. 
              생성된 시험지의 조회, 수정, 삭제 기능을 제공할 예정입니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}