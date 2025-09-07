import { StudentHeader } from "@/components/student/StudentHeader";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { loggedInStudentAtom } from "@/atoms/auth";

export const Route = createFileRoute("/main")({
  component: RouteComponent,
});

function RouteComponent() {
  // Jotai atom에서 로그인된 학생 정보 가져오기
  const loggedInStudent = useAtomValue(loggedInStudentAtom);

  // 로그인된 학생 정보가 없으면 기본값 사용
  const student = loggedInStudent || {
    studentId: "2024001",
    name: import.meta.env.VITE_DEFAULT_USER_NAME || "정보 없음",
    birthDate: "2006-03-15",
    phoneNumber: "010-1234-5678",
  };

  return (
    <div className="flex flex-col flex-1 w-full h-full">
      {/* StudentHeader를 Outlet 위에 배치 */}
      <div className="mb-4">
        <StudentHeader student={student} />
      </div>

      {/* 하위 라우트 내용이 여기에 렌더링됨 */}
      <Outlet />
    </div>
  );
}
