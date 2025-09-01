import { atom } from "jotai";

/**
 * 과제 제출 정보 타입 정의
 * @description 학생이 제출하는 과제의 모든 필수 정보를 포함
 */
type Submit = {
  /** 과제 제목 */
  title: string;
  /** 과제 범위 (예: "1단원 ~ 3단원", "교과서 45~60페이지") */
  range: string;
  /** 담당 교사명 */
  teacher: string;
  /** 과제 마감일 (ISO 문자열 권장) */
  deadline: string;
  /** 과제 내용 및 설명 */
  content: string;
  /** 제출 완료 여부 */
  isSubmitted: boolean;
};

/**
 * 과제 제출 정보를 관리하는 atom
 * @description 과제 제출 양식의 모든 입력 데이터를 전역에서 관리
 *
 * 구조 설명:
 * - title: 과제 제목
 * - range: 과제 범위 (예: "1단원 ~ 3단원")
 * - teacher: 담당 교사명
 * - deadline: 마감일 (ISO 문자열 또는 표시용 문자열)
 * - content: 과제 내용/설명
 * - isSubmitted: 제출 완료 여부
 *
 * 사용 패턴:
 * ```typescript
 * // 📌 전체 데이터 읽기/쓰기 - useAtom 사용
 * const [submit, setSubmit] = useAtom(submitAtom);
 *
 * // 📌 일부 필드만 업데이트
 * setSubmit(prev => ({ ...prev, title: "새로운 과제 제목" }));
 *
 * // 📌 제출 상태 토글
 * setSubmit(prev => ({ ...prev, isSubmitted: !prev.isSubmitted }));
 * ```
 *
 * @example
 * ```typescript
 * // 과제 정보 설정 예시
 * const assignmentData = {
 *   title: "수학 문제 풀이 과제",
 *   range: "2단원 함수와 그래프",
 *   teacher: "김수학",
 *   deadline: "2025-02-15T23:59:59Z",
 *   content: "교과서 45~60페이지 문제 풀이",
 *   isSubmitted: false
 * };
 * ```
 */
export const submitAtom = atom<Submit>({
  title: "",
  range: "",
  teacher: "",
  deadline: "",
  content: "",
  isSubmitted: false,
});
