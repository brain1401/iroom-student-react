import { createFileRoute } from "@tanstack/react-router";
import UserAccountPage from "./page";

export const Route = createFileRoute("/profile/")({
  component: UserAccountPage,
});
