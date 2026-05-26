import { createFileRoute } from "@tanstack/react-router";
import NpfPresentation from "#/components/npf/NpfPresentation";

export const Route = createFileRoute("/npf")({
	component: NpfPage,
	head: () => ({
		meta: [{ title: "NPF – LordDz" }],
	}),
});

function NpfPage() {
	return <NpfPresentation />;
}
