import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { BiBell } from "react-icons/bi";
import { VscAccount } from "react-icons/vsc";
import { RxHamburgerMenu } from "react-icons/rx";
import { RiHome5Line } from "react-icons/ri";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

/**
 * 사용자 프로필 헤더 컴포넌트
 * @description 사용자 이름, 반 배지, 알림 버튼을 포함하는 상단 헤더 UI
 *
 * 구성 요소:
 * - 왼쪽: 사용자 이름(대형 타이포) + 반 배지
 * - 오른쪽: 알림(Bell) 아이콘 버튼
 */
export type UserProfileHeaderProps = {
  /** 사용자 이름 텍스트 */
  name: string;
  /** 사용자 반/그룹 배지 라벨 텍스트 */
  badgeLabel: string;
  /** 추가 클래스 */
  className?: string;
  /** 알림 버튼 클릭 핸들러 */
  onClickBell?: () => void;
};

export function UserProfileHeader({
  name,
  badgeLabel,
  className,
}: UserProfileHeaderProps) {
  /**
   * 슬라이드 패널 열림 상태 관리
   * @description 햄버거 패널 제스처 닫기 지원을 위해 제어형 상태 사용
   */
  const [menuOpen, setMenuOpen] = useState(false);

  /**
   * 터치 스와이프 제스처 상태
   * @description 오른쪽으로 스와이프 시 패널 닫기 처리
   */
  const touchStartXRef = useRef<number | null>(null);
  const touchCurrentXRef = useRef<number | null>(null);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchCurrentXRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchCurrentXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const startX = touchStartXRef.current;
    const currentX = touchCurrentXRef.current;
    if (startX != null && currentX != null) {
      const deltaX = currentX - startX;
      // 임계값 초과 시 닫기 (오른쪽으로 스와이프)
      if (deltaX > 50) {
        setMenuOpen(false);
      }
    }
    touchStartXRef.current = null;
    touchCurrentXRef.current = null;
  };
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => window.location.href = "/main"}
          className="text-[30px] font-bold leading-[1.19] text-[#000] h-auto p-0 hover:bg-transparent"
        >
          {name}
        </Button>
        <span className="inline-flex items-center rounded-full border border-black px-3 py-1 text-[9px] leading-none text-black">
          {badgeLabel}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full size-[42px]"
          onClick={() => setNotificationOpen(true)}
        >
          <BiBell className="text-[#1C1C1E] size-[34px]" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full size-[42px]"
          onClick={() => {
            window.location.href = "/profile";
          }}
        >
          <VscAccount className="text-[#1C1C1E] size-[34px]" />
        </Button>
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full size-[42px]"
            >
              <RxHamburgerMenu className="text-[#1C1C1E] size-[34px]" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-white p-4"
            withinContainer
            disableOverlay={false}
            overlayClassName="bg-[rgba(0,0,0,0.8)]"
            container={
              typeof document !== "undefined"
                ? (document.getElementById(
                    "mobile-container",
                  ))
                : undefined
            }
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex items-end gap-2 mb-4">
              <div className="text-[30px] font-bold leading-[1.19] text-[#000]">
                {name}
              </div>
              <span className="inline-flex items-center rounded-full border border-black px-3 py-1 text-[9px] leading-none text-black">
                {badgeLabel}
              </span>
            </div>
            <div className="h-px -mx-4 bg-[#EBEBEB] mb-4" />
            <div className="flex flex-col gap-6">
              <button
                className="text-[25px] font-bold text-black text-left px-3 py-2 rounded-lg transition-colors duration-150 hover:bg-[#F5F5F5]"
                onClick={() => {
                  window.location.href = "/exam-management?tab=exam";
                  setMenuOpen(false);
                }}
              >
                시험 관리
              </button>
              <button
                className="text-[25px] font-bold text-black text-left px-3 py-2 rounded-lg transition-colors duration-150 hover:bg-[#F5F5F5]"
                onClick={() => {
                  window.location.href = "/exam-management?tab=grade";
                  setMenuOpen(false);
                }}
              >
                성적 / 리포트
              </button>
            </div>
          </SheetContent>
        </Sheet>
        <Dialog open={notificationOpen} onOpenChange={setNotificationOpen}>
          <DialogContent
            className="p-0 rounded-[10px] w-full max-w-[300px] overflow-x-hidden bg-white [&_[data-slot='dialog-close']_svg]:size-5"
            withinContainer
            overlayClassName="bg-transparent pointer-events-none"
            container={
              typeof document !== "undefined"
                ? (document.getElementById(
                    "mobile-container",
                  ))
                : undefined
            }
            showCloseButton={false}
            align="top"
            offsetTop={64}
          >

            <DialogHeader className="px-4 pt-4">
              <DialogTitle className="text-[20px] font-bold leading-[1.19] text-[#000] text-left">
                알림 목록
              </DialogTitle>
            </DialogHeader>

            <div className="mt-0 space-y-0 max-h-[80vh] overflow-y-auto overflow-x-hidden no-scrollbar ">
              {[
                {
                  date: "8월 14일",
                  text: "알림 내용입니다~ 알림 내용입니다~ 알림 내용입니다~\n알림 내용입니다~ 알림 내용입니다~ 알림 내용입니다~",
                  highlight: true,
                },
                {
                  date: "8월 14일",
                  text: "알림 내용입니다~ 알림 내용입니다~ 알림 내용입니다~\n알림 내용입니다~ 알림 내용입니다~ 알림 내용입니다~",
                  highlight: false,
                },
                {
                  date: "8월 15일",
                  text: "새로운 알림입니다~ 새로운 알림입니다~ 새로운 알림입니다~\n새로운 알림입니다~ 새로운 알림입니다~ 새로운 알림입니다~",
                  highlight: true,
                },
                {
                  date: "8월 16일",
                  text: "공지 사항입니다~ 공지 사항입니다~ 공지 사항입니다~\n공지 사항입니다~ 공지 사항입니다~ 공지 사항입니다~",
                  highlight: false,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "border-y border-[#D7D7D7] px-4 py-4! first:pt-0 first:border-t-0 cursor-pointer select-none transition-colors duration-150 hover:bg-[#F5F5F5] hover:border-[#CFCFCF]",
                  )}
                  role="button"
                  tabIndex={0}
                >
                  <div className="mt-1 text-[15px] font-bold text-[#9810FA] leading-[1]">
                    알림
                  </div>
                  <div className="-mt-2 text-[14.6px] leading-[1.5] text-[#CFCFCF] text-right">
                    {item.date}
                  </div>
                  <div className="mt-1 text-[13.5px] leading-[1.5] text-[#000] whitespace-pre-line">
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default UserProfileHeader;
