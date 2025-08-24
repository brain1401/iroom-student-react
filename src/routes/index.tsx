import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { LoginSection, MotivationSection } from "@/components/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Home,
});

/**
 * 홈페이지 컴포넌트
 * @description 로그인과 동기부여 섹션을 포함하는 반응형 메인 페이지
 *
 * 디바이스별 레이아웃 전략:
 * - 모바일: 전체 화면 세로 스택, 카드 없이 깔끔한 UI
 * - 태블릿: 중간 크기 카드, 세로 스택 유지
 * - 데스크톱: 2컬럼 레이아웃, 큰 카드로 시각적 임팩트
 *
 * 접근성 고려사항:
 * - 키보드 네비게이션 지원
 * - 스크린 리더 친화적 구조
 * - 터치 디바이스 최적화
 */
function Home() {
  /**
   * 컨테이너 스타일링 (Tailwind 반응형)
   * @description 모바일 퍼스트 접근법으로 반응형 레이아웃
   *
   * - 모바일: 전체 화면 활용, 중앙 정렬 (기본)
   * - 태블릿: 적당한 여백, 카드 스타일 (md:)
   * - 데스크톱: 카드 중앙 정렬, 더 많은 여백 (lg:)
   */
  const containerClasses = cn(
    "flex flex-1 items-stretch justify-center p-0", // 모바일 기본
    "md:items-center md:justify-center md:p-4", // 태블릿 이상
    "lg:p-8", // 데스크톱 이상
  );

  /**
   * 메인 카드 스타일링 (Tailwind 반응형)
   * @description 디바이스별 카드 외형과 레이아웃
   *
   * - 모바일: 카드 효과 없이 전체 화면 (기본)
   * - 태블릿: 적당한 카드 크기, 그림자 효과 (md:)
   * - 데스크톱: 큰 카드, 강한 그림자 효과 (lg:)
   */
  const cardClasses = cn(
    "py-0",
    "w-full overflow-hidden h-full border-0 shadow-none rounded-none", // 모바일 기본
    "md:max-w-2xl md:h-fit md:border md:shadow-lg md:rounded-lg", // 태블릿 이상
    "lg:max-w-4xl lg:border-0 lg:shadow-2xl lg:rounded-xl", // 데스크톱 이상
  );

  /**
   * 그리드 레이아웃 스타일링 (Tailwind 반응형)
   * @description LoginSection과 MotivationSection 배치
   *
   * - 모바일: 1컬럼 세로 스택 (기본)
   * - 태블릿: 1컬럼 유지 (md:)
   * - 데스크톱: 2컬럼 가로 배치 (lg:)
   */
  const gridClasses = cn(
    "grid grid-cols-1", // 모바일 기본 (1컬럼)
    "lg:grid-cols-2", // 데스크톱에서만 2컬럼
  );

  return (
    <div className={containerClasses}>
      <Card className={cardClasses}>
        <div className={gridClasses}>
          <LoginSection />
          {/* 데스크톱에서만 MotivationSection 표시 (lg: breakpoint) */}
          <div className="hidden lg:block">
            <MotivationSection />
          </div>
        </div>
      </Card>
    </div>
  );
}
