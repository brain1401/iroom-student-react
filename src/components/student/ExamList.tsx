import { ExamListItem } from "./ExamListItem";
import { cn } from "@/lib/utils";

type Exam = {
  /** 시험 제목 */
  title: string;
  /** 시험 날짜 텍스트 (예: 25.08.11) */
  date: string;
  /** 제출 여부 */
  submitted: boolean;
  /** 시험 범위 */
  range: string;
  /** 담당 선생님 */
  teacher: string;
  /** 제출기한 텍스트 */
  deadline: string;
};

type ExamListProps = {
  /** 시험 배열 */
  items: Exam[];
  /** 추가 CSS 클래스 */
  className?: string;
  /** 아이템 클릭 핸들러 */
  onItemClick?: (exam: Exam, index: number) => void;
  /** 상세 커스텀 렌더러 */
  renderDetails?: (exam: Exam, index: number) => React.ReactNode;
};

export function ExamList({
  items,
  className,
  onItemClick,
  renderDetails,
}: ExamListProps) {
  return (
    <div className="w-full">
      <div
        className={cn(
          "divide-y divide-[#D7D7D7]/60 rounded-[10px] border border-[#D7D7D7] bg-[#FAFAFA]",
          className,
        )}
      >
        {items.map((item, index) => (
          <ExamListItem
            key={`${item.title}-${item.date}-${index}`}
            title={item.title}
            date={item.date}
            submitted={item.submitted}
            range={item.range}
            teacher={item.teacher}
            deadline={item.deadline}
            onClick={() => onItemClick?.(item, index)}
            children={renderDetails?.(item, index)}
          />
        ))}
      </div>
    </div>
  );
}
