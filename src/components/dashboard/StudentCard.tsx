import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StudentCardProps = {
  /** 학생 이름 */
  name: string;
  /** 추가 클래스명 */
  className?: string;
};

/**
 * 학생 카드 컴포넌트
 * @description Figma 사양의 312x275 카드, 상단 그림자, 둥근 모서리 적용
 *
 * 주요 기능:
 * - 이름 텍스트 굵게 표시
 * - 카드 내부 공간 여백 균일 적용
 */
export function StudentCard({ name, className }: StudentCardProps) {
  return (
    <Card
      className={cn(
        "w-[312.78px] h-[275.19px] rounded-[10px] shadow-sm",
        "flex items-center justify-center",
        className,
      )}
    >
      <div className="text-[20px] font-bold leading-[1.19] text-black">
        {name}
      </div>
    </Card>
  );
}

export type { StudentCardProps };
