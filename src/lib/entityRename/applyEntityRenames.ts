import { DEFAULT_ENTITY_RENAMES } from "#/lib/entityRename/defaultEntityRenames";

export { DEFAULT_ENTITY_RENAMES };
/** @deprecated Use DEFAULT_ENTITY_RENAMES */
export const ENTITY_RENAMES = DEFAULT_ENTITY_RENAMES;

type EntityChange = {
	from: string;
	to: string;
	count: number;
	lineNumbers: number[];
};

export function applyEntityRenames(
	text: string,
	renames: Record<string, string> = DEFAULT_ENTITY_RENAMES,
) {
	const lineEnding = text.includes("\r\n") ? "\r\n" : "\n";
	let renamedCount = 0;
	const countsByPair = new Map<string, EntityChange>();

	const nextLines = text.split(/\r?\n/).map((line, index) => {
		const match = /^(\s*\{?\s*Entity\s+")([^"]+)(".*)$/.exec(line);
		if (!match) return line;

		const [, prefix, entityName, suffix] = match;
		const replacement = renames[entityName];
		if (!replacement) return line;

		renamedCount += 1;
		const pairKey = `${entityName}=>${replacement}`;
		const existing = countsByPair.get(pairKey);
		if (existing) {
			existing.count += 1;
			existing.lineNumbers.push(index + 1);
		} else {
			countsByPair.set(pairKey, {
				from: entityName,
				to: replacement,
				count: 1,
				lineNumbers: [index + 1],
			});
		}
		return `${prefix}${replacement}${suffix}`;
	});

	return {
		content: nextLines.join(lineEnding),
		renamedCount,
		changedEntities: Array.from(countsByPair.values()),
	};
}
