import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ClassSelectorProps = {
  /** 라벨 텍스트 (예: 담당 클래스) */
  label?: string;
  /** 현재 선택된 반 이름 */
  value: string;
  /** 선택 가능한 반 이름 리스트 */
  options: string[];
  /** 선택 변경 콜백 */
  onChange: (next: string) => void;
  /** 추가 클래스명 */
  className?: string;
};

/**
 * 반 선택 영역 컴포넌트
 * @description 대시보드 상단의 "담당 클래스" 선택 UI 구성 요소
 *
 * 주요 기능:
 * - 라벨과 선택 박스 수평 배치
 * - Figma 사양 기반: 둥근 모서리(10px), 경계선 색상, 높이 고정
 * - 옵션 목록 동적 렌더링
 *
 * @example
 * ```tsx
 * <ClassSelector value={value} options={["중등 A반", "중등 B반"]} onChange={setValue} />
 * ```
 */
export function ClassSelector({
  label = "담당 클래스",
  value,
  options,
  onChange,
  className,
}: ClassSelectorProps) {
  const uniqueOptions = useMemo(() => Array.from(new Set(options)), [options]);

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <Label className="text-[40px] font-medium leading-[1.19] tracking-[-0.02em] text-[#A09B9B]">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={cn(
            "h-[65px] w-[337px] rounded-[10px] border border-[#999797] bg-white px-4",
            "text-[40px] font-medium leading-[1.19] text-[#3E3E3E]",
          )}
        >
          <SelectValue placeholder="반 선택" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {uniqueOptions.map((opt) => (
            <SelectItem key={opt} value={opt} className="text-[16px]">
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export type { ClassSelectorProps };
