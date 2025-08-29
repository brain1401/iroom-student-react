import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { submitAtom } from "@/atoms/submit";
import { Button } from "../ui/button";

type ExamListItemProps = {
  /** 시험 제목 */
  title: string;
  /** 시험 날짜 텍스트 (예: 25.08.11) */
  date: string;
  /** 제출 여부 */
  submitted: boolean;
  /** 시험 범위 */
  range: string;
  /** 담당 선생님 */
  teacher: string;
  /** 제출기한 텍스트 */
  deadline: string;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 아이템 클릭 핸들러 */
  onClick?: () => void;
  /** 상세 영역 커스텀 콘텐츠 */
  children?: React.ReactNode;
};

export function ExamListItem({
  title,
  date,
  submitted,
  range,
  teacher,
  deadline,
  className,
  onClick,
  children,
}: ExamListItemProps) {
  return (
    <Collapsible className={cn("w-full", className)}>
      <div
        className={cn(
          "grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-4 py-4",
        )}
      >
        <StatusBadge submitted={submitted} />

        <button
          type="button"
          onClick={onClick}
          className="min-w-0 text-left"
          aria-label={`${title} 열기`}
        >
          <div className="truncate text-[16px] font-medium text-[#000] sm:text-[17px]">
            {title}
          </div>
        </button>

        <div className="text-[14px] text-[#4E4D4D] sm:text-[15px]">{date}</div>

        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="group inline-flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#D7D7D7] bg-white"
            aria-label="상세정보 토글"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4 text-[#4E4D4D] transition-transform duration-200 group-data-[state=open]:rotate-180"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="px-4 pb-4">
        {children ?? (
          <DefaultDetails
            title={title}
            submitted={submitted}
            range={range}
            teacher={teacher}
            deadline={deadline}
          />
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

function StatusBadge({ submitted }: { submitted: boolean }) {
  if (submitted) {
    return (
      <span
        className={cn(
          "inline-flex h-6 items-center rounded-[5px] border px-2 text-[12px] font-semibold",
          "border-[#155DFC] bg-[#155DFC] text-white",
        )}
      >
        제출
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-[5px] border px-2 text-[12px] font-semibold",
        "border-[#FF6A71] text-[#FF6A71]",
      )}
    >
      미제출
    </span>
  );
}

type DefaultDetailsProps = {
  title: string;
  submitted: boolean;
  range: string;
  teacher: string;
  deadline: string;
};

function DefaultDetails({
  title,
  submitted,
  range,
  teacher,
  deadline,
}: DefaultDetailsProps) {
  const navigate = useNavigate();

  const [_submit, setSubmit] = useAtom(submitAtom);

  const handleClick = () => {
    setSubmit({
      title,
      range,
      content: "",
      teacher,
      deadline,
      submitted,
    });

    // TODO: Update to correct submission route
    console.log("Navigate to submission for:", title);
    // navigate({
    //   to: "/submission/$examId",
    //   params: { examId: examId.toString() }
    // });
  };

  return (
    <div className="rounded-[10px] border border-[#D7D7D7] bg-white p-4 shadow-sm">
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
        <div className="min-w-0 text-[16px] font-medium text-[#4E4D4D]">
          <div className="truncate" title={title}>
            {title}
          </div>
        </div>
        <div className="text-[16px] text-[#4E4D4D]">{deadline}</div>
        <StatusBadge submitted={submitted} />
      </div>
      <div className="mt-3 grid grid-cols-[72px_1fr] gap-y-2 text-[14px]">
        <div className="text-[#999]">시험 명</div>
        <div className="text-[#4E4D4D]">{title}</div>
        <div className="text-[#999]">시험 범위</div>
        <div className="text-[#4E4D4D]">{range}</div>
        <div className="text-[#999]">담당 선생님</div>
        <div className="text-[#4E4D4D]">{teacher}</div>
        <div className="text-[#999]">제출기한</div>
        <div className="text-[#4E4D4D]">{deadline}</div>
      </div>
      <div className="mt-4">
        <SubmitButton submitted={submitted} onClick={handleClick} />
      </div>
    </div>
  );
}

function SubmitButton({
  submitted,
  onClick,
}: {
  submitted: boolean;
  onClick: () => void;
}) {
  const base =
    "inline-flex h-10 w-full items-center justify-center rounded-md text-sm font-medium";
  const primary = "bg-[#155DFC] text-white hover:bg-[#155DFC]/90";
  const label = submitted ? "제출 수정" : "제출하기";

  return (
    <Button onClick={onClick} className={cn(base, primary)}>
      {label}
    </Button>
  );
}
