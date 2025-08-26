import type { MockExam } from "./types";

// 목업 데이터 저장소
const mockExamData: Record<string, MockExam> = {
  "exam-2024-math-01": {
    id: "exam-2024-math-01",
    title: "2024학년도 3월 고3 전국연합학력평가 수학영역",
    description:
      "2024년 3월 고등학교 3학년 대상 전국연합학력평가 수학영역 모의고사입니다. 총 30문항으로 구성되어 있으며, 100분 동안 진행됩니다.",
    problems: [
      {
        id: "prob-001",
        title: "지수함수의 그래프",
        description:
          "함수 f(x) = 2^x - 1의 그래프와 y = k가 서로 다른 두 점에서 만날 때, 상수 k의 값의 범위는?",
        answer: "k > -1",
        createdAt: "2024-03-01T09:00:00.000Z",
        updatedAt: "2024-03-01T09:00:00.000Z",
        examId: "exam-2024-math-01",
      },
      {
        id: "prob-002",
        title: "삼각함수의 극한",
        description: "lim(x→0) [sin(3x) / tan(2x)]의 값을 구하시오.",
        answer: "3/2",
        createdAt: "2024-03-01T09:00:00.000Z",
        updatedAt: "2024-03-01T09:00:00.000Z",
        examId: "exam-2024-math-01",
      },
      {
        id: "prob-003",
        title: "미분계수와 접선의 방정식",
        description:
          "곡선 y = x³ - 3x² + 2 위의 점 (2, -2)에서의 접선의 방정식을 구하시오.",
        answer: "y = 0",
        createdAt: "2024-03-01T09:00:00.000Z",
        updatedAt: "2024-03-01T09:00:00.000Z",
        examId: "exam-2024-math-01",
      },
      {
        id: "prob-004",
        title: "정적분의 계산",
        description: "∫₀² (x² + 2x - 3) dx의 값을 구하시오.",
        answer: "2/3",
        createdAt: "2024-03-01T09:00:00.000Z",
        updatedAt: "2024-03-01T09:00:00.000Z",
        examId: "exam-2024-math-01",
      },
      {
        id: "prob-005",
        title: "수열의 극한",
        description:
          "수열 {aₙ}이 aₙ = (3n² + 2n) / (n² - 1)일 때, lim(n→∞) aₙ의 값은?",
        answer: "3",
        createdAt: "2024-03-01T09:00:00.000Z",
        updatedAt: "2024-03-01T09:00:00.000Z",
        examId: "exam-2024-math-01",
      },
    ],
    createdAt: "2024-03-01T08:00:00.000Z",
    updatedAt: "2024-03-15T10:30:00.000Z",
  },
  "exam-2024-math-02": {
    id: "exam-2024-math-02",
    title: "2024학년도 6월 고3 모의평가 수학영역",
    description:
      "한국교육과정평가원 주관 2024학년도 6월 대학수학능력시험 모의평가 수학영역입니다. 공통과목과 선택과목으로 구성되어 있습니다.",
    problems: [
      {
        id: "prob-math-006",
        title: "벡터의 내적",
        description:
          "두 벡터 a = (2, 3), b = (1, -4)에 대하여 a·b의 값을 구하시오.",
        answer: "-10",
        createdAt: "2024-06-01T09:00:00.000Z",
        updatedAt: "2024-06-01T09:00:00.000Z",
        examId: "exam-2024-math-02",
      },
      {
        id: "prob-math-007",
        title: "확률과 통계",
        description:
          "주사위를 3번 던질 때, 6의 약수가 적어도 2번 나올 확률을 구하시오.",
        answer: "20/27",
        createdAt: "2024-06-01T09:00:00.000Z",
        updatedAt: "2024-06-01T09:00:00.000Z",
        examId: "exam-2024-math-02",
      },
      {
        id: "prob-math-008",
        title: "등비수열의 합",
        description:
          "첫째항이 2, 공비가 3인 등비수열의 처음 5항까지의 합을 구하시오.",
        answer: "242",
        createdAt: "2024-06-01T09:00:00.000Z",
        updatedAt: "2024-06-01T09:00:00.000Z",
        examId: "exam-2024-math-02",
      },
      {
        id: "prob-math-009",
        title: "이차함수의 최댓값",
        description: "함수 f(x) = -2x² + 8x - 3의 최댓값을 구하시오.",
        answer: "5",
        createdAt: "2024-06-01T09:00:00.000Z",
        updatedAt: "2024-06-01T09:00:00.000Z",
        examId: "exam-2024-math-02",
      },
    ],
    createdAt: "2024-06-01T08:00:00.000Z",
    updatedAt: "2024-06-15T10:30:00.000Z",
  },
  "exam-2024-math-03": {
    id: "exam-2024-math-03",
    title: "2024학년도 9월 고3 모의평가 수학영역",
    description:
      "한국교육과정평가원 주관 2024학년도 9월 대학수학능력시험 모의평가 수학영역입니다. 미적분, 기하, 확률과 통계를 포함합니다.",
    problems: [
      {
        id: "prob-math-010",
        title: "로그함수의 그래프",
        description:
          "함수 f(x) = log₂(x+3) - 1의 그래프가 x축과 만나는 점의 x좌표를 구하시오.",
        answer: "-1",
        createdAt: "2024-09-01T09:00:00.000Z",
        updatedAt: "2024-09-01T09:00:00.000Z",
        examId: "exam-2024-math-03",
      },
      {
        id: "prob-math-011",
        title: "조합과 경우의 수",
        description:
          "1부터 10까지의 자연수 중에서 서로 다른 3개를 선택하여 만들 수 있는 집합의 개수를 구하시오.",
        answer: "120",
        createdAt: "2024-09-01T09:00:00.000Z",
        updatedAt: "2024-09-01T09:00:00.000Z",
        examId: "exam-2024-math-03",
      },
      {
        id: "prob-math-012",
        title: "타원의 방정식",
        description:
          "두 초점이 F(3, 0), F'(-3, 0)이고, 장축의 길이가 10인 타원의 방정식을 구하시오.",
        answer: "x²/25 + y²/16 = 1",
        createdAt: "2024-09-01T09:00:00.000Z",
        updatedAt: "2024-09-01T09:00:00.000Z",
        examId: "exam-2024-math-03",
      },
      {
        id: "prob-math-013",
        title: "정규분포",
        description:
          "확률변수 X가 정규분포 N(50, 10²)을 따를 때, P(40 < X < 60)의 값을 구하시오. (단, 표준정규분포표에서 P(0 < Z < 1) = 0.3413)",
        answer: "0.6826",
        createdAt: "2024-09-01T09:00:00.000Z",
        updatedAt: "2024-09-01T09:00:00.000Z",
        examId: "exam-2024-math-03",
      },
    ],
    createdAt: "2024-09-01T08:00:00.000Z",
    updatedAt: "2024-09-10T14:20:00.000Z",
  },
};

async function getMockExam(examId: string): Promise<MockExam> {
  // 실제 API 호출을 시뮬레이션하기 위한 약간의 지연
  await new Promise((resolve) => setTimeout(resolve, 300));

  // 요청된 ID에 해당하는 모의고사 데이터 반환
  // 없는 경우 기본 데이터 반환
  const exam = mockExamData[examId];
  if (exam) return exam;

  const defaultExam: MockExam = {
    id: examId,
    title: "행렬 1",
    description: "요청하신 모의고사를 찾을 수 없어 샘플 데이터를 제공합니다.",
    problems: [
      {
        id: "sample-001",
        title: "샘플 문제 1",
        description:
          "이것은 샘플 문제입니다. 실제 문제는 해당 모의고사 ID로 조회할 수 있습니다.",
        answer: "샘플 정답",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        examId: examId,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return defaultExam;
}

// 모든 모의고사 목록 조회
export async function getAllMockExams(): Promise<MockExam[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return Object.values(mockExamData);
}

// 특정 모의고사 조회
export async function getMockExamById(examId: string): Promise<MockExam> {
  return getMockExam(examId);
}

// 모의고사 ID 목록 조회
export async function getMockExamIds(): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return Object.keys(mockExamData);
}
