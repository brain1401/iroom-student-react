/**
 * 시험지 관리 - 단원 트리 관련 유틸리티 함수들
 * @description 단원 트리 조작, 검색, 변환 등의 도우미 함수들
 */

import type { UnitTreeNode } from "@/api/common/server-types";

/**
 * 선택된 단원들을 평면화하여 정보 추출하는 유틸리티 함수
 * @description 중첩된 단원 트리에서 선택된 단원들을 찾아서 평면화된 배열로 반환
 *
 * 주요 기능:
 * - 선택된 단원 ID들을 기준으로 해당 단원 노드들을 추출
 * - 중첩된 트리 구조를 재귀적으로 탐색
 * - 타입이 "UNIT"인 노드만 결과에 포함
 * - 중복 제거 및 효율적인 검색을 위해 Set 사용
 *
 * @example
 * ```typescript
 * const selectedIds = ["unit-1", "unit-3", "unit-5"];
 * const selectedUnits = extractSelectedUnits(unitsTree, selectedIds);
 * console.log(selectedUnits); // [{ id: "unit-1", name: "중1 수학", ... }, ...]
 * ```
 *
 * @param nodes 전체 단원 트리 노드 배열
 * @param selectedIds 선택된 단원 ID들의 배열
 * @returns 선택된 단원들의 평면화된 배열
 */
export function extractSelectedUnits(
  nodes: UnitTreeNode[], 
  selectedIds: string[]
): UnitTreeNode[] {
  const result: UnitTreeNode[] = [];
  const selectedSet = new Set(selectedIds);

  /**
   * 트리를 재귀적으로 순회하며 선택된 단원을 찾는 내부 함수
   * @param nodeList 현재 레벨의 노드 배열
   */
  const traverse = (nodeList: UnitTreeNode[]) => {
    for (const node of nodeList) {
      // 단원 타입이고 선택된 ID에 포함되면 결과에 추가
      if (node.type === "UNIT" && selectedSet.has(node.id)) {
        result.push(node);
      }

      // 자식 노드가 있으면 재귀적으로 탐색
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    }
  };

  traverse(nodes);
  return result;
}

/**
 * 단원 트리에서 특정 조건에 맞는 노드들을 필터링하는 함수
 * @description 학년, 타입, 검색어 등의 조건으로 단원 노드들을 필터링
 *
 * @param nodes 전체 단원 트리 노드 배열
 * @param options 필터링 옵션
 * @param options.grade 학년 필터 (선택적)
 * @param options.type 노드 타입 필터 (선택적)
 * @param options.searchTerm 검색어 (선택적)
 * @returns 필터링된 단원 노드 배열
 */
export function filterUnitTreeNodes(
  nodes: UnitTreeNode[],
  options: {
    grade?: number;
    type?: string;
    searchTerm?: string;
  } = {}
): UnitTreeNode[] {
  const { grade, type, searchTerm } = options;
  const result: UnitTreeNode[] = [];

  const traverse = (nodeList: UnitTreeNode[]) => {
    for (const node of nodeList) {
      let matches = true;

      // 학년 필터 적용
      if (grade !== undefined && node.grade !== grade) {
        matches = false;
      }

      // 타입 필터 적용
      if (type !== undefined && node.type !== type) {
        matches = false;
      }

      // 검색어 필터 적용
      if (searchTerm && !node.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        matches = false;
      }

      if (matches) {
        result.push(node);
      }

      // 자식 노드 탐색
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    }
  };

  traverse(nodes);
  return result;
}