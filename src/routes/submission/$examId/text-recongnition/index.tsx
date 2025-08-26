import { MathQuestionCard } from "@/components/exam/MathQuestionCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/submission/$examId/text-recongnition/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto flex h-full max-w-6xl flex-1 flex-col items-center space-y-6 overflow-y-scroll p-4">
      <PageHeader title="가나다 시험" showBackButton={true} />
      <div className="flex w-full flex-col gap-4">
        <MathQuestionCard questionNumber={1} state="completed" />
        <MathQuestionCard questionNumber={1} state="completed" />
        <MathQuestionCard questionNumber={1} state="completed" />
        <MathQuestionCard questionNumber={1} state="completed" />
        <MathQuestionCard questionNumber={1} state="completed" />
        <MathQuestionCard questionNumber={1} state="completed" />
        <MathQuestionCard questionNumber={1} state="completed" />
        <MathQuestionCard questionNumber={1} state="completed" />
        <MathQuestionCard questionNumber={1} state="error" />
        <MathQuestionCard questionNumber={1} state="idle" />
        <MathQuestionCard questionNumber={1} state="loading" />
        <MathQuestionCard questionNumber={1} state="completed" />
        <MathQuestionCard questionNumber={1} state="completed" />
      </div>

      <div className="flex-1" />

      <Button className="w-[80%]">제출하기</Button>
    </div>
  );
}
