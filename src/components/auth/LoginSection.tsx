import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, User, Phone, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSetAtom } from "jotai";
import { setLoginInfoAtom } from "@/atoms/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * 로그인 폼 스키마
 * @description 이름, 생년월일, 전화번호 필드에 대한 유효성 검사 규칙
 */
const loginFormSchema = z.object({
  /** 응시자 이름 (2-20자, 한글/영문만 허용) */
  name: z
    .string()
    .min(2, "이름은 최소 2글자 이상이어야 합니다")
    .max(20, "이름은 20글자를 초과할 수 없습니다")
    .regex(
      /^[가-힣a-zA-Z\s]+$/,
      "이름은 한글, 영문, 공백만 입력할 수 있습니다",
    ),
  /** 생년월일 (YYMMDD 형식, 6자리) */
  birth: z
    .string()
    .length(6, "생년월일은 6자리로 입력해주세요")
    .regex(/^\d{6}$/, "숫자만 입력해주세요")
    .refine((value) => {
      const year = parseInt(value.substring(0, 2));
      const month = parseInt(value.substring(2, 4));
      const day = parseInt(value.substring(4, 6));

      // 유효한 날짜 범위 검증
      if (month < 1 || month > 12) return false;
      if (day < 1 || day > 31) return false;

      return true;
    }, "올바른 생년월일을 입력해주세요"),
  /** 전화번호 (010-0000-0000 형식) */
  phoneNumber: z
    .string()
    .regex(
      /^010-\d{4}-\d{4}$/,
      "전화번호는 010-0000-0000 형식으로 입력해주세요",
    ),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

/**
 * 로그인 섹션 컴포넌트
 * @description 브랜딩, 로그인 폼(이름, 전화번호), 회원가입 링크를 포함하는 왼쪽 영역
 */
export function LoginSection() {
  /** 폼 제출 중 로딩 상태 */
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** 로그인 정보 설정 atom */
  const setLoginInfo = useSetAtom(setLoginInfoAtom);

  /**
   * React Hook Form 설정
   * @description Zod 스키마를 사용한 폼 유효성 검사 및 상태 관리
   */
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      name: "",
      birth: "",
      phoneNumber: "010",
    },
    mode: "onChange", // 실시간 유효성 검사
  });

  /**
   * 폼 제출 핸들러
   * @description 유효성 검사 통과 후 Jotai atom에 정보 저장하고 메인 페이지로 이동
   */
  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);

    try {
      // TODO: 실제 로그인 API 호출로 사용자 정보 확인
      console.log("로그인 정보:", data);

      // 임시 지연 (실제 API 호출 시뮬레이션)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Jotai atom에 로그인 정보 저장
      const studentInfo = {
        studentId: `2024${data.birth.substring(0, 2)}`, // 생년월일 기반 임시 ID 생성
        name: data.name,
        birthDate: `20${data.birth.substring(0, 2)}-${data.birth.substring(2, 4)}-${data.birth.substring(4, 6)}`,
        phoneNumber: data.phoneNumber,
      };

      setLoginInfo(studentInfo);

      // 로그인 성공 후 메인 페이지로 이동
      window.location.href = "/main";
    } catch (error) {
      console.error("로그인 실패:", error);
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

  return (
    <div className=" space-y-8 p-8 md:p-10">
      {/* 브랜딩 영역 */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600/15 text-violet-600">
          <BookOpen size={20} />
        </div>
        <div className="text-2xl font-bold">이룸클래스</div>
      </div>

      {/* 서비스 설명 */}
      <div className="text-muted-foreground">
        성장의 모든 순간을 함께하겠습니다
      </div>

      {/* 안내 메시지 */}
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          입력하신 정보는 로그인 및 서비스 이용을 위해서만 사용됩니다
        </AlertDescription>
      </Alert>

      {/* 로그인 폼 */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          {/* 폼 상태 표시 */}
          {isFormValid && !hasErrors && (
            <div className="flex items-center justify-center gap-2 text-green-600 text-sm font-medium">
              ✓ 모든 정보가 정확히 입력되었습니다
            </div>
          )}

          {/* 로그인 버튼 */}
          <Button
            type="submit"
            className={cn(
              "w-full h-12 text-base font-semibold transition-all duration-300",
              "shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
              isFormValid && !hasErrors
                ? "bg-violet-600 hover:bg-violet-700 text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-200 hover:transform-none hover:shadow-lg",
            )}
            disabled={!isFormValid || hasErrors || isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-3">로그인 중입니다...</div>
            ) : (
              <div className="flex items-center gap-2">로그인</div>
            )}
          </Button>
        </form>
      </Form>

      {/* 필수 항목 안내 */}
      <div className="text-xs text-slate-500 text-center">
        * 표시된 항목은 필수 입력 항목입니다
      </div>

      {/* 접근성을 위한 숨겨진 안내 */}
      <div className="sr-only" role="status" aria-live="polite">
        {hasErrors && "입력 정보를 확인해주세요"}
        {isSubmitting && "로그인 중입니다"}
        {isFormValid && !hasErrors && "모든 정보가 올바르게 입력되었습니다"}
      </div>
    </div>
  );
}
