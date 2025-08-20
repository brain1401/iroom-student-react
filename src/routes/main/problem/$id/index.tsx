import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChatbotFab } from "@/components/chat/ChatbotFab";
import { problems } from "../_mockData";
import { Latex } from "@/components/math/Latex";

export const Route = createFileRoute("/main/problem/$id/")({
  component: ProblemDetailPage,
});

function ProblemDetailPage() {
  const { id } = Route.useParams();
  const problem = React.useMemo(() => problems.find((p) => p.id === id), [id]);

  if (!problem) {
    return (
      <div className="container mx-auto max-w-md p-6">
        <div className="mb-4">
          <Button variant="outline" asChild>
            <Link to="/">← 홈으로</Link>
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">문제를 찾을 수 없음</div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md px-6 py-4">
      {/* 상단 정보 */}
      <div className="mb-2 flex items-center justify-between">
        <div className="text-muted-foreground">시험 관리</div>
        <div className="text-base font-bold">성적 / 리포트</div>
      </div>
      <Separator className="mb-4" />

      {/* 타이틀 + 뒤로가기 + 도움말 */}
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/">
            <span aria-hidden>←</span>
          </Link>
        </Button>
        <div className="text-xl font-bold">{problem.title}</div>
        <Button variant="outline" size="icon" aria-label="도움말">
          ?
        </Button>
      </div>

      <Separator className="mb-4" />

      {/* 문제 카드 */}
      <Card className="mb-4 rounded-xl bg-[#FAF3FF] p-4">
        <div className="mb-2 text-sm font-medium">문제 4</div>
        <div className="text-sm leading-7">{problem.description}</div>
        <div className="mt-3">
          <Latex source={"3x^2 + 14x - 24"} />
        </div>
      </Card>

      {/* 정답/내 풀이 영역 */}
      <div className="mb-2 grid grid-cols-2 gap-4">
        <div>
          <div className="text-base font-semibold text-muted-foreground">
            정답
          </div>
          <div className="mt-2 text-sm leading-7 text-muted-foreground">
            <Latex source={"3x^2 + 14x - 24"} />
          </div>
        </div>
        <div className="text-right">
          <div className="text-base font-semibold text-primary">내 정답</div>
          <div className="mt-2 text-sm leading-7 text-primary">
            <Latex source={"3x^2 + 14x - 24"} />
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* 해설, 이론, 유사 문제 추천 */}
      <div className="space-y-6">
        {[
          { label: "해설" },
          { label: "이론" },
          { label: "유사 문제 추천" },
        ].map((section) => (
          <div key={section.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">{section.label}</div>
              <Button variant="outline" size="icon" className="rounded-full">
                →
              </Button>
            </div>
            <Separator />
          </div>
        ))}
      </div>

      {/* 챗봇 플로팅 버튼 */}
      <ChatbotFab />
    </div>
  );
}
