import { Camera, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { MathQuestionCardState } from "./types";

/**
 * 수학 문제 카드 컴포넌트 프로퍼티
 * @description 피그마 디자인을 기반으로 한 수학 문제 카드의 타입 정의
 *
 * 디자인 스펙 (피그마 기준):
 * - 전체 크기: 310px × 85px (19.375rem × 5.3125rem)
 * - 좌측 문제 번호: 49px 너비 (3.0625rem), 검은색 테두리
 * - 중앙 하단: "답" 텍스트 + 수학공식 영역
 * - 우상단: 카메라 아이콘 + 재촬영 관련 5개 벡터 아이콘
 * - 폰트: Pretendard Bold 700, Regular 400, 20px
 * - 색상: 검은색 텍스트 (#000000), 검은색 테두리 (1px stroke)
 */
type MathQuestionCardProps = {
  /** 문제 번호 (예: 1, 2, 3...) */
  questionNumber: number;

  /** 수학 문제 답안 (LaTeX 또는 일반 텍스트) */
  answer?: string;

  /** 카드 상태 */
  state: MathQuestionCardState;

  /** 사진 촬영/재촬영 버튼 클릭 핸들러 */
  onTakePhoto?: () => void;

  /** 재촬영 버튼 클릭 핸들러 */
  onRetakePhoto?: () => void;

  /** 사진 삭제 버튼 클릭 핸들러 */
  onDeletePhoto?: () => void;

  /** 파일 업로드 버튼 클릭 핸들러 */
  onUploadFile?: () => void;

  /** 결과 다운로드 버튼 클릭 핸들러 */
  onDownloadResult?: () => void;

  /** 카드 클릭 핸들러 (전체 카드 선택 시) */
  onClick?: () => void;

  /** 추가 CSS 클래스 */
  className?: string;

  /** 비활성화 여부 */
  isDisabled?: boolean;
};

const BUTTON_CLASSES = "px-3 w-fit border-zinc-400 border";

/**
 * 수학 문제 카드 컴포넌트
 * @description 피그마 디자인을 기반으로 한 수학 문제 카드 UI 컴포넌트
 *
 * 주요 기능:
 * - 문제 번호와 답안 표시 (좌측 번호 영역 + 중앙 답안 영역)
 * - 상태별 아이콘 표시 (카메라, 재촬영, 업로드, 다운로드 등)
 * - 반응형 디자인 (모바일에서는 크기 조정)
 * - 접근성 고려 (키보드 네비게이션, 스크린 리더 지원)
 * - 상태 관리 (idle, loading, completed, error)
 *
 * 레이아웃 구조:
 * - 좌측: 문제 번호 영역 (49px 고정, 검은색 테두리)
 * - 중앙: 답안 표시 영역 ("답" 라벨 + 수학 공식)
 * - 우상단: 액션 아이콘들 (카메라, 재촬영, 삭제, 업로드, 다운로드)
 *
 * @example
 * ```tsx
 * // 기본 사용법 (초기 상태)
 * <MathQuestionCard
 *   questionNumber={1}
 *   state="idle"
 *   onTakePhoto={() => handleTakePhoto(1)}
 * />
 *
 * // 답안이 있는 완료 상태
 * <MathQuestionCard
 *   questionNumber={2}
 *   answer="x = 3y + 2"
 *   state="completed"
 *   onRetakePhoto={() => handleRetake(2)}
 *   onDownloadResult={() => handleDownload(2)}
 * />
 *
 * // 리스트에서 사용
 * {questions.map((question) => (
 *   <MathQuestionCard
 *     key={question.id}
 *     questionNumber={question.number}
 *     answer={question.answer}
 *     state={question.state}
 *     onTakePhoto={() => handleTakePhoto(question.id)}
 *     onRetakePhoto={() => handleRetake(question.id)}
 *     onClick={() => handleQuestionSelect(question.id)}
 *   />
 * ))}
 * ```
 */
export function MathQuestionCard({
  questionNumber,
  answer,
  state = "idle",
  onTakePhoto,
  onRetakePhoto,
  onDeletePhoto: _onDeletePhoto,
  onUploadFile: _onUploadFile,
  onDownloadResult: _onDownloadResult,
  onClick,
  className,
  isDisabled = false,
}: MathQuestionCardProps) {
  /**
   * 카드 클릭 핸들러
   * @description 비활성화 상태가 아닐 때만 클릭 이벤트 실행
   */
  const handleCardClick = () => {
    if (!isDisabled && !isLoading && onClick) {
      onClick();
    }
  };

  /**
   * 상태별 로딩 표시 여부
   */
  const isLoading = state === "loading";

  /**
   * 답안이 있는지 확인
   */
  const hasAnswer = answer && answer.trim().length > 0;

  return (
    <Card
      className={cn(
        // 피그마 디자인 크기: 310px × 85px
        "relative h-[5.35rem] w-full overflow-hidden border border-black py-0",
        // 상호작용 스타일
        !isDisabled && [
          "transition-all duration-200",
          onClick && "cursor-pointer",
        ],
        // 비활성화 상태
        isDisabled && "cursor-not-allowed opacity-60",
        isLoading && "cursor-progress",
        // 상태별 스타일
        state === "error" && "border-red-500 bg-red-50",
        state === "completed" && "border-green-600 bg-green-50",
        className,
      )}
      onClick={handleCardClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick && !isDisabled ? 0 : undefined}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && onClick && !isDisabled) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`${questionNumber}번 문제${hasAnswer ? `, 답안: ${answer}` : ""}`}
    >
      <CardContent className="flex h-full p-0">
        {/* 좌측 문제 번호 영역 - 피그마 49px 너비, 검은색 테두리 */}
        <div
          className={cn(
            "flex w-[3.0625rem] flex-shrink-0 items-center justify-center border-r border-black bg-white",
            // 상태별 배경색
            state === "completed" && "bg-green-100",
            state === "error" && "bg-red-100",
          )}
        >
          <span className="text-xl font-bold text-black">{questionNumber}</span>
        </div>

        {/* 중앙 답안 영역 */}
        <div className="flex min-w-0 flex-1 flex-col justify-center p-3">
          {/* 로딩 상태 표시 */}
          {isLoading && (
            <div className="flex items-center justify-center">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
              <span className="ml-2 text-sm text-gray-600">분석 중...</span>
            </div>
          )}

          {/* 답안 표시 영역 - 피그마 하단 배치 */}
          {!isLoading && (
            <div className="space-y-1">
              <div className="text-sm font-normal text-black">답</div>
              <div
                className={cn(
                  "min-h-[1.5rem] text-lg font-bold text-black",
                  !hasAnswer && "text-gray-400",
                )}
              >
                {hasAnswer ? answer : "정답을 입력하지 않았습니다."}
              </div>
            </div>
          )}
        </div>

        {/* 우상단 액션 아이콘들 - 피그마 5개 벡터 아이콘 */}
        <div className="absolute top-2 right-2 flex gap-1">
          {/* 카메라 아이콘 - 기본 촬영 */}
          {(state === "idle" || state === "error") && onTakePhoto && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(BUTTON_CLASSES, "w-auto")}
              onClick={(e) => {
                e.stopPropagation();
                onTakePhoto();
              }}
              disabled={isDisabled}
              aria-label="사진 촬영"
            >
              <Camera className="h-4 w-4 text-zinc-700" />
            </Button>
          )}

          {/* 재촬영 아이콘 */}
          {state === "completed" && onRetakePhoto && (
            <Button
              variant="ghost"
              size="icon"
              className={BUTTON_CLASSES}
              onClick={(e) => {
                e.stopPropagation();
                onRetakePhoto();
              }}
              disabled={isDisabled}
              aria-label="재촬영"
            >
              <div>재촬영</div>
              <RotateCcw className="h-4 w-4 text-gray-700" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
