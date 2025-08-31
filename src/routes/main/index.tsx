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
import { RecentSubmission, ExamResultCard } from "@/components/student";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSetAtom } from "jotai";
import { logoutAtom } from "@/atoms/auth";
import type { RecentSubmission as RecentSubmissionType } from "@/api/student/types";

export const Route = createFileRoute("/main/")({
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
const EXAM_RESULTS_DATA: ExamResult[] = [
  {
    id: "exam-2025-08-mock-1",
    title: "2025년 8월 모의고사",
    correctCount: 10,
    incorrectCount: 5,
    accuracyRate: 66.67,
  },
  {
    id: "exam-2025-08-mock-2",
    title: "2025년 8월 모의고사",
    correctCount: 10,
    incorrectCount: 5,
    accuracyRate: 66.67,
  },
  {
    id: "exam-math-chapter-1",
    title: "수학(상) 단원 평가",
    correctCount: 8,
    incorrectCount: 2,
    accuracyRate: 80.0,
  },
  {
    id: "exam-final-comprehensive-1",
    title: "기말고사 대비 종합 시험",
    correctCount: 25,
    incorrectCount: 5,
    accuracyRate: 83.33,
  },
  {
    id: "exam-2025-08-mock-3",
    title: "2025년 8월 모의고사",
    correctCount: 10,
    incorrectCount: 5,
    accuracyRate: 66.67,
  },
  {
    id: "exam-math-chapter-2",
    title: "수학(상) 단원 평가",
    correctCount: 8,
    incorrectCount: 2,
    accuracyRate: 80.0,
  },
  {
    id: "exam-final-comprehensive-2",
    title: "기말고사 대비 종합 시험",
    correctCount: 25,
    incorrectCount: 5,
    accuracyRate: 83.33,
  },
];

/**
 * 최근 제출 시험 가데이터
 * @description RecentSubmission 컴포넌트용 정적 데이터
 */
const RECENT_SUBMISSION_DATA: RecentSubmissionType[] = [
  {
    examId: "exam-2025-08-mock-1",
    examTitle: "2025년 8월 모의고사",
    totalQuestions: 15,
    chapterName: "수학(상) - 다항식",
    submittedAt: "2025-01-15T10:30:00Z",
    examType: "mock",
  },
  {
    examId: "exam-math-chapter-1",
    examTitle: "수학(상) 단원 평가",
    totalQuestions: 20,
    chapterName: "수학(상) - 방정식",
    submittedAt: "2025-01-14T14:20:00Z",
    examType: "chapter",
  },
  {
    examId: "exam-final-comprehensive-1",
    examTitle: "기말고사 대비 종합 시험",
    totalQuestions: 30,
    chapterName: "수학(상) - 전체 단원",
    submittedAt: "2025-01-13T09:15:00Z",
    examType: "comprehensive",
  },
  {
    examId: "exam-2025-08-mock-2",
    examTitle: "2025년 8월 모의고사",
    totalQuestions: 15,
    chapterName: "수학(상) - 함수",
    submittedAt: "2025-01-12T16:45:00Z",
    examType: "mock",
  },
  {
    examId: "exam-math-chapter-2",
    examTitle: "수학(상) 단원 평가",
    totalQuestions: 18,
    chapterName: "수학(상) - 도형",
    submittedAt: "2025-01-11T11:30:00Z",
    examType: "chapter",
  },
];

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
function ExamListSection() {
  return (
    <section id="exam-list" className="mt-8 mb-20 mx-8">
      {/* 섹션 헤더 */}
      <header className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          시험 목록
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          응시한 시험들의 결과를 확인해보세요
        </p>
      </header>

      {/* 시험 결과 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {EXAM_RESULTS_DATA.map((result) => (
          <ExamResultCardWrapper key={result.id} result={result} />
        ))}
      </div>
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
 * - 시험 결과 목록 (ExamListSection)
 * - 로그아웃 버튼 (LogoutButton)
 */
function TestList() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* 최근 제출 시험 */}
      <RecentSubmission submissions={RECENT_SUBMISSION_DATA} />

      {/* 시험 목록 */}
      <ExamListSection />

      {/* 로그아웃 버튼 */}
      <LogoutButton />
    </main>
  );
}
