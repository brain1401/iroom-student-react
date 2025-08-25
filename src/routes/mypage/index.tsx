import { userAtom } from "@/atoms/yoon";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useAtom } from "jotai";

export const Route = createFileRoute("/mypage/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [user, setUser] = useAtom(userAtom);

  return (
    <div className="w-full h-full">
      <div className="flex flex-col justify-center items-center gap-y-5 mt-[10rem]">
        <div className="flex flex-col justify-center w-fit border border-black rounded-2xl p-5">
          <p className="font-bold text-2xl">{user.name}</p>
          <p>이메일 : {user.email}</p>
          <p>나이 : {user.age}</p>
        </div>

        <Button asChild className="w-[10rem]">
          <Link to="/mypage/edit">수정</Link>
        </Button>
      </div>
    </div>
  );
}
