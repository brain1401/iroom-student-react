import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExamQuestionListIcon } from "@/components/shared";
import type { ExamQuestion } from "@/routes/main/exam/$examId";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

/**
 * 시험 문제 상세 항목 컴포넌트 프로퍼티
 * @description 답안과 점수를 포함한 시험 결과 상세 뷰 항목의 타입 정의
 */
type ExamQuestionDetailItemProps = {
  question: ExamQuestion;
  examId: string;
  className?: string;
};

/**
 * 시험 문제 상세 항목 컴포넌트
 * @description 답안, 점수, 풀이과정을 포함한 상세 정보를 표시하는 확장형 컴포넌트
 *
 * 주요 기능:
 * - 문제, 학생 답안, 정답 표시
 * - 점수 및 정/오답 표시
 * - 확장/축소 가능한 풀이과정 표시
 * - 주관식 문제 이미지 영역
 */
export function ExamQuestionDetailItem({
  question: {
    id,
    questionNumber,
    category,
    type,
    difficulty,
    status,
    questionText,
    studentAnswer,
    correctAnswer,
    isCorrect,
    score,
    earnedScore,
    solution,
    isSubjective,
  },
  examId,
  className,
}: ExamQuestionDetailItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const questionNumberString = `${questionNumber}번 문제`;

  // 답안 상세 정보가 있는 경우 상세 뷰로 표시
  if (questionText && studentAnswer !== undefined) {
    return (
      <div
        className={cn(
          "rounded-lg bg-white cursor-pointer transition-all duration-200",
          "border border-gray-200",
          className,
        )}
      >
        {/* 기존 디자인 그대로 유지 - 클릭 가능한 영역 */}
        <div className="p-3" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-lg">문항 {questionNumber}</h4>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                배점: {score || 0}점
              </span>
              <span
                className={cn(
                  "px-2 py-1 rounded text-sm font-medium",
                  isCorrect
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800",
                )}
              >
                {isCorrect ? "정답" : "오답"}
              </span>
              <div className="text-gray-500">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </div>
          </div>

          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-1">문제</p>
            <p className="text-gray-800">{questionText}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">학생 답안</p>
              <p
                className={cn(
                  "font-medium",
                  isCorrect ? "text-green-700" : "text-red-700",
                )}
              >
                {studentAnswer}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">정답</p>
              <p className="font-medium text-blue-700">{correctAnswer}</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">획득 점수</span>
              <span
                className={cn(
                  "font-bold text-lg",
                  isCorrect ? "text-green-600" : "text-red-600",
                )}
              >
                {earnedScore || 0}점
              </span>
            </div>
          </div>
        </div>

        {/* 확장된 추가 정보 */}
        <div
          className={cn(
            "border-t bg-gray-50 overflow-hidden transition-all duration-500 ease-out",
            isExpanded
              ? "max-h-[500px] opacity-100 transform translate-y-0"
              : "max-h-0 opacity-0 transform -translate-y-2",
          )}
        >
          <div className="p-4 space-y-4">
            {/* 풀이 과정 */}
            {solution && (
              <div>
                <p className="text-sm text-gray-600 mb-2 font-medium">
                  풀이 과정
                </p>
                <div className="bg-white p-3 rounded-lg border">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                    {solution}
                  </pre>
                </div>
              </div>
            )}

            {/* 주관식 이미지 공간 */}
            {isSubjective && (
              <div>
                <p className="text-sm text-gray-600 mb-2 font-medium">
                  문제 이미지
                </p>
                <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 text-center">
                  <p className="text-gray-500">
                    주관식 문제 이미지가 여기에 표시됩니다
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    이미지 업로드 또는 링크 추가
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 기존 문제 목록 뷰 (답안 정보가 없는 경우)
  return (
    <Link
      to="/main/exam/$examId/$problemId"
      params={{ examId, problemId: questionNumber.toString() }}
      className={cn(
        "relative flex items-center justify-between rounded-lg border bg-white px-5 py-5 transition-all duration-200",
        // 모바일에서 가로폭 확장 (필요 시)
        "md:w-full md:max-w-none",
        // 호버 및 상호작용 스타일
        status !== "locked" && [
          "hover:border-gray-300 hover:shadow-md",
          "cursor-pointer hover:bg-gray-50",
        ],
        // 잠긴 상태 스타일링
        status === "locked" && "cursor-not-allowed opacity-60",
        className,
      )}
      aria-label={`${questionNumber} ${category} ${type} 문제, 난이도 ${difficulty}`}
    >
      {/* 좌측 O, X 상태 아이콘 */}
      <ExamQuestionListIcon status={status} className="size-10" />

      {/* 중앙 문제 정보 영역 - Figma 수평 레이아웃 */}
      <div className="min-w-0 flex-1 px-2 md:px-3">
        {/* 첫 번째 줄: 문제 번호 + 카테고리 (Figma 레이아웃) */}
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs font-bold text-black md:text-sm">
            {questionNumberString}
          </span>
          <span className="text-xs font-normal text-[#427BFF] md:text-sm">
            # {category}
          </span>
        </div>

        {/* 두 번째 줄: 유형과 난이도 (Figma 일반 텍스트) */}
        <div className="flex items-center gap-4 text-xs font-normal text-black md:text-sm">
          <span>유형 : {type}</span>
          <span>난이도 : {difficulty}</span>
        </div>
      </div>

      {/* 우측 네비게이션 버튼 - Figma 1.5625rem x 1.5625rem */}
      <div
        className={cn(
          "h-6 w-6 flex-shrink-0 rounded-md hover:bg-gray-100",
          "md:h-[1.5625rem] md:w-[1.5625rem]",
        )}
        aria-label="이전 페이지로 이동"
      >
        <ChevronRight className="h-4 w-4 text-gray-700 md:h-5 md:w-5" />
      </div>
    </Link>
  );
}
