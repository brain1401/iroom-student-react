/**
 * 텍스트 인식 비동기 API 함수
 * @description 비동기 OCR 처리를 위한 API 호출 함수
 */

import { apiBaseUrl } from "../client/apiClient";

// 간단한 fetch 기반 API - authApiClient 대신 직접 fetch 사용

/**
 * 비동기 작업 제출 응답 타입
 */
export type AsyncSubmitResponse = {
  jobId: string;
  status: "submitted";
  estimatedCompletionTime: string;
  callbackUrl: string;
  submittedAt: string;
};

/**
 * 작업 상태 응답 타입
 */
export type AsyncStatusResponse = {
  jobId: string;
  status: "submitted" | "processing" | "completed" | "failed";
  createdAt: string;
  completedAt?: string;
};

/**
 * 작업 결과 응답 타입
 */
export type AsyncResultResponse = {
  sheet_id: string;
  processing_timestamp: string;
  answers: Array<{
    question_number: number;
    question_label: string;
    final_answer: {
      extracted_text: string;
      latex_formula?: string | null;
    };
    confidence: number;
  }>;
  metadata: {
    image_quality: string;
    processing_time_ms: number;
    total_questions_detected: number;
    model_version: string;
  };
};

/**
 * 비동기 작업 제출
 * @description 이미지를 업로드하여 비동기 처리 시작
 *
 * @param file 이미지 파일
 * @param options 추가 옵션
 * @returns 작업 정보
 */
export async function submitAsyncTextRecognition(
  file: File,
  options?: {
    callbackUrl?: string;
    priority?: number;
    useCache?: boolean;
  },
): Promise<AsyncSubmitResponse> {
  const formData = new FormData();
  formData.append("file", file);

  // URL 파라미터 구성
  const params = new URLSearchParams();
  params.append(
    "callback_url",
    options?.callbackUrl || "https://dummy-callback.com",
  );

  if (options?.priority !== undefined) {
    params.append("priority", options.priority.toString());
  }

  if (options?.useCache !== undefined) {
    params.append("use_cache", options.useCache.toString());
  }

  try {
    console.log("[AsyncTextRecognition] 작업 제출 시작:", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      options,
    });

    // fetch를 사용하여 multipart/form-data로 전송
    const response = await fetch(
      `${apiBaseUrl}/text-recognition/async/submit?${params.toString()}`,
      {
        method: "POST",
        body: formData,
        headers: {
          Accept: "*/*",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // ApiResponse<T> 구조에서 데이터 추출
    if (result.result === "SUCCESS") {
      const data = result.data as AsyncSubmitResponse;

      console.log("[AsyncTextRecognition] 작업 제출 성공:", {
        jobId: data.jobId,
        status: data.status,
        estimatedCompletionTime: data.estimatedCompletionTime,
      });

      return data;
    } else {
      throw new Error(result.message || "작업 제출 실패");
    }
  } catch (error) {
    console.error("[AsyncTextRecognition] 작업 제출 실패:", error);
    throw error;
  }
}

/**
 * 작업 상태 확인
 * @description 비동기 작업의 현재 상태 조회
 *
 * @param jobId 작업 ID
 * @returns 작업 상태
 */
export async function checkAsyncStatus(
  jobId: string,
): Promise<AsyncStatusResponse> {
  try {
    console.log("[AsyncTextRecognition] 상태 확인:", jobId);

    const response = await fetch(
      `${apiBaseUrl}/text-recognition/async/status/${jobId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // ApiResponse<T> 구조에서 데이터 추출
    if (result.result === "SUCCESS") {
      const data = result.data as AsyncStatusResponse;

      console.log("[AsyncTextRecognition] 상태 확인 결과:", {
        jobId: data.jobId,
        status: data.status,
        completedAt: data.completedAt,
      });

      return data;
    } else {
      throw new Error(result.message || "상태 확인 실패");
    }
  } catch (error) {
    console.error("[AsyncTextRecognition] 상태 확인 실패:", error);
    throw error;
  }
}

/**
 * 작업 결과 조회
 * @description 완료된 비동기 작업의 결과 조회
 *
 * @param jobId 작업 ID
 * @returns 인식 결과
 */
export async function getAsyncResult(
  jobId: string,
): Promise<AsyncResultResponse> {
  try {
    console.log("[AsyncTextRecognition] 결과 조회:", jobId);

    const response = await fetch(
      `${apiBaseUrl}/text-recognition/async/result/${jobId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // ApiResponse<T> 구조에서 데이터 추출
    if (result.result === "SUCCESS") {
      const data = result.data as AsyncResultResponse;

      console.log("[AsyncTextRecognition] 결과 조회 성공:", {
        sheetId: data.sheet_id,
        answersCount: data.answers.length,
        totalQuestions: data.metadata.total_questions_detected,
      });

      return data;
    } else {
      throw new Error(result.message || "결과 조회 실패");
    }
  } catch (error) {
    console.error("[AsyncTextRecognition] 결과 조회 실패:", error);
    throw error;
  }
}

/**
 * 폴링을 통한 작업 완료 대기
 * @description 작업이 완료될 때까지 주기적으로 상태 확인
 *
 * @param jobId 작업 ID
 * @param options 폴링 옵션
 * @returns 완료된 결과
 */
export async function pollUntilComplete(
  jobId: string,
  options?: {
    interval?: number; // 폴링 간격 (ms)
    maxAttempts?: number; // 최대 시도 횟수
    onProgress?: (status: AsyncStatusResponse) => void; // 진행 상황 콜백
  },
): Promise<AsyncResultResponse> {
  const interval = options?.interval || 500; // 기본 0.5초
  const maxAttempts = options?.maxAttempts || 60; // 기본 60회 (2분)

  const checkStatus = async (
    attempts: number,
  ): Promise<AsyncResultResponse> => {
    if (attempts >= maxAttempts) {
      throw new Error(
        `작업이 시간 초과되었습니다 (${(maxAttempts * interval) / 1000}초)`,
      );
    }

    try {
      // 상태 확인
      const status = await checkAsyncStatus(jobId);

      // 진행 상황 콜백 호출
      if (options?.onProgress) {
        options.onProgress(status);
      }

      // 상태에 따른 처리
      if (status.status === "completed") {
        // 완료된 경우 결과 조회
        return await getAsyncResult(jobId);
      } else if (status.status === "failed") {
        // 실패한 경우 에러 throw
        throw new Error("텍스트 인식 작업이 실패했습니다");
      }

      // 아직 처리 중인 경우 0.5초 후 재시도
      await new Promise((resolve) => setTimeout(resolve, interval));
      return checkStatus(attempts + 1);
    } catch (error) {
      // 404 에러는 작업이 아직 시작되지 않았을 수 있으므로 재시도
      if (error instanceof Error && error.message.includes("404")) {
        console.log(
          `[AsyncTextRecognition] 작업 ${jobId}를 찾을 수 없음, 재시도 중...`,
        );
        await new Promise((resolve) => setTimeout(resolve, interval));
        return checkStatus(attempts + 1);
      }

      // 그 외 에러는 즉시 throw
      throw error;
    }
  };

  return checkStatus(0);
}

/**
 * 파일 업로드 및 결과 대기 (편의 함수)
 * @description 파일 업로드부터 결과 받기까지 한 번에 처리
 *
 * @param file 이미지 파일
 * @param options 옵션
 * @returns 인식 결과
 */
export async function recognizeTextAsync(
  file: File,
  options?: {
    priority?: number;
    useCache?: boolean;
    onProgress?: (message: string, progress: number) => void;
  },
): Promise<AsyncResultResponse> {
  try {
    // 1. 작업 제출
    if (options?.onProgress) {
      options.onProgress("이미지를 업로드하고 있습니다...", 10);
    }

    const submitResult = await submitAsyncTextRecognition(file, {
      priority: options?.priority,
      useCache: options?.useCache,
    });

    // 2. 폴링으로 완료 대기
    if (options?.onProgress) {
      options.onProgress("텍스트 인식을 처리하고 있습니다...", 30);
    }

    const result = await pollUntilComplete(submitResult.jobId, {
      onProgress: (status) => {
        if (options?.onProgress) {
          const progress = status.status === "processing" ? 60 : 30;
          const message =
            status.status === "processing"
              ? "텍스트를 분석하고 있습니다..."
              : "작업을 준비하고 있습니다...";
          options.onProgress(message, progress);
        }
      },
    });

    if (options?.onProgress) {
      options.onProgress("텍스트 인식이 완료되었습니다!", 100);
    }

    return result;
  } catch (error) {
    console.error("[AsyncTextRecognition] 텍스트 인식 실패:", error);
    throw error;
  }
}
