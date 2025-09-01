import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExamQuestionListIcon } from "./ExamQuestionListIcon";
import type { ExamQuestion } from "@/routes/main/exam/$examId";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

/**
 * 시험 문제 항목 컴포넌트 프로퍼티
 * @description Figma 디자인을 기반으로 한 시험 문제 리스트 항목의 타입 정의
 */
type ExamQuestionItemProps = {
  question: ExamQuestion;

  examId: string;

  /** 추가 CSS 클래스 */
  className?: string;
};

/**
 * 시험 문제 항목 컴포넌트
 * @description Figma 디자인 기반 시험/퀴즈 문제 리스트 항목을 렌더링하는 컴포넌트
 *
 * 디자인 스펙 (Figma 기준):
 * - 전체 크기: 17.5rem x 2.372rem 정확한 크기 (280px x 37.95px)
 * - 좌측 상태 아이콘: 2.3125rem x 2.3125rem 영역 (37px x 37px), borderRadius 0.3125rem (5px), Lucide 아이콘 사용
 *   - 정답(completed): Circle 아이콘, 초록색
 *   - 진행중(active): Circle 아이콘, 빨간색 #FF6A71
 *   - 오답/잠김(locked): X 아이콘, 회색
 * - 우측 뒤로가기 아이콘: 1.5625rem x 1.5625rem (25px x 25px), 어두운 색상
 * - 텍스트 레이아웃: 수평 배치 (문제번호 + 카테고리 같은 줄)
 * - 문제 번호: fontWeight 700, fontSize 0.8125rem (13px), 검정색
 * - 카테고리: fontWeight 400, fontSize 0.8125rem (13px), 파란색 #427BFF
 * - 유형/난이도: fontWeight 400, fontSize 0.8125rem (13px), 검정색, 같은 줄 배치
 *
 * 주요 기능:
 * - 상태별 좌측 Lucide 아이콘 표시 (Circle/X)
 * - 반응형 레이아웃 (모바일/데스크톱)
 * - 접근성 고려 (ARIA 라벨, 키보드 네비게이션)
 * - 선택적 클릭 및 네비게이션 이벤트
 * - shadcn/ui 컴포넌트 활용
 *
 * @example
 * ```tsx
 * // 기본 사용법
 * <ExamQuestionItem
 *   questionNumber="1번 문제"
 *   category="다항식의 덧셈·뺄셈"
 *   type="계산"
 *   difficulty="중"
 *   status="active"
 *   onNavigate={() => router.back()}
 *   onClick={() => handleQuestionClick(1)}
 * />
 *
 * // 리스트에서 사용
 * {questions.map((question, index) => (
 *   <ExamQuestionItem
 *     key={question.id}
 *     questionNumber={`${index + 1}번 문제`}
 *     category={question.category}
 *     type={question.type}
 *     difficulty={question.difficulty}
 *     status={question.status}
 *     onClick={() => handleQuestionSelect(question.id)}
 *   />
 * ))}
 * ```
 */
export function ExamQuestionItem({
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
}: ExamQuestionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  /**
   * 문제 항목 클릭 핸들러
   * @description 잠긴 상태가 아닐 때만 클릭 이벤트 실행
   */

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
      // disabled={status === "locked"}
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
