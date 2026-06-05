import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/gallery")({
	component: GalleryLayout,
});

function GalleryLayout() {
	return <Outlet />;
}
