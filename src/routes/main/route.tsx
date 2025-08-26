import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/main")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col flex-1 w-full h-full">
      <Outlet />
    </div>
  );
}
