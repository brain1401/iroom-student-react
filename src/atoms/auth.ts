import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { StudentInfo } from "@/api/student/types";

/**
 * 로그인된 학생 정보 atom (localStorage에 저장)
 * @description LoginSection에서 입력받은 학생 정보를 전역으로 관리
 * localStorage에 저장하여 페이지 새로고침 시에도 유지
 */
export const loggedInStudentAtom = atomWithStorage<StudentInfo | null>(
  "logged-in-student",
  null,
);

/**
 * 로그인 상태 atom (localStorage에 저장)
 * @description 사용자의 로그인 상태를 관리
 * localStorage에 저장하여 페이지 새로고침 시에도 유지
 */
export const isLoggedInAtom = atomWithStorage<boolean>("is-logged-in", false);

/**
 * 로그인 정보 설정 atom
 * @description LoginSection에서 입력받은 정보로 로그인 상태 설정
 */
export const setLoginInfoAtom = atom(
  null,
  (get, set, studentInfo: StudentInfo) => {
    set(loggedInStudentAtom, studentInfo);
    set(isLoggedInAtom, true);
  },
);

/**
 * 로그아웃 atom
 * @description 로그인 상태 초기화
 */
export const logoutAtom = atom(null, (get, set) => {
  set(loggedInStudentAtom, null);
  set(isLoggedInAtom, false);
});
