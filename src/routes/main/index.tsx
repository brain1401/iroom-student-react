/**
 * 메인 홈 라우트
 * @description 로그인 이후 진입하는 홈 화면 라우트
 *
 * 주요 기능:
 * - 최근 제출 시험 목록 표시
 * - 시험 결과 카드 그리드 레이아웃
 * - 로그아웃 기능
 *
 * @example
 * ```tsx
 * <Route path="/main" component={TestList} />
 * ```
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useSetAtom, useAtomValue } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { atomWithQuery } from "jotai-tanstack-query";
import { logoutAtom, loggedInStudentAtom } from "@/atoms/auth";
import {
  studentRecentSubmissionsDataAtom,
  studentRecentSubmissionsActionsAtom,
  studentRecentSubmissionsPageAtom,
  studentRecentSubmissionsSizeAtom,
} from "@/atoms/student";
import type { RecentSubmission } from "@/api/student/types";
import {
  RecentExamCard,
  ExamResultCard,
  RecentSubmission as RecentSubmissionComponent,
} from "@/components/student";

import { extractApiData } from "@/api/common/types";
import { getAllExams } from "@/api/exam/server-api";
import type { ExamItem } from "@/api/common/server-types";

/**
 * 시험 목록 조회 atom (실제 서버 API 사용)
 * @description 실제 서버에서 시험 목록을 가져오는 atom
 */
const examListQueryAtom = atomWithQuery(() => ({
  queryKey: ["exams", "list"],
  queryFn: async (): Promise<ExamItem[]> => {
    const response = await getAllExams({ size: 50 }); // 홈에서는 최대 50개까지 표시
    const data = extractApiData(response);
    return data.content;
  },
  staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  gcTime: 15 * 60 * 1000, // 15분간 가비지 컬렉션 방지
}));

export const Route = createFileRoute("/main/")({
  ssr: true,

  // SSR 데이터 프리로딩
  loader: async ({ context }) => {
    // 1. 기본 시험 목록 데이터 미리 로드
    await context.queryClient.ensureQueryData({
      queryKey: ["exams", "list"],
      queryFn: async (): Promise<ExamItem[]> => {
        const response = await getAllExams({ size: 50 });
        const data = extractApiData(response);
        return data.content;
      },
      staleTime: 5 * 60 * 1000,
    });

    // 2. 기본 학생 정보로 최근 제출 내역 prefetch
    // NOTE: 실제 로그인 정보는 클라이언트에서 localStorage로부터 복원됨
    const defaultStudentAuth = {
      name: import.meta.env.VITE_DEFAULT_USER_NAME || "김체리",
      birthDate: "2006-03-15",
      phone: "010-1234-5678",
      page: 0,
      size: 10,
    };

    try {
      // 기본 인증 정보로 최근 제출 내역 prefetch 시도
      await context.queryClient.ensureQueryData({
        queryKey: [
          "student",
          "recent-submissions",
          JSON.stringify(defaultStudentAuth),
        ],
        queryFn: async () => {
          // 기본 학생 정보로 API 호출 시도
          const response = await fetch("/api/student/recent-submissions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(defaultStudentAuth),
          });

          if (!response.ok) {
            // 인증 실패 시 빈 결과 반환 (클라이언트에서 재시도됨)
            return { recentSubmissions: [], totalCount: 0 };
          }

          return response.json();
        },
        staleTime: 2 * 60 * 1000,
      });
    } catch (error) {
      // prefetch 실패 시 무시 (클라이언트에서 재시도됨)
      console.log("Server-side student data prefetch failed:", error);
    }
  },
  component: TestList,
});

// ============================================================================
// 타입 정의
// ============================================================================

/**
 * 시험 결과 데이터 타입
 * @description 시험 결과 카드에 표시할 데이터 구조
 */
type ExamResult = {
  /** 시험 고유 식별자 */
  id: string;
  /** 시험 제목 */
  title: string;
  /** 정답 개수 */
  correctCount: number;
  /** 오답 개수 */
  incorrectCount: number;
  /** 정답률 (%) */
  accuracyRate: number;
};

// ============================================================================
// 정적 데이터 (가데이터)
// ============================================================================

/**
 * 시험 결과 가데이터
 * @description SSR hydration mismatch 방지를 위한 정적 ID 사용
 */
/**
 * ExamItem을 ExamResult로 변환하는 함수
 * @description 실제 서버 데이터를 시험 결과 카드용 타입으로 변환
 * @param examItem 서버에서 받은 시험 데이터
 * @returns 시험 결과 카드용 데이터
 */
function convertExamItemToResult(examItem: ExamItem): ExamResult {
  return {
    id: examItem.id,
    title: examItem.examName,
    // TODO: 실제 학생 답안 데이터와 연결 필요
    // 현재는 임시 데이터로 설정 (향후 학생 답안 API 연동 시 실제 데이터로 교체)
    correctCount: 0,
    incorrectCount: 0,
    accuracyRate: 0,
  };
}

/**
 * 최근 제출 시험 가데이터
 * @description RecentSubmission 컴포넌트용 정적 데이터
 */
/**
 * 최근 제출 시험 임시 데이터
 * @description 실제 학생 제출 데이터 API가 없어서 임시로 빈 배열 사용
 * TODO: 학생 제출 이력 API 구현 후 실제 데이터로 교체
 */
const RECENT_SUBMISSION_DATA: RecentSubmission[] = [];

// ============================================================================
// 유틸리티 함수
// ============================================================================

/**
 * 시험 결과 카드 스타일 클래스 생성
 * @param baseClasses 기본 클래스
 * @returns 조합된 클래스 문자열
 */
const getExamCardClasses = (baseClasses?: string) => {
  return cn(
    "p-4 border border-gray-200",
    "hover:shadow-md hover:border-blue-300",
    "transition-all duration-200 cursor-pointer",
    baseClasses,
  );
};

// ============================================================================
// 컴포넌트
// ============================================================================

/**
 * 시험 목록 섹션 컴포넌트
 * @description 시험 결과 카드들을 그리드 레이아웃으로 표시
 */
/**
 * 최근 응시 시험 섹션 컴포넌트
 * @description 로그인한 학생의 최근 응시 시험 목록을 표시
 *
 * 주요 기능:
 * - 학생 인증 정보 기반 최근 시험 조회
 * - 로딩, 에러, 빈 상태 처리
 * - 시험 카드 그리드 레이아웃
 * - 페이징 기능
 */
function RecentExamSection() {
  const loggedInStudent = useAtomValue(loggedInStudentAtom);
  const recentExamsData = useAtomValue(studentRecentSubmissionsDataAtom);
  const currentPage = useAtomValue(studentRecentSubmissionsPageAtom);
  const actionsSetAtom = useSetAtom(studentRecentSubmissionsActionsAtom);
  const actions = actionsSetAtom();

  // 로그인하지 않은 경우
  if (!recentExamsData.isLoggedIn) {
    return (
      <section id="recent-exams" className="mt-8 mb-20 mx-8">
        <header className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            최근 응시 시험
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            로그인하여 최근 응시한 시험 내역을 확인해보세요
          </p>
        </header>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            로그인이 필요한 서비스입니다.
          </p>
        </div>
      </section>
    );
  }

  // 로딩 상태 처리
  if (recentExamsData.isPending) {
    return (
      <section id="recent-exams" className="mt-8 mb-20 mx-8">
        <header className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            최근 응시 시험
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {loggedInStudent?.name}님이 최근에 응시한 시험 내역을 불러오는 중...
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {/* 로딩 스켈레톤 */}
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-48"
            />
          ))}
        </div>
      </section>
    );
  }

  // 에러 상태 처리
  if (recentExamsData.isError) {
    return (
      <section id="recent-exams" className="mt-8 mb-20 mx-8">
        <header className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            최근 응시 시험
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            최근 응시 시험 내역을 불러오는 중 오류가 발생했습니다
          </p>
        </header>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            시험 내역을 불러올 수 없습니다. 다시 시도해주세요.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            다시 시도
          </Button>
        </div>
      </section>
    );
  }

  const { recentSubmissions, totalCount } = recentExamsData;

  return (
    <section id="recent-exams" className="mt-8 mb-20 mx-8">
      {/* 섹션 헤더 */}
      <header className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          최근 응시 시험 ({totalCount}개)
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {loggedInStudent?.name}님이 최근에 응시한 시험들을 확인해보세요
        </p>
      </header>

      {/* 최근 시험 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {recentSubmissions.map((submission) => (
          <RecentExamCard
            key={`${submission.examId}-${submission.submittedAt}`}
            submission={submission}
          />
        ))}
      </div>

      {/* 시험이 없는 경우 */}
      {recentExamsData.isEmpty && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            아직 응시한 시험이 없습니다.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            시험에 응시하시면 여기에서 확인할 수 있습니다.
          </p>
        </div>
      )}

      {/* 페이징 (시험이 있는 경우만) */}
      {!recentExamsData.isEmpty && recentSubmissions.length > 0 && (
        <div className="flex justify-center mt-8 gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 0}
            onClick={actions.prevPage}
          >
            이전
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={recentSubmissions.length < 10} // 페이지 크기보다 작으면 다음 페이지 없음
            onClick={actions.nextPage}
          >
            다음
          </Button>
        </div>
      )}
    </section>
  );
}

/**
 * 시험 결과 카드 래퍼 컴포넌트
 * @description ExamResultCard를 Link로 감싸는 컴포넌트
 */
function ExamResultCardWrapper({ result }: { result: ExamResult }) {
  return (
    <Link
      to="/main/exam/$examId"
      params={{ examId: result.id }}
      className="block"
    >
      <ExamResultCard
        exam={{
          examId: result.id,
          title: result.title,
          correctCount: result.correctCount,
          incorrectCount: result.incorrectCount,
          accuracyRate: result.accuracyRate,
        }}
        className={getExamCardClasses()}
      />
    </Link>
  );
}

/**
 * 로그아웃 버튼 컴포넌트
 * @description 하단에 위치한 로그아웃 액션 버튼
 */
function LogoutButton() {
  /** 로그아웃 atom */
  const logout = useSetAtom(logoutAtom);

  /**
   * 로그아웃 핸들러
   * @description 로그아웃 후 로그인 페이지로 이동
   */
  const handleLogout = () => {
    logout(); // Jotai atom 상태 초기화
    // 로그인 페이지로 이동
    window.location.href = "/";
  };

  return (
    <footer className="flex justify-start">
      <Button
        variant="ghost"
        onClick={handleLogout}
        className="mb-10 ml-10 font-bold text-gray-400 hover:text-gray-600 transition-colors duration-200"
      >
        로그아웃
      </Button>
    </footer>
  );
}

/**
 * 메인 홈 컴포넌트
 * @description 홈 화면의 전체 레이아웃과 컴포넌트들을 조합
 *
 * 주요 구성:
 * - 최근 제출 시험 목록 (RecentSubmission)
 * - 최근 응시 시험 목록 (RecentExamSection)
 * - 로그아웃 버튼 (LogoutButton)
 */
/**
 * 메인 홈 컴포넌트
 * @description 홈 화면의 전체 레이아웃과 컴포넌트들을 조합
 *
 * 주요 구성:
 * - SSR hydration 최적화
 * - 최근 제출 시험 목록 (RecentSubmission)
 * - 최근 응시 시험 목록 (RecentExamSection)
 * - 로그아웃 버튼 (LogoutButton)
 */
/**
 * 메인 홈 컴포넌트
 * @description 홈 화면의 전체 레이아웃과 SSR hydration 최적화
 *
 * SSR 최적화 전략:
 * - ssr: 'data-only'로 데이터만 서버에서 prefetch
 * - useHydrateAtoms로 초기 상태 동기화
 * - 클라이언트에서 실제 로그인 정보 복원 후 자동 re-fetch
 *
 * 주요 구성:
 * - 최근 제출 시험 목록 (RecentSubmission)
 * - 최근 응시 시험 목록 (RecentExamSection)
 * - 로그아웃 버튼 (LogoutButton)
 */
/**
 * 메인 홈 컴포넌트
 * @description 홈 화면의 전체 레이아웃과 SSR hydration 최적화
 *
 * SSR 최적화 전략:
 * - ssr: 'data-only'로 데이터만 서버에서 prefetch
 * - useHydrateAtoms로 초기 상태 동기화
 * - 클라이언트에서 실제 로그인 정보 복원 후 자동 re-fetch
 *
 * 주요 구성:
 * - 최근 제출 시험 목록 (RecentSubmission)
 * - 최근 응시 시험 목록 (RecentExamSection)
 * - 로그아웃 버튼 (LogoutButton)
 */
/**
 * 메인 홈 컴포넌트
 * @description 홈 화면의 전체 레이아웃과 SSR hydration 최적화
 *
 * SSR 최적화 전략:
 * - ssr: 'data-only'로 데이터만 서버에서 prefetch
 * - useHydrateAtoms로 초기 상태 동기화
 * - 클라이언트에서 실제 로그인 정보 복원 후 자동 re-fetch
 *
 * 주요 구성:
 * - 최근 제출 시험 목록 (RecentSubmission)
 * - 최근 응시 시험 목록 (RecentExamSection)
 * - 로그아웃 버튼 (LogoutButton)
 */
function TestList() {
  // SSR hydration 최적화를 위한 초기 상태 동기화
  // 기본 페이징 상태로 hydrate (서버-클라이언트 일관성 유지)
  useHydrateAtoms([
    [studentRecentSubmissionsPageAtom, 0],
    [studentRecentSubmissionsSizeAtom, 10],
  ]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* 최근 제출 시험 */}
      <RecentSubmissionComponent submissions={RECENT_SUBMISSION_DATA} />

      {/* 시험 목록 - 클라이언트 렌더링으로 hydration mismatch 방지 */}
      <RecentExamSection />

      {/* 로그아웃 버튼 */}
      <LogoutButton />
    </main>
  );
}
