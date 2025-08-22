// React 명시적 import 생략
import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { problems } from "./_mockData";

export const Route = createFileRoute("/main/problem/")({
  component: ProblemListPage,
});

/** 문제 목록 페이지 컴포넌트 */
function ProblemListPage() {
  return (
    <div className={cn("mx-auto w-full max-w-md p-6")}>
      {/* 상단 영역 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-muted-foreground">시험 관리</div>
        <div className="text-base font-bold">문제 목록</div>
      </div>

      <div className="space-y-3">
        {problems.map((p) => (
          <Card key={p.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">
                  {p.category}
                </div>
                <div className="text-base font-semibold">{p.title}</div>
                <div className="text-sm text-muted-foreground">
                  {p.description}
                </div>
              </div>
              <Button asChild>
                <Link to="/main/problem/$id" params={{ id: p.id }}>
                  보기
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
