import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { MdQrCodeScanner } from "react-icons/md";

type ExamSubmitEditProps = {
  title: string;
  range: string;
  teacher: string;
  deadline: string;
  content: string;
  isSubmitted: boolean;
  className?: string;
};

export function ExamSubmitEdit({
  title,
  range,
  teacher,
  deadline,
  content,
  className,
  isSubmitted,
}: ExamSubmitEditProps) {
  return (
    <div className={cn("w-full p-4 sm:p-5 md:p-6", className)}>
      <section className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-[#999]">시험명</div>
            <div className="text-[15px] text-[#4E4D4D]">{title}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-[#999]">시험 범위</div>
            <div className="text-[15px] text-[#4E4D4D]">{range}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-[#999]">담당 선생님</div>
            <div className="text-[15px] text-[#4E4D4D]">{teacher}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-[#999]">제출 기한</div>
            <div className="text-[15px] text-[#4E4D4D]">{deadline}</div>
          </div>
          <div className="flex items-start justify-between">
            <div className="text-sm text-[#999]">내용</div>
            <div className="text-right text-[15px] text-[#4E4D4D] whitespace-pre-wrap">
              {content}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-[#3E3E3E]">첨부 파일</div>
          <input
            type="file"
            className="w-full rounded-md border border-[#D7D7D7] p-2 text-[14px] file:mr-3 file:rounded-md file:border-0 file:bg-[#F3F4F6] file:px-3 file:py-2 file:text-[13px] file:text-[#4E4D4D]"
          />
        </div>

        <div className="pt-2">
          <Button className="w-full">
            {/* TODO: Add proper navigation when routes are available */}
            {isSubmitted ? "제출 답안 보기" : "제출하기"}
          </Button>
        </div>
      </section>

      <div className="h-24" />
      <div className="fixed inset-x-0 bottom-0 z-20">
        <div className="mx-auto w-full max-w-md px-4 pb-4 sm:max-w-lg sm:px-6 md:max-w-2xl md:px-8">
          <button
            type="button"
            aria-label="시험지 재촬영"
            className="flex w-full items-center justify-center gap-2 rounded-[16px] border border-[#D7D7D7] bg-white px-4 py-4 text-[#111] shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
          >
            <MdQrCodeScanner className="h-5 w-5" />
            <span className="text-[16px] font-semibold">
              {isSubmitted ? "시험지 재촬영" : "시험지 촬영"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
