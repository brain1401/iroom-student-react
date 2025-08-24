import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ExamResultCard,
  ExamQuestionItem,
  MathQuestionCard,
} from "@/components/exam";
import type { MathQuestion, MathQuestionCardState } from "@/components/exam";
import { Button } from "@/components/ui/button";

/**
 * 시험 결과 예시 데이터
 */
const examResults = [
  {
    id: "1",
    title: "가나다 시험",
    correctCount: 12,
    incorrectCount: 8,
    accuracyRate: 60,
  },
  {
    id: "2",
    title: "영어 단어 테스트",
    correctCount: 18,
    incorrectCount: 2,
    accuracyRate: 90,
  },
  {
    id: "3",
    title: "수학 기초 문제",
    correctCount: 7,
    incorrectCount: 13,
    accuracyRate: 35,
  },
  {
    id: "4",
    title: "과학 실험 퀴즈",
    correctCount: 15,
    incorrectCount: 5,
    accuracyRate: 75,
  },
  {
    id: "5",
    title: "역사 인물 문제",
    correctCount: 9,
    incorrectCount: 11,
    accuracyRate: 45,
  },
];

/**
 * 시험 문제 항목 예시 데이터
 */
const examQuestions = [
  {
    id: "1",
    questionNumber: "1번 문제",
    category: "다항식의 덧셈·뺄셈",
    type: "계산",
    difficulty: "중" as const,
    status: "active" as const,
  },
  {
    id: "2",
    questionNumber: "2번 문제",
    category: "영문법 기초",
    type: "객관식",
    difficulty: "하" as const,
    status: "completed" as const,
  },
  {
    id: "3",
    questionNumber: "3번 문제",
    category: "물리학 실험",
    type: "서술형",
    difficulty: "상" as const,
    status: "locked" as const,
  },
  {
    id: "4",
    questionNumber: "4번 문제",
    category: "한국사 근현대",
    type: "논술",
    difficulty: "상" as const,
    status: "active" as const,
  },
  {
    id: "5",
    questionNumber: "5번 문제",
    category: "화학 반응식",
    type: "계산",
    difficulty: "중" as const,
    status: "completed" as const,
  },
];

const TAB_TRIGGER_CLASSNAME =
  "data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-200 data-[state=active]:dark:bg-zinc-200 data-[state=active]:dark:text-zinc-800";

/**
 * 컴포넌트 데모 통합 페이지
 * @description 기존 exam-results 예제들을 shadcn/ui Tabs로 통합한 페이지
 *
 * 주요 기능:
 * - 3개 탭으로 구성: 시험 결과 카드, 시험 문제 항목, 수학 문제 카드
 * - 각 탭별 독립적인 상태 관리
 * - 반응형 디자인 (모바일 우선)
 * - 접근성 고려 (키보드 네비게이션, aria-label)
 * - bun 최적화된 빌드 환경 활용
 *
 * bun 활용:
 * - 빠른 HMR로 개발 효율성 향상
 * - 최적화된 번들링으로 성능 개선
 * - TanStack Start와의 완벽한 통합
 */
function ComponentsPage() {
  /**
   * 수학 문제 카드 상태 (useState로 상태 관리)
   */
  const [questions, setQuestions] = useState<MathQuestion[]>([
    {
      id: "1",
      number: 1,
      answer: "x = 3y + 2",
      state: "completed",
      createdAt: new Date(),
    },
    {
      id: "2",
      number: 2,
      state: "loading",
      createdAt: new Date(),
    },
    {
      id: "3",
      number: 3,
      state: "idle",
      createdAt: new Date(),
    },
    {
      id: "4",
      number: 4,
      answer: "2x² - 5x + 3 = 0",
      state: "error",
      createdAt: new Date(),
    },
    {
      id: "5",
      number: 5,
      answer: "∫ x² dx = (x³/3) + C",
      state: "completed",
      createdAt: new Date(),
    },
  ]);

  /**
   * 시험 결과 카드 클릭 핸들러
   */
  const handleExamCardClick = (examId: string, title: string) => {
    alert(`${title} 상세 페이지로 이동 (ID: ${examId})`);
  };

  /**
   * 시험 결과 뒤로가기 핸들러
   */
  const handleExamBackClick = (examId: string) => {
    alert(`${examId}번 시험 뒤로가기 클릭됨`);
  };

  /**
   * 문제 항목 클릭 핸들러
   */
  const handleQuestionClick = (questionId: string, questionNumber: string) => {
    alert(`${questionNumber} 풀기 시작 (ID: ${questionId})`);
  };

  /**
   * 문제 네비게이션 핸들러
   */
  const handleQuestionNavigate = (questionId: string) => {
    alert(`${questionId}번 문제에서 뒤로가기`);
  };

  /**
   * 수학 문제 상태 변경 핸들러
   */
  const updateQuestionState = (id: string, newState: MathQuestionCardState) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, state: newState } : q)),
    );
  };

  // /**
  //  * 수학 문제 사진 촬영 핸들러
  //  */
  // const handleTakePhoto = (id: string) => {
  //   console.log("사진 촬영 시작:", id);
  //   updateQuestionState(id, "loading");

  //   // 2초 후 완료 상태로 변경 (시뮬레이션)
  //   setTimeout(() => {
  //     const answers = [
  //       "y = 2x + 1",
  //       "a² + b² = c²",
  //       "lim(x→0) sin(x)/x = 1",
  //       "f'(x) = 3x² - 2x + 1",
  //     ];
  //     const randomAnswer = answers[Math.floor(Math.random() * answers.length)];

  //     setQuestions((prev) =>
  //       prev.map((q) =>
  //         q.id === id ? { ...q, state: "completed", answer: randomAnswer } : q,
  //       ),
  //     );
  //   }, 2000);
  // };

  // /**
  //  * 수학 문제 재촬영 핸들러
  //  */
  // const handleRetakePhoto = (id: string) => {
  //   console.log("재촬영 시작:", id);
  //   setQuestions((prev) =>
  //     prev.map((q) =>
  //       q.id === id ? { ...q, state: "loading", answer: undefined } : q,
  //     ),
  //   );

  //   // 1.5초 후 다시 완료 상태로 변경
  //   setTimeout(() => {
  //     handleTakePhoto(id);
  //   }, 1500);
  // };

  /**
   * 수학 문제 사진 삭제 핸들러
   */
  const handleDeletePhoto = (id: string) => {
    console.log("사진 삭제:", id);
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, state: "idle", answer: undefined } : q,
      ),
    );
  };

  /**
   * 수학 문제 파일 업로드 핸들러
   */
  const handleUploadFile = (id: string) => {
    console.log("파일 업로드:", id);
    updateQuestionState(id, "loading");
  };

  /**
   * 수학 문제 결과 다운로드 핸들러
   */
  const handleDownloadResult = (id: string) => {
    const question = questions.find((q) => q.id === id);
    if (question?.answer) {
      console.log("결과 다운로드:", question.answer);
      alert(`다운로드: ${question.answer}`);
    }
  };

  /**
   * 수학 문제 카드 선택 핸들러
   */
  const handleMathCardClick = (id: string) => {
    console.log("카드 선택:", id);
  };

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-4">
      <PageHeader title="컴포넌트 데모" showBackButton={true} />

      {/* 페이지 설명 */}
      <div className="space-y-2 text-center">
        <p className="text-gray-600">
          시험 관련 컴포넌트들의 다양한 사용법과 상태를 확인할 수 있는 통합 데모
          페이지입니다.
        </p>
        <p className="text-sm text-gray-500">
          각 탭을 클릭하여 ExamResultCard, ExamQuestionItem, MathQuestionCard
          컴포넌트를 살펴보세요.
        </p>
      </div>

      {/* Tabs 컴포넌트로 통합 UI 구성 */}
      <Tabs defaultValue="exam-results" className="w-full">
        {/* 탭 목록 */}
        <TabsList className="flex h-[3rem] w-full justify-center gap-x-3">
          <TabsTrigger value="exam-results" className={TAB_TRIGGER_CLASSNAME}>
            시험 결과 카드
          </TabsTrigger>
          <TabsTrigger value="exam-questions" className={TAB_TRIGGER_CLASSNAME}>
            시험 문제 항목
          </TabsTrigger>
          <TabsTrigger value="math-cards" className={TAB_TRIGGER_CLASSNAME}>
            수학 문제 카드
          </TabsTrigger>
        </TabsList>

        {/* 시험 결과 카드 탭 */}
        <TabsContent value="exam-results" className="space-y-6">
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                ExamResultCard 컴포넌트
              </h2>
              <p className="mt-2 text-gray-600">
                시험 결과를 보여주는 카드 컴포넌트의 다양한 사용 예시입니다.
              </p>
            </div>

            {/* 기본 사용법 섹션 */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                기본 사용법
              </h3>
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {examResults.map((exam) => (
                  <ExamResultCard
                    key={exam.id}
                    title={exam.title}
                    correctCount={exam.correctCount}
                    incorrectCount={exam.incorrectCount}
                    accuracyRate={exam.accuracyRate}
                    onClick={() => handleExamCardClick(exam.id, exam.title)}
                  />
                ))}
              </div>
            </section>

            {/* 변형 예시 섹션 */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                크기 및 옵션 변형
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <ExamResultCard
                  title="작은 크기 카드"
                  correctCount={10}
                  incorrectCount={5}
                  accuracyRate={67}
                  size="sm"
                />
                <ExamResultCard
                  title="뒤로가기 버튼 있는 카드"
                  correctCount={14}
                  incorrectCount={6}
                  accuracyRate={70}
                  showBackButton={true}
                  onBackClick={() => handleExamBackClick("back-example")}
                />
                <ExamResultCard
                  title="진행바 없는 카드"
                  correctCount={16}
                  incorrectCount={4}
                  accuracyRate={80}
                  showProgressBar={false}
                />
              </div>
            </section>
          </div>
        </TabsContent>

        {/* 시험 문제 항목 탭 */}
        <TabsContent value="exam-questions" className="space-y-6">
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                ExamQuestionItem 컴포넌트
              </h2>
              <p className="mt-2 text-gray-600">
                시험 문제 항목을 표시하는 컴포넌트의 다양한 상태와 기능입니다.
              </p>
            </div>

            {/* 기본 사용법 섹션 */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                기본 사용법
              </h3>
              <div className="space-y-2">
                {examQuestions.map((question) => (
                  <ExamQuestionItem
                    key={question.id}
                    questionNumber={question.questionNumber}
                    category={question.category}
                    type={question.type}
                    difficulty={question.difficulty}
                    status={question.status}
                    onClick={() =>
                      handleQuestionClick(question.id, question.questionNumber)
                    }
                    onNavigate={() => handleQuestionNavigate(question.id)}
                  />
                ))}
              </div>
            </section>

            {/* 상태별 예시 섹션 */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                상태별 예시
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-lg font-medium text-gray-700">
                    활성 상태 (풀 수 있는 문제)
                  </h4>
                  <ExamQuestionItem
                    questionNumber="예시 1번"
                    category="미적분학"
                    type="계산"
                    difficulty="상"
                    status="active"
                    onClick={() => alert("활성 문제 클릭!")}
                    onNavigate={() => alert("뒤로가기")}
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-medium text-gray-700">
                    완료 상태 (이미 푼 문제)
                  </h4>
                  <ExamQuestionItem
                    questionNumber="예시 2번"
                    category="생물학 실험"
                    type="실험"
                    difficulty="중"
                    status="completed"
                    onClick={() => alert("완료된 문제 - 답안 확인")}
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-medium text-gray-700">
                    잠금 상태 (아직 접근할 수 없는 문제)
                  </h4>
                  <ExamQuestionItem
                    questionNumber="예시 3번"
                    category="고급 물리학"
                    type="논술"
                    difficulty="상"
                    status="locked"
                    onClick={() => alert("잠금된 문제입니다")}
                  />
                </div>
              </div>
            </section>
          </div>
        </TabsContent>

        {/* 수학 문제 카드 탭 */}
        <TabsContent value="math-cards" className="space-y-6">
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                MathQuestionCard 컴포넌트
              </h2>
              <p className="mt-2 text-gray-600">
                수학 문제 사진 촬영 및 분석 기능을 제공하는 카드 컴포넌트입니다.
              </p>
            </div>

            {/* 상태 설명 */}
            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="mb-3 text-lg font-semibold">상태 설명</h4>
              <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                  <span>
                    <strong>idle:</strong> 초기 상태 - 사진 촬영 대기
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 animate-pulse rounded-full bg-blue-500"></div>
                  <span>
                    <strong>loading:</strong> 로딩 중 - 분석 또는 업로드 진행
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>
                    <strong>completed:</strong> 완료 - 답안 표시
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <span>
                    <strong>error:</strong> 오류 - 재촬영 필요
                  </span>
                </div>
              </div>
            </div>

            {/* 수학 문제 카드 그리드 */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">카드 예시</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {questions.map((question) => (
                  <div key={question.id} className="flex justify-center">
                    <MathQuestionCard
                      questionNumber={question.number}
                      answer={question.answer}
                      state={question.state}
                      onTakePhoto={() => console.log(question.id)}
                      onRetakePhoto={() => console.log(question.id)}
                      onDeletePhoto={() => handleDeletePhoto(question.id)}
                      onUploadFile={() => handleUploadFile(question.id)}
                      onDownloadResult={() => handleDownloadResult(question.id)}
                      onClick={() => handleMathCardClick(question.id)}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* 액션 버튼들 */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                테스트 액션
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => {
                    const idleQuestions = questions.filter(
                      (q) => q.state === "idle",
                    );
                    if (idleQuestions.length > 0) {
                      // handleTakePhoto(idleQuestions[0].id);
                    }
                  }}
                  className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                >
                  첫 번째 idle 상태 촬영
                </button>
                <button
                  onClick={() => {
                    setQuestions((prev) =>
                      prev.map((q) => ({
                        ...q,
                        state: "idle" as MathQuestionCardState,
                        answer: undefined,
                      })),
                    );
                  }}
                  className="rounded bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
                >
                  모든 카드 초기화
                </button>
              </div>
            </section>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export const Route = createFileRoute("/examples/components/")({
  component: ComponentsPage,
});
