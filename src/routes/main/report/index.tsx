import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Latex } from "@/components/math/Latex";
import { ChatbotFab } from "@/components/chat/ChatbotFab";

/**
 * 리포트 문제 상세 페이지 라우트
 * @description Figma "모바일" 프레임(노출 텍스트/레이아웃 값 기반) 정밀 재현
 */
export const Route = createFileRoute("/main/report/")({
  component: ReportProblemDetailMobile,
});

/**
 * 리포트 문제 상세 페이지 컴포넌트
 * @description 제목, 문제 카드, 정답/내 정답, 토글 섹션, 플로팅 버튼 구성
 */
function ReportProblemDetailMobile() {
  const [activeSection, setActiveSection] = React.useState<"manage" | "report">(
    "report",
  );
  const isReport = activeSection === "report";

  const questionTitle = "가다나 시험 8번";
  // const problemTitle = "문제 4\n(3x-4)(x+6)를 전개하시오.";
  const solutionSteps =
    "(3x−4)(x+6)\n3x × x = 3x²\n3x × 6 = 18x\n-4 × x = -4x\n-4 × 6 = -24\n3x² + 18x -4x -24\n3x² + 14x -24";
  const answerExpr = "3x² + 14x -24";

  /** 텍스트 수식 간단 변환 함수: LaTeX 호환 문자열 변환 */
  const toLatex = React.useCallback((expr: string) => {
    return expr
      .replaceAll("×", " \\times ")
      .replaceAll("−", "-")
      .replaceAll("²", "^{2}")
      .replaceAll("³", "^{3}");
  }, []);

  const [openMap, setOpenMap] = React.useState<Record<string, boolean>>({
    해설: false,
    이론: false,
    "유사 문제 추천": false,
  });

  const toggleSection = (label: string) => {
    setOpenMap((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="flex w-full justify-center p-6">
      {/* 모바일 프레임 (360 x 978) */}
      <div className="relative h-[978px] w-[360px] rounded-md bg-white">
        {/* 상단 이름/배지 + 우측 아이콘 영역은 상위 레이아웃에서 처리됨 */}

        {/* 상단 섹션/타이틀 (버튼) */}
        <button
          type="button"
          aria-pressed={!isReport}
          onClick={() => setActiveSection("manage")}
          className={cn(
            "absolute left-[65.22px] top-[90.45px] text-[20px]/[1.19]",
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
            "absolute left-[206.76px] top-[90.45px] text-[20px]/[1.19]",
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
            <div className="text-[20px]/[1.19] font-bold text-black">
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
                className="w-auto max-w-[312px] rounded-[10px] border border-black bg-white p-4 shadow relative before:content-[''] before:absolute before:-top-[6px] before:left-[calc(50%+1cm+6px-2mm)] before:-translate-x-1/2 before:transform before:h-3 before:w-3 before:rotate-45 before:bg-white before:border-l before:border-t before:border-black"
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
        <div className="absolute left-[25.51px] top-[193.46px] h-[2px] w-[314.59px] bg-black" />

        {/* 문제 카드 */}
        {isReport ? (
          <div className="absolute left-[25.51px] top-[207.36px] w-[314.59px] rounded-[10px] bg-[#FAF3FF] p-4">
            <div className="mb-2 text-[15px]/[2] font-medium text-black whitespace-pre-line">
              <Latex source={toLatex("(3x-4)(x+6) = ?")} displayMode="block" />
            </div>
          </div>
        ) : (
          <div className="absolute left-[25.51px] top-[207.36px] flex w-[314.59px] items-center justify-center rounded-[10px] border py-16">
            <div className="text-sm text-[#666]">
              시험 관리 화면 구성 표시 영역
            </div>
          </div>
        )}

        {/* 섹션 구분선 (회색) */}
        <div className="absolute left-[23.7px] top-[400.49px] h-px w-[312.59px] bg-[#D7D7D7]" />

        {/* 정답/내 정답 타이틀 */}
        <div className="absolute left-[23.7px] top-[364.03px] text-[18px]/[1.19] font-medium text-[#4E4D4D]">
          정답
        </div>
        <div className="absolute left-[178.13px] top-[364.03px] text-[18px]/[1.19] font-medium text-[#155DFC]">
          내 정답
        </div>

        {/* 정답/내 정답 수식 */}
        <div className="absolute left-[67.9px] top-[360.03px] whitespace-nowrap text-[15px]/[2] font-medium text-[#4E4D4D]">
          <Latex source={toLatex(answerExpr)} displayMode="inline" />
        </div>
        <div className="absolute right-[25.51px] top-[360.03px] whitespace-nowrap text-[15px]/[2] font-medium text-[#155DFC]">
          <Latex source={toLatex(answerExpr)} displayMode="inline" />
        </div>

        {/* 문제 본문 풀이 영역 */}
        <div className="absolute left-[25.51px] top-[456.77px] w-[120px] whitespace-pre-line text-[15px]/[2] font-medium text-black">
          {solutionSteps}
        </div>

        {/* 하단 섹션 그룹: 해설 / 이론 / 유사 문제 추천 */}
        <div className="absolute left-[23.7px] top-[calc(684.08px-2cm)] h-px w-[312.59px] bg-[#D7D7D7]" />

        <div className="absolute left-[23.7px] top-[calc(708.46px+1cm)] w-[316.4px]">
          <SectionRow
            label="해설"
            isOpen={openMap["해설"]}
            onToggle={() => toggleSection("해설")}
          >
            <div className="px-1 pb-4 pt-2 text-[14px] leading-relaxed text-[#4E4D4D]">
              풀이 요약 표시 영역
            </div>
          </SectionRow>
          <div className="h-px w-full bg-[#D7D7D7]" />
        </div>

        <div className="absolute left-[23.7px] top-[calc(773.43px+1cm)] w-[316.4px]">
          <SectionRow
            label="이론"
            isOpen={openMap["이론"]}
            onToggle={() => toggleSection("이론")}
          >
            <div className="px-1 pb-4 pt-2 text-[14px] leading-relaxed text-[#4E4D4D]">
              관련 개념 요약 표시 영역
            </div>
          </SectionRow>
          <div className="h-px w-full bg-[#D7D7D7]" />
        </div>

        <div className="absolute left-[23.7px] top-[calc(838.39px+1cm)] w-[316.4px]">
          <SectionRow
            label="유사 문제 추천"
            isOpen={openMap["유사 문제 추천"]}
            onToggle={() => toggleSection("유사 문제 추천")}
          >
            <div className="px-1 pb-4 pt-2 text-[14px] leading-relaxed text-[#4E4D4D]">
              유사 유형 문제 리스트 표시 영역
            </div>
          </SectionRow>
        </div>

        {/* 우측 하단 고정 버튼식 챗봇 (프레임 내부 우하단 24px 여백) */}
        <ChatbotFab
          mode="fixed-button"
          position="absolute"
          label="챗봇"
          className="bottom-[24px] right-[24px]"
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
  /** 펼침 콘텐츠 */
  children: React.ReactNode;
};

/**
 * 섹션 행 컴포넌트
 * @description 라벨 + 우측 원형 버튼 + 토글 영역 렌더링
 */
function SectionRow({ label, isOpen, onToggle, children }: SectionRowProps) {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between py-3">
        <div className="text-[20px]/[1.19] font-bold text-black">{label}</div>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          aria-label={`${label} 토글`}
          aria-expanded={isOpen}
          onClick={onToggle}
          className="h-[24px] w-[24px] rounded-full p-0"
       >
          <ChevronDown
            className={cn(
              "h-[13px] w-[13px] text-[#1C1C1E] transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </Button>
      </div>
      {isOpen && children}
    </div>
  );
}
