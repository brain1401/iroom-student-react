import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { IoChevronBack } from "react-icons/io5";
import { ExamSubmit } from "@/components/student";
import { useAtom, useAtomValue } from "jotai";
import { submitAtom } from "@/atoms/submit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/main/test/exams/submit/")({
  component: SubmitEditPage,
});

function SubmitEditPage() {
  const submit = useAtomValue(submitAtom);

  const isSubmitted = submit.submitted;

  return (
    <div className="flex w-full flex-1 justify-center px-4 py-4 sm:px-6 md:px-8">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl">
        
        <header className="mb-4 grid grid-cols-[auto_1fr_auto] items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/main/test">
              <IoChevronBack className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-center text-[18px] font-bold text-black">가나다 시험</h1>
          <span className={cn("inline-flex h-6 items-center justify-center rounded-[5px] px-2 text-[12px] font-semibold text-white", isSubmitted ? "bg-submitted" : "bg-not-submitted")}>{isSubmitted ? "제출" : "미제출"}</span>
        </header>

        <ExamSubmit
          title={submit.title}
          range={submit.range}
          teacher={submit.teacher}
          deadline={submit.deadline}
          content={submit.content}
          isSubmitted={isSubmitted}
        />
      </div>
    </div>
  );
}


