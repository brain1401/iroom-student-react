import { getMockExamById } from "@/api/exam/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/submission/$examId/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const exam = await getMockExamById(params.examId);
    return { exam };
  },
});

function RouteComponent() {
  const { exam } = Route.useLoaderData();
  const { examId } = Route.useParams();
  const examName = exam.title;

  return (
    <div className="container mx-auto flex flex-1 h-full max-w-6xl flex-col items-center space-y-6 p-4">
      <PageHeader title={examName} showBackButton={false} />
      <div className="flex flex-col gap-8 w-full h-[30vh] justify-center ">
        이름
        <Input placeholder="이름" className="w-full " />
        전화번호
        <Input placeholder="전화번호" className="w-full " />
      </div>
      <div className="flex-1" />
      <Button className="w-[80%]" asChild>
        <Link to="/submission/$examId/scan" params={{ examId }}>
          다음
        </Link>
      </Button>
    </div>
  );
}
