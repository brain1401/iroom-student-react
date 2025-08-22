import * as React from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/**
 * 이니셜 생성 함수
 * @description 이름에서 성(첫 글자) 추출
 */
function getNameMonogram(name: string): string {
  if (!name) return "";
  return name.slice(0, 1);
}

/**
 * 메시지 타입
 * @description 사용자/어시스턴트 메시지와 전송 시각 정보 포함
 */
type ChatMessage = {
  /** 발신 유형 */
  role: "assistant" | "user";
  /** 메시지 텍스트 */
  content: string;
  /** 전송 시각 */
  timestamp: number;
};

type ChatbotFabProps = {
  /** 추가 클래스 */
  className?: string;
  /** 버튼 표시 모드 (fab: 플로팅, inline: 인라인 버튼, fixed-button: 고정형 버튼) */
  mode?: "fab" | "inline" | "fixed-button";
  /** 버튼 라벨 텍스트 */
  label?: string;
  /** 버튼 포지셔닝 방식 */
  position?: "fixed" | "absolute";
  /** 트리거 내부 커스텀 콘텐츠 */
  triggerChildren?: React.ReactNode;
};

/**
 * 챗봇 버튼 컴포넌트
 * @description 플로팅(fab) 또는 인라인 버튼으로 챗봇 드로어 트리거 표시
 */
export function ChatbotFab({
  className,
  mode = "fab",
  label = "챗봇 열기",
  position = "fixed",
  triggerChildren,
}: ChatbotFabProps) {
  const USER_NAME = "김체리";
  const AI_NAME = "AI";
  const USER_AVATAR_SRC = ""; // 성(첫 글자) 모노그램 표시
  const AI_AVATAR_SRC = "/figma/mobile-fab.png";
  const INPUT_BAR_AVATAR_SRC = "/figma/mobile-fab.png";
  const QUICK_PROMPTS: readonly string[] = [
    "비슷한 문제 추천해줘",
    "풀이 순서 알려줘",
    "관련 공식 설명해줘",
  ] as const;
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState<ChatMessage[]>([{
    role: "assistant",
    content: "무엇을 도와줄까",
    timestamp: Date.now(),
  }]);
  const [isTyping, setIsTyping] = React.useState(false);
  /** 대기 응답 타임아웃 참조 */
  const pendingReplyTimeoutRef = React.useRef<number | null>(null);
  /** 스크롤 컨테이너 참조 */
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  /** 삭제 모드 여부 */
  const [isDeleteMode, setIsDeleteMode] = React.useState(false);
  /** 선택 삭제 인덱스 집합 */
  const [selectedForDelete, setSelectedForDelete] = React.useState<Set<number>>(new Set());

  /** 드로어 열림 시 초기 메시지 세팅 */
  React.useEffect(() => {
    if (!open) return;
    // Figma 화면 동일 문구 세팅
    setMessages([
      {
        role: "user",
        content:
          "저는 2x × -5에서 -10x 말고 +10x로 계산했어요. 왜 틀린 거죠?",
        timestamp: Date.now(),
      },
      {
        role: "assistant",
        content:
          "2 × -5는 양수 × 음수이기 때문에 부호가 음수가 됩니다.\n곱셈 부호 규칙을 꼭 기억하세요: (+) × (+) = (+) (+) × (-) = (-) (-) × (+) = (-) (-) × (-) = (+)\n그래서 2x × (-5)는 -10x가 맞습니다.",
        timestamp: Date.now(),
      },
    ]);
  }, [open]);

  /** 텍스트 전송 함수 */
  const sendText = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const newUserMsg: ChatMessage = {
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newUserMsg]);

    // 어시스턴트 타이핑 표시 및 임시 응답 추가
    setIsTyping(true);
    const timeoutId = window.setTimeout(() => {
      const assistantReply: ChatMessage = {
        role: "assistant",
        content: "요청 내용 검토 중",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantReply]);
      setIsTyping(false);
      pendingReplyTimeoutRef.current = null;
    }, 800);
    pendingReplyTimeoutRef.current = timeoutId as unknown as number;
  };

  /** 입력 전송 처리 함수 */
  const handleSend = () => {
    const text = message.trim();
    if (!text) return;
    sendText(text);
    setMessage("");
  };

  // 추천 프롬프트 전송 함수 (미사용)
  // const handleQuickSend = (_text: string) => {};

  /** 컴포넌트 언마운트 시 타임아웃 정리 */
  React.useEffect(() => {
    return () => {
      if (pendingReplyTimeoutRef.current !== null) {
        clearTimeout(pendingReplyTimeoutRef.current);
        pendingReplyTimeoutRef.current = null;
      }
    };
  }, []);

  /** 자동 스크롤 처리 */
  React.useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    // 다음 프레임에서 스크롤 적용 처리
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
  }, [messages, isTyping, open]);

  /** 대화 전체 삭제 함수 */
  const handleClearAll = () => {
    if (pendingReplyTimeoutRef.current !== null) {
      clearTimeout(pendingReplyTimeoutRef.current);
      pendingReplyTimeoutRef.current = null;
    }
    setIsTyping(false);
    setMessages([]);
  };

  /** 삭제 모드 토글 함수 */
  const toggleDeleteMode = () => {
    setIsDeleteMode((prev) => !prev);
    setSelectedForDelete(new Set());
  };

  /** 메시지 선택 토글 함수 */
  const toggleSelectMessage = (index: number) => {
    setSelectedForDelete((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  /** 선택 메시지 일괄 삭제 함수 */
  const handleDeleteSelected = () => {
    if (selectedForDelete.size === 0) {
      setIsDeleteMode(false);
      return;
    }
    setMessages((prev) => prev.filter((_, i) => !selectedForDelete.has(i)));
    setSelectedForDelete(new Set());
    setIsDeleteMode(false);
  };

  /** 개별 메시지 삭제 함수 */
  const handleDeleteMessage = (index: number) => {
    setMessages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      {mode === "fab" ? (
        <Button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            `${position} bottom-6 right-4 z-50 h-14 w-14 rounded-full p-0 shadow-lg`,
            "bg-gradient-to-b from-[#C667F0] to-[#A445EB]",
            className,
          )}
          aria-label="챗봇 열기"
        >
          {triggerChildren ?? (
            <span className="text-xl leading-none text-white">💬</span>
          )}
        </Button>
      ) : mode === "inline" ? (
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => setOpen(true)}
          className={cn("rounded-full px-3", className)}
          aria-label="챗봇 열기"
        >
          {label}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            `${position} bottom-6 right-4 z-50 shadow-lg`,
            "rounded-full h-10 px-4 bg-gradient-to-b from-[#C667F0] to-[#A445EB] text-white",
            className,
          )}
          aria-label="챗봇 열기"
        >
          💬 {label}
        </Button>
      )}

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="h-[443.72px] rounded-t-[0px] p-0 shadow-[0_1px_6px_rgba(0,0,0,0.25)]">
          {/* 상단 보라 바 */}
          <div className="relative h-[53.24px] w-full bg-[#AB4CEC] shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
            <div className="absolute left-1/2 top-[17.62px] -translate-x-1/2 text-[18px]/[1] font-medium text-white">
              이룸클래스 챗봇
            </div>
            <div className="absolute right-[16px] top-[15px] flex items-center gap-3 text-white">
              {!isDeleteMode ? (
                <button
                  type="button"
                  onClick={toggleDeleteMode}
                  className="text-[15px]/[1] font-medium opacity-90 hover:opacity-100"
                  aria-label="삭제"
                >
                  삭제
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-[15px]/[1] font-medium opacity-90 hover:opacity-100"
                    aria-label="전체 삭제"
                  >
                    전체 삭제
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteSelected}
                    className="text-[15px]/[1] font-medium opacity-90 hover:opacity-100"
                    aria-label="선택 삭제"
                  >
                    선택 삭제
                  </button>
                  <button
                    type="button"
                    onClick={toggleDeleteMode}
                    className="text-[15px]/[1] font-medium opacity-90 hover:opacity-100"
                    aria-label="취소"
                  >
                    취소
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-[15px]/[1] font-medium"
                aria-label="접기"
              >
                접기
              </button>
            </div>
          </div>

          {/* 대화 영역 + 추천 프롬프트 + 하단 바 */}
          <div className="flex h-[calc(443.72px-53.24px-67.57px)] flex-col overflow-hidden">
            {/* 추천 프롬프트 행 */}
            <div className="px-[24px] pt-[12px]">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="shrink-0 rounded-full border px-3 py-1 text-[12px] text-[#777777]"
                    onClick={() => sendText(prompt)}
                    aria-label={prompt}
                    title={prompt}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div ref={scrollContainerRef} className="flex-1 space-y-2 overflow-y-auto px-[24px] pt-[12px]">
              {messages.map((m, idx) => {
                const isAssistant = m.role === "assistant";
                const userMonogram = getNameMonogram(USER_NAME);
                const isSelected = selectedForDelete.has(idx);
                return (
                  <div key={idx} className={cn(isAssistant ? "self-start" : "self-end", "relative max-w-[298px]")}> 
                    {/* 프로필 + 성명 행 */}
                    <div
                      className={cn(
                        "mb-1 flex items-center gap-2",
                        isAssistant ? "flex-row" : "flex-row-reverse justify-start",
                      )}
                    >
                      <Avatar className="h-[20px] w-[20px]">
                        <AvatarImage src={isAssistant ? AI_AVATAR_SRC : USER_AVATAR_SRC} alt={isAssistant ? "AI avatar" : "사용자 아바타"} />
                        <AvatarFallback className="text-[11px] font-medium text-[#4E4D4D]">
                          {userMonogram}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[13px] text-[#777777]">
                        {isAssistant ? AI_NAME : USER_NAME}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "whitespace-pre-wrap break-words rounded-[14px] px-[10px] py-[8px] text-[15px] leading-[1.2]",
                        isAssistant ? "bg-white text-[#4E4D4D] shadow" : "bg-[#AB4CEC] text-white",
                      )}
                    >
                      {m.content}
                    </div>
                    {!isDeleteMode ? (
                      <button
                        type="button"
                        onClick={() => handleDeleteMessage(idx)}
                        className={cn(
                          "absolute -right-2 -top-2 h-5 w-5 rounded-full text-[12px] leading-[20px]",
                          isAssistant ? "bg-black/30 text-white" : "bg-white/30 text-black",
                        )}
                        aria-label="메시지 삭제"
                        title="삭제"
                      >
                        ×
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleSelectMessage(idx)}
                        className={cn(
                          "absolute -top-2 flex h-5 w-5 items-center justify-center rounded border",
                          isAssistant ? "-left-6" : "-right-6",
                          isSelected ? "border-[#AB4CEC] bg-[#AB4CEC] text-white" : "border-[#AB4CEC] bg-white text-transparent",
                        )}
                        aria-label="메시지 선택"
                        title={isSelected ? "선택됨" : "선택"}
                      >
                        ✓
                      </button>
                    )}
                  </div>
                );
              })}
              {isTyping && (
                <div className="self-start max-w-[298px] rounded-[14px] bg-white px-[10px] py-[8px] text-[15px] leading-[1.2] text-[#4E4D4D] shadow">
                  입력 중
                </div>
              )}
            </div>
          </div>

          {/* 하단 입력 바 (Figma 스펙) */}
          <div className="relative h-[67.57px] w-full">
            <div className="absolute left-0 top-0 h-[67.57px] w-full bg-[#AB4CEC] shadow-[0_1px_6px_rgba(0,0,0,0.25)]" />

            <div className="absolute left-[70.44px] top-[15.63px] h-[46px] w-[268.14px]">
              <div className="absolute inset-0 rounded-[38.62px] bg-white shadow-[0_1px_6px_rgba(0,0,0,0.25)]" />
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && message.trim()) handleSend();
                }}
                className="absolute left-[18.84px] top-[9.42px] h-[30px] w-[235.35px] bg-transparent text-[15px] outline-none placeholder:text-[#777777]"
                placeholder="AI에게 질문하기..."
                aria-label="메시지 입력"
              />
            </div>
            <Button
              type="button"
              disabled={!message.trim()}
              onClick={handleSend}
              className="absolute left-[271px] top-[20.16px] h-[36.94px] w-[60.09px] rounded-[38.62px] bg-[#AB4CEC] text-[13px]/[2.31] font-medium text-white shadow-[0_1px_6px_rgba(0,0,0,0.25)]"
              aria-label="전송"
            >
              전송
            </Button>
            <img
              src={INPUT_BAR_AVATAR_SRC}
              alt="avatar"
              className="absolute left-0 top-0 h-[67.57px] w-[67.57px] object-cover"
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default ChatbotFab;
