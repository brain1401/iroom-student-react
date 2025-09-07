/**
 * 메인 페이지 상태 관리 Atoms
 * @description 메인 홈 화면의 상태 관리를 위한 Jotai atoms
 */

import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import type { ExamItem } from "@/api/common/server-types";
import type { ExamHistoryParams, ExamHistoryResponse } from "@/api/student";
import { examHistoryQueryOptions } from "@/api/student";
import { getAllExams } from "@/api/exam/server-api";
import { extractApiData } from "@/api/common/types";
import { loggedInStudentAtom } from "./auth";

/**
 * 시험 목록 조회 atom (응시 가능한 시험)
 * @description 실제 서버에서 시험 목록을 가져오는 atom
 */
export const examListQueryAtom = atomWithQuery(() => ({
  queryKey: ["exams", "list"],
  queryFn: async (): Promise<ExamItem[]> => {
    const response = await getAllExams({ size: 50 }); // 홈에서는 최대 50개까지 표시
    const data = extractApiData(response);
    return data.content;
  },
  staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  gcTime: 15 * 60 * 1000, // 15분간 가비지 컬렉션 방지
}));

/**
 * 시험 이력 페이지 atom
 * @description 시험 이력 조회를 위한 페이지 번호 관리
 */
export const examHistoryPageAtom = atom<number>(0);

/**
 * 시험 이력 페이지 크기 atom
 * @description 시험 이력 조회를 위한 페이지 크기 관리
 */
export const examHistoryPageSizeAtom = atom<number>(10);

/**
 * 시험 이력 조회 파라미터 atom
 * @description 학생 인증 정보와 페이징 정보를 결합한 파라미터
 */
export const examHistoryParamsAtom = atom<ExamHistoryParams | null>((get) => {
  const loggedInStudent = get(loggedInStudentAtom);
  const page = get(examHistoryPageAtom);
  const size = get(examHistoryPageSizeAtom);

  if (!loggedInStudent) {
    return null;
  }

  return {
    name: loggedInStudent.name,
    phone: loggedInStudent.phoneNumber,  // StudentInfo 타입에 맞게 수정
    birthDate: loggedInStudent.birthDate,
    page,
    size,
  };
});

/**
 * 시험 이력 조회 atom
 * @description 학생이 응시한 모든 시험 이력을 가져오는 atom
 */
export const examHistoryQueryAtom = atomWithQuery((get) => {
  const params = get(examHistoryParamsAtom);

  if (!params) {
    return {
      queryKey: ["student", "exam-history", "disabled"],
      queryFn: () => Promise.resolve({} as ExamHistoryResponse),
      enabled: false,
    };
  }

  return examHistoryQueryOptions(params);
});

/**
 * 시험 이력 액션 atom
 * @description 시험 이력 페이징 제어 액션들
 */
export const examHistoryActionsAtom = atom(
  null,
  (get, set) => ({
    nextPage: () => {
      const currentPage = get(examHistoryPageAtom);
      set(examHistoryPageAtom, currentPage + 1);
    },
    prevPage: () => {
      const currentPage = get(examHistoryPageAtom);
      if (currentPage > 0) {
        set(examHistoryPageAtom, currentPage - 1);
      }
    },
    goToPage: (page: number) => {
      set(examHistoryPageAtom, page);
    },
    setPageSize: (size: number) => {
      set(examHistoryPageSizeAtom, size);
      set(examHistoryPageAtom, 0); // 페이지 크기 변경 시 첫 페이지로 이동
    },
  })
);

/**
 * 시험 이력 데이터 atom
 * @description 시험 이력 상태와 데이터를 관리하는 파생 atom
 */
export const examHistoryDataAtom = atom((get) => {
  const loggedInStudent = get(loggedInStudentAtom);
  const { data, isPending, isError } = get(examHistoryQueryAtom);

  return {
    isLoggedIn: !!loggedInStudent,
    examHistory: data?.content || [],
    totalElements: data?.totalElements || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.number || 0,
    pageSize: data?.size || 10,
    isFirstPage: data?.first || true,
    isLastPage: data?.last || true,
    isEmpty: data?.empty || true,
    isPending,
    isError,
  };
});