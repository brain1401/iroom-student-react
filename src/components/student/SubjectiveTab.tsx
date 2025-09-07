/**
 * 주관식 탭 컴포넌트
 * @description 주관식 문제 답안 제출을 위한 UI
 *
 * 주요 기능:
 * - 문제별 이미지 촬영
 * - 촬영된 이미지 표시
 * - 이미지 인식 결과 표시
 * - 답안 입력 및 제출
 *
 * @example
 * ```tsx
 * <SubjectiveTab onNext={() => handleNext()} />
 * ```
 */

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Loader2, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  ExamDetailResult,
  QuestionAnswer,
  ExamQuestionsData,
  Question,
} from "@/api/student/types";
import { FileUpload } from "../layout";
import { recognizeTextAsync } from "@/api/text-recognition/async-api";
import type { AsyncResultResponse } from "@/api/text-recognition/async-api";
// useMutation 제거 - 간단한 fetch 방식 사용
import { Button } from "@/components/ui/button";

// ============================================================================
// 타입 정의
// ============================================================================

/**
 * 주관식 문제 데이터 타입
 * @description 문제별 이미지, 인식 결과, 답안 정보
 */
type SubjectiveQuestion = (QuestionAnswer | Question) & {
  /** 문제 이미지 URL (사용자가 촬영한 이미지) */
  capturedImageUrl?: string;
  /** 이미지 인식된 풀이 과정 */
  recognizedSolution?: string;
  /** 최종 답안 (사용자 입력) */
  userAnswer?: string;
};

/**
 * 제출 상태 타입
 * @description 제출 진행 상태를 관리
 */
type SubmissionState = {
  /** 제출 확인 모달 표시 여부 */
  showConfirmModal: boolean;
  /** 제출 완료 모달 표시 여부 */
  showSubmissionModal: boolean;
  /** 남은 시간 (초) */
  remainingTime: number;
  /** 제출 중 로딩 상태 */
  isSubmitting: boolean;
};

/**
 * 텍스트 인식 상태 타입
 * @description 텍스트 인식 진행 상태를 관리
 */
type TextRecognitionState = {
  /** 텍스트 인식 중 여부 */
  isRecognizing: boolean;
  /** 인식 진행률 (0-100) */
  progress: number;
  /** 현재 상태 메시지 */
  message: string;
  /** 인식 결과 */
  recognitionResult?: AsyncResultResponse;
  /** 에러 메시지 */
  error?: string;
};

// ============================================================================
// 상수 정의
// ============================================================================

/** 제출 완료 후 대기 시간 (초) */
const SUBMISSION_COUNTDOWN_SECONDS = 3;

/** API 호출 시뮬레이션 시간 (밀리초) */
const API_SIMULATION_DELAY = 2000;

// 기본값 설정 (데이터가 없을 때 사용)
const DEFAULT_SCORE_PER_QUESTION = 10;

/**
 * 백워드 호환성을 위한 데이터 유틸리티 함수들
 * @description 신규 API와 기존 API 데이터 구조를 상호 변환
 */

/**
 * 시험 데이터가 신규 API 구조인지 확인
 */
function IsExamQuestionsData(
  examDetail: ExamDetailResult | ExamQuestionsData,
): examDetail is ExamQuestionsData {
  return "questions" in examDetail && "multipleChoiceCount" in examDetail;
}

/**
 * 문제 데이터가 신규 API 구조인지 확인
 */
function IsNewQuestion(
  question: QuestionAnswer | Question,
): question is Question {
  return "seqNo" in question && "questionText" in question;
}

/**
 * 시험 데이터에서 주관식 문제만 추출
 */
function ExtractSubjectiveQuestions(
  examDetail: ExamDetailResult | ExamQuestionsData,
): (QuestionAnswer | Question)[] {
  if (IsExamQuestionsData(examDetail)) {
    // 신규 API: questions 배열에서 SUBJECTIVE 필터링
    return (
      examDetail.questions?.filter((q) => q.questionType === "SUBJECTIVE") || []
    );
  } else {
    // 기존 API: questionAnswers 배열에서 주관식 필터링
    return (
      examDetail?.questionAnswers?.filter(
        (q) => q.questionType === "주관식" || q.questionType === "SUBJECTIVE",
      ) || []
    );
  }
}

/**
 * 문제 데이터에서 공통 필드 추출 (백워드 호환성)
 */
function GetQuestionFields(question: QuestionAnswer | Question) {
  if (IsNewQuestion(question)) {
    // 신규 API 구조
    return {
      questionId: question.questionId,
      questionOrder: question.seqNo, // seqNo → questionOrder 매핑
      questionSummary:
        question.questionText.substring(0, 50) +
        (question.questionText.length > 50 ? "..." : ""), // questionText를 요약으로 변환
      points: question.points,
      difficulty: question.difficulty,
      unitInfo: null, // 신규 API에는 unitInfo가 없음
    };
  } else {
    // 기존 API 구조
    return {
      questionId: question.questionId,
      questionOrder: question.questionOrder,
      questionSummary: question.questionSummary,
      points: question.points,
      difficulty: question.difficulty,
      unitInfo: question.unitInfo,
    };
  }
}

// ============================================================================
// 커스텀 훅
// ============================================================================

/**
 * 제출 상태 관리 함수
 * @description 제출 관련 상태와 핸들러를 관리
 */
function CreateSubmissionState() {
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    showConfirmModal: false,
    showSubmissionModal: false,
    remainingTime: SUBMISSION_COUNTDOWN_SECONDS,
    isSubmitting: false,
  });

  const setShowConfirmModal = useCallback((show: boolean) => {
    setSubmissionState((prev) => ({ ...prev, showConfirmModal: show }));
  }, []);

  const setShowSubmissionModal = useCallback((show: boolean) => {
    setSubmissionState((prev) => ({ ...prev, showSubmissionModal: show }));
  }, []);

  const setRemainingTime = useCallback((time: number) => {
    setSubmissionState((prev) => ({ ...prev, remainingTime: time }));
  }, []);

  const setIsSubmitting = useCallback((submitting: boolean) => {
    setSubmissionState((prev) => ({ ...prev, isSubmitting: submitting }));
  }, []);

  const resetSubmissionState = useCallback(() => {
    setSubmissionState({
      showConfirmModal: false,
      showSubmissionModal: false,
      remainingTime: SUBMISSION_COUNTDOWN_SECONDS,
      isSubmitting: false,
    });
  }, []);

  return {
    ...submissionState,
    setShowConfirmModal,
    setShowSubmissionModal,
    setRemainingTime,
    setIsSubmitting,
    resetSubmissionState,
  };
}

/**
 * 제출 카운트다운 함수
 * @description 제출 완료 후 로그인 페이지 이동을 위한 카운트다운
 */
function CreateSubmissionCountdown(
  showSubmissionModal: boolean,
  isSubmitting: boolean,
  remainingTime: number,
  setRemainingTime: (time: number) => void,
) {
  useEffect(() => {
    if (showSubmissionModal && !isSubmitting && remainingTime > 0) {
      const timer = setTimeout(() => {
        setRemainingTime(remainingTime - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }

    if (showSubmissionModal && !isSubmitting && remainingTime === 0) {
      // 로그인 페이지로 이동
      window.location.href = "/";
    }
  }, [showSubmissionModal, isSubmitting, remainingTime, setRemainingTime]);
}

/**
 * 텍스트 인식 상태 관리 함수
 * @description 텍스트 인식 관련 상태와 핸들러를 관리
 */
function CreateTextRecognitionState() {
  const [recognitionState, setRecognitionState] =
    useState<TextRecognitionState>({
      isRecognizing: false,
      progress: 0,
      message: "",
      recognitionResult: undefined,
      error: undefined,
    });

  const setIsRecognizing = useCallback((recognizing: boolean) => {
    setRecognitionState((prev) => ({ ...prev, isRecognizing: recognizing }));
  }, []);

  const setProgress = useCallback((progress: number) => {
    setRecognitionState((prev) => ({ ...prev, progress }));
  }, []);

  const setMessage = useCallback((message: string) => {
    setRecognitionState((prev) => ({ ...prev, message }));
  }, []);

  const setRecognitionResult = useCallback((result: AsyncResultResponse) => {
    setRecognitionState((prev) => ({ ...prev, recognitionResult: result }));
  }, []);

  const setError = useCallback((error: string) => {
    setRecognitionState((prev) => ({ ...prev, error }));
  }, []);

  const resetRecognitionState = useCallback(() => {
    setRecognitionState({
      isRecognizing: false,
      progress: 0,
      message: "",
      recognitionResult: undefined,
      error: undefined,
    });
  }, []);

  return {
    ...recognitionState,
    setIsRecognizing,
    setProgress,
    setMessage,
    setRecognitionResult,
    setError,
    resetRecognitionState,
  };
}

// ============================================================================
// 하위 컴포넌트
// ============================================================================

/**
 * 답안 입력 컴포넌트
 * @description 최종 답안을 입력하는 텍스트 영역
 */
type AnswerInputProps = {
  /** 문제 ID */
  questionId: string;
  /** 문제 순서 */
  questionOrder: number;
  /** 현재 답안 */
  answer?: string;
  /** 답안 변경 핸들러 */
  onAnswerChange: (questionId: string, answer: string) => void;
};

function AnswerInput({
  questionId,
  questionOrder: _questionOrder,
  answer,
  onAnswerChange,
}: AnswerInputProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={`answer-${questionId}`}
        className="block text-sm font-medium text-gray-700"
      >
        최종 답안
      </label>
      <textarea
        id={`answer-${questionId}`}
        value={answer || ""}
        onChange={(e) => onAnswerChange(questionId, e.target.value)}
        placeholder="답안을 입력하세요"
        className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
    </div>
  );
}

/**
 * 문제 아이템 컴포넌트
 * @description 개별 문제의 전체 UI를 구성
 */
type QuestionItemProps = {
  /** 문제 데이터 */
  question: SubjectiveQuestion;
  /** 촬영 핸들러 */
  onCapture: (questionId: string) => void;
  /** 답안 변경 핸들러 */
  onAnswerChange: (questionId: string, answer: string) => void;
};

function QuestionItem({
  question,
  onCapture: _onCapture,
  onAnswerChange,
}: QuestionItemProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">
              문제 {GetQuestionFields(question).questionOrder}번
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">주관식</Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              {GetQuestionFields(question).points || DEFAULT_SCORE_PER_QUESTION}
              점
            </Badge>
            {GetQuestionFields(question).difficulty && (
              <Badge variant="outline" className="text-gray-500">
                {GetQuestionFields(question).difficulty}
              </Badge>
            )}
          </div>
        </div>

        {GetQuestionFields(question).questionSummary && (
          <span
            className="text-sm text-gray-500 truncate max-w-xs flex"
            dangerouslySetInnerHTML={{
              __html: GetQuestionFields(question).questionSummary,
            }}
          />
        )}
        {/* 문제 이미지가 있다면 여기에 추가하는 코드 만들기 */}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 단원 정보 */}
        {GetQuestionFields(question).unitInfo && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">단원 정보</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                {GetQuestionFields(question).unitInfo?.categoryName}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {GetQuestionFields(question).unitInfo?.subcategoryName}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {GetQuestionFields(question).unitInfo?.unitName}
              </Badge>
            </div>
          </div>
        )}

        {/* 이미지 인식 결과 */}
        {question.recognizedSolution && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">인식된 풀이 과정</h4>
            <div className="p-4 bg-gray-50 rounded-lg">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {question.recognizedSolution}
              </pre>
            </div>
          </div>
        )}

        {/* 답안 입력 */}
        <AnswerInput
          questionId={GetQuestionFields(question).questionId}
          questionOrder={GetQuestionFields(question).questionOrder}
          answer={question.userAnswer}
          onAnswerChange={onAnswerChange}
        />
      </CardContent>
    </Card>
  );
}

/**
 * 제출 확인 모달 컴포넌트
 * @description 시험 제출 확인 메시지를 표시
 */
type SubmissionConfirmModalProps = {
  /** 모달 표시 여부 */
  isVisible: boolean;
  /** 답안 완성도 */
  completionRate: number;
  /** 확인 클릭 핸들러 */
  onConfirm: () => void;
  /** 취소 클릭 핸들러 */
  onCancel: () => void;
};

function SubmissionConfirmModal({
  isVisible,
  completionRate,
  onConfirm,
  onCancel,
}: SubmissionConfirmModalProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl">
        <h3 className="text-xl font-bold text-gray-900 mb-2">제출 확인</h3>
        <p className="text-gray-600 mb-4">
          답안 완성도: {Math.round(completionRate)}%
        </p>
        <p className="text-gray-600 mb-4">
          제출하시면 답안을 수정할 수 없습니다. 제출하시겠습니까?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-main-500 text-white font-semibold rounded-lg hover:bg-main-600 transition-colors duration-200"
          >
            확인
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * 제출 완료 모달 컴포넌트
 * @description 시험 제출 완료 메시지를 표시
 */
type SubmissionCompleteModalProps = {
  /** 모달 표시 여부 */
  isVisible: boolean;
  /** 남은 시간 (초) */
  remainingTime: number;
  /** 제출 중 로딩 상태 */
  isSubmitting: boolean;
};

function SubmissionCompleteModal({
  isVisible,
  remainingTime,
  isSubmitting,
}: SubmissionCompleteModalProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl">
        {isSubmitting ? (
          <>
            <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              답안을 제출하고 있습니다
            </h3>
            <p className="text-gray-600 mb-4">잠시만 기다려주세요...</p>
          </>
        ) : (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              시험 제출이 완료되었습니다
            </h3>
            <p className="text-gray-600 mb-4">
              잠시 후 로그인 페이지로 이동합니다
            </p>
            <div className="text-sm text-gray-500">
              {remainingTime}초 후 이동...
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * 텍스트 인식 진행 모달 컴포넌트
 * @description 텍스트 인식 진행 상태를 표시
 */
type TextRecognitionModalProps = {
  /** 모달 표시 여부 */
  isVisible: boolean;
  /** 인식 중 여부 */
  isRecognizing: boolean;
  /** 진행률 (0-100) */
  progress: number;
  /** 상태 메시지 */
  message: string;
  /** 에러 메시지 */
  error?: string;
  /** 취소 핸들러 */
  onCancel?: () => void;
};

function TextRecognitionModal({
  isVisible,
  isRecognizing,
  progress,
  message,
  error,
  onCancel,
}: TextRecognitionModalProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl">
        {isRecognizing ? (
          <>
            <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              텍스트 인식 중
            </h3>
            <p className="text-gray-600 mb-4">{message}</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-sm text-gray-500 mb-4">{progress}%</div>
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
            )}
          </>
        ) : error ? (
          <>
            <div className="w-16 h-16 text-red-500 mx-auto mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              텍스트 인식 실패
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              확인
            </button>
          </>
        ) : (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              텍스트 인식 완료
            </h3>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              확인
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 메인 컴포넌트
// ============================================================================

/**
 * 주관식 탭 메인 컴포넌트
 * @description 주관식 문제 답안 제출 UI
 */

/**
 * 주관식 탭 메인 컴포넌트
 * @description 주관식 문제 답안 제출 UI
 */
type SubjectiveTabProps = {
  /** 시험 상세 정보 (기존 API 또는 신규 API) */
  examDetail?: ExamDetailResult | ExamQuestionsData;
  /** 다음 단계로 이동하는 핸들러 */
  onNext?: () => void;
};

export function SubjectiveTab({ examDetail, onNext }: SubjectiveTabProps) {
  // 시험 데이터에서 주관식 문제들만 필터링 (신규/기존 API 모두 지원)
  const subjectiveQuestions = examDetail
    ? ExtractSubjectiveQuestions(examDetail)
    : [];

  // 주관식 문제를 SubjectiveQuestion 타입으로 변환하여 상태 초기화
  const [questionsState, setQuestionsState] = useState<SubjectiveQuestion[]>(
    () =>
      subjectiveQuestions.map((question) => ({
        ...question,
        capturedImageUrl: undefined,
        recognizedSolution: undefined,
        userAnswer: undefined,
      })),
  );

  // 시험 데이터가 변경되면 문제 상태 업데이트
  useEffect(() => {
    const newSubjectiveQuestions = examDetail
      ? ExtractSubjectiveQuestions(examDetail)
      : [];

    setQuestionsState((prev) => {
      // 기존 사용자 입력 데이터 유지하면서 새 문제 데이터로 업데이트
      return newSubjectiveQuestions.map((question) => {
        const existing = prev.find((p) => p.questionId === question.questionId);
        return {
          ...question,
          capturedImageUrl: existing?.capturedImageUrl,
          recognizedSolution: existing?.recognizedSolution,
          userAnswer: existing?.userAnswer,
        };
      });
    });
  }, [examDetail]);

  // 제출 상태 관리
  const {
    showConfirmModal,
    showSubmissionModal,
    remainingTime,
    isSubmitting,
    setShowConfirmModal,
    setShowSubmissionModal,
    setRemainingTime,
    setIsSubmitting,
    resetSubmissionState: _resetSubmissionState,
  } = CreateSubmissionState();

  // 텍스트 인식 상태 관리
  const {
    isRecognizing,
    progress,
    message,
    recognitionResult,
    error: recognitionError,
    setIsRecognizing,
    setProgress,
    setMessage,
    setRecognitionResult,
    setError: setRecognitionError,
    resetRecognitionState,
  } = CreateTextRecognitionState();

  // 카운트다운 설정
  CreateSubmissionCountdown(
    showSubmissionModal,
    isSubmitting,
    remainingTime,
    setRemainingTime,
  );

  // 이미지 촬영 핸들러 (문제 ID가 string 타입으로 변경)
  const handleCapture = useCallback((questionId: string) => {
    console.log(`문제 ${questionId} 촬영`);

    // TODO: 실제 카메라/이미지 업로드 기능 구현
    // 임시로 더미 이미지 URL 설정 (개발용)
    setQuestionsState((prev) =>
      prev.map((q) =>
        q.questionId === questionId
          ? {
              ...q,
              capturedImageUrl: `https://via.placeholder.com/400x300?text=문제+${GetQuestionFields(q).questionOrder}번+이미지`,
              recognizedSolution: `문제 ${GetQuestionFields(q).questionOrder}번의 인식된 풀이 과정입니다.\n수식: 2x + 3 = 7\n따라서 x = 2`,
            }
          : q,
      ),
    );
  }, []);

  // 답안 변경 핸들러 (문제 ID가 string 타입으로 변경)
  const handleAnswerChange = useCallback(
    (questionId: string, answer: string) => {
      setQuestionsState((prev) =>
        prev.map((q) =>
          q.questionId === questionId ? { ...q, userAnswer: answer } : q,
        ),
      );
    },
    [],
  );

  // 간단한 텍스트 인식 함수
  const handleTextRecognition = useCallback(async (file: File) => {
    try {
      // 상태 초기화
      resetRecognitionState();
      setIsRecognizing(true);
      setProgress(0);
      setMessage("이미지를 업로드하고 있습니다...");

      // 비동기 텍스트 인식 실행
      const result = await recognizeTextAsync(file, {
        priority: 5,
        useCache: true,
        onProgress: (message, progress) => {
          setMessage(message);
          setProgress(progress);
        },
      });

      // 성공 시 결과 처리
      setRecognitionResult(result);

      // 각 문제에 답안 자동 입력
      setQuestionsState((prev) =>
        prev.map((question) => {
          const matchedAnswer = result.answers.find(
            (a) =>
              a.question_number === GetQuestionFields(question).questionOrder,
          );

          return {
            ...question,
            userAnswer:
              matchedAnswer?.final_answer.extracted_text ||
              question.userAnswer ||
              "",
            recognizedSolution: matchedAnswer
              ? `${matchedAnswer.solution_process.extracted_text}

최종 답: ${matchedAnswer.final_answer.extracted_text}`
              : question.recognizedSolution,
          };
        }),
      );

      setMessage("답안을 자동으로 입력했습니다!");
      setIsRecognizing(false);

    } catch (error) {
      console.error("[SubjectiveTab] 텍스트 인식 실패:", error);
      setRecognitionError(
        error instanceof Error
          ? error.message
          : "텍스트 인식 중 오류가 발생했습니다.",
      );
      setIsRecognizing(false);
    }
  }, [
    resetRecognitionState,
    setIsRecognizing,
    setProgress,
    setMessage,
    setRecognitionResult,
    setRecognitionError,
    setQuestionsState,
  ]);

  // 파일 업로드 핸들러
  const handleFilesSelect = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      console.log(`[SubjectiveTab] 파일 업로드: ${files.length}개 파일`);

      // 첫 번째 파일만 처리
      const file = files[0];
      await handleTextRecognition(file);
    },
    [handleTextRecognition],
  );

  // 제출 확인 모달 표시
  const handleSubmitClick = useCallback(() => {
    setShowConfirmModal(true);
  }, [setShowConfirmModal]);

  // 제출 확인 모달에서 확인 클릭
  const handleConfirmSubmit = useCallback(() => {
    setShowConfirmModal(false);
    handleSubmit();
  }, [setShowConfirmModal]);

  // 제출 확인 모달에서 취소 클릭
  const handleCancelSubmit = useCallback(() => {
    setShowConfirmModal(false);
  }, [setShowConfirmModal]);

  // 제출 핸들러
  const handleSubmit = useCallback(async () => {
    console.log("주관식 답안 제출:", questionsState);

    // 제출 모달 표시 (로딩 상태)
    setShowSubmissionModal(true);
    setIsSubmitting(true);

    try {
      // TODO: 답안 제출 API 호출
      // const response = await submitSubjectiveAnswers({
      //   examId: examDetail?.examId,
      //   answers: questionsState.map(q => ({
      //     questionId: q.questionId,
      //     userAnswer: q.userAnswer,
      //     capturedImageUrl: q.capturedImageUrl,
      //   }))
      // });

      // API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, API_SIMULATION_DELAY));

      // 제출 완료 상태로 변경
      setIsSubmitting(false);
      setRemainingTime(SUBMISSION_COUNTDOWN_SECONDS);

      // 다음 단계로 이동 (제공된 경우)
      if (onNext) {
        setTimeout(onNext, (SUBMISSION_COUNTDOWN_SECONDS + 1) * 1000);
      }
    } catch (error) {
      console.error("답안 제출 실패:", error);
      // 에러 발생 시에도 완료 상태로 변경
      setIsSubmitting(false);
      setRemainingTime(SUBMISSION_COUNTDOWN_SECONDS);
    }
  }, [
    questionsState,
    examDetail,
    onNext,
    setShowSubmissionModal,
    setIsSubmitting,
    setRemainingTime,
  ]);

  // 답안 완성도 계산
  const answeredCount = questionsState.filter((q) =>
    q.userAnswer?.trim(),
  ).length;
  const completionRate =
    questionsState.length > 0
      ? (answeredCount / questionsState.length) * 100
      : 0;

  // 시험 데이터 로딩 중이거나 주관식 문제가 없는 경우
  if (!examDetail) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 text-center">
        <div className="text-gray-500">시험 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (questionsState.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 text-center">
        <div className="text-gray-500">주관식 문제가 없습니다.</div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-4xl mx-auto p-4">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">주관식 답안</h2>
          <p className="text-gray-600 mb-4">
            시험지를 촬영하여 답안을 자동으로 인식합니다
          </p>

          {/* 시험지 촬영 버튼 */}
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (files.length > 0) {
                  handleFilesSelect(files);
                }
                // 파일 선택 후 input 초기화
                e.target.value = "";
              }}
              className="hidden"
              id="camera-input"
            />
            <Button
              onClick={() => document.getElementById("camera-input")?.click()}
              disabled={isRecognizing}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera className="w-5 h-5 mr-2" />
              {isRecognizing ? "인식 중..." : "시험지 촬영"}
            </Button>
          </div>

          <div className="mt-4 flex justify-center items-center gap-8 text-sm text-gray-500">
            <span>총 문제: {questionsState.length}문제</span>
            <span>답안 완성: {answeredCount}문제</span>
            {examDetail.examName && <span>시험: {examDetail.examName}</span>}
          </div>
          <Separator className="mt-4" />
        </div>

        {/* 문제 목록 */}
        <div className="space-y-8">
          {questionsState.map((question) => (
            <QuestionItem
              key={question.questionId}
              question={question}
              onCapture={handleCapture}
              onAnswerChange={handleAnswerChange}
            />
          ))}
        </div>

        {/* 진행률 및 제출 버튼 */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* 진행률 표시 */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              답안 완성도:{" "}
              <span className="font-semibold text-green-600">
                {answeredCount}
              </span>{" "}
              / {questionsState.length}
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 font-medium">
              {Math.round(completionRate)}%
            </span>
          </div>
          {/* 제출 버튼 */}
          <button
            onClick={handleSubmitClick}
            disabled={answeredCount === 0 || showSubmissionModal}
            className={cn(
              "px-8 py-3 bg-main-500 text-white font-semibold rounded-lg",
              "hover:bg-main-600 focus:ring-4 focus:ring-main-300",
              "transition-all duration-200 transform hover:scale-105",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            {showSubmissionModal ? "제출 중..." : "제출하기"}
          </button>
        </div>
      </div>

      {/* 제출 확인 모달 */}
      <SubmissionConfirmModal
        isVisible={showConfirmModal}
        completionRate={completionRate}
        onConfirm={handleConfirmSubmit}
        onCancel={handleCancelSubmit}
      />

      {/* 제출 완료 모달 */}
      <SubmissionCompleteModal
        isVisible={showSubmissionModal}
        remainingTime={remainingTime}
        isSubmitting={isSubmitting}
      />

      {/* 텍스트 인식 모달 */}
      <TextRecognitionModal
        isVisible={
          isRecognizing ||
          !!recognitionResult ||
          !!recognitionError
        }
        isRecognizing={isRecognizing}
        progress={progress}
        message={message}
        error={recognitionError}
        onCancel={() => {
          if (isRecognizing) {
            // 진행 중인 경우 인식 상태 리셋
            setIsRecognizing(false);
          }
          resetRecognitionState();
        }}
      />
    </>
  );
}
