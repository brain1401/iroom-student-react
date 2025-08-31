/**
 * 객관식 탭 컴포넌트 (OMR 카드 형식)
 * @description OMR 카드 스타일의 객관식 답안지
 *
 * 주요 기능:
 * - OMR 카드 형식의 답안지
 * - 보기 선택 및 답안 입력
 * - 문제별 배점 표시
 * - 반응형 그리드 레이아웃
 * - 주관식 탭으로 이동
 *
 * @example
 * ```tsx
 * <ObjectiveTab onNext={() => setActiveTab("subjective")} />
 * ```
 */

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// 보기 데이터 타입
type Option = {
  /** 보기 값 */
  value: string;
  /** 보기 라벨 */
  label: string;
  /** 보기 번호 (한글 숫자) */
  number: string;
};

// 보기 데이터
const options: Option[] = [
  { value: "1", label: "보기 1", number: "①" },
  { value: "2", label: "보기 2", number: "②" },
  { value: "3", label: "보기 3", number: "③" },
  { value: "4", label: "보기 4", number: "④" },
  { value: "5", label: "보기 5", number: "⑤" },
];

// 문제 개수 및 배점 설정
const QUESTION_COUNT = 20;
const SCORE_PER_QUESTION = 5;

/**
 * 보기 선택 컴포넌트
 * @description 라디오 버튼을 사용한 보기 선택 UI
 */
type OptionSelectorProps = {
  /** 문제 ID */
  questionId: number;
  /** 보기 목록 */
  options: Option[];
  /** 선택된 값 */
  selectedValue: string;
  /** 값 변경 핸들러 */
  onValueChange: (value: string) => void;
};

function OptionSelector({
  questionId,
  options,
  selectedValue,
  onValueChange,
}: OptionSelectorProps) {
  return (
    <RadioGroup
      value={selectedValue}
      onValueChange={onValueChange}
      className="grid grid-cols-5 gap-2"
    >
      {options.map((option) => (
        <div key={option.value}>
          <RadioGroupItem
            value={option.value}
            id={`q${questionId}-${option.value}`}
            className="sr-only"
          />
          <Label
            htmlFor={`q${questionId}-${option.value}`}
            className={cn(
              "flex items-center justify-center p-3 border-2 rounded-lg bg-white cursor-pointer transition-all duration-200",
              "hover:border-blue-500 hover:bg-blue-50 hover:shadow-md",
              selectedValue === option.value
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-300",
            )}
          >
            <span className="text-lg font-bold text-gray-700">
              {option.value}
            </span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}

/**
 * 문제 행 컴포넌트
 * @description OMR 카드의 문제 행을 표시
 */
type QuestionRowProps = {
  /** 문제 번호 */
  questionNumber: number;
  /** 선택된 답안 */
  selectedAnswer: string;
  /** 답안 변경 핸들러 */
  onAnswerChange: (questionId: number, value: string) => void;
};

function QuestionRow({
  questionNumber,
  selectedAnswer,
  onAnswerChange,
}: QuestionRowProps) {
  const handleValueChange = useCallback(
    (value: string) => {
      onAnswerChange(questionNumber, value);
    },
    [questionNumber, onAnswerChange],
  );

  return (
    <div className="flex items-center gap-4 p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
      {/* 문제 번호 */}
      <div className="flex-shrink-0">
        <Badge variant="outline" className="w-12 text-center font-bold">
          {questionNumber}번
        </Badge>
      </div>

      {/* 보기 선택 */}
      <div className="flex-1">
        <OptionSelector
          questionId={questionNumber}
          options={options}
          selectedValue={selectedAnswer}
          onValueChange={handleValueChange}
        />
      </div>

      {/* 배점 표시 */}
      <div className="flex-shrink-0 text-sm text-gray-600 font-medium">
        {SCORE_PER_QUESTION}점
      </div>
    </div>
  );
}

/**
 * OMR 카드 헤더 컴포넌트
 * @description OMR 카드 상단의 제목과 설명
 */
function OMRCardHeader() {
  return (
    <div className="text-center mb-6 pb-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">객관식 답안지</h2>
      <p className="text-gray-600">정답을 선택하여 표시하세요</p>
      <div className="mt-4 flex justify-center items-center gap-8 text-sm text-gray-500">
        <span>총 문제: {QUESTION_COUNT}문제</span>
        <span>총 배점: {QUESTION_COUNT * SCORE_PER_QUESTION}점</span>
        <span>문항당 배점: {SCORE_PER_QUESTION}점</span>
      </div>
      <Separator className="mt-4" />
    </div>
  );
}

/**
 * OMR 카드 하단 컴포넌트
 * @description OMR 카드 하단의 안내 문구
 */
function OMRCardFooter() {
  return (
    <div className="mt-6 pt-4 text-center">
      <Separator className="mb-4" />
      <p className="text-sm text-gray-600">
        ※ 답안을 선택한 후 다음 단계로 진행하세요
      </p>
    </div>
  );
}

/**
 * OMR 카드 메인 컴포넌트
 * @description OMR 카드 형식의 객관식 답안지
 */
type ObjectiveTabProps = {
  /** 다음 탭으로 이동하는 핸들러 */
  onNext?: () => void;
};

export function ObjectiveTab({ onNext }: ObjectiveTabProps) {
  // 답안 상태 관리
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // 답안 변경 핸들러
  const handleAnswerChange = useCallback(
    (questionId: number, value: string) => {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: value,
      }));
    },
    [],
  );

  // 다음 단계로 이동 핸들러
  const handleNext = useCallback(() => {
    console.log("객관식 답안:", answers);
    // TODO: 답안 저장 API 호출
    onNext?.();
  }, [answers, onNext]);

  // 답안 완성도 계산
  const answeredCount = Object.keys(answers).length;
  const completionRate = (answeredCount / QUESTION_COUNT) * 100;

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* OMR 카드 */}
      <Card className="border-2 border-gray-800 shadow-lg">
        <CardContent className="p-6">
          <OMRCardHeader />

          {/* 문제 목록 */}
          <div className="space-y-1">
            {Array.from({ length: QUESTION_COUNT }, (_, index) => (
              <QuestionRow
                key={index + 1}
                questionNumber={index + 1}
                selectedAnswer={answers[index + 1] || ""}
                onAnswerChange={handleAnswerChange}
              />
            ))}
          </div>

          <OMRCardFooter />

          {/* 진행률 및 다음 버튼 */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* 진행률 표시 */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                답안 완성도:{" "}
                <span className="font-semibold text-blue-600">
                  {answeredCount}
                </span>{" "}
                / {QUESTION_COUNT}
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 font-medium">
                {Math.round(completionRate)}%
              </span>
            </div>

            {/* 다음 버튼 */}
            <button
              onClick={handleNext}
              className={cn(
                "px-8 py-3 bg-main-500 text-white font-semibold rounded-lg",
                "hover:bg-main-600 focus:ring-4 focus:ring-main-300",
                "transition-all duration-200 transform hover:scale-105",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
              disabled={answeredCount === 0}
            >
              다음 단계 →
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
