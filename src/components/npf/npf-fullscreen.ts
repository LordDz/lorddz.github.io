export const NPF_REQUEST_FS_KEY = "npf-request-fs";

export function requestNpfFullscreenFromNav() {
	try {
		sessionStorage.setItem(NPF_REQUEST_FS_KEY, "1");
	} catch {
		/* ignore */
	}
}

export async function enterNpfFullscreenIfRequested(): Promise<boolean> {
	try {
		if (sessionStorage.getItem(NPF_REQUEST_FS_KEY) !== "1") {
			return false;
		}
		sessionStorage.removeItem(NPF_REQUEST_FS_KEY);
	} catch {
		return false;
	}

	if (document.fullscreenElement) {
		return true;
	}

	try {
		await document.documentElement.requestFullscreen();
		return true;
	} catch {
		return false;
	}
}

export function setNpfPresentingChrome(hidden: boolean) {
	document.body.classList.toggle("npf-presenting", hidden);
}
