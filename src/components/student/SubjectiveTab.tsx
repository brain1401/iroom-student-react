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
import { Camera, Image as ImageIcon, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// 타입 정의
// ============================================================================

/**
 * 주관식 문제 데이터 타입
 * @description 문제별 이미지, 인식 결과, 답안 정보
 */
type SubjectiveQuestion = {
  /** 문제 번호 */
  id: number;
  /** 문제 이미지 URL */
  imageUrl?: string;
  /** 이미지 인식된 풀이 과정 */
  recognizedSolution?: string;
  /** 최종 답안 */
  finalAnswer?: string;
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

// ============================================================================
// 상수 정의
// ============================================================================

/** 제출 완료 후 대기 시간 (초) */
const SUBMISSION_COUNTDOWN_SECONDS = 3;

/** API 호출 시뮬레이션 시간 (밀리초) */
const API_SIMULATION_DELAY = 2000;

/** 문제 데이터 (2문제) */
const QUESTIONS: SubjectiveQuestion[] = [
  {
    id: 19,
    imageUrl: undefined,
    recognizedSolution:
      "(2x x x) + (2x x -5) + (3 x x) + (3 x -5)\n2x², -10x, +3x, -15\n2x² + (-10x + 3x) - 15 → 2x² - 7x - 15",
    finalAnswer: "2x² - 7x - 15",
  },
  {
    id: 20,
    imageUrl: undefined,
    recognizedSolution: undefined,
    finalAnswer: undefined,
  },
];

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

// ============================================================================
// 하위 컴포넌트
// ============================================================================

/**
 * 문제 촬영 버튼 컴포넌트
 * @description 문제 이미지를 촬영하는 버튼
 */
type CaptureButtonProps = {
  /** 문제 번호 */
  questionNumber: number;
  /** 촬영 핸들러 */
  onCapture: (questionId: number) => void;
};

function CaptureButton({ questionNumber, onCapture }: CaptureButtonProps) {
  return (
    <button
      onClick={() => onCapture(questionNumber)}
      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
    >
      <Camera className="w-4 h-4" />
      문제 촬영
    </button>
  );
}

/**
 * 이미지 표시 영역 컴포넌트
 * @description 촬영된 이미지 또는 플레이스홀더를 표시
 */
type ImageDisplayProps = {
  /** 문제 번호 */
  questionNumber: number;
  /** 이미지 URL */
  imageUrl?: string;
  /** 이미지가 없는 경우 표시할 메시지 */
  placeholderMessage?: string;
};

function ImageDisplay({
  questionNumber,
  imageUrl,
  placeholderMessage,
}: ImageDisplayProps) {
  if (imageUrl) {
    return (
      <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={imageUrl}
          alt={`문제 ${questionNumber}번 이미지`}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-48 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500">
      <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
      <p className="text-sm">{placeholderMessage || "이미지를 촬영해주세요"}</p>
    </div>
  );
}

/**
 * 답안 입력 컴포넌트
 * @description 최종 답안을 입력하는 텍스트 영역
 */
type AnswerInputProps = {
  /** 문제 번호 */
  questionNumber: number;
  /** 현재 답안 */
  answer?: string;
  /** 답안 변경 핸들러 */
  onAnswerChange: (questionId: number, answer: string) => void;
};

function AnswerInput({
  questionNumber,
  answer,
  onAnswerChange,
}: AnswerInputProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={`answer-${questionNumber}`}
        className="block text-sm font-medium text-gray-700"
      >
        최종 답안
      </label>
      <textarea
        id={`answer-${questionNumber}`}
        value={answer || ""}
        onChange={(e) => onAnswerChange(questionNumber, e.target.value)}
        placeholder="답안을 입력하세요"
        className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-500 focus:border-transparent resize-none"
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
  onCapture: (questionId: number) => void;
  /** 답안 변경 핸들러 */
  onAnswerChange: (questionId: number, answer: string) => void;
};

function QuestionItem({
  question,
  onCapture,
  onAnswerChange,
}: QuestionItemProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">문제 {question.id}번</CardTitle>
          <Badge variant="secondary">주관식</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 이미지 촬영 영역 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">문제 이미지</h4>
            <CaptureButton questionNumber={question.id} onCapture={onCapture} />
          </div>
          <ImageDisplay
            questionNumber={question.id}
            imageUrl={question.imageUrl}
            placeholderMessage="문제를 촬영해주세요"
          />
        </div>

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
          questionNumber={question.id}
          answer={question.finalAnswer}
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

// ============================================================================
// 메인 컴포넌트
// ============================================================================

/**
 * 주관식 탭 메인 컴포넌트
 * @description 주관식 문제 답안 제출 UI
 */
type SubjectiveTabProps = {
  /** 다음 단계로 이동하는 핸들러 */
  onNext?: () => void;
};

export function SubjectiveTab({ onNext }: SubjectiveTabProps) {
  // 문제 상태 관리
  const [questionsState, setQuestionsState] =
    useState<SubjectiveQuestion[]>(QUESTIONS);

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
    resetSubmissionState,
  } = CreateSubmissionState();

  // 카운트다운 설정
  CreateSubmissionCountdown(
    showSubmissionModal,
    isSubmitting,
    remainingTime,
    setRemainingTime,
  );

  // 이미지 촬영 핸들러
  const handleCapture = useCallback((questionId: number) => {
    console.log(`문제 ${questionId}번 촬영`);
    // TODO: 실제 카메라/이미지 업로드 기능 구현
  }, []);

  // 답안 변경 핸들러
  const handleAnswerChange = useCallback(
    (questionId: number, answer: string) => {
      setQuestionsState((prev) =>
        prev.map((q) =>
          q.id === questionId ? { ...q, finalAnswer: answer } : q,
        ),
      );
    },
    [],
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
      // const response = await submitAnswers(questionsState);

      // API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, API_SIMULATION_DELAY));

      // 제출 완료 상태로 변경
      setIsSubmitting(false);
      setRemainingTime(SUBMISSION_COUNTDOWN_SECONDS);
    } catch (error) {
      console.error("답안 제출 실패:", error);
      // 에러 발생 시에도 완료 상태로 변경
      setIsSubmitting(false);
      setRemainingTime(SUBMISSION_COUNTDOWN_SECONDS);
    }
  }, [
    questionsState,
    setShowSubmissionModal,
    setIsSubmitting,
    setRemainingTime,
  ]);

  // 답안 완성도 계산
  const answeredCount = questionsState.filter((q) =>
    q.finalAnswer?.trim(),
  ).length;
  const completionRate = (answeredCount / questionsState.length) * 100;

  return (
    <>
      <div className="w-full max-w-4xl mx-auto p-4">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">주관식 답안</h2>
          <p className="text-gray-600">문제를 촬영하고 답안을 입력하세요</p>
          <div className="mt-4 flex justify-center items-center gap-8 text-sm text-gray-500">
            <span>총 문제: {questionsState.length}문제</span>
            <span>답안 완성: {answeredCount}문제</span>
          </div>
          <Separator className="mt-4" />
        </div>

        {/* 문제 목록 */}
        <div className="space-y-8">
          {questionsState.map((question) => (
            <QuestionItem
              key={question.id}
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
    </>
  );
}
