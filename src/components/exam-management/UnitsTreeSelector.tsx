/**
 * 단원 트리 선택기 컴포넌트
 * @description 계층적 단원 구조에서 원하는 단원들을 선택하는 UI
 *
 * 주요 기능:
 * - 트리 구조 표시 (대분류 → 중분류 → 세부단원)
 * - 다중 선택 지원
 * - 문제 수 표시 (shouldIncludeQuestions 옵션)
 * - 검색 및 필터링
 * - 전체 선택/해제
 */

import { useState, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, ChevronDown, Search, CheckSquare, Square } from "lucide-react";
import type { UnitTreeNode } from "@/api/common/server-types";

type UnitsTreeSelectorProps = {
  /** 단원 트리 데이터 */
  data: UnitTreeNode[];
  /** 선택된 단원 ID 배열 */
  selectedUnitIds: string[];
  /** 선택 변경 핸들러 */
  onSelectionChange: (selectedIds: string[]) => void;
  /** 문제 수 표시 여부 */
  shouldIncludeQuestions: boolean;
}

type TreeNodeProps = {
  /** 노드 데이터 */
  node: UnitTreeNode;
  /** 현재 뎁스 (들여쓰기용) */
  depth: number;
  /** 선택된 노드 ID들 */
  selectedIds: Set<string>;
  /** 선택 토글 핸들러 */
  onToggle: (nodeId: string) => void;
  /** 문제 수 표시 여부 */
  shouldIncludeQuestions: boolean;
  /** 검색어 */
  searchTerm: string;
}

/**
 * 트리 노드 컴포넌트
 * @description 개별 단원 노드를 렌더링하는 재귀 컴포넌트
 */
function TreeNode({ 
  node, 
  depth, 
  selectedIds, 
  onToggle, 
  shouldIncludeQuestions, 
  searchTerm 
}: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(depth < 2); // 처음 2단계까지 기본 열림

  const isSelected = selectedIds.has(node.id);
  const hasChildren = node.children && node.children.length > 0;
  
  // 검색어 하이라이팅
  const isSearchMatch = searchTerm && 
    node.name.toLowerCase().includes(searchTerm.toLowerCase());

  // 자식 노드 중 검색 결과가 있는지 확인
  const hasMatchingChildren = useMemo(() => {
    if (!searchTerm || !hasChildren) return false;
    
    const checkMatch = (nodes: UnitTreeNode[]): boolean => {
      return nodes.some(child => 
        child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (child.children && checkMatch(child.children))
      );
    };
    
    return checkMatch(node.children);
  }, [searchTerm, hasChildren, node.children]);

  // 검색어가 있을 때 매칭되지 않는 노드 숨김
  if (searchTerm && !isSearchMatch && !hasMatchingChildren) {
    return null;
  }

  return (
    <div className={cn("select-none", depth > 0 && "ml-4")}>
      <div className="flex items-center space-x-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md px-2">
        {/* 확장/축소 버튼 */}
        {hasChildren ? (
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-6 w-6"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        ) : (
          <div className="w-6 h-6" /> // 공간 유지용
        )}

        {/* 체크박스 (세부단원만) */}
        {node.type === "UNIT" && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggle(node.id)}
            id={`unit-${node.id}`}
          />
        )}

        {/* 단원명 */}
        <label 
          htmlFor={node.type === "UNIT" ? `unit-${node.id}` : undefined}
          className={cn(
            "flex-1 text-sm cursor-pointer",
            node.type === "CATEGORY" && "font-semibold text-lg",
            node.type === "SUBCATEGORY" && "font-medium text-base",
            node.type === "UNIT" && "text-sm",
            isSearchMatch && "bg-yellow-200 dark:bg-yellow-900 px-1 rounded",
          )}
        >
          {node.name}
        </label>

        {/* 배지들 */}
        <div className="flex items-center space-x-1">
          {/* 타입 배지 */}
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs",
              node.type === "CATEGORY" && "bg-blue-100 text-blue-800",
              node.type === "SUBCATEGORY" && "bg-green-100 text-green-800",
              node.type === "UNIT" && "bg-gray-100 text-gray-800",
            )}
          >
            {node.type === "CATEGORY" && "대분류"}
            {node.type === "SUBCATEGORY" && "중분류"}
            {node.type === "UNIT" && "세부단원"}
          </Badge>

          {/* 문제 수 배지 (shouldIncludeQuestions가 true이고 실제 문제가 있을 때) */}
          {shouldIncludeQuestions && node.type === "UNIT" && (
            <Badge variant="secondary" className="text-xs">
              {/* TODO: 실제 문제 수 표시 로직 추가 */}
              문제 미구현
            </Badge>
          )}

          {/* 학년 정보 */}
          {node.grade && (
            <Badge variant="default" className="text-xs">
              {node.grade}학년
            </Badge>
          )}
        </div>
      </div>

      {/* 자식 노드들 */}
      {hasChildren && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent>
            <div className="border-l border-gray-200 dark:border-gray-700 ml-3">
              {node.children?.map((child) => (
                <TreeNode
                  key={child.id}
                  node={child}
                  depth={depth + 1}
                  selectedIds={selectedIds}
                  onToggle={onToggle}
                  shouldIncludeQuestions={shouldIncludeQuestions}
                  searchTerm={searchTerm}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

/**
 * 단원 트리 선택기 메인 컴포넌트
 */
export function UnitsTreeSelector({ 
  data, 
  selectedUnitIds, 
  onSelectionChange, 
  shouldIncludeQuestions 
}: UnitsTreeSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const selectedIds = useMemo(() => new Set(selectedUnitIds), [selectedUnitIds]);

  /**
   * 개별 노드 선택/해제 핸들러
   */
  const handleToggle = useCallback((nodeId: string) => {
    const newSelectedIds = new Set(selectedIds);
    
    if (newSelectedIds.has(nodeId)) {
      newSelectedIds.delete(nodeId);
    } else {
      newSelectedIds.add(nodeId);
    }
    
    onSelectionChange(Array.from(newSelectedIds));
  }, [selectedIds, onSelectionChange]);

  /**
   * 전체 선택/해제 핸들러
   */
  const handleSelectAll = useCallback(() => {
    // 모든 UNIT 타입 노드들을 재귀적으로 수집
    const collectUnits = (nodes: UnitTreeNode[]): string[] => {
      const units: string[] = [];
      
      for (const node of nodes) {
        if (node.type === "UNIT") {
          units.push(node.id);
        }
        if (node.children) {
          units.push(...collectUnits(node.children));
        }
      }
      
      return units;
    };

    const allUnitIds = collectUnits(data);
    const isAllSelected = allUnitIds.every(id => selectedIds.has(id));
    
    if (isAllSelected) {
      onSelectionChange([]); // 전체 해제
    } else {
      onSelectionChange(allUnitIds); // 전체 선택
    }
  }, [data, selectedIds, onSelectionChange]);

  // 전체 단원 수 계산
  const totalUnits = useMemo(() => {
    const countUnits = (nodes: UnitTreeNode[]): number => {
      let count = 0;
      for (const node of nodes) {
        if (node.type === "UNIT") count++;
        if (node.children) count += countUnits(node.children);
      }
      return count;
    };
    return countUnits(data);
  }, [data]);

  const allSelected = totalUnits > 0 && selectedUnitIds.length === totalUnits;
  const someSelected = selectedUnitIds.length > 0 && selectedUnitIds.length < totalUnits;

  return (
    <div className="space-y-4">
      {/* 검색 및 액션 바 */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* 검색 입력 */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="단원명으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* 전체 선택 버튼 */}
        <Button
          variant="outline"
          onClick={handleSelectAll}
          className="flex items-center space-x-2"
        >
          {allSelected ? (
            <CheckSquare className="h-4 w-4" />
          ) : (
            <Square className="h-4 w-4" />
          )}
          <span>
            {allSelected ? "전체 해제" : "전체 선택"}
          </span>
        </Button>
      </div>

      {/* 선택 현황 */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Badge variant={someSelected || allSelected ? "default" : "outline"}>
          {selectedUnitIds.length} / {totalUnits} 선택
        </Badge>
        
        {shouldIncludeQuestions && (
          <Badge variant="secondary">
            문제 수 표시 중
          </Badge>
        )}
        
        {searchTerm && (
          <Badge variant="outline">
            검색: "{searchTerm}"
          </Badge>
        )}
      </div>

      {/* 트리 영역 */}
      <Card>
        <CardContent className="p-4">
          {data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-2">📚</div>
              <p>표시할 단원이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {data.map((node) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  depth={0}
                  selectedIds={selectedIds}
                  onToggle={handleToggle}
                  shouldIncludeQuestions={shouldIncludeQuestions}
                  searchTerm={searchTerm}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}