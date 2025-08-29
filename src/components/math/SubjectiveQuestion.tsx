import { useState, useCallback, useRef, useEffect } from "react";
import type { SubjectiveQuestion } from "@/api/common/types";
import { MathRenderer, MathPreview } from "./MathRenderer";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import {
  Eye,
  EyeOff,
  Type,
  Calculator,
  AlertTriangle,
  CheckCircle,
  RotateCcw,
  Copy,
} from "lucide-react";
import { validateLatex, convertToLatex } from "./util";

/**
 * 주관식 문제 카드 컴포넌트 속성
 * @description 주관식 수학 문제를 위한 입력 인터페이스
 */
type SubjectiveQuestionCardProps = {
  /** 주관식 문제 데이터 */
  question: SubjectiveQuestion;
  /** 현재 답안 */
  currentAnswer?: string;
  /** 답안 변경 콜백 */
  onAnswerChange?: (answer: string) => void;
  /** 읽기 전용 모드 */
  isReadonly?: boolean;
  /** 자동 포커스 여부 */
  isAutoFocus?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
};

/**
 * 주관식 문제 카드 컴포넌트
 * @description 서술형 답안을 입력받는 수학 문제 컴포넌트
 *
 * 주요 기능:
 * - LaTeX 수식 입력 지원
 * - 실시간 수식 미리보기
 * - 일반 텍스트 입력 모드
 * - 자동 LaTeX 변환 (선택적)
 * - 입력 유효성 검사
 * - 답안 형식 가이드 표시
 * - 접근성 지원
 * - 키보드 단축키
 *
 * 입력 모드:
 * - "text": 일반 텍스트 입력
 * - "latex": LaTeX 수식 입력 (실시간 미리보기)
 *
 * @example
 * ```tsx
 * <SubjectiveQuestionCard
 *   question={subjectiveQuestion}
 *   currentAnswer="x = 2y + 3"
 *   onAnswerChange={(answer) => saveAnswer(answer)}
 *   autoFocus
 * />
 * ```
 */
export function SubjectiveQuestionCard({
  question,
  currentAnswer = "",
  onAnswerChange,
  isReadonly = false,
  isAutoFocus = false,
  className,
}: SubjectiveQuestionCardProps) {
  const [inputMode, setInputMode] = useState<"text" | "latex">("text");
  const [showPreview, setShowPreview] = useState(true);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    error?: string;
  }>({ isValid: true });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /**
   * 답안 변경 처리
   * @description 사용자 입력을 처리하고 유효성을 검사
   */
  const handleAnswerChange = useCallback(
    (value: string) => {
      // LaTeX 모드에서 유효성 검사
      if (inputMode === "latex") {
        const validation = validateLatex(value);
        setValidationResult(validation);
      } else {
        setValidationResult({ isValid: true });
      }

      onAnswerChange?.(value);
    },
    [inputMode, onAnswerChange],
  );

  /**
   * 입력 모드 변경 처리
   */
  const handleInputModeChange = (mode: "text" | "latex") => {
    setInputMode(mode);

    // 텍스트 모드에서 LaTeX 모드로 변경 시 자동 변환 시도
    if (mode === "latex" && currentAnswer && inputMode === "text") {
      const converted = convertToLatex(currentAnswer);
      if (converted !== currentAnswer) {
        handleAnswerChange(converted);
      }
    }
  };

  /**
   * 미리보기 토글
   */
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  /**
   * 답안 초기화
   */
  const clearAnswer = () => {
    handleAnswerChange("");
    textareaRef.current?.focus();
  };

  /**
   * 답안 복사
   */
  const copyAnswer = async () => {
    try {
      await navigator.clipboard.writeText(currentAnswer);
      // 성공 피드백 (토스트 등)
      console.log("답안이 클립보드에 복사되었습니다");
    } catch (error) {
      console.error("복사 실패:", error);
    }
  };

  /**
   * 답안 형식 가이드 텍스트
   */
  const getFormatGuide = () => {
    switch (question.answerFormat) {
      case "latex":
        return "LaTeX 형식으로 입력하세요 (예: x^2 + y^2 = z^2)";
      case "number":
        return "숫자만 입력하세요 (예: 42, 3.14)";
      case "text":
      default:
        return "답안을 자유롭게 입력하세요";
    }
  };

  /**
   * 키보드 단축키 처리
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl/Cmd + Enter: 미리보기 토글
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      togglePreview();
    }

    // Ctrl/Cmd + L: LaTeX 모드 토글
    if ((e.ctrlKey || e.metaKey) && e.key === "l") {
      e.preventDefault();
      handleInputModeChange(inputMode === "latex" ? "text" : "latex");
    }
  };

  /**
   * 자동 포커스 처리
   */
  useEffect(() => {
    if (isAutoFocus && textareaRef.current && !isReadonly) {
      textareaRef.current.focus();
    }
  }, [isAutoFocus, isReadonly]);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">답안 입력</CardTitle>

          <div className="flex items-center gap-2">
            {/* 답안 형식 표시 */}
            <Badge
              variant={
                question.answerFormat === "latex" ? "default" : "secondary"
              }
              className="text-xs"
            >
              {question.answerFormat === "latex"
                ? "LaTeX"
                : question.answerFormat === "number"
                  ? "숫자"
                  : "텍스트"}
            </Badge>

            {/* 입력 모드 전환 버튼 */}
            {!isReadonly && (
              <div className="flex rounded-md border">
                <Button
                  variant={inputMode === "text" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleInputModeChange("text")}
                  className="rounded-r-none border-r"
                >
                  <Type className="h-4 w-4" />
                  <span className="sr-only">텍스트 모드</span>
                </Button>
                <Button
                  variant={inputMode === "latex" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleInputModeChange("latex")}
                  className="rounded-l-none"
                >
                  <Calculator className="h-4 w-4" />
                  <span className="sr-only">LaTeX 모드</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 입력 가이드 */}
        <p className="text-sm text-gray-600">{getFormatGuide()}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 입력 영역 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="answer-input" className="text-sm font-medium">
              답안
            </label>

            {!isReadonly && (
              <div className="flex items-center gap-1">
                {/* 미리보기 토글 */}
                {inputMode === "latex" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePreview}
                    title="미리보기 토글 (Ctrl+Enter)"
                  >
                    {showPreview ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">미리보기 토글</span>
                  </Button>
                )}

                {/* 답안 복사 */}
                {currentAnswer && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyAnswer}
                    title="답안 복사"
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">답안 복사</span>
                  </Button>
                )}

                {/* 답안 초기화 */}
                {currentAnswer && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAnswer}
                    title="답안 초기화"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span className="sr-only">답안 초기화</span>
                  </Button>
                )}
              </div>
            )}
          </div>

          <Textarea
            ref={textareaRef}
            id="answer-input"
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              inputMode === "latex"
                ? "LaTeX 수식을 입력하세요... (예: \\frac{x^2}{y})"
                : "답안을 입력하세요..."
            }
            disabled={isReadonly}
            className={cn(
              "min-h-[120px] font-mono text-sm resize-none",
              inputMode === "latex" && "font-mono",
              !validationResult.isValid &&
                "border-red-500 focus-visible:ring-red-500",
            )}
            aria-describedby={
              !validationResult.isValid
                ? "validation-error"
                : question.answerFormat
                  ? "format-guide"
                  : undefined
            }
          />

          {/* 유효성 검사 결과 */}
          {!validationResult.isValid && validationResult.error && (
            <Alert variant="destructive" className="py-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription id="validation-error" className="text-sm">
                {validationResult.error}
              </AlertDescription>
            </Alert>
          )}

          {/* 성공 피드백 */}
          {validationResult.isValid &&
            currentAnswer.trim() &&
            inputMode === "latex" && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>유효한 LaTeX 수식입니다</span>
              </div>
            )}
        </div>

        {/* LaTeX 미리보기 */}
        {inputMode === "latex" && showPreview && (
          <MathPreview
            latex={currentAnswer}
            title="수식 미리보기"
            className="mt-4"
          />
        )}

        {/* 읽기 전용 모드에서 정답 비교 */}
        {isReadonly && question.answer && (
          <div className="mt-6 space-y-4 pt-4 border-t">
            <Tabs defaultValue="user-answer" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user-answer">내 답안</TabsTrigger>
                <TabsTrigger value="correct-answer">정답</TabsTrigger>
              </TabsList>

              <TabsContent value="user-answer" className="mt-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">제출한 답안</h4>
                  {currentAnswer ? (
                    <MathRenderer math={currentAnswer} />
                  ) : (
                    <span className="text-gray-500 italic">
                      답안을 제출하지 않았습니다
                    </span>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="correct-answer" className="mt-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">정답</h4>
                  <MathRenderer math={question.answer} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* 키보드 단축키 도움말 */}
        {!isReadonly && inputMode === "latex" && (
          <div className="text-xs text-gray-500 mt-2">
            <span className="font-medium">단축키:</span> Ctrl+Enter (미리보기),
            Ctrl+L (모드 전환)
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * LaTeX 수식 입력 도우미 컴포넌트
 * @description 자주 사용하는 LaTeX 명령어를 버튼으로 제공
 */
type LatexHelperProps = {
  /** 삽입 콜백 함수 */
  onInsert: (latex: string) => void;
  /** 커서 위치 */
  cursorPosition?: number;
};

export function LatexHelper({ onInsert }: LatexHelperProps) {
  const commonCommands = [
    { label: "분수", latex: "\\frac{a}{b}", description: "분수" },
    { label: "제곱", latex: "x^{2}", description: "제곱" },
    { label: "제곱근", latex: "\\sqrt{x}", description: "제곱근" },
    { label: "적분", latex: "\\int_{a}^{b} f(x)dx", description: "적분" },
    { label: "합", latex: "\\sum_{i=1}^{n} x_i", description: "합" },
    { label: "극한", latex: "\\lim_{x \\to 0} f(x)", description: "극한" },
    { label: "알파", latex: "\\alpha", description: "그리스문자 알파" },
    { label: "베타", latex: "\\beta", description: "그리스문자 베타" },
    { label: "파이", latex: "\\pi", description: "원주율" },
    { label: "무한대", latex: "\\infty", description: "무한대" },
  ];

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h4 className="text-sm font-medium mb-3">LaTeX 명령어</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {commonCommands.map((cmd) => (
          <Button
            key={cmd.latex}
            variant="outline"
            size="sm"
            onClick={() => onInsert(cmd.latex)}
            title={cmd.description}
            className="text-xs font-mono"
          >
            {cmd.label}
          </Button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3">
        클릭하여 수식을 삽입할 수 있습니다
      </p>
    </div>
  );
}
