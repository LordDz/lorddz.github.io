import { Store } from "@tanstack/store";

import { DEFAULT_ENTITY_RENAMES } from "#/lib/entityRename/defaultEntityRenames";

const STORAGE_KEY = "goh-entity-renames";

type EntityRenameState = {
	mappings: Record<string, string>;
};

function cloneDefaults() {
	return { ...DEFAULT_ENTITY_RENAMES };
}

function readStoredMappings(): Record<string, string> | null {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const parsed: unknown = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

		const mappings: Record<string, string> = {};
		for (const [from, to] of Object.entries(parsed as Record<string, unknown>)) {
			if (typeof from === "string" && typeof to === "string" && from && to) {
				mappings[from] = to;
			}
		}
		return Object.keys(mappings).length > 0 ? mappings : null;
	} catch {
		return null;
	}
}

function writeStoredMappings(mappings: Record<string, string>) {
	if (typeof window === "undefined") return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(mappings));
}

function initialMappings() {
	return readStoredMappings() ?? cloneDefaults();
}

export const entityRenameStore = new Store<EntityRenameState>({
	mappings: cloneDefaults(),
});

if (typeof window !== "undefined") {
	entityRenameStore.setState(() => ({ mappings: initialMappings() }));
}

export function saveEntityRenameMappings(mappings: Record<string, string>) {
	const next = { ...mappings };
	entityRenameStore.setState(() => ({ mappings: next }));
	writeStoredMappings(next);
}

export function resetEntityRenameMappings() {
	const defaults = cloneDefaults();
	saveEntityRenameMappings(defaults);
	return defaults;
}

export function getEntityRenameMappings() {
	return entityRenameStore.state.mappings;
}
