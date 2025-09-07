/**
 * 시험지 등록 컴포넌트
 * @description 단원 트리 선택을 통한 시험지 생성 기능
 *
 * 주요 기능:
 * - 단원 트리 구조 조회 (CSR 방식)
 * - 문제 포함 단원 트리 로딩 스피너
 * - 사용자 친화적인 로딩 경험 제공
 * - 단원 선택 및 시험지 생성
 *
 * 성능 최적화:
 * - SSR → CSR 전환으로 초기 페이지 로딩 속도 향상
 * - 로딩 스피너로 사용자 대기 시간 체감 개선
 * - React Query를 통한 캐싱 및 백그라운드 업데이트
 */

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UnitsTreeLoadingSpinner } from "./UnitsTreeLoadingSpinner";
import { UnitsTreeSelector } from "./UnitsTreeSelector";
import { ExamSheetFormCard } from "./ExamSheetFormCard";
import { getAllUnits, getUnitsByGrade } from "@/api/units/server-api";
import type { ExamSheetFormData, UnitsTreeOptions } from "./types";

/**
 * 시험지 등록 메인 컴포넌트
 * @description CSR 방식으로 단원 트리를 로딩하고 시험지를 등록하는 컴포넌트
 */
export function ExamSheetRegister() {
  // 로컬 상태 관리
  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  const [shouldIncludeQuestions, setShouldIncludeQuestions] = useState<boolean>(true);
  const [formData, setFormData] = useState<ExamSheetFormData>({
    examName: "",
    grade: 1,
    unitSelection: {
      selectedUnitIds: [],
      grade: 1,
      totalSelectedUnits: 0,
      unitQuestionCounts: {},
    },
    questionSettings: {
      multipleChoiceCount: 0,
      subjectiveCount: 0,
      totalPoints: 0,
    },
  });

  // 단원 트리 조회 쿼리 (CSR 방식)
  const {
    data: unitsTree,
    isPending: isUnitsLoading,
    isError: isUnitsError,
    error: unitsError,
    isFetching: isUnitsFetching,
    refetch: refetchUnits,
  } = useQuery({
    queryKey: ["units", "tree", { grade: selectedGrade, shouldIncludeQuestions }],
    queryFn: () => {
      return selectedGrade 
        ? getUnitsByGrade(selectedGrade)
        : getAllUnits();
    },
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  /**
   * 학년 변경 핸들러
   * @param grade 선택된 학년
   */
  const handleGradeChange = useCallback((grade: number) => {
    setSelectedGrade(grade);
    setFormData(prev => ({
      ...prev,
      grade,
      unitSelection: {
        selectedUnitIds: [],
        grade,
        totalSelectedUnits: 0,
        unitQuestionCounts: {},
      },
    }));
  }, []);

  /**
   * 문제 포함 옵션 변경 핸들러
   * @param include 문제 포함 여부
   */
  const handleIncludeQuestionsChange = useCallback((include: boolean) => {
    setShouldIncludeQuestions(include);
  }, []);

  /**
   * 단원 선택 변경 핸들러
   * @param unitIds 선택된 단원 ID 배열
   */
  const handleUnitSelectionChange = useCallback((unitIds: string[]) => {
    setFormData(prev => ({
      ...prev,
      unitSelection: {
        ...prev.unitSelection,
        selectedUnitIds: unitIds,
        totalSelectedUnits: unitIds.length,
        // TODO: 실제 문제 수 계산 로직 추가
        unitQuestionCounts: {},
      },
    }));
  }, []);

  return (
    <div className="space-y-6">
      {/* 헤더 영역 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">시험지 등록</h2>
          <p className="text-muted-foreground">
            단원을 선택하여 새로운 시험지를 생성합니다
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isUnitsFetching && (
            <Badge variant="secondary" className="animate-pulse">
              동기화 중...
            </Badge>
          )}
        </div>
      </div>

      {/* 설정 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">기본 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 학년 선택 */}
            <div className="space-y-2">
              <Label htmlFor="grade-select">학년 선택</Label>
              <Select 
                value={selectedGrade.toString()} 
                onValueChange={(value) => handleGradeChange(Number(value))}
              >
                <SelectTrigger id="grade-select">
                  <SelectValue placeholder="학년을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1학년</SelectItem>
                  <SelectItem value="2">2학년</SelectItem>
                  <SelectItem value="3">3학년</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 문제 포함 옵션 */}
            <div className="space-y-2">
              <Label htmlFor="include-questions">문제 포함 조회</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="include-questions"
                  checked={shouldIncludeQuestions}
                  onCheckedChange={handleIncludeQuestionsChange}
                />
                <span className="text-sm text-muted-foreground">
                  {shouldIncludeQuestions ? "문제 수 표시" : "단원만 표시"}
                </span>
              </div>
            </div>

            {/* 선택된 단원 수 */}
            <div className="space-y-2">
              <Label>선택된 단원</Label>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-base">
                  {formData.unitSelection.totalSelectedUnits}개
                </Badge>
                <span className="text-sm text-muted-foreground">단원</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 단원 트리 영역 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">단원 선택</CardTitle>
          <p className="text-sm text-muted-foreground">
            시험지에 포함할 단원들을 선택하세요
            {shouldIncludeQuestions && " (문제 수 포함 조회 중)"}
          </p>
        </CardHeader>
        <CardContent>
          {isUnitsLoading ? (
            <UnitsTreeLoadingSpinner 
              shouldIncludeQuestions={shouldIncludeQuestions}
              grade={selectedGrade}
            />
          ) : isUnitsError ? (
            <Alert variant="destructive">
              <AlertDescription>
                단원 정보를 불러오는데 실패했습니다: {unitsError?.message}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-2" 
                  onClick={() => refetchUnits()}
                >
                  다시 시도
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <UnitsTreeSelector
              data={unitsTree || []}
              selectedUnitIds={formData.unitSelection.selectedUnitIds}
              onSelectionChange={handleUnitSelectionChange}
              shouldIncludeQuestions={shouldIncludeQuestions}
            />
          )}
        </CardContent>
      </Card>

      {/* 시험지 생성 폼 */}
      {formData.unitSelection.totalSelectedUnits > 0 && (
        <ExamSheetFormCard
          formData={formData}
          onFormDataChange={setFormData}
          unitsTree={unitsTree || []}
        />
      )}
    </div>
  );
}