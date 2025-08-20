import { createFileRoute } from "@tanstack/react-router";
import ExamManagementPage from "./page";

export const Route = createFileRoute("/exam-management/")({
  component: ExamManagementPage,
});
