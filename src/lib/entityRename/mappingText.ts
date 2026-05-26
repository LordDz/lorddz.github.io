export function formatEntityRenamesText(mappings: Record<string, string>) {
	return Object.entries(mappings)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([from, to]) => `${from} -> ${to}`)
		.join("\n");
}

export function parseEntityRenamesText(text: string) {
	const mappings: Record<string, string> = {};
	const errors: string[] = [];
	const lines = text.split(/\r?\n/);

	for (let index = 0; index < lines.length; index += 1) {
		const lineNumber = index + 1;
		const line = lines[index]?.trim() ?? "";
		if (!line || line.startsWith("#")) continue;

		if (/\bdeleted\b/i.test(line) && !line.includes("->") && !/renamed\s+to/i.test(line)) {
			continue;
		}

		const arrowMatch = /^(.+?)\s*->\s*(.+)$/.exec(line);
		const renamedMatch = /^(.+?)\s+renamed\s+to\s+(.+?)(?:\s*\([^)]*\))?\s*$/i.exec(
			line,
		);

		let from: string | undefined;
		let to: string | undefined;

		if (arrowMatch) {
			from = arrowMatch[1]?.trim();
			to = arrowMatch[2]?.trim();
		} else if (renamedMatch) {
			from = renamedMatch[1]?.trim();
			to = renamedMatch[2]?.trim();
		} else {
			errors.push(`Line ${lineNumber}: could not parse "${line}"`);
			continue;
		}

		if (!from || !to) {
			errors.push(`Line ${lineNumber}: missing from or to name`);
			continue;
		}

		if (mappings[from] && mappings[from] !== to) {
			errors.push(`Line ${lineNumber}: duplicate mapping for "${from}"`);
			continue;
		}

		mappings[from] = to;
	}

	return { mappings, errors };
}
