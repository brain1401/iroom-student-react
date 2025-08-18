import { createFileRoute } from "@tanstack/react-router";
import MainHome from "@/components/MainHome";

/**
 * 메인 홈 라우트
 * @description 로그인 이후 진입하는 홈 화면 라우트
 */
export const Route = createFileRoute("/main/")({
  component: MainHome,
});


