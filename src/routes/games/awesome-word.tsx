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
		<main className="page-wrap px-4 pb-12 pt-6">
			<AwesomeWordGame />
		</main>
	);
}
