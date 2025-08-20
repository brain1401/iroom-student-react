import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bell,
  CircleUser,
  Menu,
  ChevronDown,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

type MobileObjectiveCorrectProps = Record<string, never>;

/**
 * 객관식 정답 화면 (모바일)
 * @description 객관식 정답 선택 완료 상태 전용 페이지 (Figma "모바일" 프레임 기반)
 *
 * 주요 구성:
 * - 상단: 상위 섹션/타이틀, 뒤로가기, 이름/반 배지
 * - 본문: 문제 카드(연보라 배경)
 * - 정답/내 정답: 동일 선택 강조 표시 (파란색)
 * - 섹션 리스트: 해설, 이론, 유사 문제 추천
 * - 우하단: 그라데이션 동그라미 플로팅 버튼
 */
function MobileObjectiveCorrect(_props: MobileObjectiveCorrectProps) {
  const [activeSection, setActiveSection] = React.useState<"manage" | "report">(
    "report",
  );
  const isReport = activeSection === "report";
  const questionTitle = "가다나 시험 4번";
  const problemText =
    "문제 4\n(2x + 3)(x - 5)의 전개식으로 알맞은 것은?\n ① 2x² + 7x - 15\n ② 2x² - 7x - 15\n ③ 2x² + 10x - 15\n ④ 2x² - 10x + 15";
  const correctChoice = "②";
  const [openMap, setOpenMap] = React.useState<Record<string, boolean>>({
    해설: false,
    이론: false,
    "유사 문제 추천": false,
  });

  /**
   * 섹션 토글 핸들러
   * @description 라벨 기반 열림/닫힘 상태 토글
   */
  const toggleSection = (label: string) => {
    setOpenMap((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="flex w-full justify-center p-6">
      <div className="relative h-[804px] w-[360px] rounded-md bg-white">
        {/* 상단 이름/반 배지 */}
        <div className="absolute left-[23px] top-[20px] flex items-center gap-3">
          <div className="text-[30px]/[1.19] font-bold text-black">김체리</div>
          <div className="rounded-full border border-black/90 px-[10px] py-[2px]">
            <span className="block text-center text-[9px]/[1] text-black">
              중등 B반
            </span>
          </div>
        </div>

        {/* 상단 아이콘 버튼: 알림, 마이 페이지, 햄버거 (검은 줄 끝과 정렬: right-[19px]) */}
        <div className="absolute right-[19px] top-[20px] flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            aria-label="알림"
            className="relative size-[34px]"
            type="button"
          >
            <Bell className="h-[18px] w-[18px] text-[#1C1C1E]" />
            <span className="absolute right-[3px] top-[3px] h-[10px] w-[10px] rounded-full bg-[#FF6A71]" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="마이 페이지"
            className="size-[34px]"
            type="button"
          >
            <CircleUser className="h-[18px] w-[18px] text-[#1C1C1E]" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="메뉴"
            className="size-[34px]"
            type="button"
          >
            <Menu className="h-[20px] w-[20px] text-[#1C1C1E]" />
          </Button>
        </div>

        {/* 상단 섹션/타이틀 (버튼) */}
        <button
          type="button"
          aria-pressed={!isReport}
          onClick={() => setActiveSection("manage")}
          className={cn(
            "absolute left-[65px] top-[90px] text-[20px]/[1.19]",
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
            "absolute left-[207px] top-[90px] text-[20px]/[1.19]",
            isReport ? "font-bold text-black" : "font-medium text-[#999999]",
          )}
        >
          성적 / 리포트
        </button>
        {/* 기준선: 활성 탭만 밑줄 표시 */}
        {!isReport && (
          <div className="absolute left-[24px] top-[124px] h-px w-[155px] bg-black" />
        )}
        {isReport && (
          <div className="absolute left-[182px] top-[124px] h-px w-[155px] bg-black" />
        )}

        {/* 뒤로가기 + 타이틀 */}
        <div className="absolute left-[19px] top-[160px]">
          <Button
            variant="ghost"
            size="icon"
            className="h-[25px] w-[25px] p-0"
            asChild
          >
            <Link to="/">
              <ArrowLeft className="h-[18px] w-[18px]" />
            </Link>
          </Button>
        </div>
        <div className="absolute left-1/2 top-[158px] -translate-x-1/2 flex items-center">
          <div className="whitespace-nowrap text-[20px]/[1.19] font-bold text-black">
            {questionTitle}
          </div>
          <HoverCard openDelay={100} closeDelay={100}>
            <HoverCardTrigger asChild>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="ml-[4px] h-[24px] px-2 text-[14px]"
                aria-label="문제 정보 버튼"
              >
                ?
              </Button>
            </HoverCardTrigger>
            <HoverCardContent
              side="bottom"
              align="center"
              className="w-auto max-w-[312px] rounded-[10px] border border-black bg-white p-4 shadow relative before:content-[''] before:absolute before:-top-[6px] before:left-[calc(50%-2cm+4px-2mm)] before:-translate-x-1/2 before:transform before:h-3 before:w-3 before:rotate-45 before:bg-white before:border-l before:border-t before:border-black"
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

        {/* 상단 보조: 물음표 표시 (제목 옆에 인라인 배치) */}

        <div className="absolute left-[26px] top-[193px] h-[2px] w-[315px] bg-black" />

        {/* manage/report 전환: report일 때 문제 카드 표시, manage일 때 플레이스홀더 */}
        {isReport ? (
          <div className="absolute left-[26px] top-[207px] w-[315px] rounded-[10px] bg-[#FAF3FF] p-4">
            <div className="whitespace-pre-line text-[15px] leading-[2] text-black">
              {problemText}
            </div>
          </div>
        ) : (
          <div className="absolute left-[26px] top-[207px] flex w-[315px] justify-center rounded-[10px] border py-16">
            <div className="text-center text-sm text-[#666]">
              시험 관리 화면 구성 표시 영역
            </div>
          </div>
        )}

        {/* 정답/내 정답 (동일 값 표시) */}
        <div className="absolute left-[24px] top-[449px] text-[20px]/[1.19] font-bold text-black">
          정답
        </div>
        <div className="absolute left-[68px] top-[486px] text-[25px]/[1.19] font-light text-[#4E4D4D]">
          {correctChoice}
        </div>

        <div className="absolute left-[24px] top-[490px] text-[18px]/[1.19] font-medium text-[#4E4D4D]">
          정답
        </div>
        <div className="absolute left-[132px] top-[490px] text-[18px]/[1.19] font-medium text-[#155DFC]">
          내 정답
        </div>
        <div className="absolute left-[194px] top-[486px] text-[25px]/[1.19] font-light text-[#155DFC]">
          {correctChoice}
        </div>

        {/* 섹션 리스트 (토글) */}
        <div className="absolute left-[24px] top-[calc(526px-2cm)] w-[316px]">
          <div className="h-px w-full bg-[#D7D7D7] mt-[1cm]" />
          <SectionToggle
            label="해설"
            isOpen={openMap["해설"]}
            onToggle={() => toggleSection("해설")}
          >
            <div className="px-1 pb-4 pt-2 text-[14px] leading-relaxed text-[#4E4D4D]">
              이 문항의 정답 도출 과정 및 핵심 포인트 요약 표시 영역
            </div>
          </SectionToggle>
          <div className="h-px w-full bg-[#D7D7D7] mt-[1cm]" />
          <SectionToggle
            label="이론"
            isOpen={openMap["이론"]}
            onToggle={() => toggleSection("이론")}
          >
            <div className="px-1 pb-4 pt-2 text-[14px] leading-relaxed text-[#4E4D4D]">
              관련 개념/정의/공식 요약 표시 영역
            </div>
          </SectionToggle>
          <div className="h-px w-full bg-[#D7D7D7] mt-[1cm]" />
          <SectionToggle
            label="유사 문제 추천"
            isOpen={openMap["유사 문제 추천"]}
            onToggle={() => toggleSection("유사 문제 추천")}
          >
            <div className="px-1 pb-4 pt-2 text-[14px] leading-relaxed text-[#4E4D4D]">
              난이도/유형이 유사한 문제 리스트 표시 영역
            </div>
          </SectionToggle>
        </div>

        {/* 우하단 챗봇 버튼 → 시트 열기 */}
        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="챗봇 열기"
              className={cn(
                "absolute right-[22px] top-[719px] h-[59px] w-[59px] rounded-full",
                "bg-gradient-to-b from-[#C667F0] to-[#A445EB] shadow-[1px_2px_4px_rgba(0,0,0,0.4)]",
              )}
            >
              <img
                src="/figma-assets/mobile-fab.png"
                alt="챗봇"
                className="absolute left-[4px] top-[4px] h-[52px] w-[52px] rounded-full object-cover"
              />
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[65%] rounded-t-xl p-0">
            <SheetHeader className="p-4">
              <SheetTitle>AI 챗봇</SheetTitle>
            </SheetHeader>
            <div className="flex h-[calc(100%-112px)] flex-col">
              <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-2">
                <div className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                  무엇을 도와드릴까요?
                </div>
              </div>
              <div className="border-t p-3">
                <form
                  className="flex items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <Input
                    placeholder="메시지 입력"
                    aria-label="메시지 입력"
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" aria-label="전송">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

type SectionToggleProps = {
  /** 라벨 텍스트 */
  label: string;
  /** 열림 여부 */
  isOpen: boolean;
  /** 토글 핸들러 */
  onToggle: () => void;
  /** 펼침 콘텐츠 */
  children: React.ReactNode;
};

/**
 * 섹션 토글 행
 * @description 라벨 + 아래 화살표 버튼, 클릭 시 하단 콘텐츠 토글
 */
function SectionToggle({
  label,
  isOpen,
  onToggle,
  children,
}: SectionToggleProps) {
  return (
    <div className="w-full">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex w-full items-center justify-between py-3"
      >
        <div className="text-[20px]/[1.19] font-bold text-black">{label}</div>
        <div
          className={cn(
            "flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#EDEDED]",
          )}
        >
          <ChevronDown
            className={cn(
              "h-[14px] w-[14px] text-[#1C1C1E] transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </button>
      {isOpen && children}
    </div>
  );
}

export const Route = createFileRoute("/main/report/mobile/objective-correct/")({
  component: MobileObjectiveCorrect,
});
