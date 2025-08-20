import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatbotFab } from "@/components/chat/ChatbotFab";

export const Route = createFileRoute("/main/report/mobile/")({
  component: MobileReport,
});


type MobileReportProps = Record<string, never>;

/**
 * 모바일 리포트 요약 화면
 * @description Figma "모바일" 프레임(시험 점수 탭 + 카드 3개) 구현
 *
 * 주요 구성:
 * - 상단: 이름/반 배지, 상위 섹션/타이틀, 탭(시험 점수/오답 노트)
 * - 본문: 요약 카드 3개 (제목, 정답률, 진행 바, 수치)
 */
function MobileReport(_props: MobileReportProps) {
  const [activeSection, setActiveSection] = React.useState<"manage" | "report">(
    "report",
  );
  const isReport = activeSection === "report";
  return (
    <div className="flex w-full justify-center p-6">
      {/* 모바일 프레임 (360 x 780) */}
      <div
        className="relative h-[780px] w-[360px] rounded-md bg-white"
        style={{ transform: "translateX(-1cm)" }}
      >
        {/* 개발용 이동 버튼: 주관식 오답 */}
        <div className="absolute right-2 bottom-2 z-10">
          <Button size="sm" variant="outline" asChild>
            <Link to="/main/report/mobile/subjective-wrong">
              주관식 오답 열기
            </Link>
          </Button>
        </div>

        {/* 상단 섹션/타이틀 (버튼) */}
        <button
          type="button"
          aria-pressed={!isReport}
          onClick={() => setActiveSection("manage")}
          className={cn(
            "absolute left-[65px] top-[90px] text-[20px]/[1.19] whitespace-nowrap",
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
            "absolute left-[207px] top-[90px] text-[20px]/[1.19] whitespace-nowrap",
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
          <div className="absolute left-[182.26px] top-[123.63px] h-px w-[154.67px] bg-black" />
        )}

        {/* 리포트 탭 (리포트 섹션에서만 표시) */}
        {isReport && (
          <>
            <div className="absolute left-[70.6px] top-[161.98px] text-[20px]/[1.19] font-bold text-black">
              시험 점수
            </div>
            <div className="absolute left-[210.37px] top-[161.98px] text-[20px]/[1.19] font-medium text-[#9F9F9F]">
              오답 노트
            </div>
            <div className="absolute left-[39.32px] top-[196.65px] h-px w-[282.69px] bg-[#EBEBEB]" />
            <div className="absolute left-[39.32px] top-[195.98px] h-px w-[141.57px] bg-black" />
          </>
        )}

        {/* 메인 캔버스 사각형 (양쪽 24px 여백 정렬) */}
        <div
          className={cn(
            "absolute left-[24px] top-[149.73px] h-[591.76px] w-[312px] rounded-[10px] bg-white",
            "shadow-[0_1px_6px_rgba(0,0,0,0.25)]",
          )}
        />

        {isReport ? (
          <>
            {/* 카드 1 */}
            <SummaryCard
              className="absolute left-[39.32px] top-[225.26px]"
              title="가나다 시험"
              correct={12}
              wrong={8}
            />

            {/* 카드 2 */}
            <SummaryCard
              className="absolute left-[39.32px] top-[366.47px]"
              title="가나다 시험"
              correct={12}
              wrong={8}
            />

            {/* 카드 3 */}
            <SummaryCard
              className="absolute left-[39.32px] top-[507.69px]"
              title="가나다 시험"
              correct={12}
              wrong={8}
            />
          </>
        ) : (
          <div className="absolute left-[24px] top-[149.73px] flex h-[591.76px] w-[312px] items-center justify-center rounded-[10px]">
            <div className="text-center">
              <div className="text-[18px] font-bold text-black">시험 관리</div>
              <div className="mt-2 text-[14px] text-[#666]">
                이 영역에서 관리 화면 구성이 표시됨
              </div>
            </div>
          </div>
        )}

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

type SummaryCardProps = {
  /** 카드 제목 */
  title: string;
  /** 정답 수 */
  correct: number;
  /** 오답 수 */
  wrong: number;
  /** 외부 위치 지정 클래스 */
  className?: string;
};

/**
 * 요약 카드 (정답률, 진행 바, 수치)
 * @description Figma 그룹(제목, 정답률, 12/8 수치, 총 N문항, 진행 바, 우측 아이콘) 반영
 */
function SummaryCard({ title, correct, wrong, className }: SummaryCardProps) {
  const total = correct + wrong;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className={cn("w-[282.15px]", className)}>
      {/* 내용 그룹 */}
      <div className="relative h-[101.51px] w-[281.47px]">
        {/* 제목 */}
        <div className="absolute left-0 top-0 text-[20px]/[1.19] font-bold text-black">
          {title}
        </div>
        {/* 정답률 */}
        <div className="absolute left-0 top-[69.47px] text-[15px]/[1.19] font-medium text-[#999999]">
          정답률 {accuracy}%
        </div>

        {/* 수치: 정답/오답/총 문항 */}
        <div className="absolute left-[19.5px] top-[30.78px] text-[20px]/[1.19] font-bold text-[#155DFC]">
          {correct}
        </div>
        <div className="absolute left-[82.31px] top-[31.64px] text-[20px]/[1.19] font-bold text-[#FF6A71]">
          {wrong}
        </div>
        <div className="absolute left-[119.54px] top-[34.1px] text-[15px]/[1.19] font-normal text-[#999999]">
          총 {total}문항
        </div>

        {/* 좌측 원형 (장식) */}
        <div className="absolute left-0 top-[34.92px] h-[15.72px] w-[15.72px] rounded-full border-[3px] border-[#155DFC]" />

        {/* 우측 아이콘 대체 */}
        <div className="absolute right-0 top-0 h-[25px] w-[25px] rounded-[10px]">
          <div className="absolute left-[9.38px] top-[5.21px] h-[14.58px] w-[6.25px] rounded bg-[#1C1C1E]" />
        </div>

        {/* 진행 바 (하단) */}
        <div className="absolute left-0 top-[94.25px] h-[7.26px] w-[265.85px] rounded bg-[#FF6A71]" />
        <div
          className="absolute left-0 top-[94.25px] h-[7.26px] rounded bg-[#155DFC]"
          style={{
            width: `${total > 0 ? Math.round((correct / total) * 265.85) : 0}px`,
          }}
        />
      </div>

      {/* 하단 구분선 */}
      <div className="h-px w-[276.88px] bg-[#D7D7D7]" />
    </div>
  );
}

