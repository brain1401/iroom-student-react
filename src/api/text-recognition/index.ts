/**
 * 텍스트 인식 API 모듈
 * @description OCR 및 텍스트 인식 관련 API 함수들을 내보내는 인덱스 파일
 */

export {
  recognizeText,
  recognizeMultipleTexts,
  parseAnswersByQuestion,
} from "./api";
export type {
  TextRecognitionRequest,
  TextRecognitionResponse,
  TextRecognitionError,
  TextRecognitionStatus,
} from "./types";
