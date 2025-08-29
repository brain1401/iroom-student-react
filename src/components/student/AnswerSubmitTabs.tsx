import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { MdQrCodeScanner } from "react-icons/md";

/**
 * 답안 제출 탭 컴포넌트
 * @description 객관식, 주관식 탭 기반 답안 입력 UI 구성
 */
export function AnswerSubmitTabs(props: AnswerSubmitTabsProps) {
  const {
    className,
    initialTab = "objective",
    objectiveCount = 20,
    objectiveOptions = ["A", "B", "C", "D", "E"],
    subjectiveCount = 5,
    isSubmitted = false,
    deadline,
    subjectiveImages,
    subjectivePlaceholder = "/figma/subjective-question.svg",
    onSubmit,
  } = props;

  const [objectiveAnswers, setObjectiveAnswers] = useState<
    Record<number, string>
  >(() => ({}));
  const [subjectiveAnswers, setSubjectiveAnswers] = useState<
    Record<number, string>
  >(() => ({}));
  const [subjectiveExplanations, setSubjectiveExplanations] = useState<
    Record<number, string>
  >(() => ({}));

  const allObjectiveNumbers = useMemo(
    () => Array.from({ length: objectiveCount }, (_, i) => i + 1),
    [objectiveCount],
  );
  const allSubjectiveNumbers = useMemo(
    () => Array.from({ length: subjectiveCount }, (_, i) => i + 1),
    [subjectiveCount],
  );

  function handleResetObjective() {
    setObjectiveAnswers({});
  }

  function handleResetSubjective() {
    setSubjectiveAnswers({});
    setSubjectiveExplanations({});
  }

  function handleSubmitAll() {
    const result: SubmitAnswersPayload = {
      objective: allObjectiveNumbers.map((num) => ({
        number: num,
        answer: objectiveAnswers[num] || "",
      })),
      subjective: allSubjectiveNumbers.map((num) => ({
        number: num,
        answer: subjectiveAnswers[num] || "",
        explanation: subjectiveExplanations[num] || "",
      })),
    };
    onSubmit?.(result);
  }

  function isPastDeadline(value?: string) {
    if (!value) return false;
    const ms = new Date(value).getTime();
    if (!Number.isFinite(ms)) return false;
    return ms < Date.now();
  }

  const deadlinePassed = isPastDeadline(deadline);
  const finalButtonLabel = deadlinePassed
    ? "제출 마감"
    : isSubmitted
      ? "수정하기"
      : "제출하기";

  return (
    <div className={cn("w-full", className)}>
      <Tabs defaultValue={initialTab} className="w-full">
        <TabsList className="mb-4 flex w-full justify-center bg-transparent p-0 h-auto gap-8">
          <TabsTrigger
            value="objective"
            className="border-0 bg-transparent shadow-none rounded-none px-0 py-0 h-auto text-[18px] sm:text-[20px] font-bold data-[state=active]:text-[#111] text-[#9CA3AF]"
          >
            객관식 답안
          </TabsTrigger>
          <TabsTrigger
            value="subjective"
            className="border-0 bg-transparent shadow-none rounded-none px-0 py-0 h-auto text-[18px] sm:text-[20px] font-bold data-[state=active]:text-[#111] text-[#9CA3AF]"
          >
            주관식 답안
          </TabsTrigger>
        </TabsList>

        <TabsContent value="objective" className="space-y-4">
          <div className="rounded-2xl border border-[#E6E6E6] bg-white p-4 sm:p-5">
            <div className="mb-3 text-[16px] sm:text-[18px] font-semibold text-[#111]">
              객관식 답안 입력
            </div>
            <div className="flex flex-col gap-3">
              {allObjectiveNumbers.map((number) => (
                <div key={number}>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-[#EFEFEF] px-3 py-3">
                    <div className="text-[14px] sm:text-[15px] font-semibold text-[#3E3E3E]">
                      문제 {number}
                    </div>
                    <RadioGroup
                      className="grid grid-flow-col gap-2"
                      value={objectiveAnswers[number] || ""}
                      onValueChange={(val) =>
                        setObjectiveAnswers((prev) => ({
                          ...prev,
                          [number]: val,
                        }))
                      }
                    >
                      {objectiveOptions.map((opt) => (
                        <div
                          key={opt}
                          className="inline-flex items-center gap-1.5"
                        >
                          <RadioGroupItem
                            id={`q${number}-${opt}`}
                            value={opt}
                          />
                          <label
                            htmlFor={`q${number}-${opt}`}
                            className="text-[13px] font-medium text-[#4E4D4D]"
                          >
                            {opt}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  {number % 5 === 0 &&
                  number !==
                    allObjectiveNumbers[allObjectiveNumbers.length - 1] ? (
                    <div className="my-2">
                      <Separator />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetObjective}
              >
                전체 초기화
              </Button>
              <Button size="sm" onClick={handleSubmitAll}>
                임시 저장
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="subjective" className="space-y-4">
          <div className="rounded-2xl border border-[#E6E6E6] bg-white p-4 sm:p-5">
            <div className="mb-3 text-[16px] sm:text-[18px] font-semibold text-[#111]">
              주관식 답안 입력
            </div>
            <div className="space-y-3">
              {allSubjectiveNumbers.map((number) => (
                <div
                  key={number}
                  className="space-y-2 rounded-xl border border-[#EFEFEF] p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[14px] sm:text-[15px] font-semibold text-[#3E3E3E]">
                      문제 {number}
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 gap-1"
                    >
                      <MdQrCodeScanner className="h-4 w-4" />
                      <span className="text-[12px]">문제 재촬영</span>
                    </Button>
                  </div>
                  <div className="overflow-hidden rounded-md border border-[#EEE]">
                    <img
                      src={
                        subjectiveImages && subjectiveImages[number]
                          ? subjectiveImages[number]
                          : subjectivePlaceholder
                      }
                      alt={`문제 ${number} 이미지`}
                      className="w-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[13px] font-medium text-[#4E4D4D]">
                      풀이
                    </div>
                    <Textarea
                      value={subjectiveExplanations[number] || ""}
                      placeholder="풀이 입력"
                      className="min-h-28"
                      onChange={(e) =>
                        setSubjectiveExplanations((prev) => ({
                          ...prev,
                          [number]: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[13px] font-medium text-[#4E4D4D]">
                      답안
                    </div>
                    <Textarea
                      value={subjectiveAnswers[number] || ""}
                      placeholder="답안 입력"
                      className="min-h-14"
                      onChange={(e) =>
                        setSubjectiveAnswers((prev) => ({
                          ...prev,
                          [number]: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetSubjective}
              >
                전체 초기화
              </Button>
              <Button size="sm" onClick={handleSubmitAll}>
                임시 저장
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-4 flex items-center justify-end">
        <Button
          size="default"
          className="w-full"
          disabled={deadlinePassed}
          onClick={() => {
            if (deadlinePassed) return;
            handleSubmitAll();
          }}
        >
          {finalButtonLabel}
        </Button>
      </div>
    </div>
  );
}

/**
 * 답안 제출 탭 Props
 * @property className 추가 CSS 클래스
 * @property initialTab 초기 탭 값
 * @property objectiveCount 객관식 문항 수
 * @property objectiveOptions 객관식 보기 옵션 목록
 * @property subjectiveCount 주관식 문항 수
 * @property onSubmit 제출 콜백
 */
export type AnswerSubmitTabsProps = {
  /** 추가 CSS 클래스 */
  className?: string;
  /** 초기 탭 값 */
  initialTab?: "objective" | "subjective";
  /** 객관식 문항 수 */
  objectiveCount?: number;
  /** 객관식 보기 옵션 목록 */
  objectiveOptions?: string[];
  /** 주관식 문항 수 */
  subjectiveCount?: number;
  /** 제출 여부 */
  isSubmitted?: boolean;
  /** 제출 기한 (ISO 날짜 문자열) */
  deadline?: string;
  /** 주관식 문제 이미지 URL 목록 (문항 번호 기반) */
  subjectiveImages?: Record<number, string>;
  /** 주관식 문제 기본 이미지 */
  subjectivePlaceholder?: string;
  /** 제출 콜백 */
  onSubmit?: (payload: SubmitAnswersPayload) => void;
};

/**
 * 제출 페이로드 타입
 * @description 객관식, 주관식 답안 배열 포함
 */
export type SubmitAnswersPayload = {
  objective: { number: number; answer: string }[];
  subjective: { number: number; answer: string; explanation: string }[];
};
