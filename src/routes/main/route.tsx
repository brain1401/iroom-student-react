import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/main")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-full bg-white px-4 py-2">
      <Outlet />
    </div>
  );
}
