import { cn } from "@/lib/utils";

/**
 * 사용자 계정 패널 컴포넌트
 * @description 피그마 모바일 레이아웃 기준 사용자 기본 정보 표시 UI
 */
export type UserAccountPanelProps = {
  /** 사용자 표시 이름 텍스트 */
  name: string;
  /** 학년 표시 텍스트 */
  grade: string;
  /** 학교명 텍스트 */
  school: string;
  /** 연락처 텍스트 */
  phone: string;
  /** 학원명 텍스트 */
  academyName: string;
  /** 반/그룹 라벨 텍스트 */
  classLabel: string;
  /** 추가 클래스 */
  className?: string;
};

export function UserAccountPanel({
  name,
  grade,
  school,
  phone,
  academyName,
  classLabel,
  className,
}: UserAccountPanelProps) {
  return (
    <div className={cn("w-full space-y-3", className)}>
      <div className="space-y-3">
        <Row label="반" value={classLabel} />
        <Row label="학년" value={grade} />
        <Row label="학교" value={school} />
        <Row label="연락처" value={phone} />
        <Row label="학원명" value={academyName} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-[15px] text-[#4E4D4D]">{label}</span>
      <span className="text-[15px] text-[#000]">{value}</span>
    </div>
  );
}

export default UserAccountPanel;
