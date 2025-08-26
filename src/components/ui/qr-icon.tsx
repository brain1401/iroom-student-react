import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * 큐알 아이콘 컴포넌트
 * @description 정사각형 컨테이너 내 `public/icons/qr.svg` 표시
 *
 * 주요 기능:
 * - 크기 제어를 위한 `size` 지원
 * - 외부 스타일 결합을 위한 `className` 지원
 *
 * @example
 * ```tsx
 * <QrIcon size={32} />
 * <QrIcon className="h-10 w-10" />
 * ```
 */
export type QrIconProps = {
  /** 아이콘 크기 (px 단위) */
  size?: number;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 대체 텍스트 */
  alt?: string;
} & React.ComponentPropsWithoutRef<"div">;

export function QrIcon({
  size = 24,
  className,
  alt = "큐알 아이콘",
  ...props
}: QrIconProps) {
  return (
    <div
      role="img"
      aria-label={alt}
      {...props}
      className={cn("inline-block overflow-hidden", className)}
      style={{ width: size, height: size, ...props.style }}
    >
      <img
        src="/icons/qr.svg"
        alt={alt}
        width={size}
        height={size}
        className="h-full w-full object-contain"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

export default QrIcon;
