import { useRouter, useCanGoBack } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * 페이지 헤더 컴포넌트
 * @description 제목과 선택적 뒤로가기 버튼이 포함된 페이지 상단 헤더
 *
 * 주요 기능:
 * - 선택적 좌측 뒤로가기 아이콘 버튼 (ChevronLeft)
 * - 제목 텍스트 표시 (중앙 또는 좌측 정렬)
 * - 선택적 하단 구분선 (기본값: 표시)
 * - TanStack Router 통합 뒤로가기 기능
 * - 커스텀 뒤로가기 동작 지원
 * - 유연한 레이아웃 (뒤로가기 버튼 유무에 따라 조정)
 * - 반응형 디자인 (모바일 우선)
 *
 * 피그마 디자인 기반:
 * - 전체 높이: 36px (모바일), 더 큰 화면에서 48px
 * - 아이콘 크기: 25x25px, 둥근 모서리 10px
 * - 제목 폰트: Pretendard Bold 20px
 * - 구분선: 2px 굵기
 * - 색상: 텍스트 #000000, 아이콘 #1C1C1E
 *
 * @example
 * ```tsx
 * // 기본 사용법 (뒤로가기 버튼 있음)
 * <PageHeader title="주관식 답안" />
 *
 * // 뒤로가기 버튼 없는 메인 페이지
 * <PageHeader title="대시보드" showBackButton={false} />
 *
 * // 뒤로가기 없이 우측 메뉴만 있는 경우
 * <PageHeader title="설정" showBackButton={false}>
 *   <Button variant="ghost" size="sm">
 *     <Settings className="w-4 h-4" />
 *   </Button>
 * </PageHeader>
 *
 * // 커스텀 뒤로가기 동작
 * <PageHeader
 *   title="프로필 수정"
 *   onBack={() => navigate({ to: '/profile' })}
 * />
 *
 * // 구분선 없이 표시
 * <PageHeader title="채팅" showDivider={false} />
 *
 * // 모든 옵션 활용
 * <PageHeader
 *   title="채팅방"
 *   showBackButton={true}
 *   showDivider={true}
 *   onBack={() => handleCustomBack()}
 * >
 *   <Button variant="ghost" size="sm">
 *     <MoreVertical className="w-4 h-4" />
 *   </Button>
 * </PageHeader>
 * ```
 */

type PageHeaderProps = {
  /** 헤더에 표시할 제목 텍스트 */
  title: string;

  /**
   * 뒤로가기 버튼 표시 여부
   * @description false일 경우 뒤로가기 버튼이 렌더링되지 않음
   * @default true
   */
  showBackButton?: boolean;

  /**
   * 커스텀 뒤로가기 핸들러
   * @description 제공되면 기본 뒤로가기 대신 이 함수가 호출됨
   */
  onBack?: () => void;

  /**
   * 하단 구분선 표시 여부
   * @default true
   */
  showDivider?: boolean;

  /** 추가 CSS 클래스 */
  className?: string;

  /**
   * 우측 영역에 추가할 요소
   * @description 메뉴 버튼, 액션 버튼 등을 배치할 수 있음
   */
  children?: React.ReactNode;
};

export function PageHeader({
  title,
  showBackButton = false,
  onBack,
  showDivider = true,
  className,
  children,
}: PageHeaderProps) {
  // TanStack Router 훅은 항상 호출 (React Rules of Hooks)
  const router = useRouter();
  const canGoBack = useCanGoBack();

  /**
   * 뒤로가기 처리 함수
   * @description 커스텀 onBack이 있으면 실행, 없으면 브라우저 히스토리 back() 사용
   * @note showBackButton이 false이거나 뒤로갈 수 없을 때는 동작하지 않음
   *
   * Hydration mismatch 방지:
   * - disabled 속성 대신 onClick에서 조건 확인
   * - 서버와 클라이언트에서 일관된 렌더링 보장
   */
  const handleBack = () => {
    if (!showBackButton || !canGoBack) return;

    if (onBack) {
      onBack();
    } else {
      router.history.back();
    }
  };

  return (
    <header
      className={cn(
        "relative flex h-12 w-full items-center px-4 py-2 md:h-15 dark:bg-gray-900",
        className,
      )}
    >
      {/* 뒤로가기 버튼 - 조건부 렌더링 */}
      {showBackButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="h-11 w-11 rounded-[10px] p-0 hover:bg-gray-100 md:h-12 md:w-12 dark:hover:bg-gray-800"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="size-6 text-gray-800 md:size-7 dark:text-gray-200" />
        </Button>
      )}

      {/* 제목 영역 - 뒤로가기 버튼 유무에 따른 레이아웃 조정 */}
      <div
        className={cn(
          "flex flex-1",
          // 뒤로가기 버튼이 없을 때의 정렬 로직
          !showBackButton
            ? children
              ? "justify-start" // 우측에 children이 있으면 좌측 정렬
              : "justify-center" // children이 없으면 완전 중앙 정렬
            : "justify-center", // 뒤로가기 버튼이 있으면 중앙 정렬 (기존과 동일)
        )}
      >
        <h1
          className={cn(
            "text-center text-lg font-bold text-black md:text-xl dark:text-white",
            showBackButton
              ? !children && "pr-10 md:pr-11"
              : !children && "pl-0",
          )}
        >
          {title}
        </h1>
      </div>

      {/* 우측 추가 요소 영역 */}
      {children && <div className="flex items-center">{children}</div>}

      {/* 하단 구분선 */}
      {showDivider && (
        <div className="absolute right-0 bottom-0 left-0 h-[2px] bg-black dark:bg-white" />
      )}
    </header>
  );
}
