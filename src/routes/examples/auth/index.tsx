import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/examples/auth/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto flex flex-1 h-full max-w-6xl flex-col items-center space-y-6 p-4">
      <PageHeader title="가나다 시험" showBackButton={false} />
      <div className="flex flex-col gap-8 w-full h-[30vh] justify-center ">
        이름
        <Input placeholder="이름" className="w-full " />
        전화번호
        <Input placeholder="전화번호" className="w-full " />
      </div>
      <div className="flex-1" />
      <Button className="w-[80%]" asChild>
        <Link to="/examples/scan">다음</Link>
      </Button>
    </div>
  );
}
