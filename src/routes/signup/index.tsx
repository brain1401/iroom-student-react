import { createFileRoute, Link } from "@tanstack/react-router";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * 회원가입 페이지 라우트
 * @description 피그마 모바일 프레임 구조 기반 회원가입 폼 UI 구성
 *
 * 섹션 구성:
 * - 제목: 회원가입
 * - 입력: 아이디, 비밀번호, 비밀번호 확인, 이름, 학교, 전화번호
 * - 선택: 학제(중학교/고등학교 등), 학년(1~3학년 가정)
 * - 제출: 회원가입 버튼
 */
export const Route = createFileRoute("/signup/")({
  component: SignupPage,
});

/**
 * 회원가입 페이지 컴포넌트
 * @returns JSX.Element
 */
function SignupPage() {
  return (
    <div className={cn("w-full h-screen overflow-hidden flex justify-center")}>
      <div
        className={cn(
          "w-[360px] h-full bg-white dark:bg-white px-5 py-8 space-y-6",
        )}
      >
        {/* 제목 영역 */}
        <h1 className="text-2xl font-bold text-foreground">회원가입</h1>

        <div className="mx-auto w-[321px] space-y-6">
          {/* 아이디 */}
          <div className="space-y-2">
            <Label htmlFor="username">아이디</Label>
            <Input
              id="username"
              placeholder="아이디를 입력해주세요"
              className="h-[50px] rounded-lg"
            />
          </div>

          {/* 비밀번호 */}
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              className="h-[50px] rounded-lg"
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className="space-y-2">
            <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
            <Input
              id="passwordConfirm"
              type="password"
              placeholder="비밀번호를 다시 입력해주세요"
              className="h-[50px] rounded-lg"
            />
          </div>

          {/* 이름 */}
          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              placeholder="이름을 입력해주세요"
              className="h-[50px] rounded-lg"
            />
          </div>

          {/* 학교 */}
          <div className="space-y-2">
            <Label htmlFor="school">학교</Label>
            <Input
              id="school"
              placeholder="학교를 입력해주세요"
              className="h-[50px] rounded-lg"
            />
          </div>

          {/* 학년 그룹: 학제 + 학년 (피그마 166px / 142px) */}
          <div className="grid grid-cols-[166px_142px] gap-3">
            <div className="space-y-2">
              <Label htmlFor="schoolLevel">학년</Label>
              <Select defaultValue="middle">
                <SelectTrigger
                  id="schoolLevel"
                  className="!h-[50px] rounded-lg w-[166px]"
                >
                  <SelectValue placeholder="중학교" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="middle">중학교</SelectItem>
                  <SelectItem value="high">고등학교</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gradeYear" className="invisible">
                학년
              </Label>
              <Select defaultValue="1">
                <SelectTrigger
                  id="gradeYear"
                  className="!h-[50px] rounded-lg w-[142px]"
                >
                  <SelectValue placeholder="1학년" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1학년</SelectItem>
                  <SelectItem value="2">2학년</SelectItem>
                  <SelectItem value="3">3학년</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 전화번호 */}
          <div className="space-y-2">
            <Label htmlFor="phone">전화번호</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="전화번호를 입력해주세요"
              className="h-[50px] rounded-lg"
            />
          </div>
        </div>

        {/* 제출 버튼 */}
        <Button
          asChild
          className="w-full h-12 text-base bg-violet-700 hover:bg-violet-700/90"
        >
          <Link to="/">회원가입</Link>
        </Button>
      </div>
    </div>
  );
}
