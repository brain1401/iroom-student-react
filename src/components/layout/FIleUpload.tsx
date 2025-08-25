import React, { useState, useEffect, useRef, useId } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import QrIcon from "../ui/qr-icon";

type FileUploadProps = {
  onFilesSelect: (files: File[]) => void;
};

export default function FileUpload({ onFilesSelect }: FileUploadProps) {
  const inputId = useId();
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  // 파일 선택 변경 처리 함수
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    const selectedFiles = Array.from(fileList);

    // 누적 리스트로 병합 (기존 + 신규)
    setFiles((prev) => {
      const merged = [...prev, ...selectedFiles];
      onFilesSelect(merged);
      return merged;
    });

    // 동일 파일 다시 선택 허용을 위한 값 초기화
    event.target.value = "";
  };

  return (
    <div className={cn("flex w-full h-full flex-1 flex-col")}>
      <p className={cn("mb-2 text-[13px] font-medium text-gray-700")}>
        첨부파일
      </p>

      {/* 숨김 입력 요소: 레이블로 트리거 */}
      <Input
        id={inputId}
        ref={cameraInputRef}
        type="file"
        multiple
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        
      />
      
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
          <label htmlFor={inputId} className="cursor-pointer inline-flex items-center">
            <span className={cn("mr-2")}>
              <QrIcon size={24} />
            </span>
            시험지 촬영
          </label>
        </Button>
      </div>
    </div>
  );
}