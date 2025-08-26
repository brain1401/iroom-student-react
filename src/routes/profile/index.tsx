import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { userDisplayInfoAtom } from "@/atoms/ui";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/profile/")({
  component: UserAccountPage,
});

function UserAccountPage() {
  const { name, badgeLabel } = useAtomValue(userDisplayInfoAtom);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const navigater = useNavigate();

  const handleLogout = () => {
    // 로그아웃 처리 후 메인 페이지로 이동
    navigater({ to: "/", replace: true });
  };

  return (
    <div className={cn("w-full flex justify-center")}>
      <div className={cn("w-[360px] bg-white p-4")}>
        {/* 피그마 카드 (Frame 1171275910) */}
        <div
          className="relative rounded-[10px] border"
          style={{ width: 312.78, height: 260.04, borderColor: "#DFDFDF" }}
        >
          {/* 상단 구분선 (Vector 50) */}
          <div
            className="absolute"
            style={{
              left: 23.3,
              top: 53.9,
              width: 266.84,
              height: 1,
              backgroundColor: "#DFDFDF",
            }}
          />

          {/* 이름 (20px bold, #000) */}
          <div
            className="absolute font-bold"
            style={{
              left: 23.3,
              top: 18.1,
              fontSize: 20,
              lineHeight: 1.193,
              color: "#000000",
            }}
          >
            {name}
          </div>

          {/* 라벨: 보라(#9810FA) 15px semibold */}
          <LabelText left={23.3} top={69.09} text="학년" />
          <LabelText left={23.3} top={105.09} text="학교" />
          <LabelText left={22.3} top={141.96} text="전화번호" />
          <LabelText left={23.3} top={177.96} text="학원명" />
          <LabelText left={23.3} top={213.25} text="반 이름" />

          {/* 값: 진회색(#3E3E3E) 15px regular */}
          <ValueText left={128.39} top={69.09} text="2학년" />
          <ValueText left={128.39} top={105.09} text="가나 중학교" />
          <ValueText left={127.3} top={141.96} text="010-1234-5678" />
          <ValueText left={128.39} top={177.96} text="모모 학원" />
          <ValueText left={128.39} top={213.25} text={badgeLabel} />
        </div>

        {/* 로그아웃 텍스트 (16px, #424242), 마우스오버 색상 변경 */}
        <button
          type="button"
          className="mt-4 text-left text-[16px] leading-[1.193] text-[#424242] transition-colors duration-150 hover:text-black"
          style={{ marginLeft: 5 }}
          onClick={() => setLogoutDialogOpen(true)}
        >
          로그아웃
        </button>
      </div>

      {/* 로그아웃 확인 모달 */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="p-6 rounded-[10px] w-full max-w-[280px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-[18px] font-bold leading-[1.19] text-[#000] text-center">
              로그아웃 하시겠습니까?
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              className="flex-1 text-[14px] font-medium"
              onClick={() => setLogoutDialogOpen(false)}
            >
              아니요
            </Button>
            <Button
              className="flex-1 text-[14px] font-medium bg-[#9810FA] hover:bg-[#8A0FE8]"
              onClick={handleLogout}
            >
              예
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LabelText({
  left,
  top,
  text,
}: {
  left: number;
  top: number;
  text: string;
}) {
  return (
    <div
      className="absolute font-semibold"
      style={{ left, top, fontSize: 15, lineHeight: 1.193, color: "#9810FA" }}
    >
      {text}
    </div>
  );
}

function ValueText({
  left,
  top,
  text,
}: {
  left: number;
  top: number;
  text: string;
}) {
  return (
    <div
      className="absolute"
      style={{ left, top, fontSize: 15, lineHeight: 1.193, color: "#3E3E3E" }}
    >
      {text}
    </div>
  );
}
