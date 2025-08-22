import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ChatbotFab } from "@/components/chat/ChatbotFab";

type MobileSubjectiveWrongProps = Record<string, never>;

/**
 * 주관식 오답 화면 (모바일)
 * @description Figma 모바일 프레임 기반 주관식 오답 상태 화면 구성
 *
 * 주요 구성:
 * - 상단: 섹션 토글(시험 관리/성적·리포트), 뒤로가기, 제목+물음표, 상단 검정 라인
 * - 본문: 문제 카드(연보라), 정답/내 정답(내 정답 빨간색), 풀이 과정
 * - 하단: 해설/이론/유사 문제 추천 토글 섹션
 */
function MobileSubjectiveWrong(_props: MobileSubjectiveWrongProps) {
  const [activeSection, setActiveSection] = React.useState<"manage" | "report">(
    "report",
  );
  const isReport = activeSection === "report";

  const questionTitle = "가다나 시험 8번";
  const problemTitle = "문제 4\n(3x-4)(x+6)를 전개하시오.";
  const correctExpr = "3x² + 14x -24";
  const myWrongExpr = "3x² + 18x -24";
  const solutionSteps =
    "(3x−4)(x+6)\n3x × x = 3x²\n3x × 6 = 18x\n-4 × x = -4x\n-4 × 6 = -24\n3x² + 18x -4x -24\n3x² + 14x -24";

  const [openMap, setOpenMap] = React.useState<Record<string, boolean>>({
    해설: false,
    이론: false,
    "유사 문제 추천": false,
  });

  // 각 토글 섹션 펼침 콘텐츠 높이 상태
  const [contentHeights, setContentHeights] = React.useState<Record<string, number>>({
    해설: 0,
    이론: 0,
    "유사 문제 추천": 0,
  });

  // 모두 펼치기/접기 핸들러
  const expandAll = () =>
    setOpenMap({ 해설: true, 이론: true, "유사 문제 추천": true });
  const collapseAll = () =>
    setOpenMap({ 해설: false, 이론: false, "유사 문제 추천": false });
  const anyOpen = openMap["해설"] || openMap["이론"] || openMap["유사 문제 추천"];

  // 컨테이너 동적 높이 계산 (마지막 섹션 위치 + 여백)
  const lastBaseTop = 989.79;
  const lastTop =
    lastBaseTop +
    (openMap["해설"] ? contentHeights["해설"] + 8 : 0) +
    (openMap["이론"] ? contentHeights["이론"] + 8 : 0);
  const frameHeight = Math.max(
    1080,
    lastTop + (openMap["유사 문제 추천"] ? contentHeights["유사 문제 추천"] + 140 : 140),
  );

  /**
   * 섹션 토글 핸들러
   * @description 라벨 기반 열림/닫힘 상태 토글
   */
  const toggleSection = (label: string) => {
    setOpenMap((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="flex w-full justify-center p-6">
      <div
        className="relative w-[360px] rounded-md bg-white"
        style={{ transform: "translateX(-1cm)", height: frameHeight }}
      >
        {/* 상단 섹션/타이틀 (버튼) */}
        <button
          type="button"
          aria-pressed={!isReport}
          onClick={() => setActiveSection("manage")}
          className={cn(
            "absolute left-[65.22px] top-[90.45px] text-[20px]/[1.19] whitespace-nowrap",
            !isReport ? "font-bold text-black" : "font-medium text-[#999999]",
          )}
        >
          시험 관리
        </button>
        <button
          type="button"
          aria-pressed={isReport}
          onClick={() => setActiveSection("report")}
          className={cn(
            "absolute left-[206.76px] top-[90.45px] text-[20px]/[1.19] whitespace-nowrap",
            isReport ? "font-bold text-black" : "font-medium text-[#999999]",
          )}
        >
          성적 / 리포트
        </button>

        {/* 기준선: 활성 탭만 밑줄 표시 */}
        {!isReport && (
          <div className="absolute left-[24px] top-[123.63px] h-px w-[154.67px] bg-black" />
        )}
        {isReport && (
          <div className="absolute left-[182.28px] top-[123.63px] h-px w-[154.67px] bg-black" />
        )}

        {/* 뒤로가기 + 타이틀 + 물음표 */}
        <div className="absolute left-[19.36px] top-[160.01px]">
          <Button
            variant="ghost"
            size="icon"
            className="h-[25px] w-[25px] p-0"
            asChild
          >
            <Link to="/main">
              <ArrowLeft className="h-[18px] w-[18px]" />
            </Link>
          </Button>
        </div>
        <div className="absolute left-1/2 top-[158.34px] -translate-x-1/2">
          <div className="flex items-center">
            <div className="whitespace-nowrap text-[20px]/[1.19] font-bold text-black">
              {questionTitle}
            </div>
            <HoverCard openDelay={100} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="ml-[6px] h-[24px] px-2 text-[14px]"
                  aria-label="문제 정보 버튼"
                >
                  ?
                </Button>
              </HoverCardTrigger>
              <HoverCardContent
                side="bottom"
                align="center"
                sideOffset={8}
                collisionPadding={16}
                style={{ marginLeft: "-2cm" }}
                className="w-auto max-w-[312px] rounded-[10px] border border-black bg-white p-4 shadow relative before:content-[''] before:absolute before:-top-[6px] before:left-[calc(50%+1cm+4px-2mm)] before:-translate-x-1/2 before:transform before:h-3 before:w-3 before:rotate-45 before:bg-white before:border-l before:border-t before:border-black"
              >
                <div className="mb-3 text-[20px]/[1.19] font-bold text-black">시험 정보</div>
                <div className="grid grid-cols-2 gap-y-2 text-[18px]/[1.19] font-medium text-[#4E4D4D]">
                  <div className="text-black">제목</div>
                  <div className="text-right text-[#4E4D4D]">가나다 시험</div>
                  <div className="text-black">단원</div>
                  <div className="text-right text-[#4E4D4D]">식의 계산</div>
                  <div className="text-black">세부 단원</div>
                  <div className="text-right text-[#4E4D4D]">다항식의 곱셈</div>
                  <div className="text-black">유형</div>
                  <div className="text-right text-[#4E4D4D]">계산</div>
                  <div className="text-black">난이도</div>
                  <div className="text-right text-[#4E4D4D]">중</div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>

        {/* 상단 검정 라인 */}
        <div className="absolute left-[24px] top-[193.46px] h-[2px] w-[312px] bg-black" />

        {/* 문제 카드 */}
        {isReport ? (
          <div className="absolute left-[24px] top-[207.36px] w-[312px] rounded-[10px] bg-[#FAF3FF] p-4">
            <div className="mb-2 whitespace-pre-line text-[15px]/[2] font-medium text-black">
              {problemTitle}
            </div>
          </div>
        ) : (
          <div className="absolute left-[24px] top-[207.36px] flex w-[312px] items-center justify-center rounded-[10px] border py-16">
            <div className="text-sm text-[#666]">
              시험 관리 화면 구성 표시 영역
            </div>
          </div>
        )}

        {/* 섹션 구분선 (회색) */}
        <div className="absolute left-[24px] top-[410px] h-px w-[312px] bg-[#D7D7D7]" />

        {/* 정답/내 정답 일렬 정렬 (4열 행렬, 간격 고정, 개행 금지) */}
        <div className="absolute left-[24px] top-[364px] grid w-[312px] grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_auto] items-baseline gap-x-1">
          <span className="whitespace-nowrap text-[18px]/[1.19] font-medium text-[#4E4D4D]">정답</span>
          <span className="min-w-0 truncate whitespace-nowrap text-[15px]/[2] font-medium text-[#4E4D4D]">
            {correctExpr}
          </span>
          <span className="min-w-0 truncate whitespace-nowrap text-right text-[15px]/[2] font-medium text-[#FF6A71]">
            {myWrongExpr}
          </span>
          <span className="whitespace-nowrap text-[18px]/[1.19] font-medium text-[#FF6A71]">내 정답</span>
        </div>

        {/* 풀이 과정 */}
        <div className="absolute left-[24px] top-[456.77px] w-[120px] whitespace-pre-line text-[15px]/[2] font-medium text-black">
          {solutionSteps}
        </div>

        {/* 하단 섹션 그룹: 해설 / 이론 / 유사 문제 추천 */}
        <div className="absolute left-[24px] top-[calc(684.08px-2cm)] h-px w-[312px] bg-[#D7D7D7]" />
        <div className="absolute right-[24px] top-[690px]">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 px-2 text-[12px]"
            onClick={anyOpen ? collapseAll : expandAll}
          >
            {anyOpen ? "모두 접기" : "모두 펼치기"}
          </Button>
        </div>

        {/* 해설 섹션 */}
        <div className="absolute left-[24px] top-[708.46px] w-[312px]">
          <SectionRow
            label="해설"
            isOpen={openMap["해설"]}
            onToggle={() => toggleSection("해설")}
            onContentHeightChange={(h) =>
              setContentHeights((prev) => ({ ...prev, 해설: h }))
            }
          >
            <div className="px-1 pb-4 pt-2 text-[14px] leading-relaxed text-[#4E4D4D]">
              풀이 요약 표시 영역
            </div>
          </SectionRow>
          <div className="h-px w-full bg-[#D7D7D7]" />
        </div>

        {/* 이론 섹션: 위 섹션 열림 시 콘텐츠 높이만큼 간격 보정 */}
        <div
          className="absolute left-[24px] w-[312px]"
          style={{ top: `${849.03 + (openMap["해설"] ? contentHeights["해설"] + 8 : 0)}px`, marginTop: "1cm" }}
        >
          <SectionRow
            label="이론"
            isOpen={openMap["이론"]}
            onToggle={() => toggleSection("이론")}
            onContentHeightChange={(h) =>
              setContentHeights((prev) => ({ ...prev, 이론: h }))
            }
          >
            <div className="px-1 pb-4 pt-2 text-[14px] leading-relaxed text-[#4E4D4D]">
              관련 개념 요약 표시 영역
            </div>
          </SectionRow>
          <div className="h-px w-full bg-[#D7D7D7]" />
        </div>

        {/* 유사 문제 추천 섹션: 위 섹션들 열림 시 누적 간격 보정 */}
        <div
          className="absolute left-[24px] w-[312px]"
          style={{
            top: `${989.79 +
              (openMap["해설"] ? contentHeights["해설"] + 8 : 0) +
              (openMap["이론"] ? contentHeights["이론"] + 8 : 0)}px`,
            marginTop: "1cm",
          }}
        >
          <SectionRow
            label="유사 문제 추천"
            isOpen={openMap["유사 문제 추천"]}
            onToggle={() => toggleSection("유사 문제 추천")}
            onContentHeightChange={(h) =>
              setContentHeights((prev) => ({ ...prev, "유사 문제 추천": h }))
            }
          >
            <div className="px-1 pb-4 pt-2 text-[14px] leading-relaxed text-[#4E4D4D]">
              유사 유형 문제 리스트 표시 영역
            </div>
          </SectionRow>
        </div>

        {/* 우하단 챗봇 플로팅 버튼 → 드로어 열기 */}
        <ChatbotFab
          mode="fab"
          position="absolute"
          className={cn(
            "right-[19.9px] top-[891.19px] h-[59.12px] w-[59.12px] rounded-full",
            "shadow-[1px_2px_4px_rgba(0,0,0,0.4)]",
          )}
          triggerChildren={
            <img
              src="/figma/mobile-fab.png"
              alt="챗봇"
              className="absolute left-[4.15px] top-[4.15px] h-[56.94px] w-[56.94px] rounded-full object-cover"
            />
          }
        />
      </div>
    </div>
  );
}

type SectionRowProps = {
  /** 라벨 텍스트 */
  label: string;
  /** 열림 여부 */
  isOpen: boolean;
  /** 토글 핸들러 */
  onToggle: () => void;
  /** 내부 콘텐츠 높이 변경 콜백 (열림 시 높이 측정) */
  onContentHeightChange?: (height: number) => void;
  /** 펼침 콘텐츠 */
  children: React.ReactNode;
};

/**
 * 섹션 행 컴포넌트
 * @description 라벨 + 우측 원형 버튼 + 토글 영역 렌더링
 */
function SectionRow({ label, isOpen, onToggle, onContentHeightChange, children }: SectionRowProps) {
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const el = contentRef.current;
    if (!el) return;
    const h = el.getBoundingClientRect().height;
    onContentHeightChange?.(h);
  }, [isOpen, onContentHeightChange]);

  return (
    <div className="w-full">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex w-full items-center justify-between py-3"
      >
        <div className="text-[20px]/[1.19] font-bold text-black">{label}</div>
        <div className="flex h-[21.75px] w-[21.75px] items-center justify-center rounded-full bg-[#EDEDED]">
          <ChevronDown
            className={cn(
              "h-[13px] w-[13px] text-[#1C1C1E] transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </button>
      {isOpen && (
        <div ref={contentRef}>{children}</div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/main/report/mobile/subjective-wrong/")({
  component: MobileSubjectiveWrong,
});
