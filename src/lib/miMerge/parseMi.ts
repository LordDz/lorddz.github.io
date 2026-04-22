/**
 * Brace-aware helpers for Gates of Hell / Men of War style `.mi` mission files
 * (S-expression–like, not JSON).
 */

const ENTITY_HEADER_RE = /^\t\{Entity\s+"[^"]*"\s+(0x[0-9a-fA-F]+)/gim;
const TAGS_LINE_RE = /^\t\{Tags\b[^\n]*\r?\n/gim;

function normId(id: string): string {
	return id.toLowerCase();
}

/** Index of `{` for the block whose header matches `headerRe` (e.g. Helpers). */
export function findBlockOpenBrace(
	text: string,
	headerRe: RegExp,
	from = 0,
): number {
	headerRe.lastIndex = from;
	const m = headerRe.exec(text);
	if (!m) return -1;
	const brace = text.indexOf("{", m.index);
	return brace === -1 ? -1 : brace;
}

/**
 * Given index of opening `{`, returns index of matching closing `}`.
 * Respects double-quoted strings and simple backslash escapes.
 */
export function findMatchingClose(
	text: string,
	openBraceIndex: number,
): number {
	let depth = 1;
	let inString = false;
	let escaped = false;
	for (let i = openBraceIndex + 1; i < text.length; i++) {
		const c = text.charAt(i);
		if (inString) {
			if (escaped) {
				escaped = false;
				continue;
			}
			if (c === "\\") {
				escaped = true;
				continue;
			}
			if (c === '"') inString = false;
			continue;
		}
		if (c === '"') {
			inString = true;
			continue;
		}
		if (c === "{") depth++;
		else if (c === "}") {
			depth--;
			if (depth === 0) return i;
		}
	}
	return -1;
}

export function extractBlock(text: string, openBraceIndex: number): string {
	const close = findMatchingClose(text, openBraceIndex);
	if (close === -1) return "";
	return text.slice(openBraceIndex, close + 1);
}

/** `{` index for first `\t\t{vars` inside Helpers inner (after Helpers `{`). */
export function findVarsOpenInHelpersInner(helpersInner: string): number {
	const m = /\t\t\{vars\b/.exec(helpersInner);
	if (!m) return -1;
	return helpersInner.indexOf("{", m.index);
}

/** `{` index for first `\t\t{triggers` after `varsClose` (relative indices in same string). */
export function findTriggersOpenInHelpersInner(
	helpersInner: string,
	afterIndex: number,
): number {
	const slice = helpersInner.slice(afterIndex);
	const m = /\t\t\{triggers\b/.exec(slice);
	if (!m) return -1;
	return afterIndex + slice.indexOf("{", m.index);
}

export type HelpersSections = {
	helpersOpenBrace: number;
	helpersCloseBrace: number;
	/** Content inside `{Helpers` … `}` between outer braces (exclusive). */
	helpersInner: string;
	varsOpenInFile: number;
	varsCloseInFile: number;
	triggersOpenInFile: number;
	triggersCloseInFile: number;
};

/**
 * Locates `{Helpers` … `{vars` … `}` … `{triggers` … `}` in full mission text.
 * Indices vars/triggers open/close are absolute positions in `text`.
 */
export function extractHelpersLayout(text: string): HelpersSections | null {
	const helpersOpen = findBlockOpenBrace(text, /^\t\{Helpers\b/m);
	if (helpersOpen === -1) return null;
	const helpersClose = findMatchingClose(text, helpersOpen);
	if (helpersClose === -1) return null;

	const varsOpenRel = findVarsOpenInHelpersInner(
		text.slice(helpersOpen + 1, helpersClose),
	);
	if (varsOpenRel === -1) return null;
	const varsOpenInFile = helpersOpen + 1 + varsOpenRel;
	const varsCloseInFile = findMatchingClose(text, varsOpenInFile);
	if (varsCloseInFile === -1) return null;

	const helpersInnerSlice = text.slice(helpersOpen + 1, helpersClose);
	const varsEndRel = varsCloseInFile - (helpersOpen + 1);
	const triggersOpenRel = findTriggersOpenInHelpersInner(
		helpersInnerSlice,
		varsEndRel + 1,
	);
	if (triggersOpenRel === -1) return null;
	const triggersOpenInFile = helpersOpen + 1 + triggersOpenRel;
	const triggersCloseInFile = findMatchingClose(text, triggersOpenInFile);
	if (triggersCloseInFile === -1) return null;

	return {
		helpersOpenBrace: helpersOpen,
		helpersCloseBrace: helpersClose,
		helpersInner: text.slice(helpersOpen + 1, helpersClose),
		varsOpenInFile,
		varsCloseInFile,
		triggersOpenInFile,
		triggersCloseInFile,
	};
}

export type EntityBlock = {
	raw: string;
	id: string;
};

/** Mission-level `\t{Entity …}` blocks (tab-indented direct children of `{mission`). */
export function extractMissionEntityBlocks(text: string): EntityBlock[] {
	const out: EntityBlock[] = [];
	for (const m of text.matchAll(ENTITY_HEADER_RE)) {
		const lineStart = m.index;
		const g1 = m[1];
		if (lineStart === undefined || g1 === undefined) continue;
		const id = normId(g1);
		const brace = lineStart + 1;
		if (text[brace] !== "{") continue;
		const close = findMatchingClose(text, brace);
		if (close === -1) continue;
		out.push({
			id,
			raw: text.slice(lineStart, close + 1),
		});
	}
	return out;
}

export function collectEntityIdsFromMission(text: string): Set<string> {
	const ids = new Set<string>();
	for (const m of text.matchAll(ENTITY_HEADER_RE)) {
		const g1 = m[1];
		if (g1 !== undefined) ids.add(normId(g1));
	}
	return ids;
}

/** Entity id hex on a `{Tags …}` line (last `0x…` before closing `}`). */
export function parseTagsLineEntityId(line: string): string | null {
	const m = line.trimEnd().match(/(0x[0-9a-fA-F]+)\}\s*$/i);
	const g1 = m?.[1];
	return g1 !== undefined ? normId(g1) : null;
}

/**
 * Mission-level `{Tags …}` lines whose trailing entity id is in `idSet`
 * (compared case-insensitively).
 */
export function extractMissionTagLinesForIds(
	text: string,
	idSet: Set<string>,
): string[] {
	const lines: string[] = [];
	for (const m of text.matchAll(TAGS_LINE_RE)) {
		const line = m[0];
		const id = parseTagsLineEntityId(line);
		if (id && idSet.has(id))
			lines.push(line.endsWith("\n") ? line : `${line}\n`);
	}
	return lines;
}

/** Index of first `\t{Helpers` (tab + brace) for insertion point before Helpers. */
export function findHelpersInsertionIndex(text: string): number {
	const m = /\n\t\{Helpers\b/m.exec(text);
	if (m) return m.index + 1;
	const m2 = /^\t\{Helpers\b/m.exec(text);
	return m2 ? m2.index : -1;
}
