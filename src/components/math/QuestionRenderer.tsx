import {
  isSubjectiveQuestion,
  isMultipleChoiceQuestion,
} from "@/api/common/types";
import type { MathQuestion } from "@/api/common/types";
import { MathRenderer } from "./MathRenderer";
import { SubjectiveQuestionCard } from "./SubjectiveQuestion";
import { MultipleChoiceQuestionCard } from "./MultipleChoiceQuestion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

/**
 * QuestionRenderer 컴포넌트 속성
 * @description 문제 타입에 따른 렌더링을 담당하는 컴포넌트의 props
 */
type QuestionRendererProps = {
  /** 렌더링할 수학 문제 */
  question: MathQuestion;
  /** 현재 답안 */
  currentAnswer?: string;
  /** 답안 변경 콜백 */
  onAnswerChange?: (answer: string) => void;
  /** 문제 번호 (선택적) */
  questionNumber?: number;
  /** 읽기 전용 모드 (결과 확인용) */
  isReadonly?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
};

/**
 * QuestionRenderer 컴포넌트
 * @description 수학 문제 타입에 따라 적절한 하위 컴포넌트를 렌더링
 *
 * 주요 기능:
 * - 문제 타입 자동 감지 (주관식 vs 객관식)
 * - 타입별 전용 컴포넌트 렌더링
 * - 공통 문제 정보 표시 (제목, 설명, 배점)
 * - 에러 상황 처리 (잘못된 문제 데이터)
 * - LaTeX 수식 지원
 * - 접근성 고려 (스크린 리더, 키보드 네비게이션)
 *
 * 컴포넌트 구조:
 * ```
 * QuestionRenderer
 * ├── 공통 문제 정보 (제목, 설명, 배점)
 * ├── MathRenderer (LaTeX 수식)
 * └── 타입별 분기
 *     ├── SubjectiveQuestionCard (주관식)
 *     └── MultipleChoiceQuestionCard (객관식)
 * ```
 *
 * @example
 * ```tsx
 * // 주관식 문제 렌더링
 * <QuestionRenderer
 *   question={subjectiveQuestion}
 *   questionNumber={1}
 *   currentAnswer="x = 2y + 3"
 *   onAnswerChange={(answer) => console.log('답안:', answer)}
 * />
 *
 * // 객관식 문제 렌더링
 * <QuestionRenderer
 *   question={multipleChoiceQuestion}
 *   questionNumber={2}
 *   currentAnswer="option-3"
 *   onAnswerChange={(answer) => console.log('선택:', answer)}
 * />
 *
 * // 읽기 전용 모드 (결과 확인)
 * <QuestionRenderer
 *   question={question}
 *   currentAnswer="user-answer"
 *   readonly
 * />
 * ```
 */
export function QuestionRenderer({
  question,
  currentAnswer = "",
  onAnswerChange,
  questionNumber,
  isReadonly = false,
  className,
}: QuestionRendererProps) {
  /**
   * 문제 데이터 유효성 검사
   */
  if (!question || !question.id || !question.type) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          문제 데이터가 올바르지 않습니다. 관리자에게 문의하세요.
        </AlertDescription>
      </Alert>
    );
  }

  /**
   * 문제 번호 표시 텍스트
   */
  const questionNumberText = questionNumber
    ? `문제 ${questionNumber}`
    : `문제 ${question.id}`;

  /**
   * 문제 타입별 컴포넌트 렌더링
   */
  const renderQuestionComponent = () => {
    if (isSubjectiveQuestion(question)) {
      return (
        <SubjectiveQuestionCard
          question={question}
          currentAnswer={currentAnswer}
          onAnswerChange={onAnswerChange}
          isReadonly={isReadonly}
        />
      );
    }

    if (isMultipleChoiceQuestion(question)) {
      return (
        <MultipleChoiceQuestionCard
          question={question}
          currentAnswer={currentAnswer}
          onAnswerChange={onAnswerChange}
          isReadonly={isReadonly}
        />
      );
    }

    // 알 수 없는 문제 타입
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>지원하지 않는 문제 타입입니다</AlertDescription>
      </Alert>
    );
  };

  return (
    <div className={className}>
      {/* 문제 헤더 영역 */}
      <div className="mb-6">
        {/* 문제 번호 및 배점 */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold text-gray-900">
            {questionNumberText}
            {question.title && question.title !== questionNumberText && (
              <span className="ml-2 text-lg font-normal text-gray-600">
                {question.title}
              </span>
            )}
          </h2>

          {question.points && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {question.points}점
            </div>
          )}
        </div>

        {/* 문제 설명 (LaTeX 수식 포함) */}
        {question.description && (
          <div
            className="bg-gray-50 p-4 rounded-lg border"
            role="region"
            aria-label="문제 설명"
          >
            <MathRenderer
              math={question.description}
              className="text-gray-900 leading-relaxed"
            />
          </div>
        )}

        {/* 문제 타입 표시 (개발/디버깅용) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-2 text-xs text-gray-400">
            타입: {question.type === "subjective" ? "주관식" : "객관식"}| ID:{" "}
            {question.id}
          </div>
        )}
      </div>

      {/* 답안 입력/선택 영역 */}
      <div className="space-y-4" role="group" aria-label="답안 입력 영역">
        {renderQuestionComponent()}
      </div>

      {/* 읽기 전용 모드일 때 추가 정보 표시 */}
      {isReadonly && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <span className="font-medium">정답:</span>{" "}
            {isSubjectiveQuestion(question) ? (
              <MathRenderer math={question.answer} isInline className="ml-1" />
            ) : isMultipleChoiceQuestion(question) ? (
              question.options.find(
                (opt) => opt.id === question.correctOptionId,
              )?.text || "정답 정보 없음"
            ) : (
              "정답 정보 없음"
            )}
          </div>

          {question.points && (
            <div className="text-sm text-gray-600 mt-1">
              <span className="font-medium">배점:</span> {question.points}점
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * 문제 미리보기 컴포넌트
 * @description 문제를 간략하게 미리보기하는 컴포넌트 (문제 목록용)
 */
type QuestionPreviewProps = {
  /** 미리보기할 문제 */
  question: MathQuestion;
  /** 문제 번호 */
  questionNumber?: number;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 답안 상태 표시 */
  answerStatus?: "idle" | "answered" | "skipped";
  /** 추가 CSS 클래스 */
  className?: string;
};

export function QuestionPreview({
  question,
  questionNumber,
  onClick,
  answerStatus = "idle",
  className,
}: QuestionPreviewProps) {
  const questionNumberText = questionNumber
    ? `${questionNumber}번`
    : question.id;

  const statusConfig = {
    idle: { color: "bg-gray-100 text-gray-600", text: "미응답" },
    answered: { color: "bg-green-100 text-green-700", text: "완료" },
    skipped: { color: "bg-yellow-100 text-yellow-700", text: "건너뜀" },
  };

  const status = statusConfig[answerStatus];

  return (
    <div
      className={`
        p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md hover:border-blue-300
        ${className}
      `}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`${questionNumberText} ${question.type === "subjective" ? "주관식" : "객관식"} 문제`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-900">
          {questionNumberText}
        </span>
        <div className="flex items-center gap-2">
          {question.points && (
            <span className="text-sm text-gray-500">{question.points}점</span>
          )}
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
          >
            {status.text}
          </span>
        </div>
      </div>

      <div className="text-sm text-gray-600 line-clamp-2">
        {question.title || `${question.description?.substring(0, 100)}...`}
      </div>

      <div className="text-xs text-gray-400 mt-2">
        {question.type === "subjective" ? "주관식" : "객관식"}
      </div>
    </div>
  );
}
