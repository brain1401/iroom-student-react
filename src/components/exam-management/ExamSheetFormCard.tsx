/**
 * 시험지 생성 폼 카드 컴포넌트
 * @description 선택한 단원들을 바탕으로 시험지를 생성하는 폼
 *
 * 주요 기능:
 * - 시험지 이름 입력
 * - 문제 구성 설정 (객관식/주관식 비율)
 * - 배점 설정
 * - 선택한 단원 요약 표시
 * - 시험지 미리보기
 */

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Plus, Save } from "lucide-react";
import type { ExamSheetFormData } from "./types";
import type { UnitTreeNode } from "@/api/common/server-types";
import { extractSelectedUnits } from "@/utils/exam-management";

type ExamSheetFormCardProps = {
  /** 폼 데이터 */
  formData: ExamSheetFormData;
  /** 폼 데이터 변경 핸들러 */
  onFormDataChange: (data: ExamSheetFormData) => void;
  /** 단원 트리 데이터 (선택된 단원 정보 표시용) */
  unitsTree: UnitTreeNode[];
}

/**
 * 시험지 생성 폼 카드 컴포넌트
 */
export function ExamSheetFormCard({
  formData,
  onFormDataChange,
  unitsTree,
}: ExamSheetFormCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 선택된 단원들 정보 추출
  const selectedUnits = useMemo(() => {
    return extractSelectedUnits(unitsTree, formData.unitSelection.selectedUnitIds);
  }, [unitsTree, formData.unitSelection.selectedUnitIds]);

  // 총 문제 수 계산
  const totalQuestions = useMemo(() => {
    return formData.questionSettings.multipleChoiceCount + 
           formData.questionSettings.subjectiveCount;
  }, [formData.questionSettings]);

  // 평균 배점 계산
  const averagePoints = useMemo(() => {
    return totalQuestions > 0 
      ? Math.round((formData.questionSettings.totalPoints / totalQuestions) * 10) / 10
      : 0;
  }, [formData.questionSettings.totalPoints, totalQuestions]);

  /**
   * 폼 필드 변경 핸들러
   */
  const updateFormData = (field: keyof ExamSheetFormData, value: any) => {
    onFormDataChange({
      ...formData,
      [field]: value,
    });
  };

  /**
   * 문제 설정 변경 핸들러
   */
  const updateQuestionSettings = (
    field: keyof ExamSheetFormData["questionSettings"], 
    value: number
  ) => {
    onFormDataChange({
      ...formData,
      questionSettings: {
        ...formData.questionSettings,
        [field]: value,
      },
    });
  };

  /**
   * 시험지 생성 핸들러
   */
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // TODO: 실제 API 호출 구현
      console.log("시험지 생성 데이터:", formData);
      
      // 임시 지연 (실제 API 호출 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert("시험지가 성공적으로 생성되었습니다!");
      
    } catch (error) {
      console.error("시험지 생성 실패:", error);
      alert("시험지 생성에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = 
    formData.examName.trim().length > 0 &&
    totalQuestions > 0 &&
    formData.questionSettings.totalPoints > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          시험지 생성
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 기본 정보 입력 */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="exam-name">시험지 이름 *</Label>
            <Input
              id="exam-name"
              placeholder="예: 2024년 1학기 중간고사"
              value={formData.examName}
              onChange={(e) => updateFormData("examName", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">추가 메모</Label>
            <Textarea
              id="notes"
              placeholder="시험지에 대한 추가 설명이나 주의사항을 입력하세요"
              value={formData.notes || ""}
              onChange={(e) => updateFormData("notes", e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <Separator />

        {/* 문제 구성 설정 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">문제 구성</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="multiple-choice">객관식 문제 수</Label>
              <Input
                id="multiple-choice"
                type="number"
                min="0"
                value={formData.questionSettings.multipleChoiceCount}
                onChange={(e) => updateQuestionSettings("multipleChoiceCount", Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subjective">주관식 문제 수</Label>
              <Input
                id="subjective"
                type="number"
                min="0"
                value={formData.questionSettings.subjectiveCount}
                onChange={(e) => updateQuestionSettings("subjectiveCount", Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="total-points">총 배점</Label>
              <Input
                id="total-points"
                type="number"
                min="0"
                value={formData.questionSettings.totalPoints}
                onChange={(e) => updateQuestionSettings("totalPoints", Number(e.target.value))}
              />
            </div>
          </div>

          {/* 문제 구성 요약 */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {totalQuestions}
                </div>
                <div className="text-sm text-muted-foreground">총 문제 수</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formData.questionSettings.totalPoints}
                </div>
                <div className="text-sm text-muted-foreground">총 배점</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {averagePoints}
                </div>
                <div className="text-sm text-muted-foreground">평균 배점</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {selectedUnits.length}
                </div>
                <div className="text-sm text-muted-foreground">선택 단원</div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* 선택된 단원 요약 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">선택된 단원</h3>
          
          {selectedUnits.length > 0 ? (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {selectedUnits.map((unit: UnitTreeNode) => (
                  <Badge key={unit.id} variant="outline" className="text-xs">
                    {unit.name}
                    {unit.grade && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        ({unit.grade}학년)
                      </span>
                    )}
                  </Badge>
                ))}
              </div>
              
              <div className="text-sm text-muted-foreground">
                총 {selectedUnits.length}개 단원이 선택되었습니다.
              </div>
            </div>
          ) : (
            <Alert>
              <AlertDescription>
                아직 선택된 단원이 없습니다. 위에서 단원을 선택해 주세요.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Separator />

        {/* 생성 버튼 */}
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              // TODO: 미리보기 기능 구현
              alert("미리보기 기능은 곧 구현될 예정입니다.");
            }}
          >
            미리보기
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                생성 중...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                시험지 생성
              </>
            )}
          </Button>
        </div>

        {/* 폼 검증 안내 */}
        {!isFormValid && (
          <Alert>
            <AlertDescription>
              시험지를 생성하려면 다음 항목을 입력해 주세요:
              <ul className="mt-2 ml-4 list-disc">
                {!formData.examName.trim() && <li>시험지 이름</li>}
                {totalQuestions === 0 && <li>문제 수 (객관식 또는 주관식)</li>}
                {formData.questionSettings.totalPoints === 0 && <li>총 배점</li>}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}