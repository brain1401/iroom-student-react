import { FileUpload } from "@/components/layout/FIleUpload";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ObjectiveTab } from "@/components/student/ObjectiveTab";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/submission/$examId/scan/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { examId } = Route.useParams();

  /** 현재 활성 탭 상태 */
  const [activeTab, setActiveTab] = useState<"objective" | "subjective">(
    "objective",
  );

  /**
   * 텍스트 인식이 확실히 되었다고 서버에서 응답을 보내줌 -> 그 동안 다음 버튼을 누를 수 없고 로딩 스피너가 버튼에 보여짐 -> 텍스트 인식 페이지로 이동
   */

  return (
    <div className="container  mx-auto flex flex-1 h-full max-w-6xl flex-col items-center space-y-6 p-4">
      <PageHeader title="가나다 시험" shouldShowBackButton={true} />

      {/* 탭 버튼들 */}
      <div className="flex border-b border-gray-200 mb-6 w-full max-w-4xl">
        <button
          onClick={() => setActiveTab("objective")}
          className={cn(
            "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "objective"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700",
          )}
        >
          객관식
        </button>
        <button
          onClick={() => setActiveTab("subjective")}
          className={cn(
            "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === "subjective"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700",
          )}
        >
          주관식
        </button>
      </div>

      {/* 탭 내용 */}
      {activeTab === "objective" && <ObjectiveTab />}
      {activeTab === "subjective" && (
        <div className="w-full flex flex-col items-center space-y-6">
          <FileUpload onFilesSelect={() => {}} />

          <Button className="w-[80%] " asChild>
            <Link
              to="/submission/$examId/text-recongnition"
              params={{ examId }}
            >
              다음
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
