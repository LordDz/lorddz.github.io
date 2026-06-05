import { createFileRoute } from "@tanstack/react-router";
import AwesomeWordGame from "#/components/games/awesome-word/AwesomeWordGame";

export const Route = createFileRoute("/games/awesome-word")({
	component: AwesomeWordRoute,
	head: () => ({
		meta: [{ title: "AwesomeWord · LordDz" }],
	}),
});

function AwesomeWordRoute() {
	return (
		<main className="awesome-word-page page-wrap px-0 pb-12 pt-0 sm:px-4 sm:pt-6">
			<AwesomeWordGame />
		</main>
	);
}
