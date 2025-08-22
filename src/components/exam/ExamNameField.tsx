import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type ExamNameFieldProps = {
  /** 라벨 텍스트 (기본값: "시험지명") */
  label?: string;
  /** 입력값 */
  value: string;
  /** 값 변경 핸들러 */
  onChange: (value: string) => void;
  /** 추가 클래스명 */
  className?: string;
  /** placeholder 텍스트 (기본값: "시험지명 입력") */
  placeholder?: string;
  /** 비활성화 여부 */
  disabled?: boolean;
};

/**
 * 시험지명 입력 필드
 *
 * 주요 기능:
 * - 라벨 + 입력 필드 구성
 * - placeholder 및 disable 상태 지원
 * - 외부 컨트롤 방식 value/onChange 제공
 *
 * @example
 * ```tsx
 * <ExamNameField value={name} onChange={setName} />
 * ```
 */
export function ExamNameField({
  label = "시험지명",
  value,
  onChange,
  className,
  placeholder = "시험지명 입력",
  disabled,
}: ExamNameFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-[25px]/[1.19] font-medium text-[#1C1C1E]">
        {label}
      </span>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "h-[51px] rounded-md border-[#D7D7D7]/100 text-base placeholder:text-[#B1B1B1]",
          "focus-visible:ring-[3px] focus-visible:ring-[#155DFC33]",
        )}
      />
    </div>
  );
}
