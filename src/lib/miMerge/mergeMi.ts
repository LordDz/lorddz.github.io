import {
	collectEntityIdsFromMission,
	extractHelpersLayout,
	extractMissionEntityBlocks,
	extractMissionTagLinesForIds,
	findHelpersInsertionIndex,
} from "#/lib/miMerge/parseMi";

export type MergePreview = {
	vars: string;
	triggers: string;
	entities: string;
};

export type MergeResult =
	| {
			ok: true;
			preview: MergePreview;
			outputText: string;
			warnings: string[];
	  }
	| { ok: false; error: string };

function escapeRegExp(s: string): string {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Apply id remaps; keys sorted by numeric value descending to avoid partial overlaps. */
export function applyIdRemap(text: string, remap: Map<string, string>): string {
	const keys = [...remap.keys()].sort(
		(a, b) => Number.parseInt(b.slice(2), 16) - Number.parseInt(a.slice(2), 16),
	);
	let out = text;
	for (const oldId of keys) {
		const newId = remap.get(oldId);
		if (!newId) continue;
		const re = new RegExp(`\\b${escapeRegExp(oldId)}\\b`, "gi");
		out = out.replace(re, newId);
	}
	return out;
}

function allocateUnusedId(used: Set<string>): string {
	let n = 0xf0_00_00;
	for (;;) {
		const candidate = `0x${n.toString(16)}`;
		if (!used.has(candidate)) {
			used.add(candidate);
			return candidate;
		}
		n++;
	}
}

function buildRemapForReferenceEntities(
	referenceEntities: { id: string; raw: string }[],
	targetIds: Set<string>,
): Map<string, string> {
	const used = new Set(targetIds);
	const remap = new Map<string, string>();
	for (const ent of referenceEntities) {
		if (used.has(ent.id)) {
			const newId = allocateUnusedId(used);
			remap.set(ent.id, newId);
		} else {
			used.add(ent.id);
		}
	}
	return remap;
}

function findUndeclaredTriggerEntityRefs(
	mergedText: string,
	triggersBody: string,
): string[] {
	const declared = collectEntityIdsFromMission(mergedText);
	const refs = new Set<string>();
	const re = /\b0x[0-9a-f]{1,8}\b/gi;
	for (;;) {
		const m = re.exec(triggersBody);
		if (m === null) break;
		const raw = m[0];
		if (!raw) continue;
		const id = raw.toLowerCase();
		if (!declared.has(id)) refs.add(id);
	}
	return [...refs].slice(0, 40);
}

export function buildMergeResult(
	referenceText: string,
	targetText: string,
): MergeResult {
	const refLayout = extractHelpersLayout(referenceText);
	const targetLayoutOk = extractHelpersLayout(targetText);
	if (!targetLayoutOk)
		return {
			ok: false,
			error: "Target .mi: could not find {Helpers}/{vars}/{triggers}.",
		};
	if (!refLayout)
		return {
			ok: false,
			error: "Reference .mi: could not find {Helpers}/{vars}/{triggers}.",
		};

	const refVars = referenceText.slice(
		refLayout.varsOpenInFile,
		refLayout.varsCloseInFile + 1,
	);
	const refTriggers = referenceText.slice(
		refLayout.triggersOpenInFile,
		refLayout.triggersCloseInFile + 1,
	);

	const refEntities = extractMissionEntityBlocks(referenceText);
	const refEntityIdSet = new Set(refEntities.map((e) => e.id));
	const targetEntityIds = collectEntityIdsFromMission(targetText);

	const remap = buildRemapForReferenceEntities(refEntities, targetEntityIds);

	const remappedEntities = refEntities.map((e) =>
		remap.has(e.id) ? applyIdRemap(e.raw, remap) : e.raw,
	);
	const tagLines = extractMissionTagLinesForIds(referenceText, refEntityIdSet);
	const remappedTags = tagLines.map((line) => applyIdRemap(line, remap));

	const varsMerged = applyIdRemap(refVars, remap);
	const triggersMerged = applyIdRemap(refTriggers, remap);

	const insertBlock =
		(remappedEntities.length ? `${remappedEntities.join("\n")}\n` : "") +
		(remappedTags.length ? remappedTags.join("") : "");

	const helpersInsert = findHelpersInsertionIndex(targetText);
	if (helpersInsert === -1)
		return {
			ok: false,
			error: "Target .mi: could not find insertion point before {Helpers}.",
		};

	const withInserts =
		targetText.slice(0, helpersInsert) +
		(insertBlock ? `${insertBlock}\n` : "") +
		targetText.slice(helpersInsert);

	const layoutAfter = extractHelpersLayout(withInserts);
	if (!layoutAfter)
		return {
			ok: false,
			error:
				"Merge failed: structure lost after entity insertion (Helpers not found).",
		};

	const outputText =
		withInserts.slice(0, layoutAfter.varsOpenInFile) +
		varsMerged +
		withInserts.slice(
			layoutAfter.varsCloseInFile + 1,
			layoutAfter.triggersOpenInFile,
		) +
		triggersMerged +
		withInserts.slice(layoutAfter.triggersCloseInFile + 1);

	const warnings: string[] = [];
	const undeclared = findUndeclaredTriggerEntityRefs(
		outputText,
		triggersMerged,
	);
	if (undeclared.length > 0) {
		warnings.push(
			`Merged triggers reference hex id(s) not found on any mission-level Entity line (sample): ${undeclared.join(", ")}${undeclared.length >= 40 ? " …" : ""}`,
		);
	}

	const entitiesPreview =
		(remappedEntities.length ? remappedEntities.join("\n") : "") +
		(remappedTags.length ? `\n${remappedTags.join("")}` : "");

	return {
		ok: true,
		preview: {
			vars: varsMerged,
			triggers: triggersMerged,
			entities: entitiesPreview,
		},
		outputText,
		warnings,
	};
}
