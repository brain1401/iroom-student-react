import { useState, useCallback } from "react";
import type {
  MultipleChoiceQuestion,
  QuestionOption,
} from "@/api/common/types";
import { MathRenderer } from "./MathRenderer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  Circle,
  RotateCcw,
  AlertCircle,
} from "lucide-react";

/**
 * 객관식 문제 카드 컴포넌트 속성
 * @description 객관식 수학 문제를 위한 선택 인터페이스
 */
type MultipleChoiceQuestionCardProps = {
  /** 객관식 문제 데이터 */
  question: MultipleChoiceQuestion;
  /** 현재 선택된 답안 (선택지 ID) */
  currentAnswer?: string;
  /** 답안 변경 콜백 */
  onAnswerChange?: (optionId: string) => void;
  /** 읽기 전용 모드 (결과 확인용) */
  isReadonly?: boolean;
  /** 정답 표시 여부 (결과 확인 시) */
  isShowCorrectAnswer?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
};

/**
 * 객관식 문제 카드 컴포넌트
 * @description 선택지 중 하나를 고르는 수학 문제 컴포넌트
 *
 * 주요 기능:
 * - 라디오 버튼 기반 선택지 표시
 * - LaTeX 수식이 포함된 선택지 렌더링
 * - 키보드 네비게이션 지원 (화살표 키, 숫자 키)
 * - 선택 상태 시각적 피드백
 * - 정답/오답 표시 (결과 확인 모드)
 * - 접근성 지원 (스크린 리더, ARIA)
 * - 선택 취소 기능
 *
 * 선택지 구조:
 * - ID 기반 선택 관리
 * - 라벨 (1, 2, 3, 4, 5 등)
 * - 텍스트 (LaTeX 수식 포함 가능)
 * - 정답 여부 (readonly 모드에서만 표시)
 *
 * @example
 * ```tsx
 * <MultipleChoiceQuestionCard
 *   question={multipleChoiceQuestion}
 *   currentAnswer="option-2"
 *   onAnswerChange={(optionId) => saveAnswer(optionId)}
 * />
 *
 * // 결과 확인 모드
 * <MultipleChoiceQuestionCard
 *   question={question}
 *   currentAnswer="user-selected-option"
 *   readonly
 *   showCorrectAnswer
 * />
 * ```
 */
export function MultipleChoiceQuestionCard({
  question,
  currentAnswer = "",
  onAnswerChange,
  isReadonly = false,
  isShowCorrectAnswer = false,
  className,
}: MultipleChoiceQuestionCardProps) {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  /**
   * 선택지 변경 처리
   */
  const handleOptionChange = useCallback(
    (optionId: string) => {
      if (isReadonly) return;
      onAnswerChange?.(optionId);
    },
    [isReadonly, onAnswerChange],
  );

  /**
   * 선택 취소
   */
  const clearSelection = useCallback(() => {
    if (isReadonly) return;
    onAnswerChange?.("");
  }, [isReadonly, onAnswerChange]);

  /**
   * 키보드 단축키 처리
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isReadonly) return;

      // 숫자 키로 선택지 선택 (1-9)
      const keyNumber = parseInt(e.key);
      if (keyNumber >= 1 && keyNumber <= question.options.length) {
        e.preventDefault();
        const targetOption = question.options[keyNumber - 1];
        handleOptionChange(targetOption.id);
      }

      // Escape 키로 선택 취소
      if (e.key === "Escape") {
        e.preventDefault();
        clearSelection();
      }
    },
    [isReadonly, question.options, handleOptionChange, clearSelection],
  );

  /**
   * 선택지 상태 계산
   */
  const getOptionState = (option: QuestionOption) => {
    const isSelected = currentAnswer === option.id;
    const isCorrect = option.id === question.correctOptionId;
    const isUserCorrect = isSelected && isCorrect;
    const isUserWrong = isSelected && !isCorrect;

    return {
      isSelected,
      isCorrect,
      isUserCorrect,
      isUserWrong,
    };
  };

  /**
   * 선택지 스타일 계산
   */
  const getOptionStyles = (option: QuestionOption) => {
    const state = getOptionState(option);

    if (isReadonly && isShowCorrectAnswer) {
      if (state.isUserCorrect) {
        return "border-green-500 bg-green-50 text-green-900";
      }
      if (state.isUserWrong) {
        return "border-red-500 bg-red-50 text-red-900";
      }
      if (state.isCorrect) {
        return "border-green-300 bg-green-25 text-green-800";
      }
    }

    if (state.isSelected && !isReadonly) {
      return "border-blue-500 bg-blue-50 text-blue-900";
    }

    if (hoveredOption === option.id && !isReadonly) {
      return "border-gray-300 bg-gray-50";
    }

    return "border-gray-200 hover:border-gray-300";
  };

  /**
   * 선택지 아이콘 렌더링
   */
  const renderOptionIcon = (option: QuestionOption) => {
    const state = getOptionState(option);

    if (isReadonly && isShowCorrectAnswer) {
      if (state.isUserCorrect) {
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      }
      if (state.isUserWrong) {
        return <XCircle className="h-5 w-5 text-red-600" />;
      }
      if (state.isCorrect) {
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      }
    }

    return (
      <Circle
        className={cn(
          "h-5 w-5",
          state.isSelected ? "text-blue-600" : "text-gray-400",
        )}
      />
    );
  };

  /**
   * 데이터 유효성 검사
   */
  if (!question.options || question.options.length === 0) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          선택지가 없습니다. 관리자에게 문의하세요.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">선택지</CardTitle>

          <div className="flex items-center gap-2">
            {/* 선택지 개수 표시 */}
            <Badge variant="outline" className="text-xs">
              {question.options.length}개 선택지
            </Badge>

            {/* 선택 취소 버튼 */}
            {!isReadonly && currentAnswer && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                title="선택 취소 (Esc)"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="sr-only">선택 취소</span>
              </Button>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600">
          {isReadonly ? "선택한 답안을 확인하세요" : "정답을 하나 선택하세요"}
        </p>
      </CardHeader>

      <CardContent>
        <RadioGroup
          value={currentAnswer}
          onValueChange={handleOptionChange}
          disabled={isReadonly}
          className="space-y-3"
          onKeyDown={handleKeyDown}
        >
          {question.options.map((option, index) => (
            <div
              key={option.id}
              className={cn(
                "relative flex items-start gap-3 p-4 rounded-lg border transition-all cursor-pointer",
                getOptionStyles(option),
                isReadonly && "cursor-default",
              )}
              onMouseEnter={() => !isReadonly && setHoveredOption(option.id)}
              onMouseLeave={() => setHoveredOption(null)}
              onClick={() => handleOptionChange(option.id)}
              role="button"
              tabIndex={isReadonly ? -1 : 0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleOptionChange(option.id);
                }
              }}
              aria-label={`선택지 ${option.label}: ${option.text}`}
            >
              {/* 라디오 버튼 */}
              <div className="flex items-center mt-1">
                <RadioGroupItem
                  value={option.id}
                  id={option.id}
                  className="sr-only"
                  aria-describedby={`option-${option.id}-content`}
                />
                {renderOptionIcon(option)}
              </div>

              {/* 선택지 내용 */}
              <div className="flex-1 min-w-0">
                <Label
                  htmlFor={option.id}
                  className="flex items-start gap-3 cursor-pointer"
                >
                  {/* 선택지 라벨 */}
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-current flex items-center justify-center text-sm font-semibold">
                    {option.label}
                  </span>

                  {/* 선택지 텍스트 */}
                  <div
                    id={`option-${option.id}-content`}
                    className="flex-1 min-w-0"
                  >
                    <MathRenderer math={option.text} className="text-left" />
                  </div>
                </Label>

                {/* 키보드 단축키 힌트 */}
                {!isReadonly && (
                  <div className="text-xs text-gray-400 mt-1 ml-11">
                    단축키: {index + 1}
                  </div>
                )}
              </div>

              {/* 정답/오답 표시 (결과 확인 모드) */}
              {isReadonly && isShowCorrectAnswer && (
                <div className="flex flex-col items-end gap-1">
                  {getOptionState(option).isCorrect && (
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 text-xs"
                    >
                      정답
                    </Badge>
                  )}
                  {getOptionState(option).isSelected && (
                    <Badge
                      variant={
                        getOptionState(option).isUserCorrect
                          ? "default"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      선택함
                    </Badge>
                  )}
                </div>
              )}
            </div>
          ))}
        </RadioGroup>

        {/* 현재 선택 상태 표시 */}
        {!isReadonly && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                현재 선택:{" "}
                {currentAnswer ? (
                  <span className="font-medium">
                    {question.options.find((opt) => opt.id === currentAnswer)
                      ?.label || "알 수 없음"}
                    번
                  </span>
                ) : (
                  <span className="text-gray-400">선택되지 않음</span>
                )}
              </span>

              <span className="text-gray-400">
                {question.options.length}개 중 {currentAnswer ? "1개" : "0개"}{" "}
                선택
              </span>
            </div>
          </div>
        )}

        {/* 결과 분석 (읽기 전용 모드) */}
        {isReadonly && isShowCorrectAnswer && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">정답:</span>
                <span className="font-medium">
                  {question.options.find(
                    (opt) => opt.id === question.correctOptionId,
                  )?.label || "알 수 없음"}
                  번
                </span>
              </div>

              {currentAnswer && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">선택한 답:</span>
                  <span
                    className={cn(
                      "font-medium",
                      currentAnswer === question.correctOptionId
                        ? "text-green-600"
                        : "text-red-600",
                    )}
                  >
                    {question.options.find((opt) => opt.id === currentAnswer)
                      ?.label || "알 수 없음"}
                    번
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-gray-600">결과:</span>
                <Badge
                  variant={
                    currentAnswer === question.correctOptionId
                      ? "default"
                      : "destructive"
                  }
                  className="text-xs"
                >
                  {currentAnswer === question.correctOptionId ? "정답" : "오답"}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* 키보드 단축키 도움말 */}
        {!isReadonly && (
          <div className="text-xs text-gray-500 mt-4 pt-2 border-t border-gray-100">
            <span className="font-medium">키보드 단축키:</span> 1-
            {question.options.length} (선택), Esc (취소)
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * 선택지 통계 컴포넌트
 * @description 객관식 문제의 선택지별 통계를 표시 (관리자용)
 */
type OptionStatsProps = {
  /** 문제 데이터 */
  question: MultipleChoiceQuestion;
  /** 선택지별 선택 수 */
  optionStats: Record<string, number>;
  /** 전체 응답자 수 */
  totalResponses: number;
  /** 추가 CSS 클래스 */
  className?: string;
};

export function OptionStats({
  question,
  optionStats,
  totalResponses,
  className,
}: OptionStatsProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-lg">선택지별 통계</CardTitle>
        <p className="text-sm text-gray-600">총 {totalResponses}명 응답</p>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {question.options.map((option) => {
            const count = optionStats[option.id] || 0;
            const percentage =
              totalResponses > 0 ? (count / totalResponses) * 100 : 0;
            const isCorrect = option.id === question.correctOptionId;

            return (
              <div key={option.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{option.label}번</span>
                    {isCorrect && (
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800 text-xs"
                      >
                        정답
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">
                    {count}명 ({percentage.toFixed(1)}%)
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={cn(
                      "h-2 rounded-full transition-all",
                      isCorrect ? "bg-green-500" : "bg-blue-500",
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
