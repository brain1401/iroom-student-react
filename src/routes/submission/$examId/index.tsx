import { getMockExamById } from "@/api/exam/api";
import { extractApiData } from "@/api/common/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { User, Phone, CheckCircle2, Loader2 } from "lucide-react";

/**
 * 제출 양식 스키마
 * @description 이름과 전화번호 필드에 대한 유효성 검사 규칙
 */
const submissionFormSchema = z.object({
  /** 응시자 이름 (2-20자, 한글/영문만 허용) */
  name: z
    .string()
    .min(2, "이름은 최소 2글자 이상이어야 합니다")
    .max(20, "이름은 20글자를 초과할 수 없습니다")
    .regex(
      /^[가-힣a-zA-Z\s]+$/,
      "이름은 한글, 영문, 공백만 입력할 수 있습니다",
    ),
  /** 전화번호 (010-0000-0000 형식) */
  phoneNumber: z
    .string()
    .regex(
      /^010-\d{4}-\d{4}$/,
      "전화번호는 010-0000-0000 형식으로 입력해주세요",
    ),
  grade: z.string().min(1, "학년을 선택해주세요"),
  birth: z.string().min(1, "생년월일을 선택해주세요"),
});

type SubmissionFormData = z.infer<typeof submissionFormSchema>;

export const Route = createFileRoute("/submission/$examId/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    try {
      const examResponse = await getMockExamById(params.examId);
      const exam = extractApiData(examResponse);
      return { exam };
    } catch (error) {
      console.error("모의고사 조회 실패:", error);
      return { exam: null, error: error as Error };
    }
  },
});

function RouteComponent() {
  const { exam, error } = Route.useLoaderData();
  const { examId } = Route.useParams();
  const examName = exam?.title;
  const navigate = useNavigate();

  /** 폼 제출 중 로딩 상태 */
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * React Hook Form 설정
   * @description Zod 스키마를 사용한 폼 유효성 검사 및 상태 관리
   */
  const form = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionFormSchema),
    defaultValues: {
      name: "",
      phoneNumber: "010",
      grade: "",
      birth: "",
    },
    mode: "onChange", // 실시간 유효성 검사
  });

  /**
   * 폼 제출 핸들러
   * @description 유효성 검사 통과 후 다음 페이지로 이동
   */
  const onSubmit = async (data: SubmissionFormData) => {
    setIsSubmitting(true);

    try {
      // TODO: 실제 API 호출로 응시자 정보 저장
      console.log("제출된 응시자 정보:", data);

      // 임시 지연 (실제 API 호출 시뮬레이션)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 제출 성공 후 스캔 페이지로 이동
      await navigate({
        to: "/submission/$examId/scan",
        params: { examId },
      });
    } catch (error) {
      console.error("응시자 정보 저장 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 전화번호 입력 포맷팅
   * @description 사용자가 입력하는 동안 자동으로 하이픈 추가
   */
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, "");

    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7)
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  /** 폼 유효성 검사 상태 */
  const isFormValid = form.formState.isValid;
  const hasErrors = Object.keys(form.formState.errors).length > 0;

  // 디버깅용 폼 상태 확인
  const currentGrade = form.getValues("grade");
  const currentBirth = form.getValues("birth");
  const isButtonDisabled = !isFormValid || hasErrors || isSubmitting;

  console.log("폼 상태:", {
    isFormValid,
    hasErrors,
    isSubmitting,
    currentGrade,
    currentBirth,
    birthLength: currentBirth?.length,
    isButtonDisabled,
  });

  if (error || !examName) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>해당하는 모의고사가 없습니다.</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <PageHeader title={examName} shouldShowBackButton={false} />

      {/* 응시자 정보 입력 카드 */}
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-main-50 rounded-full flex items-center justify-center mb-2">
            <User className="w-8 h-8 text-main-600" />
          </div>
          <CardTitle className="text-xl font-bold text-slate-900">
            응시자 정보 입력
          </CardTitle>
          <CardDescription className="text-slate-600">
            시험 응시를 위해 본인 확인이 필요한 정보를 입력해주세요
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 ">
          {/* 안내 메시지 */}
          <Alert className="border-purple-200 bg-main-50">
            <CheckCircle2 className="h-4 w-4 text-main-600" />
            <AlertDescription className="text-main-800">
              입력하신 정보는 시험 진행 및 결과 확인을 위해서만 사용됩니다
            </AlertDescription>
          </Alert>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* 이름 입력 필드 */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      이름 *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="예) 김철수"
                        className={cn(
                          "h-12 text-base transition-all duration-200",
                          "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                          form.formState.errors.name &&
                            "border-red-500 focus-visible:border-red-500 focus:ring-red-200",
                          !form.formState.errors.name &&
                            field.value &&
                            "border-green-500 focus:ring-green-200",
                        )}
                        disabled={isSubmitting}
                        autoComplete="name"
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-slate-600">
                      한글 또는 영문으로 2-20자 이내 입력
                    </FormDescription>
                    <FormMessage
                      role="alert"
                      className="text-sm text-red-600 font-medium"
                    />
                  </FormItem>
                )}
              />

              {/* 전화번호 입력 필드 */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      전화번호 *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="010-0000-0000"
                        className={cn(
                          "h-12 text-base transition-all duration-200",
                          "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                          form.formState.errors.phoneNumber &&
                            "border-red-500 focus-visible:border-red-500 focus:ring-red-200",
                          !form.formState.errors.phoneNumber &&
                            field.value.length === 13 &&
                            "border-green-500 focus:ring-green-200",
                        )}
                        disabled={isSubmitting}
                        autoComplete="tel"
                        type="tel"
                        onChange={(e) => {
                          const formatted = formatPhoneNumber(e.target.value);
                          field.onChange(formatted);
                        }}
                        maxLength={13}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-slate-600">
                      010으로 시작하는 휴대폰 번호를 입력해주세요
                    </FormDescription>
                    <FormMessage
                      role="alert"
                      className="text-sm text-red-600 font-medium"
                    />
                  </FormItem>
                )}
              />

              {/* 학년 선택 필드 */}
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      학년 *
                    </FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className={cn(
                          "h-12 text-base transition-all duration-200 border border-gray-300 rounded-md px-3",
                          "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                          form.formState.errors.grade &&
                            "border-red-500 focus-visible:border-red-500 focus:ring-red-200",
                          !form.formState.errors.grade &&
                            field.value &&
                            "border-green-500 focus:ring-green-200",
                        )}
                        disabled={isSubmitting}
                      >
                        <option value="">학년 선택</option>
                        <option value="1">1학년</option>
                        <option value="2">2학년</option>
                        <option value="3">3학년</option>
                      </select>
                    </FormControl>
                    <FormMessage
                      role="alert"
                      className="text-sm text-red-600 font-medium"
                    />
                  </FormItem>
                )}
              />

              {/* 생년월일 입력 필드 */}
              <FormField
                control={form.control}
                name="birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      생년월일 *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="YYMMDD (예: 080101)"
                        maxLength={6}
                        className={cn(
                          "h-12 text-base transition-all duration-200",
                          "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                          form.formState.errors.birth &&
                            "border-red-500 focus-visible:border-red-500 focus:ring-red-200",
                          !form.formState.errors.birth &&
                            field.value &&
                            field.value.length === 6 &&
                            "border-green-500 focus:ring-green-200",
                        )}
                        disabled={isSubmitting}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, "");
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-slate-600">
                      생년월일 6자리를 입력해주세요 (예: 080101)
                    </FormDescription>
                    <FormMessage
                      role="alert"
                      className="text-sm text-red-600 font-medium"
                    />
                  </FormItem>
                )}
              />

              {/* 폼 상태 표시 */}
              {isFormValid &&
                !hasErrors &&
                form.getValues("grade") &&
                form.getValues("birth")?.length === 6 && (
                  <div className="flex items-center justify-center gap-2 text-green-600 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    모든 정보가 정확히 입력되었습니다
                  </div>
                )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* 하단 여백 */}
      <div className="flex-1" />

      {/* 다음 버튼 */}
      <div className="w-full max-w-lg px-4">
        <Button
          className={cn(
            "w-full h-14 text-lg font-semibold rounded-xl transition-all duration-300",
            "shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
            isFormValid && !hasErrors
              ? "bg-main-500 hover:bg-main-600 text-white"
              : "bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-200 hover:transform-none hover:shadow-lg",
          )}
          disabled={isButtonDisabled}
          onClick={form.handleSubmit(onSubmit)}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              정보를 확인하는 중입니다...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              시험 시작하기
              <CheckCircle2 className="w-5 h-5" />
            </div>
          )}
        </Button>

        {/* 필수 항목 안내 */}
        <div className="text-xs text-slate-500 text-center mt-3">
          * 표시된 항목은 필수 입력 항목입니다
        </div>
      </div>

      {/* 접근성을 위한 숨겨진 안내 */}
      <div className="sr-only" role="status" aria-live="polite">
        {hasErrors && "입력 정보를 확인해주세요"}
        {isSubmitting && "정보를 저장하고 있습니다"}
        {isFormValid && !hasErrors && "모든 정보가 올바르게 입력되었습니다"}
      </div>
    </>
  );
}
