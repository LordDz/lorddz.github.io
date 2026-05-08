export function isAcceptedEntityRenameFilename(filename: string) {
	const name = filename.toLowerCase();
	return name === "map" || name.endsWith(".mi");
}
