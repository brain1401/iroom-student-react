export type Problem = {
  /** 문제 ID (문자열) */
  id: string;
  /** 문제 제목 */
  title: string;
  /** 카테고리 (막대 차트 기준) */
  category: string;
  /** 간단 설명 */
  description: string;
};

/**
 * 예시 문제 목록
 * @description 차트 카테고리와 일치하는 더미 데이터
 */
export const problems: Problem[] = [
  {
    id: "p-101",
    title: "두 자리 수 덧셈",
    category: "덧셈·뺄셈",
    description: "받아올림 포함 덧셈 연산",
  },
  {
    id: "p-102",
    title: "세 자리 수 뺄셈",
    category: "덧셈·뺄셈",
    description: "받아내림 포함 뺄셈 연산",
  },
  {
    id: "p-201",
    title: "구구단 곱셈 응용",
    category: "곱셈",
    description: "구구단 활용한 곱셈 응용 문제",
  },
  {
    id: "p-202",
    title: "두 자리 수 곱셈",
    category: "곱셈",
    description: "세로셈 곱셈 절차 이해",
  },
  {
    id: "p-301",
    title: "다항식 전개 1",
    category: "전개",
    description: "분배법칙 전개 기본",
  },
  {
    id: "p-302",
    title: "다항식 전개 2",
    category: "전개",
    description: "동류항 정리 포함",
  },
  {
    id: "p-401",
    title: "인수분해 기본",
    category: "인수분해",
    description: "공통인수 묶기",
  },
  {
    id: "p-402",
    title: "완전제곱식 인수분해",
    category: "인수분해",
    description: "제곱 공식 활용",
  },
  {
    id: "p-501",
    title: "응용 문제 1",
    category: "응용",
    description: "실생활 맥락 문제 해결",
  },
  {
    id: "p-502",
    title: "응용 문제 2",
    category: "응용",
    description: "복합적 사고 요구",
  },
];
