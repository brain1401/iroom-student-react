import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Latex } from "@/components/math/Latex";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";


type MobileAllOpenProps = Record<string, never>;

/**
 * 모바일 상세 리포트 모두 펼침 화면
 * @description Figma "모바일" 프레임(해설/이론/유사 문제 추천 모두 펼침 상태) 정밀 구현
 *
 * 주요 구성:
 * - 상단 사용자 영역: 이름, 반 배지, 우측 유틸 아이콘(알림 뱃지 포함)
 * - 상단 섹션 토글: 시험 관리 / 성적 · 리포트, 우측 기준선 정렬
 * - 문제 타이틀 영역: 뒤로가기, 제목, 물음표 원형 아이콘, 상단 구분선
 * - 본문: 문제 카드(연보라 배경), 정답/내 정답 표기, 구분선
 * - 해설, 이론, 유사 문제 추천: 모두 펼침 콘텐츠
 * - 우하단: 그라데이션 원형 플로팅 버튼(시트)
 */
function MobileAllOpen(_props: MobileAllOpenProps) {
  const [activeSection, setActiveSection] = React.useState<"manage" | "report">(
    "report",
  );
  const isReport = activeSection === "report";
  const questionTitle = "가다나 시험 4번";
  // const problemText =
  //   "문제 4\n(2x + 3)(x - 5)의 전개식으로 알맞은 것은?\n ① 2x² + 7x - 15\n ② 2x² - 7x - 15\n ③ 2x² + 10x - 15\n ④ 2x² - 10x + 15";
  const correctChoice = "②";
  const myChoice = "③";

  /** 수식 문자열 LaTeX 변환 함수 */
  const toLatex = (expr: string) =>
    expr
      .replaceAll("×", " \\times ")
      .replaceAll("−", "-")
      .replaceAll("²", "^{2}")
      .replaceAll("³", "^{3}");

  return (
    <div className="w-full flex justify-center">
      {/* 모바일 프레임 (스마트폰 360px 고정 폭) */}
      <div className="relative h-[1820px] w-[360px] bg-white">


        {/* 상단 섹션/타이틀 (Tabs) */}
        <Tabs
          value={activeSection}
          onValueChange={(v) => setActiveSection(v as "manage" | "report")}
        >
          <TabsList className="absolute left-0 right-0 bg-transparent p-0 h-auto">
            <TabsTrigger
              value="manage"
              className={cn(
                "absolute left-[65.17px] top-[90.16px] h-auto border-none bg-transparent px-0 py-0",
                "text-[20px]/[1.19] whitespace-nowrap",
                "data-[state=active]:font-bold data-[state=active]:text-black",
                "data-[state=inactive]:font-medium data-[state=inactive]:text-[#999999]",
              )}
            >
              시험 관리
            </TabsTrigger>
            <TabsTrigger
              value="report"
              className={cn(
                "absolute left-[206.71px] top-[90.16px] h-auto border-none bg-transparent px-0 py-0",
                "text-[20px]/[1.19] whitespace-nowrap",
                "data-[state=active]:font-bold data-[state=active]:text-black",
                "data-[state=inactive]:font-medium data-[state=inactive]:text-[#999999]",
              )}
            >
              성적 / 리포트
            </TabsTrigger>
            {/* 기준선: 활성 탭만 밑줄 표시 */}
            {activeSection !== "report" && (
              <div className="absolute left-[24px] top-[123.34px] h-px w-[154.67px] bg-black" />
            )}
            {activeSection === "report" && (
              <div className="absolute left-[182.24px] top-[123.34px] h-px w-[154.67px] bg-black" />
            )}
          </TabsList>
        </Tabs>

        <Tabs
          value={activeSection}
          onValueChange={(v) => setActiveSection(v as "manage" | "report")}
        >
          <TabsContent value="report" className="p-0">

            {/* 뒤로가기 + 타이틀 + 물음표 (리포트일 때만 표시) */}
            <div className="absolute left-[19.33px] top-[159.72px]">
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
            <div className="absolute left-1/2 top-[158.05px] -translate-x-1/2 flex items-center">
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
                  sideOffset={8}
                  collisionPadding={16}
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

            {/* 상단 검은 선 */}
            <div className="absolute left-[24px] right-[24px] top-[193.17px] h-px bg-black" />

            {/* 문제 카드 */}
            <div
              className={cn(
                "absolute left-[24px] right-[24px] top-[207.06px] h-[216.16px] rounded-[10px] bg-[#FAF3FF]",
              )}
            >
              <div
                className="absolute left-[39.49px] top-[222.03px] text-[15px] leading-[2] text-black"
                style={{ left: 14, top: 15 }}
              >
                <div className="flex items-baseline gap-2 whitespace-nowrap">
                  <span>문제 4</span>
                  <span>
                    <Latex source={toLatex("(2x + 3)(x - 5) = ?")} displayMode="inline" />
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span>①</span>
                    <Latex source={toLatex("2x^{2} + 7x - 15")} displayMode="inline" />
                  </div>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span>②</span>
                    <Latex source={toLatex("2x^{2} - 7x - 15")} displayMode="inline" />
                  </div>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span>③</span>
                    <Latex source={toLatex("2x^{2} + 10x - 15")} displayMode="inline" />
                  </div>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span>④</span>
                    <Latex source={toLatex("2x^{2} - 10x + 15")} displayMode="inline" />
                  </div>
                </div>
              </div>
            </div>

            {/* 정답/내 정답 */}
            <div className="absolute left-[23.67px] top-[448.23px] text-[20px]/[1.19] font-bold text-black">
              정답
            </div>
            <div className="absolute left-[67.87px] top-[485.54px] text-[25px]/[1.19] font-light text-[#4E4D4D]">
              {correctChoice}
            </div>

            <div className="absolute left-[23.67px] top-[489.54px] text-[18px]/[1.19] font-medium text-[#4E4D4D]">
              정답
            </div>
            <div className="absolute left-[131.64px] top-[489.54px] text-[18px]/[1.19] font-medium text-[#FF6A71]">
              내 정답
            </div>
            <div className="absolute left-[194.03px] top-[485.54px] text-[25px]/[1.19] font-light text-[#FF6A71]">
              {myChoice}
            </div>

            <div className="absolute left-[24px] right-[24px] top-[526px] h-px bg-[#D7D7D7]" />

            {/* 해설 제목 + 우측 아이콘 */}
            <div className="absolute left-[23.67px] top-[540.55px] text-[20px]/[1.19] font-bold text-black">
              해설
            </div>
            <div className="absolute left-[318.33px] top-[541.68px] flex h-[21.75px] w-[21.75px] items-center justify-center rounded-full bg-[#EDEDED]">
              <ChevronDown className="h-[13px] w-[13px] text-[#1C1C1E]" />
            </div>
            <div className="absolute left-[23.67px] top-[577.86px] w-[314.16px] text-black overflow-x-auto pr-1 text-left">
              <Latex
                className="text-[14px]"
                displayMode="block"
                source={`\begin{aligned}
                          (2x + 3)(x - 5) &= 2x \\times x \\\ 
                          &{}+ 2x \\times (-5) \\\ 
                          &{}+ 3 \\times x \\\ 
                          &{}+ 3 \\times (-5) \\\ 
                          &= 2x^{2} - 10x + 3x - 15 \\\ 
                          &= 2x^{2} - 7x - 15
                          \end{aligned}`}
              />
            </div>

            {/* 구분선 */}
            <div className="absolute left-[24px] right-[24px] top-[calc(849.75px+1cm)] h-px bg-[#D7D7D7]" />

            {/* 이론 제목 + 우측 아이콘 */}
            <div className="absolute left-[23.67px] top-[calc(886.76px+1cm)] text-[20px]/[1.19] font-bold text-black">
              이론
            </div>
            <div className="absolute left-[318.33px] top-[887.89px] flex h-[21.75px] w-[21.75px] items-center justify-center rounded-full bg-[#EDEDED]">
              <ChevronDown className="h-[13px] w-[13px] text-[#1C1C1E]" />
            </div>
            <div className="absolute left-[23.67px] top-[926.5px] w-[314.16px] whitespace-pre-wrap text-[15px] leading-[2] text-black">
              {
                "다항식의 곱셈\n정의: 두 다항식의 곱은 각 항끼리 곱한 뒤 같은 항끼리 더하거나 뺀다.\n절차:\n분배법칙 적용\n각 항의 곱 구하기\n동류항끼리 정리\n주의: 부호 규칙(+, −) 반드시 확인\n자주 쓰는 공식\n(a + b)(a - b) = a² - b²\n(a + b)² = a² + 2ab + b²"
              }
            </div>

            {/* 구분선 */}
            <div className="absolute left-[24px] right-[24px] top-[calc(1272.13px+1cm)] h-px bg-[#D7D7D7]" />

            {/* 유사 문제 추천 제목 + 우측 아이콘 */}
            <div className="absolute left-[23.67px] top-[calc(1309.15px+1cm)] text-[20px]/[1.19] font-bold text-black">
              유사 문제 추천
            </div>
            <div className="absolute left-[318.33px] top-[1310.27px] flex h-[21.75px] w-[21.75px] items-center justify-center rounded-full bg-[#EDEDED]">
              <ChevronDown className="h-[13px] w-[13px] text-[#1C1C1E]" />
            </div>

            {/* 추천 카드 1 */}
            <div
              className={cn(
                "absolute left-[24px] right-[24px] top-[1359.28px] rounded bg-white shadow-[0_1px_6px_rgba(0,0,0,0.25)] p-3",
              )}
            >
              <div className="text-[13px]/[1.19] font-bold text-black flex items-baseline gap-2 whitespace-nowrap overflow-hidden text-ellipsis py-0.5">

                <Latex source={toLatex("(x + 4)(x - 6)")} className=" text-center w-[6rem]" displayMode="inline" />

                <div className="flex-1">의 전개식</div>
              </div>
              <div className="mt-1 flex items-center justify-between gap-2">
                <div className="text-[11px]/[1.19] text-black">
                  유형 : 계산<span className="ml-3">난이도 : 하</span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  className={cn(
                    "h-7 rounded-[5px] px-3 py-1 text-[13px]/[1.19] font-medium text-white",
                    "bg-[#9810FA] hover:bg-[#7d0ccf]",
                  )}
                >
                  풀기
                </Button>
              </div>
              <div className="sr-only">카드 1</div>
            </div>

            {/* 추천 카드 2 */}
            <div
              className={cn(
                "absolute left-[24px] right-[24px] top-[1454.46px] rounded bg-white shadow-[0_1px_6px_rgba(0,0,0,0.25)] p-3",
              )}
            >
              <div className="text-[13px]/[1.19] font-bold text-black flex items-baseline gap-2 whitespace-nowrap overflow-hidden text-ellipsis py-0.5">
                <span className="inline-flex items-baseline">
                  <Latex source={toLatex("(x + 4)(x - 6)")} displayMode="inline" />
                </span>
                <span>의 전개식</span>
              </div>
              <div className="mt-1 flex items-center justify-between gap-2">
                <div className="text-[11px]/[1.19] text-black">
                  유형 : 계산<span className="ml-3">난이도 : 하</span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  className={cn(
                    "h-7 rounded-[5px] px-3 py-1 text-[13px]/[1.19] font-medium text-white",
                    "bg-[#9810FA] hover:bg-[#7d0ccf]",
                  )}
                >
                  풀기
                </Button>
              </div>
              <div className="sr-only">카드 2</div>
            </div>

            {/* 추천 카드 3 */}
            <div
              className={cn(
                "absolute left-[24px] right-[24px] top-[1549.64px] rounded bg-white shadow-[0_1px_6px_rgba(0,0,0,0.25)] p-3",
              )}
            >
              <div className="text-[13px]/[1.19] font-bold text-black flex items-baseline gap-2 whitespace-nowrap overflow-hidden text-ellipsis py-0.5">
                <div className="">
                  <Latex source={toLatex("(x + 4)(x - 6)")} displayMode="inline" />
                </div>
                <span>의 전개식</span>
              </div>
              <div className="mt-1 flex items-center justify-between gap-2">
                <div className="text-[11px]/[1.19] text-black">
                  유형 : 계산<span className="ml-3">난이도 : 하</span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  className={cn(
                    "h-7 rounded-[5px] px-3 py-1 text-[13px]/[1.19] font-medium text-white",
                    "bg-[#9810FA] hover:bg-[#7d0ccf]",
                  )}
                >
                  풀기
                </Button>
              </div>
              <div className="sr-only">카드 3</div>
            </div>

            {/* 그라데이션 원형 플로팅 버튼 → 시트 */}
            {isReport && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    aria-label="챗봇 열기"
                    className={cn(
                      "absolute right-[20.93px] top-[1724.82px] h-[59.12px] w-[59.12px] rounded-full",
                      "bg-gradient-to-b from-[#C667F0] to-[#A445EB] shadow-[1px_2px_4px_rgba(0,0,0,0.4)]",
                    )}
                  >
                    <img
                      src="/figma/mobile-fab.png"
                      alt="챗봇"
                      className="absolute left-[4px] top-[4px] h-[52px] w-[52px] rounded-full object-cover"
                    />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[65%] rounded-t-xl p-0">
                  {/* 상단 퍼플 바 */}
                  <div className="relative h-[53.24px] w-full bg-[#AB4CEC] shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
                    <div className="absolute left-[123.01px] top-[17.62px] text-[18px]/[1] font-medium text-white">
                      이룸클래스 챗봇
                    </div>
                    <SheetClose asChild>
                      <Button type="button" className="absolute right-[19.24px] top-[19.12px] text-[15px]/[1] text-white">
                        접기
                      </Button>
                    </SheetClose>
                  </div>

                  {/* 메시지 영역 */}
                  <div className="flex h-[calc(100%-120px)] flex-col overflow-y-auto px-4 py-4">
                    <div className="mb-2 flex items-center gap-4">
                      <div className="flex items-center gap-1 text-[#5F5F5F]">
                        <div className="h-[9.28px] w-[11.37px] bg-[#5F5F5F]" />
                        <div className="text-[12px]">AI</div>
                      </div>
                      <div className="flex items-center gap-1 text-[#5F5F5F]">
                        <div className="h-[19.74px] w-[19.74px] rounded-full bg-gradient-to-b from-[#6392FF] to-[#427BFF]" />
                        <div className="text-[12px]">체리</div>
                      </div>
                    </div>
                    <div className="self-end max-w-[80%] rounded-2xl bg-[#F0F0F0] px-3 py-2 text-sm text-black">
                      저는 2x × -5에서 -10x 말고 +10x로 계산했어요. 왜 틀린 거죠?
                    </div>
                    <div className="mt-3 max-w-[85%] self-start rounded-2xl bg-[#F7F7F7] px-3 py-2 text-sm text-black whitespace-pre-wrap">
                      2 × -5는 양수 × 음수이기 때문에 부호가 음수가 됩니다.
                      <br />
                      곱셈 부호 규칙: (+) × (+) = (+), (+) × (-) = (-), (-) × (+) = (-), (-) × (-) = (+)
                      <br />
                      그래서 2x × (-5)는 -10x가 맞습니다.
                    </div>
                  </div>

                  {/* 하단 입력 바 */}
                  <div className="relative h-[67.57px] w-full">
                    <div className="absolute left-0 top-0 h-[67.57px] w-full bg-[#AB4CEC] shadow-[0_1px_6px_rgba(0,0,0,0.25)]" />

                    <div className="absolute left-[70.44px] top-[15.63px] h-[46px] w-[268.14px]">
                      <div className="absolute inset-0 rounded-[38.62px] bg-white shadow-[0_1px_6px_rgba(0,0,0,0.25)]" />
                      <input
                        className="absolute left-[18.84px] top-[9.42px] h-[30px] w-[235.35px] bg-transparent text-[15px] outline-none placeholder:text-[#777777]"
                        placeholder="AI에게 질문하기..."
                        aria-label="메시지 입력"
                      />
                    </div>
                    <Button
                      type="button"
                      className="absolute left-[271px] top-[20.16px] h-[36.94px] w-[60.09px] rounded-[38.62px] bg-[#AB4CEC] text-[13px]/[2.31] font-medium text-white shadow-[0_1px_6px_rgba(0,0,0,0.25)]"
                      aria-label="전송"
                    >
                      전송
                    </Button>
                    <img
                      src="/figma/mobile-fab.png"
                      alt="avatar"
                      className="absolute left-0 top-0 h-[67.57px] w-[67.57px] object-cover"
                    />
                  </div>
                </SheetContent>
              </Sheet>
            )}

          </TabsContent>
          <TabsContent value="manage" className="p-0">
            <div className="absolute left-[24px] top-[149.73px] flex h-[591.76px] w-[312px] items-center justify-center rounded-[10px]">
              <div className="text-center">
                <div className="text-[18px] font-bold text-black">시험 관리</div>
                <div className="mt-2 text-[14px] text-[#666]">이 영역에서 관리 화면 구성이 표시됨</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/main/report/mobile/all-display/")({
  component: MobileAllOpen,
});
