/**
 * 단원 트리 로딩 스피너 컴포넌트
 * @description 문제 포함 단원 트리 조회 시 사용자 친화적인 로딩 경험 제공
 *
 * 주요 기능:
 * - 진행률 표시
 * - 로딩 단계별 메시지
 * - 예상 소요 시간 안내
 * - 사용자 친화적인 디자인
 */

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * 로딩 단계 정의
 */
const LOADING_STEPS = [
  {
    id: "connecting",
    label: "서버 연결 중",
    description: "데이터베이스에 연결하고 있습니다",
    duration: 1000,
  },
  {
    id: "fetching",
    label: "단원 정보 조회 중",
    description: "전체 단원 구조를 가져오고 있습니다",
    duration: 2000,
  },
  {
    id: "processing",
    label: "문제 정보 처리 중", 
    description: "각 단원별 문제 수를 계산하고 있습니다",
    duration: 2500,
  },
  {
    id: "finalizing",
    label: "데이터 정리 중",
    description: "트리 구조를 최적화하고 있습니다",
    duration: 500,
  },
] as const;

interface UnitsTreeLoadingSpinnerProps {
  /** 문제 포함 조회 여부 */
  includeQuestions: boolean;
  /** 선택된 학년 */
  grade: number;
}

/**
 * 단원 트리 로딩 스피너 컴포넌트
 * @description 단원 트리 조회 중 사용자에게 진행 상황을 시각적으로 표시
 */
export function UnitsTreeLoadingSpinner({ 
  includeQuestions, 
  grade 
}: UnitsTreeLoadingSpinnerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  // 예상 총 소요 시간 계산
  const totalDuration = LOADING_STEPS.reduce((sum, step) => sum + step.duration, 0);
  const estimatedTime = includeQuestions ? Math.round(totalDuration / 1000) : 2;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let startTime = Date.now();

    const runStep = (stepIndex: number) => {
      if (stepIndex >= LOADING_STEPS.length) return;

      const step = LOADING_STEPS[stepIndex];
      setCurrentStep(stepIndex);

      // 프로그레스 바 애니메이션
      const stepProgress = ((stepIndex + 1) / LOADING_STEPS.length) * 100;
      setProgress(stepProgress);

      timeoutId = setTimeout(() => {
        runStep(stepIndex + 1);
      }, step.duration);
    };

    // 경과 시간 업데이트
    const timeInterval = setInterval(() => {
      setElapsedTime(Math.round((Date.now() - startTime) / 1000));
    }, 1000);

    runStep(0);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(timeInterval);
    };
  }, [includeQuestions, grade]);

  const currentStepData = LOADING_STEPS[currentStep] || LOADING_STEPS[0];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          {/* 메인 아이콘 */}
          <div className="flex justify-center">
            <div className="relative">
              {/* 회전하는 스피너 */}
              <div className="w-16 h-16 border-4 border-primary/20 rounded-full">
                <div className="w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              {/* 중앙 숫자 표시 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">
                  {grade}
                </span>
              </div>
            </div>
          </div>

          {/* 상태 정보 */}
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <h3 className="text-xl font-semibold">{currentStepData.label}</h3>
              {includeQuestions && (
                <Badge variant="secondary">문제 수 포함</Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              {currentStepData.description}
            </p>
          </div>

          {/* 진행률 바 */}
          <div className="space-y-2">
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>단계 {currentStep + 1} / {LOADING_STEPS.length}</span>
              <span>{Math.round(progress)}% 완료</span>
            </div>
          </div>

          {/* 시간 정보 */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                경과 시간
              </div>
              <div className="text-2xl font-bold">
                {elapsedTime}초
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                예상 시간
              </div>
              <div className="text-2xl font-bold">
                {estimatedTime}초
              </div>
            </div>
          </div>

          {/* 추가 안내 메시지 */}
          {includeQuestions && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    문제 정보 조회 중
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    각 단원별 문제 수를 확인하고 있어 시간이 조금 더 걸립니다.
                    잠시만 기다려 주세요!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 스켈레톤 미리보기 */}
          <div className="space-y-3 mt-8">
            <div className="text-sm font-medium text-muted-foreground text-left">
              곧 표시될 내용:
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
              <div className="ml-4 space-y-2">
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}