import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BiBell } from "react-icons/bi";
import { VscAccount } from "react-icons/vsc";
import { RxHamburgerMenu } from "react-icons/rx";

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
  onClickBell,
}: UserProfileHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-end gap-2">
        <div className="text-[30px] font-bold leading-[1.19] text-[#000]">
          {name}
        </div>
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
          onClick={onClickBell}
        >
          <BiBell className="text-[#1C1C1E] size-[34px]" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full size-[42px]"
        >
          <VscAccount className="text-[#1C1C1E] size-[34px]" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full size-[42px]"
        >
          <RxHamburgerMenu className="text-[#1C1C1E] size-[34px]" />
        </Button>
      </div>
    </div>
  );
}

export default UserProfileHeader;
