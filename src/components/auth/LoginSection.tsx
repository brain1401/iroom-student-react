import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const inputStyles = "h-12";

/**
 * 로그인 섹션 컴포넌트
 * @description 브랜딩, 로그인 폼, 회원가입 링크를 포함하는 왼쪽 영역
 *
 * 주요 기능:
 * - 아이디/비밀번호 입력 폼 (검증 없이 바로 이동)
 * - 로그인 버튼 클릭 시 /main 페이지로 즉시 이동
 * - 회원가입 페이지 링크 제공
 * - 브랜드 로고 및 서비스 설명 표시
 *
 * UX 고려사항:
 * - form 구조 유지로 Enter 키 지원
 * - 프로토타입 단계로 즉시 이동 (검증 없음)
 * - 추후 실제 로그인 로직 추가 가능한 구조
 */
export function LoginSection() {
  /**
   * TanStack Router 네비게이션 훅
   * @description 프로그래밍 방식으로 라우트 이동을 위한 훅
   */
  const navigate = useNavigate();

  /**
   * 로그인 폼 제출 처리 함수
   * @description 아이디/비밀번호 검증 없이 즉시 /main 페이지로 이동
   * @param e - 폼 제출 이벤트
   */
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    // 기본 form 제출 동작 방지
    e.preventDefault();

    // 검증 없이 즉시 메인 페이지로 이동
    navigate({ to: "/main" });
  };
  return (
    <div className="bg-background space-y-8 p-8 md:p-10">
      {/* 브랜딩 영역 */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600/15 text-violet-600">
          <BookOpen size={20} />
        </div>
        <div className="text-2xl font-bold">이룸클래스</div>
      </div>

      {/* 서비스 설명 */}
      <div className="text-muted-foreground">
        성장의 모든 순간을 함께하겠습니다
      </div>

      {/* 로그인 폼 */}
      <form className="space-y-4" onSubmit={handleLogin}>
        <div className="space-y-2">
          <Label htmlFor="username">아이디</Label>
          <Input
            id="username"
            name="username"
            placeholder="아이디를 입력하세요"
            className={inputStyles}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            className={inputStyles}
          />
        </div>
        <Button asChild className={cn(inputStyles, "w-full")}>
          <a href="/main">로그인</a>
        </Button>
      </form>

      {/* 회원가입 링크 */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">처음이신가요?</span>
        <Link to="/signup" className="ml-2 underline">
          회원가입
        </Link>
      </div>
    </div>
  );
}
