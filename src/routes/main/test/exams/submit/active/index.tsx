import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { IoChevronBack } from "react-icons/io5";
import { AnswerSubmitTabs } from "@/components/student";
import { useAtomValue } from "jotai";
import { submitAtom } from "@/atoms/submit";

export const Route = createFileRoute("/main/test/exams/submit/active/")({
	component: SubmitActivePage,
});

function SubmitActivePage() {
	const submit = useAtomValue(submitAtom);
	const isSubmitted = submit.submitted;
	const statusText = isSubmitted ? "제출" : "미제출";
	const statusBg = isSubmitted ? "bg-[#10B981]" : "bg-[#F59E0B]";
	return (
		<div className="flex w-full flex-1 justify-center px-4 py-4 sm:px-6 md:px-8">
			<div className="w-full max-w-md sm:max-w-lg md:max-w-2xl">
				<header className="mb-4 grid grid-cols-[auto_1fr_auto] items-center gap-2">
					<Button variant="ghost" size="sm" asChild>
						<Link to="/main/test/exams/submit">
							<IoChevronBack className="h-5 w-5" />
						</Link>
					</Button>
					<h1 className="text-center text-[18px] font-bold text-black">{submit.title || "시험명"}</h1>
					<span className={`inline-flex h-6 items-center justify-center rounded-[5px] px-2 text-[12px] font-semibold text-white ${statusBg}`}>{statusText}</span>
				</header>

				<AnswerSubmitTabs
					initialTab="objective"
					objectiveCount={20}
					objectiveOptions={["A", "B", "C", "D", "E"]}
					subjectiveCount={5}
					isSubmitted={isSubmitted}
					deadline={submit.deadline}
				/>
			</div>
		</div>
	);
}
