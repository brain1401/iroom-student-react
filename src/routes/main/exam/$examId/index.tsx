import { ExamQuestionItem } from "@/components/exam";
import { PageHeader } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { createFileRoute } from "@tanstack/react-router";
import type { ProblemStatus } from "@/components/shared/types";

export const Route = createFileRoute("/main/exam/$examId/")({
  component: RouteComponent,
});

export type ExamQuestion = {
  id: string;
  questionNumber: number;
  category: string;
  type: string;
  difficulty: string;
  status: ProblemStatus;
  // 답안 상세 정보 추가
  questionText?: string;
  studentAnswer?: string;
  correctAnswer?: string;
  isCorrect?: boolean;
  score?: number; // 배점
  earnedScore?: number; // 획득 점수
  // 추가 정보
  solution?: string;
  isSubjective?: boolean;
};

const examQuestions: ExamQuestion[] = [
  {
    id: "0198e5a3-4931-768e-a519-4bade610257c",
    questionNumber: 1,
    category: "다항식의 덧셈·뺄셈",
    type: "계산",
    difficulty: "중" as const,
    status: "completed" as const,
    // 답안 상세 정보 추가
    questionText: "다항식 (2x + 3) + (x - 1)을 계산하시오.",
    studentAnswer: "3x + 2",
    correctAnswer: "3x + 2",
    isCorrect: true,
    score: 5,
    earnedScore: 5,
    // 추가 정보
    solution:
      "1) (2x + 3) + (x - 1)\n2) 2x + 3 + x - 1\n3) (2x + x) + (3 - 1)\n4) 3x + 2",
    isSubjective: false,
  },
  {
    id: "233a1234-4931-768e-a519-fhgujysdf",
    questionNumber: 2,
    category: "이차방정식",
    type: "계산",
    difficulty: "하" as const,
    status: "completed" as const,
    // 답안 상세 정보 추가
    questionText: "x² - 4 = 0을 풀어라.",
    studentAnswer: "x = 2",
    correctAnswer: "x = ±2",
    isCorrect: false,
    score: 3,
    earnedScore: 0,
    // 추가 정보
    solution:
      "1) x² - 4 = 0\n2) x² = 4\n3) x = ±√4 = ±2\n\n오답 이유: x = 2만 답했지만, x = -2도 해입니다. 제곱근은 항상 ± 부호를 가집니다.",
    isSubjective: false,
  },
  {
    id: "393a1234-kfgy-sdss-dfd-2sdfsdf3asd",
    questionNumber: 3,
    category: "삼각함수",
    type: "계산",
    difficulty: "상" as const,
    status: "locked" as const,
    // 답안 상세 정보 추가
    questionText: "sin²θ + cos²θ = ?",
    studentAnswer: "1",
    correctAnswer: "1",
    isCorrect: true,
    score: 4,
    earnedScore: 4,
    // 추가 정보
    solution:
      "1) sin²θ + cos²θ = 1\n2) 이는 삼각함수의 기본 항등식입니다.\n3) 단위원에서 sin²θ + cos²θ = 1이 항상 성립합니다.",
    isSubjective: false,
  },
  {
    id: "fg4rds-fs3g-768e-a519-gjjkdfefs",
    questionNumber: 4,
    category: "미분법",
    type: "계산",
    difficulty: "상" as const,
    status: "active" as const,
    // 답안 상세 정보 추가
    questionText: "f(x) = x³ + 2x² + 1의 도함수를 구하라.",
    studentAnswer: "3x² + 4x",
    correctAnswer: "3x² + 4x",
    isCorrect: true,
    score: 5,
    earnedScore: 5,
    // 추가 정보
    solution:
      "1) f(x) = x³ + 2x² + 1\n2) f'(x) = 3x² + 4x\n3) x³의 도함수: 3x²\n4) 2x²의 도함수: 4x\n5) 상수 1의 도함수: 0",
    isSubjective: false,
  },
  {
    id: "555a1234-4931-768e-a519-4bade610257c",
    questionNumber: 5,
    category: "적분법",
    type: "계산",
    difficulty: "중" as const,
    status: "completed" as const,
    // 답안 상세 정보 추가
    questionText: "∫(2x + 1)dx를 계산하라.",
    studentAnswer: "x² + x + C",
    correctAnswer: "x² + x + C",
    isCorrect: true,
    score: 4,
    earnedScore: 4,
    // 추가 정보
    solution:
      "1) ∫(2x + 1)dx\n2) ∫2x dx + ∫1 dx\n3) 2·(x²/2) + x + C\n4) x² + x + C\n\n적분 상수 C를 잊지 마세요!",
    isSubjective: false,
  },
];

// 시험 전체 정보
const examInfo = {
  totalScore: 21, // 5+0+4+5+4 = 21점
  examTitle: "가나다 시험",
  chapters: ["다항식", "이차방정식", "삼각함수", "미분법", "적분법"],
};

const handleQuestionNavigate = (questionId: string) => {
  alert(`${questionId}번 문제에서 뒤로가기`);
};

function RouteComponent() {
  const { examId } = Route.useParams();
  return (
    <div>
      <PageHeader title="가나다 시험" shouldShowBackButton={true} />

      {/* 시험 요약정보 카드 */}
      <div className="px-4 mt-6">
        <div className="bg-white rounded-lg border border-purple-500 shadow-sm p-6">
          <div className="space-y-4">
            {/* 시험명 */}
            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 w-16">
                시험명 :
              </span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {examInfo.examTitle}
              </span>
            </div>

            {/* 총 문항 수 */}
            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 w-16">
                총문항 :
              </span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                20
              </span>
            </div>

            {/* 객관식/주관식 문항 수 */}
            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 w-16">
                문항구성 :
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 dark:text-white">
                  객 <span className="font-semibold">18</span>
                </span>
                <span className="text-gray-400">/</span>
                <span className="text-gray-900 dark:text-white">
                  주 <span className="font-semibold">2</span>
                </span>
              </div>
            </div>

            {/* 단원명 */}
            <div className="flex items-start">
              <span className="text-sm text-gray-500 dark:text-gray-400 w-16 mt-1">
                단원 :
              </span>
              <div className="flex flex-wrap gap-2">
                {examInfo.chapters.map((chapter) => (
                  <Badge
                    key={chapter}
                    variant="secondary"
                    className="bg-main-100 text-main-800 border-main-200 dark:bg-main-900/20 dark:text-main-300 dark:border-main-700"
                  >
                    {chapter}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 그래프 공간 */}

      <div className="px-4">
        <div>
          {examQuestions.map((question, index) => (
            <div key={question.id} className={index === 0 ? "mt-4" : "mt-4"}>
              <ExamQuestionItem question={question} examId={examId} />
            </div>
          ))}
        </div>
        {/* 총점 표시 */}
        <div className="mt-8 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-blue-800">총점</span>
              <span className="text-2xl font-bold text-blue-600">
                {examInfo.totalScore}점
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
