import { browser } from '$app/environment';

const storageKey = 'sound';

const paths = {
	click: '/sfx/ui-click.mp3',
	open: '/sfx/ui-open.mp3',
};

/** @type {Map<string, HTMLAudioElement>} */
const cache = new Map();

/** @returns {boolean} */
export function isSoundEnabled() {
	if (!browser) return true;
	try {
		return localStorage.getItem(storageKey) !== 'off';
	} catch {
		return true;
	}
}

/** @param {boolean} enabled */
export function setSoundEnabled(enabled) {
	if (!browser) return;
	try {
		localStorage.setItem(storageKey, enabled ? 'on' : 'off');
	} catch {
		/* ignore */
	}
}

/** @param {string} path */
function play(path) {
	if (!browser || !isSoundEnabled()) return;

	let audio = cache.get(path);
	if (!audio) {
		audio = new Audio(path);
		audio.preload = 'auto';
		cache.set(path, audio);
	}

	audio.currentTime = 0;
	audio.play().catch(() => {});
}

export function playClick() {
	play(paths.click);
}

export function playOpen() {
	play(paths.open);
}

/** @param {string} pathname @param {Set<string>} postIds */
export function isPostPath(pathname, postIds) {
	const match = pathname.match(/^\/([^/]+)$/);
	return Boolean(match && postIds.has(match[1]));
}
