import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Lightbulb } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="h-fit w-full max-w-4xl overflow-hidden border-0 py-0 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-background space-y-8 p-8 md:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600/15 text-violet-600">
                <BookOpen size={20} />
              </div>
              <div className="text-2xl font-bold">이룸클래스</div>
            </div>
            <div className="text-muted-foreground">
              성장의 모든 순간을 함께하겠습니다
            </div>

            <form className="space-y-4" action="" method="post">
              <div className="space-y-2">
                <Label htmlFor="username">아이디</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="아이디를 입력하세요"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
              <Button type="submit" className="w-full h-[3rem]">
                로그인
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">처음이신가요?</span>
              <Link to="/signup" className="ml-2 underline">
                회원가입
              </Link>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500" />
            <div className="relative flex h-full flex-col items-center justify-center p-10 text-center text-white">
              <div className="mb-6 rounded-full bg-white/20 p-4">
                <Lightbulb size={36} />
              </div>
              <h2 className="mb-2 text-2xl font-bold">너의 가능성을 믿어봐!</h2>
              <p className="leading-relaxed text-white/85">
                로그인하고 너를 위해 준비된 맞춤 학습 리포트와 아웃풋들을
                확인해봐.
              </p>
              <p className="leading-relaxed text-white/85">
                어제의 너보다 더 성장할 수 있을 거야!
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
