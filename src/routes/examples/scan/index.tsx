
import FileUpload from "@/components/layout/FIleUpload";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/examples/scan/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container  mx-auto flex flex-1 h-full max-w-6xl flex-col items-center space-y-6 p-4">
      <PageHeader title="가나다 시험" showBackButton={true} />
      <FileUpload onFilesSelect={() => {}} />
      
      <Button className="w-[80%] " asChild>
        <Link to="/examples/submission">다음</Link>
      </Button>
    </div>
  );
}
