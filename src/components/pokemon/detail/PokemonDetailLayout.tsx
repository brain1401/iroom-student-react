import { Card } from "@/components/ui/card";
import type { ReactNode } from "react";

type Props = {
  left: ReactNode;
  right: ReactNode;
};

/** 상세 레이아웃 래퍼 컴포넌트 -함 */
export function PokemonDetailLayout({ left, right }: Props) {
  return (
    <Card className="overflow-hidden border-2 py-0 shadow-2xl">
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
        {left}
        <div className="bg-white p-8 lg:p-12">{right}</div>
      </div>
    </Card>
  );
}
