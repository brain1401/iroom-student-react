/**
 * 객관식 탭 컴포넌트 (OMR 카드 형식)
 * @description OMR 카드 스타일의 객관식 답안지
 *
 * 주요 기능:
 * - OMR 카드 형식의 답안지
 * - 보기 선택 및 답안 입력
 * - 문제별 배점 표시
 * - 반응형 그리드 레이아웃
 * - 주관식 탭으로 이동
 *
 * @example
 * ```tsx
 * <ObjectiveTab onNext={() => setActiveTab("subjective")} />
 * ```
 */

import { useCallback } from "react";
import { useAtom, useAtomValue } from "jotai";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type {
  ExamDetailResult,
  QuestionAnswer,
  ExamQuestionsData,
  Question,
} from "@/api/student/types";
import { currentExamIdAtom, objectiveAnswersAtom } from "@/atoms/student";

// 보기 데이터 타입
type Option = {
  /** 보기 값 */
  value: string;
  /** 보기 라벨 */
  label: string;
  /** 보기 번호 (한글 숫자) */
  number: string;
};

// 보기 데이터
const options: Option[] = [
  { value: "1", label: "보기 1", number: "①" },
  { value: "2", label: "보기 2", number: "②" },
  { value: "3", label: "보기 3", number: "③" },
  { value: "4", label: "보기 4", number: "④" },
  { value: "5", label: "보기 5", number: "⑤" },
];

// 기본값 설정 (데이터가 없을 때 사용)
const DEFAULT_SCORE_PER_QUESTION = 5;

/**
 * 백워드 호환성을 위한 데이터 유틸리티 함수들
 * @description 신규 API와 기존 API 데이터 구조를 상호 변환
 */

/**
 * 시험 데이터가 신규 API 구조인지 확인
 * @param examDetail 시험 데이터
 */
function IsExamQuestionsData(
  examDetail: ExamDetailResult | ExamQuestionsData,
): examDetail is ExamQuestionsData {
  return "questions" in examDetail && "multipleChoiceCount" in examDetail;
}

/**
 * 문제 데이터가 신규 API 구조인지 확인
 * @param question 문제 데이터
 */
function IsNewQuestion(
  question: QuestionAnswer | Question,
): question is Question {
  return "seqNo" in question && "questionText" in question;
}

/**
 * 시험 데이터에서 객관식 문제만 추출
 * @param examDetail 시험 데이터 (기존 또는 신규 API)
 */
function ExtractObjectiveQuestions(
  examDetail: ExamDetailResult | ExamQuestionsData,
): (QuestionAnswer | Question)[] {
  if (IsExamQuestionsData(examDetail)) {
    // 신규 API: questions 배열에서 MULTIPLE_CHOICE 필터링
    return (
      examDetail.questions?.filter(
        (q) => q.questionType === "MULTIPLE_CHOICE",
      ) || []
    );
  } else {
    // 기존 API: questionAnswers 배열에서 객관식 필터링
    return (
      examDetail?.questionAnswers?.filter(
        (q) => q.questionType === "객관식" || q.questionType === "OBJECTIVE",
      ) || []
    );
  }
}

/**
 * 문제 데이터에서 공통 필드 추출 (백워드 호환성)
 * @param question 문제 데이터 (기존 또는 신규 API)
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
    };
  } else {
    // 기존 API 구조
    return {
      questionId: question.questionId,
      questionOrder: question.questionOrder,
      questionSummary: question.questionSummary,
      points: question.points,
      difficulty: question.difficulty,
    };
  }
}

/**
 * 보기 선택 컴포넌트
 * @description 라디오 버튼을 사용한 보기 선택 UI
 */
type OptionSelectorProps = {
  /** 문제 ID */
  questionId: number;
  /** 보기 목록 */
  options: Option[];
  /** 선택된 값 */
  selectedValue: string;
  /** 값 변경 핸들러 */
  onValueChange: (value: string) => void;
};

function OptionSelector({
  questionId,
  options,
  selectedValue,
  onValueChange,
}: OptionSelectorProps) {
  return (
    // RadioGroup 컴포넌트를 사용하여 보기 선택 영역을 구성
    <RadioGroup
      value={selectedValue}
      onValueChange={onValueChange}
      className="grid grid-cols-5 gap-2"
    >
      {options.map((option) => (
        <div key={option.value}>
          <RadioGroupItem
            value={option.value}
            id={`q${questionId}-${option.value}`}
            // sr-only 클래스를 사용하여 화면 판독기에서 숨김
            className="sr-only"
          />
          <Label
            htmlFor={`q${questionId}-${option.value}`}
            className={cn(
              "flex items-center justify-center p-3 border-2 rounded-lg bg-white cursor-pointer transition-all duration-200",
              "hover:border-blue-500 hover:bg-blue-50 hover:shadow-md",
              selectedValue === option.value
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-300",
            )}
          >
            <span className="text-lg font-bold text-gray-700">
              {option.value}
            </span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}

/**
 * 문제 행 컴포넌트
 * @description OMR 카드의 문제 행을 표시
 */
type QuestionRowProps = {
  /** 문제 데이터 (기존 API 또는 신규 API) */
  question: QuestionAnswer | Question;
  /** 선택된 답안 */
  selectedAnswer: string;
  /** 답안 변경 핸들러 */
  onAnswerChange: (questionId: string, value: string) => void;
};

// 문재 행(한줄) 컴포넌트
function QuestionRow({
  question,
  selectedAnswer,
  onAnswerChange,
}: QuestionRowProps) {
  const handleValueChange = useCallback(
    (value: string) => {
      onAnswerChange(GetQuestionFields(question).questionId, value);
    },
    [question, onAnswerChange],
  );

  return (
    <div className="flex items-center gap-4 p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
      <div className="flex flex-col items-center gap-4">
        {/* 문제 번호 및 요약 */}

        <div className="flex-shrink-0 flex flex-col items-center">
          <Badge variant="outline" className="text-center font-bold mb-1">
            {GetQuestionFields(question).questionOrder}번
          </Badge>
        </div>
      </div>

      {/* 보기 선택 */}
      <div className="flex-1">
        <OptionSelector
          questionId={parseInt(GetQuestionFields(question).questionId)}
          options={options}
          selectedValue={selectedAnswer}
          onValueChange={handleValueChange}
        />
      </div>

      {/* 배점 및 난이도 표시 */}
      <div className="flex-shrink-0 text-right">
        <div className="text-sm font-semibold text-blue-600">
          {GetQuestionFields(question).points || DEFAULT_SCORE_PER_QUESTION}점
        </div>
        {GetQuestionFields(question).difficulty && (
          <div className="text-xs text-gray-500">
            {GetQuestionFields(question).difficulty}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * OMR 카드 헤더 컴포넌트
 * @description OMR 카드 상단의 제목과 설명
 */
type OMRCardHeaderProps = {
  /** 객관식 문제 데이터 (기존 API 또는 신규 API) */
  objectiveQuestions: (QuestionAnswer | Question)[];
};

function OMRCardHeader({ objectiveQuestions }: OMRCardHeaderProps) {
  const totalQuestions = objectiveQuestions.length;
  const totalScore = objectiveQuestions.reduce(
    (sum, q) => sum + (GetQuestionFields(q).points || 0),
    0,
  );
  const averageScore =
    totalQuestions > 0
      ? Math.round((totalScore / totalQuestions) * 10) / 10
      : 0;

  return (
    <div className="text-center mb-6 pb-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">객관식 답안지</h2>
      <p className="text-gray-600">정답을 선택하여 표시하세요</p>
      <div className="mt-4 flex justify-center items-center gap-8 text-sm text-gray-500">
        <span>총 문제: {totalQuestions}문제</span>
        <span>총 배점: {totalScore}점</span>
        <span>평균 배점: {averageScore}점</span>
      </div>
      <Separator className="mt-4" />
    </div>
  );
}

/**
 * OMR 카드 하단 컴포넌트
 * @description OMR 카드 하단의 안내 문구
 */
function OMRCardFooter() {
  return (
    <div className="mt-6 pt-4 text-center">
      <Separator className="mb-4" />
      <p className="text-sm text-gray-600">
        ※ 답안을 선택한 후 다음 단계로 진행하세요
      </p>
    </div>
  );
}

/**
 * OMR 카드 메인 컴포넌트
 * @description OMR 카드 형식의 객관식 답안지
 */
type ObjectiveTabProps = {
  /** 시험 상세 정보 (기존 API 또는 신규 API) */
  examDetail?: ExamDetailResult | ExamQuestionsData;
  /** 다음 탭으로 이동하는 핸들러 */
  onNext?: () => void;
};

export function ObjectiveTab({ examDetail, onNext }: ObjectiveTabProps) {
  // 객관식 문제만 필터링 (신규/기존 API 모두 지원)
  const objectiveQuestions = examDetail
    ? ExtractObjectiveQuestions(examDetail)
    : [];

  // 전역 객관식 답안 상태 (questionId -> 선택값)
  const [answers, setAnswers] = useAtom(objectiveAnswersAtom);
  const examId = useAtomValue(currentExamIdAtom);

  // 답안 변경 핸들러
  const handleAnswerChange = useCallback(
    (questionId: string, value: string) => {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: value,
      }));
    },
    [],
  );

  // 다음 단계로 이동 핸들러
  const handleNext = useCallback(() => {
    console.log("[ObjectiveTab] 객관식 답안 저장:", { examId, answers });
    onNext?.();
  }, [answers, onNext, examId]);

  // 답안 완성도 계산
  const totalQuestions = objectiveQuestions.length;
  const answeredCount = Object.keys(answers).length;
  const completionRate =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  // 데이터가 없는 경우 처리
  if (!examDetail || objectiveQuestions.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <Card className="border-2 border-gray-200 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-gray-600 text-lg">객관식 문제가 없습니다</div>
            <div className="mt-4 text-sm text-gray-500">
              이 시험에는 객관식 문제가 포함되어 있지 않습니다
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* OMR 카드 */}
      <Card className="border-2 border-gray-800 shadow-lg">
        <CardContent className="p-6">
          <OMRCardHeader objectiveQuestions={objectiveQuestions} />

          {/* 문제 목록 */}
          <div className="space-y-1">
            {objectiveQuestions.map((question) => {
              const questionFields = GetQuestionFields(question);
              return (
                <QuestionRow
                  key={questionFields.questionId}
                  question={question}
                  selectedAnswer={answers[questionFields.questionId] || ""}
                  onAnswerChange={handleAnswerChange}
                />
              );
            })}
          </div>

          <OMRCardFooter />

          {/* 진행률 및 다음 버튼 */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* 진행률 표시 */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                답안 완성도:{" "}
                <span className="font-semibold text-blue-600">
                  {answeredCount}
                </span>{" "}
                / {totalQuestions}
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 font-medium">
                {Math.round(completionRate)}%
              </span>
            </div>

            {/* 다음 버튼 */}
            <button
              onClick={handleNext}
              className={cn(
                "px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg",
                "hover:bg-blue-600 focus:ring-4 focus:ring-blue-300",
                "transition-all duration-200 transform hover:scale-105",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
              disabled={answeredCount === 0}
            >
              다음 단계 →
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
