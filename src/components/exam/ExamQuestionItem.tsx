import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExamQuestionListIcon } from "./ExamQuestionListIcon";
import type { ExamQuestion } from "@/routes/main/exam/$examId";
import { Link } from "@tanstack/react-router";

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
  question: { id, questionNumber, category, type, difficulty, status },
  examId,
  className,
}: ExamQuestionItemProps) {
  /**
   * 문제 항목 클릭 핸들러
   * @description 잠긴 상태가 아닐 때만 클릭 이벤트 실행
   */

  const questionNumberString = `${questionNumber}번 문제`;

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
