import { baseApiClient } from "@/api/client";
import { aiApiBaseUrl, apiBaseUrl } from "../client/apiClient";

/**
 * 제출 및 채점 요청 타입
 * @description FastAPI /grading/submit-and-grade 요청 본문 스키마와 동일
 */
export type SubmitAndGradeRequest = {
  /** 시험 ID (UUID) */
  exam_id: string;
  /** 학생 ID (백엔드 정수 ID) */
  student_id: number | string;
  /** 문제별 답안 목록 */
  answers: Array<{
    /** 문제 ID (UUID) */
    question_id: string;
    /** 객관식 선택 번호 (1-based) */
    selected_choice?: number | null;
    /** 주관식 답 텍스트 */
    answer_text?: string | null;
    /** 답안 이미지 URL */
    answer_image_url?: string | null;
  }>;
  /** 채점 강제 실행 여부 */
  force_grading?: boolean;
  /** 채점 옵션 (확장 가능) */
  grading_options?: Record<string, unknown>;
};

/**
 * 제출 및 채점 응답 타입 (요약)
 * @description FastAPI 응답 구조의 핵심 필드만 반영
 */
export type SubmitAndGradeResponse = {
  submission_id: string;
  exam_sheet_id: string;
  student_answer_sheet_id: string;
  status: string;
  message: string;
  submitted_at: string;
  grading_result?: {
    result_id: string;
    submission_id: string;
    exam_sheet_id: string;
    status: string;
    total_score: number;
    max_total_score: number;
    question_results: Array<{
      question_id: string;
      answer_id: string | null;
      is_correct: boolean;
      score: number;
      max_score: number;
      grading_method: string;
      confidence_score?: string | number;
      scoring_comment?: string | null;
      created_at: string;
    }>;
    metadata?: Record<string, unknown>;
    grading_comment?: string | null;
    graded_at?: string;
    version?: number;
  };
};

/**
 * 제출 및 채점 API 호출 함수
 * @description FastAPI /grading/submit-and-grade 엔드포인트 호출
 * @example
 * const res = await submitAndGrade({ exam_id, student_id, answers, force_grading: true });
 */
export async function submitAndGrade(
  payload: SubmitAndGradeRequest,
  options?: { signal?: AbortSignal },
): Promise<SubmitAndGradeResponse> {
  const response = await baseApiClient.request<SubmitAndGradeResponse>({
    method: "POST",
    // FastAPI (외부 서비스) 절대 경로 사용
    url: `${aiApiBaseUrl}/grading/submit-and-grade`,
    data: payload,
    signal: options?.signal,
  });

  return response.data;
}
