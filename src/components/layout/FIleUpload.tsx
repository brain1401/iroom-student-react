import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import QrIcon from "../ui/qr-icon";
import { useDropzone } from "react-dropzone";
import { Input } from "../ui/input";
import { X } from "lucide-react";

/**
 * 파일 업로드 컴포넌트 Props
 * @description 파일 선택 시 상위로 파일 목록 전달
 */
type FileUploadProps = {
  /** 파일 선택 콜백 */
  onFilesSelect: (files: File[]) => void;
};

/**
 * 미리보기 파일 타입
 * @description 브라우저 객체 URL 포함 파일 타입
 */
type PreviewFile = File & { preview?: string; _id: string };

export function FileUpload({ onFilesSelect }: FileUploadProps) {
  const inputId = useId();
  const [files, setFiles] = useState<PreviewFile[]>([]);

  /**
   * 파일 드롭존 설정
   * @description 버튼으로만 파일 선택, 드래그앤드롭 허용
   */
  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    accept: { "image/*": [] },
    multiple: true,
    onDrop: (accepted) => {
      // 미리보기 URL 및 고유 ID 생성 후 누적 병합
      const acceptedWithPreview: PreviewFile[] = accepted.map((file, idx) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          _id: `${Date.now()}-${idx}-${file.lastModified}`,
        }),
      );
      setFiles((prev) => {
        const merged = [...prev, ...acceptedWithPreview];
        onFilesSelect(merged);
        return merged;
      });
    },
  });

  /**
   * 미리보기 URL 정리
   * @description 컴포넌트 언마운트 시 메모리 누수 방지
   */
  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [files]);

  /**
   * 파일 제거 핸들러
   * @description 썸네일 X 버튼 클릭 시 파일 목록에서 제거 및 URL 해제
   */
  const handleRemove = (id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f._id === id);
      if (target?.preview) URL.revokeObjectURL(target.preview);
      const next = prev.filter((f) => f._id !== id);
      onFilesSelect(next);
      return next;
    });
  };

  return (
    <div className={cn("flex w-full h-full flex-1 flex-col")}>
      {/* 드롭존 루트 및 입력 요소 */}
      <div {...getRootProps()} className={cn("contents")}>
        <Input
          id={inputId}
          {...getInputProps({
            accept: "image/*",
            multiple: true,
            capture: "environment",
          })}
        />
      </div>

      <div className="flex flex-col flex-1 justify-center items-center">
        <Button
          asChild
          type="button"
          variant="outline"
          className={cn(
            "w-full py-[2rem] rounded-full bg-white px-6 text-base font-semibold",
            "shadow-[0_8px_24px_rgba(0,0,0,0.08)] ring-1 ring-gray-200",
          )}
        >
          <label
            htmlFor={inputId}
            className="cursor-pointer inline-flex items-center"
            onClick={(e) => {
              e.preventDefault();
              open();
            }}
          >
            <span className={cn("mr-2")}>
              <QrIcon size={24} />
            </span>
            시험지 촬영
          </label>
        </Button>
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <div
            className={cn(
              "grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-6",
            )}
          >
            {files.map((file) => (
              <div
                key={file._id}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-md border",
                  "bg-muted flex items-center justify-center",
                )}
              >
                <button
                  type="button"
                  aria-label="remove"
                  className={cn(
                    "absolute right-1 top-1 z-10 inline-flex h-6 w-6 items-center justify-center",
                    "rounded-full bg-black/60 text-white hover:bg-black/70",
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(file._id);
                  }}
                >
                  <X size={14} />
                </button>

                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="h-full w-full object-cover"
                    onLoad={() => {
                      const previewUrl = file.preview;
                      if (previewUrl) URL.revokeObjectURL(previewUrl);
                    }}
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">
                    미리보기 없음
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
