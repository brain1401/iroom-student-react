import { FileUpload } from "@/components/layout/FIleUpload";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/submission/$examId/scan/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { examId } = Route.useParams();

  /**
   * 텍스트 인식이 확실히 되었다고 서버에서 응답을 보내줌 -> 그 동안 다음 버튼을 누를 수 없고 로딩 스피너가 버튼에 보여짐 -> 텍스트 인식 페이지로 이동
   */

  return (
    <div className="container  mx-auto flex flex-1 h-full max-w-6xl flex-col items-center space-y-6 p-4">
      <PageHeader title="가나다 시험" showBackButton={true} />
      <FileUpload onFilesSelect={() => {}} />

      <Button className="w-[80%] " asChild>
        <Link to="/submission/$examId/text-recongnition" params={{ examId }}>
          다음
        </Link>
      </Button>
    </div>
  );
}
