/**
 * 텍스트 인식 API 함수
 * @description OCR 및 텍스트 인식 관련 API 호출 함수
 */

import { baseApiClient } from "@/api/client";
import type {
  TextRecognitionRequest,
  TextRecognitionResponse,
  TextRecognitionError,
} from "./types";

/**
 * 텍스트 인식 API 엔드포인트
 * @description 백엔드 텍스트 인식 API URL
 * Swagger 문서: http://100.82.50.108:3055/api/swagger-ui/index.html#/%ED%85%8D%EC%8A%A4%ED%8A%B8%20%EC%9D%B8%EC%8B%9D%20API
 *
 * 가능한 엔드포인트들:
 * - /api/ocr/recognize
 * - /api/text-recognition
 * - /api/ocr
 * - /api/recognize
 */
const BASE_API_URL = "http://100.82.50.108:3055";

/**
 * 가능한 텍스트 인식 API 엔드포인트들
 * @description 여러 가능한 엔드포인트를 시도해보기 위한 배열
 */
const POSSIBLE_ENDPOINTS = [
  "/api/ocr/recognize",
  "/api/ocr",
  "/api/recognize",
  "/api/text-recognition",
  "/api/ocr/text",
  "/api/ocr/process",
  "/api/vision/ocr",
  "/api/vision/recognize",
  "/api/vision/text",
  "/api/document/ocr",
  "/api/document/recognize",
  "/api/ai/ocr",
  "/api/ai/recognize",
  "/ocr/recognize",
  "/ocr",
  "/recognize",
  "/text-recognition",
  "/vision/ocr",
  "/vision/recognize",
];

/**
 * 이미지 파일을 텍스트로 변환하는 함수
 * @description OCR API를 사용하여 이미지에서 텍스트 추출
 *
 * @param request 텍스트 인식 요청 데이터
 * @returns Promise<TextRecognitionResponse> 인식된 텍스트 정보
 *
 * @example
 * ```typescript
 * const file = new File([...], "image.jpg", { type: "image/jpeg" });
 * const result = await recognizeText({ image: file });
 * console.log(result.text); // 인식된 텍스트
 * ```
 */
/**
 * 서버 연결 테스트 함수
 * @description 서버가 실행 중인지 확인
 */
async function testServerConnection(): Promise<boolean> {
  const healthEndpoints = [
    "/health",
    "/api/health",
    "/api/status",
    "/status",
    "/",
  ];

  for (const endpoint of healthEndpoints) {
    try {
      const response = await fetch(`${BASE_API_URL}${endpoint}`, {
        method: "GET",
        timeout: 5000,
      } as any);

      if (response.ok || response.status === 404) {
        console.log(
          `[TextRecognition] 서버 연결 성공: ${BASE_API_URL}${endpoint}`,
        );
        return true;
      }
    } catch (error: any) {
      console.log(
        `[TextRecognition] 서버 연결 실패: ${BASE_API_URL}${endpoint}`,
        {
          message: error?.message,
        },
      );
    }
  }

  return false;
}

/**
 * 여러 엔드포인트를 시도해보는 텍스트 인식 함수
 * @description 가능한 엔드포인트들을 순차적으로 시도하여 올바른 API를 찾음
 */
async function tryRecognizeTextWithEndpoints(
  formData: FormData,
  options: any,
): Promise<TextRecognitionResponse> {
  let lastError: any = null;

  for (const endpoint of POSSIBLE_ENDPOINTS) {
    const fullUrl = `${BASE_API_URL}${endpoint}`;

    try {
      console.log(`[TextRecognition] 엔드포인트 시도: ${fullUrl}`);

      const response = await baseApiClient.post<TextRecognitionResponse>(
        fullUrl,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        },
      );

      console.log(`[TextRecognition] 성공한 엔드포인트: ${fullUrl}`, {
        status: response.status,
        textLength: response.data.text?.length || 0,
      });

      return response.data;
    } catch (error: any) {
      console.log(`[TextRecognition] 엔드포인트 실패: ${fullUrl}`, {
        status: error?.response?.status,
        message: error?.message,
      });

      lastError = error;

      // 404가 아닌 다른 에러면 즉시 중단
      if (error?.response?.status !== 404) {
        break;
      }
    }
  }

  throw lastError;
}

/**
 * 직접 fetch를 사용하는 텍스트 인식 함수 (대안)
 * @description baseApiClient 대신 직접 fetch 사용
 */
async function recognizeTextWithFetch(
  formData: FormData,
  options: any,
): Promise<TextRecognitionResponse> {
  for (const endpoint of POSSIBLE_ENDPOINTS) {
    const fullUrl = `${BASE_API_URL}${endpoint}`;

    try {
      console.log(`[TextRecognition] Fetch로 엔드포인트 시도: ${fullUrl}`);

      const response = await fetch(fullUrl, {
        method: "POST",
        body: formData,
        // Content-Type 헤더는 자동으로 설정됨 (multipart/form-data)
      });

      console.log(`[TextRecognition] Fetch 응답:`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: fullUrl,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`[TextRecognition] Fetch 성공: ${fullUrl}`, data);
        return data;
      } else {
        console.log(`[TextRecognition] Fetch 실패: ${fullUrl}`, {
          status: response.status,
          statusText: response.statusText,
        });
      }
    } catch (error: any) {
      console.log(`[TextRecognition] Fetch 에러: ${fullUrl}`, {
        message: error?.message,
      });
    }
  }

  throw new Error("모든 fetch 엔드포인트 실패");
}

export async function recognizeText(
  request: TextRecognitionRequest,
): Promise<TextRecognitionResponse> {
  try {
    console.log(`[TextRecognition] 텍스트 인식 요청 시작:`, {
      fileName: request.image.name,
      fileSize: request.image.size,
      fileType: request.image.type,
      baseUrl: BASE_API_URL,
      possibleEndpoints: POSSIBLE_ENDPOINTS,
      options: request.options,
    });

    // 서버 연결 테스트
    const isServerConnected = await testServerConnection();
    if (!isServerConnected) {
      throw new Error(
        `서버에 연결할 수 없습니다. 서버(${BASE_API_URL})가 실행 중인지 확인해주세요.`,
      );
    }

    // FormData 생성
    const formData = new FormData();
    formData.append("image", request.image);

    // 옵션이 있으면 추가
    if (request.options) {
      if (request.options.language) {
        formData.append("language", request.options.language);
      }
      if (request.options.accuracy) {
        formData.append("accuracy", request.options.accuracy);
      }
    }

    // 먼저 baseApiClient로 시도
    let result: TextRecognitionResponse;
    try {
      result = await tryRecognizeTextWithEndpoints(formData, request.options);
    } catch (error) {
      console.log(`[TextRecognition] baseApiClient 실패, fetch로 재시도`);
      // baseApiClient 실패 시 fetch로 재시도
      result = await recognizeTextWithFetch(formData, request.options);
    }

    console.log(`[TextRecognition] 텍스트 인식 완료:`, {
      textLength: result.text?.length || 0,
      confidence: result.confidence,
      processingTime: result.processingTime,
      fullResponse: result,
    });

    return result;
  } catch (error: any) {
    console.error("[TextRecognition] 모든 엔드포인트 실패 - 상세 정보:", {
      error: error,
      message: error?.message,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
      config: {
        url: error?.config?.url,
        method: error?.config?.method,
        headers: error?.config?.headers,
      },
    });

    // 404 에러 특별 처리
    if (error?.response?.status === 404) {
      throw new Error(
        `모든 API 엔드포인트를 찾을 수 없습니다 (404). 시도한 엔드포인트: ${POSSIBLE_ENDPOINTS.join(", ")}. 서버가 실행 중인지 확인해주세요.`,
      );
    }

    // 네트워크 에러 처리
    if (
      error?.code === "NETWORK_ERROR" ||
      error?.message?.includes("Network Error")
    ) {
      throw new Error(
        `네트워크 연결 오류입니다. 서버(${BASE_API_URL})에 연결할 수 없습니다.`,
      );
    }

    // 기타 HTTP 에러 처리
    if (error?.response?.status) {
      throw new Error(
        `HTTP ${error.response.status} 에러: ${error.response.statusText}. ${error.response.data?.message || ""}`,
      );
    }

    // 일반 에러 처리
    if (error instanceof Error) {
      throw new Error(`텍스트 인식 실패: ${error.message}`);
    }

    throw new Error(
      "텍스트 인식을 처리하는 중 알 수 없는 오류가 발생했습니다.",
    );
  }
}

/**
 * 여러 이미지 파일을 순차적으로 텍스트로 변환하는 함수
 * @description 여러 이미지를 하나씩 처리하여 텍스트 추출
 *
 * @param requests 텍스트 인식 요청 배열
 * @returns Promise<TextRecognitionResponse[]> 인식된 텍스트 정보 배열
 *
 * @example
 * ```typescript
 * const files = [file1, file2, file3];
 * const requests = files.map(file => ({ image: file }));
 * const results = await recognizeMultipleTexts(requests);
 * results.forEach((result, index) => {
 *   console.log(`이미지 ${index + 1}:`, result.text);
 * });
 * ```
 */
export async function recognizeMultipleTexts(
  requests: TextRecognitionRequest[],
): Promise<TextRecognitionResponse[]> {
  const results: TextRecognitionResponse[] = [];

  console.log(
    `[TextRecognition] 다중 텍스트 인식 시작: ${requests.length}개 파일`,
  );

  for (let i = 0; i < requests.length; i++) {
    try {
      console.log(`[TextRecognition] 처리 중: ${i + 1}/${requests.length}`);
      const result = await recognizeText(requests[i]);
      results.push(result);
    } catch (error) {
      console.error(`[TextRecognition] ${i + 1}번째 파일 처리 실패:`, error);

      // 실패한 경우에도 빈 결과를 추가하여 순서 유지
      results.push({
        text: "",
        confidence: 0,
        processingTime: 0,
        error: error instanceof Error ? error.message : "알 수 없는 오류",
      });
    }
  }

  console.log(
    `[TextRecognition] 다중 텍스트 인식 완료: ${results.length}개 결과`,
  );
  return results;
}

/**
 * 텍스트 인식 결과를 문제별로 분할하는 함수
 * @description 인식된 텍스트를 문제 번호별로 구분하여 반환
 *
 * @param text 인식된 전체 텍스트
 * @param questionCount 문제 개수
 * @returns string[] 문제별 텍스트 배열
 *
 * @example
 * ```typescript
 * const text = "1번 답: 42\n2번 답: 3.14\n3번 답: x=5";
 * const answers = parseAnswersByQuestion(text, 3);
 * // ["42", "3.14", "x=5"]
 * ```
 */
export function parseAnswersByQuestion(
  text: string,
  questionCount: number,
): string[] {
  const answers: string[] = [];

  console.log(`[TextRecognition] 원본 인식 텍스트:`, text);

  // 다양한 패턴으로 답안 추출 시도
  const patterns = [
    // "1", "2" 형태 (단순 숫자)
    /^(\d+)\s*(.+?)(?=^\d+\s|$)/gm,
    // "1번", "2번" 형태
    /(\d+)번\s*[답답안]?\s*[:：]\s*(.+?)(?=\d+번|$)/g,
    // "1.", "2." 형태
    /(\d+)\.\s*(.+?)(?=\d+\.|$)/g,
    // "1)", "2)" 형태
    /(\d+)\)\s*(.+?)(?=\d+\)|$)/g,
    // 단순 숫자 + 내용 (공백으로 구분)
    /(\d+)\s+(.+?)(?=\d+\s+|$)/g,
  ];

  let bestMatches: Array<{ number: number; answer: string }> = [];

  // 각 패턴으로 시도해보고 가장 많은 매칭을 찾은 패턴 사용
  for (const pattern of patterns) {
    const matches = Array.from(text.matchAll(pattern));
    if (matches.length > bestMatches.length) {
      bestMatches = matches.map((match) => ({
        number: parseInt(match[1], 10),
        answer: match[2]?.trim() || "",
      }));
    }
  }

  // 매칭된 답안들을 문제 번호 순으로 정렬
  bestMatches.sort((a, b) => a.number - b.number);

  console.log(`[TextRecognition] 매칭된 답안들:`, bestMatches);

  // 문제별 답안 추출
  for (let i = 1; i <= questionCount; i++) {
    const match = bestMatches.find((m) => m.number === i);
    if (match && match.answer) {
      answers[i - 1] = match.answer;
    } else {
      answers[i - 1] = "";
    }
  }

  // 매칭이 적은 경우, 텍스트를 줄 단위로 분할하여 순서대로 할당
  if (bestMatches.length < questionCount / 2) {
    console.log(`[TextRecognition] 매칭이 부족하여 줄 단위로 재분할 시도`);

    const lines = text
      .split(/[\n\r]+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    console.log(`[TextRecognition] 분할된 줄들:`, lines);

    // 각 줄을 순서대로 답안에 할당
    for (let i = 0; i < Math.min(questionCount, lines.length); i++) {
      if (!answers[i] || answers[i].length === 0) {
        answers[i] = lines[i];
      }
    }
  }

  console.log(`[TextRecognition] 답안 파싱 완료:`, {
    totalQuestions: questionCount,
    foundAnswers: answers.filter((a) => a).length,
    answers: answers,
    originalText: text,
  });

  return answers;
}
