import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/submission/$examId")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto flex flex-1 h-full max-w-6xl flex-col items-center space-y-6 p-4">
      <Outlet />
    </div>
  );
}
