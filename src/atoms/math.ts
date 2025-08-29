/**
 * 수학 문제 시스템 상태 관리 (Jotai)
 * @description 수학 문제 시험, 답안, UI 상태를 관리하는 atoms
 */

import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { atomWithQuery, atomWithMutation } from "jotai-tanstack-query";
import type { MathQuestion, SubmitAnswerRequest } from "@/api/common/types";
import { getMockExamById } from "@/api/exam/api";

/**
 * 시험 관련 기본 상태
 */

/**
 * 현재 활성화된 시험 ID
 * @description 사용자가 현재 응시 중인 시험의 ID
 */
export const currentExamIdAtom = atom<string | null>(null);

/**
 * 현재 문제 인덱스
 * @description 사용자가 현재 보고 있는 문제의 인덱스 (0부터 시작)
 */
export const currentQuestionIndexAtom = atom<number>(0);

/**
 * 시험 데이터 조회 (서버 상태)
 * @description React Query와 통합된 시험 정보 조회
 */
export const currentExamQueryAtom = atomWithQuery((get) => {
  const examId = get(currentExamIdAtom);

  if (!examId) {
    return {
      queryKey: ["exam", "none"],
      enabled: false,
      queryFn: async () => null,
    };
  }

  return {
    queryKey: ["exam", examId],
    queryFn: async () => {
      const response = await getMockExamById(examId);
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    gcTime: 1000 * 60 * 30, // 30분간 가비지 컬렉션 방지
  };
});

/**
 * 현재 문제 계산된 상태
 * @description 현재 인덱스에 해당하는 문제 객체
 */
export const currentQuestionAtom = atom<MathQuestion | null>((get) => {
  const examQuery = get(currentExamQueryAtom);
  const currentIndex = get(currentQuestionIndexAtom);

  if (examQuery.isPending || examQuery.isError || !examQuery.data) {
    return null;
  }

  const problems = examQuery.data.problems;
  return (problems[currentIndex] as MathQuestion) || null;
});

/**
 * 시험 진행 상태 계산
 * @description 전체 문제 수, 현재 진행률 등
 */
export const examProgressAtom = atom((get) => {
  const examQuery = get(currentExamQueryAtom);
  const currentIndex = get(currentQuestionIndexAtom);
  const answers = get(answersAtom);

  if (!examQuery.data) {
    return {
      totalQuestions: 0,
      currentQuestion: 0,
      progress: 0,
      answeredCount: 0,
      isCompleted: false,
    };
  }

  const totalQuestions = examQuery.data.problems.length;
  const answeredCount = Object.keys(answers).length;
  const progress =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return {
    totalQuestions,
    currentQuestion: currentIndex + 1,
    progress: Math.round(progress),
    answeredCount,
    isCompleted: answeredCount === totalQuestions,
  };
});

/**
 * 답안 관리 상태
 */

/**
 * 사용자 답안 저장소 (localStorage 연동)
 * @description 문제 ID를 키로 하고 답안을 값으로 하는 맵
 *
 * 구조:
 * - 주관식: { "question-1": "x = 2y + 3" }
 * - 객관식: { "question-2": "option-id-3" }
 */
export const answersAtom = atomWithStorage<Record<string, string>>(
  "math-answers",
  {},
);

/**
 * 문제별 상태 추적
 * @description 각 문제의 응답 상태를 추적
 */
export const questionStatesAtom = atom<
  Record<string, "idle" | "answered" | "skipped" | "reviewing">
>({});

/**
 * 특정 문제의 답안 가져오기
 * @param questionId 문제 ID
 */
export const getQuestionAnswerAtom = (questionId: string) =>
  atom((get) => get(answersAtom)[questionId] || "");

/**
 * 특정 문제의 답안 설정하기
 * @param questionId 문제 ID
 * @param answer 답안 내용
 */
export const setQuestionAnswerAtom = atom(
  null,
  (
    get,
    set,
    { questionId, answer }: { questionId: string; answer: string },
  ) => {
    const currentAnswers = get(answersAtom);
    const newAnswers = { ...currentAnswers, [questionId]: answer };

    set(answersAtom, newAnswers);

    // 문제 상태를 'answered'로 변경
    const currentStates = get(questionStatesAtom);
    set(questionStatesAtom, {
      ...currentStates,
      [questionId]: answer.trim() ? "answered" : "idle",
    });
  },
);

/**
 * 현재 문제의 답안 상태
 * @description 현재 보고 있는 문제의 답안과 상태
 */
export const currentQuestionAnswerAtom = atom(
  (get) => {
    const currentQuestion = get(currentQuestionAtom);
    if (!currentQuestion) return { answer: "", state: "idle" as const };

    const answers = get(answersAtom);
    const states = get(questionStatesAtom);

    return {
      answer: answers[currentQuestion.id] || "",
      state: states[currentQuestion.id] || ("idle" as const),
    };
  },
  (get, set, answer: string) => {
    const currentQuestion = get(currentQuestionAtom);
    if (!currentQuestion) return;

    set(setQuestionAnswerAtom, {
      questionId: currentQuestion.id,
      answer,
    });
  },
);

/**
 * API 호출 관련 mutations
 */

/**
 * 답안 임시저장 mutation
 * @description 사용자 답안을 서버에 임시저장
 */
export const saveAnswerMutationAtom = atomWithMutation(() => ({
  mutationKey: ["save-answer"],
  mutationFn: async (request: SubmitAnswerRequest) => {
    // TODO: 실제 API 호출 구현
    console.log("답안 임시저장:", request);
    await new Promise((resolve) => setTimeout(resolve, 500)); // 임시 지연
    return { success: true };
  },
  onSuccess: () => {
    console.log("답안 임시저장 성공");
  },
  onError: (error) => {
    console.error("답안 임시저장 실패:", error);
  },
}));

/**
 * 답안 최종제출 mutation
 * @description 사용자 답안을 서버에 최종 제출
 */
export const submitAnswerMutationAtom = atomWithMutation(() => ({
  mutationKey: ["submit-answer"],
  mutationFn: async (request: SubmitAnswerRequest) => {
    // TODO: 실제 API 호출 구현
    console.log("답안 최종제출:", request);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 임시 지연
    return { success: true };
  },
  onSuccess: () => {
    console.log("답안 제출 성공");
  },
  onError: (error) => {
    console.error("답안 제출 실패:", error);
  },
}));

/**
 * UI 설정 및 상태 관리
 */

/**
 * 수학 문제 UI 설정 (localStorage 저장)
 * @description 사용자의 UI 선호도 설정
 */
export const mathConfigAtom = atomWithStorage("math-config", {
  /** LaTeX 미리보기 표시 여부 */
  showLatexPreview: true,
  /** 자동저장 활성화 여부 */
  autoSave: true,
  /** 자동저장 간격 (밀리초) */
  autoSaveInterval: 30000,
  /** 문제 번호 표시 여부 */
  showQuestionNumbers: true,
  /** 진행률 표시 여부 */
  showProgressBar: true,
  /** 키보드 단축키 활성화 */
  enableKeyboardShortcuts: true,
  /** 답안 확인 다이얼로그 표시 */
  showAnswerConfirmation: true,
});

/**
 * MathJax 렌더링 상태
 * @description MathJax 초기화 및 렌더링 상태 추적
 */
export const mathJaxStateAtom = atom({
  /** MathJax 초기화 완료 여부 */
  isReady: false,
  /** 렌더링된 수식 개수 */
  renderCount: 0,
  /** 렌더링 중인 수식 개수 */
  pendingCount: 0,
  /** 마지막 렌더링 시간 */
  lastRenderTime: null as Date | null,
});

/**
 * 시험 타이머 상태
 * @description 시험 시간 관리
 */
export const examTimerAtom = atom({
  /** 시작 시간 */
  startTime: null as Date | null,
  /** 종료 시간 */
  endTime: null as Date | null,
  /** 일시정지 여부 */
  isPaused: false,
  /** 남은 시간 (초) */
  remainingTime: 0,
  /** 제한 시간 (초) */
  timeLimit: 3600, // 기본 1시간
});

/**
 * 네비게이션 상태
 * @description 문제 간 이동 및 네비게이션
 */
export const navigationAtom = atom((get) => {
  const currentIndex = get(currentQuestionIndexAtom);
  const examQuery = get(currentExamQueryAtom);
  const totalQuestions = examQuery.data?.problems.length || 0;

  return {
    canGoPrevious: currentIndex > 0,
    canGoNext: currentIndex < totalQuestions - 1,
    isFirst: currentIndex === 0,
    isLast: currentIndex === totalQuestions - 1,
  };
});

/**
 * 문제 이동 액션들
 */
export const goToNextQuestionAtom = atom(null, (get, set) => {
  const navigation = get(navigationAtom);
  if (navigation.canGoNext) {
    const currentIndex = get(currentQuestionIndexAtom);
    set(currentQuestionIndexAtom, currentIndex + 1);
  }
});

export const goToPreviousQuestionAtom = atom(null, (get, set) => {
  const navigation = get(navigationAtom);
  if (navigation.canGoPrevious) {
    const currentIndex = get(currentQuestionIndexAtom);
    set(currentQuestionIndexAtom, currentIndex - 1);
  }
});

export const goToQuestionAtom = atom(null, (get, set, index: number) => {
  const examQuery = get(currentExamQueryAtom);
  const totalQuestions = examQuery.data?.problems.length || 0;

  if (index >= 0 && index < totalQuestions) {
    set(currentQuestionIndexAtom, index);
  }
});

/**
 * 자동저장 관련 상태
 */
export const autoSaveAtom = atom((get) => {
  const config = get(mathConfigAtom);
  const currentQuestion = get(currentQuestionAtom);
  const currentAnswer = get(currentQuestionAnswerAtom);

  return {
    isEnabled: config.autoSave,
    interval: config.autoSaveInterval,
    hasUnsavedChanges: currentAnswer.answer.trim().length > 0,
    lastSaveTime: null as Date | null,
  };
});

/**
 * 전역 상태 초기화
 * @description 새로운 시험 시작 시 상태 초기화
 */
export const resetExamStateAtom = atom(null, (get, set) => {
  set(currentExamIdAtom, null);
  set(currentQuestionIndexAtom, 0);
  set(answersAtom, {});
  set(questionStatesAtom, {});
  set(mathJaxStateAtom, {
    isReady: false,
    renderCount: 0,
    pendingCount: 0,
    lastRenderTime: null,
  });
  set(examTimerAtom, {
    startTime: null,
    endTime: null,
    isPaused: false,
    remainingTime: 0,
    timeLimit: 3600,
  });
});

/**
 * 시험 시작 액션
 * @description 시험을 시작하고 필요한 상태를 설정
 */
export const startExamAtom = atom(
  null,
  (get, set, { examId, timeLimit }: { examId: string; timeLimit?: number }) => {
    // 기존 상태 초기화
    set(resetExamStateAtom);

    // 새 시험 설정
    set(currentExamIdAtom, examId);

    // 타이머 설정
    const now = new Date();
    set(examTimerAtom, {
      startTime: now,
      endTime: null,
      isPaused: false,
      remainingTime: timeLimit || 3600,
      timeLimit: timeLimit || 3600,
    });
  },
);
