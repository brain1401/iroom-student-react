import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExamQuestionListIcon } from "@/components/shared";
import type { ExamQuestion } from "@/routes/main/exam/$examId";
import { Link } from "@tanstack/react-router";

/**
 * 시험 문제 목록 아이템 컴포넌트 Props
 */
type ExamQuestionItemProps = {
  /** 시험 문제 데이터 */
  question: ExamQuestion;
  /** 시험 ID */
  examId: string;
  /** 추가 CSS 클래스 */
  className?: string;
};

/**
 * 시험 문제 목록 아이템 컴포넌트
 * @description 시험 문제 목록에서 사용되는 기본 문제 항목
 */
export function ExamQuestionItem({
  question,
  examId,
  className,
}: ExamQuestionItemProps) {
  return (
    <Link
      to="/main/exam/$examId/$problemId"
      params={{
        examId,
        problemId: question.id,
      }}
      className={cn(
        "flex items-center justify-between p-4 rounded-lg border",
        "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <ExamQuestionListIcon status={question.status} />
        <div>
          <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">
            문제 {question.questionNumber}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {question.category} - {question.type} ({question.difficulty})
          </p>
          {question.questionText && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate max-w-[200px]">
              {question.questionText}
            </p>
          )}
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-gray-400" />
    </Link>
  );
}
