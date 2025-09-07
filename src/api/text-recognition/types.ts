/**
 * 텍스트 인식 API 관련 타입 정의
 * @description OCR 및 텍스트 인식 API 요청/응답 타입
 */

/**
 * 텍스트 인식 요청 타입
 * @description 이미지 파일을 텍스트로 변환하는 API 요청
 */
export type TextRecognitionRequest = {
  /** 이미지 파일 */
  image: File;
  /** 추가 옵션 (선택사항) */
  options?: {
    /** 언어 설정 */
    language?: string;
    /** 인식 정확도 설정 */
    accuracy?: "low" | "medium" | "high";
  };
};

/**
 * 텍스트 인식 응답 타입
 * @description OCR API 응답 구조
 */
export type TextRecognitionResponse = {
  /** 인식된 텍스트 */
  text: string;
  /** 인식 신뢰도 (0-100) */
  confidence: number;
  /** 인식된 텍스트의 위치 정보 */
  boundingBoxes?: {
    /** 텍스트 내용 */
    text: string;
    /** X 좌표 */
    x: number;
    /** Y 좌표 */
    y: number;
    /** 너비 */
    width: number;
    /** 높이 */
    height: number;
    /** 신뢰도 */
    confidence: number;
  }[];
  /** 처리 시간 (밀리초) */
  processingTime: number;
  /** 에러 메시지 (실패 시) */
  error?: string;
};

/**
 * 텍스트 인식 에러 타입
 * @description 텍스트 인식 실패 시 에러 정보
 */
export type TextRecognitionError = {
  /** 에러 코드 */
  code: string;
  /** 에러 메시지 */
  message: string;
  /** 상세 정보 */
  details?: string;
};

/**
 * 텍스트 인식 상태 타입
 * @description 텍스트 인식 진행 상태
 */
export type TextRecognitionStatus = {
  /** 인식 중 여부 */
  isProcessing: boolean;
  /** 진행률 (0-100) */
  progress: number;
  /** 현재 상태 메시지 */
  message: string;
  /** 에러 정보 */
  error?: TextRecognitionError;
};
