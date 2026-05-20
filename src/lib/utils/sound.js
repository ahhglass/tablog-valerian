/**
 * UI-звуки (клик, открытие, подчёркивание) с кэшем Audio и переключателем в localStorage.
 * `isPostPath` — хелпер для SoundManager при навигации между постами.
 */

import { browser } from '$app/environment';

const storageKey = 'sound';

const paths = {
	click: '/sfx/ui-click.mp3',
	open: '/sfx/ui-open.mp3',
	popup: '/sfx/ui-popup.mp3',
};

const drawPaths = [
	'/sfx/ui-draw-1.mp3',
	'/sfx/ui-draw-2.mp3',
	'/sfx/ui-draw-3.mp3',
	'/sfx/ui-draw-4.mp3',
	'/sfx/ui-draw-5.mp3',
	'/sfx/ui-draw-6.mp3',
	'/sfx/ui-draw-7.mp3',
];

const drawVolume = 0.3;

/** @type {Map<string, HTMLAudioElement>} */
const cache = new Map();

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

/** @returns {boolean} включён ли звук после переключения */
export function toggleSound() {
	const next = !isSoundEnabled();
	setSoundEnabled(next);
	return next;
}

/** @param {string} path @param {number} [volume=1] */
function play(path, volume = 1) {
	if (!browser || !isSoundEnabled()) return;

	let audio = cache.get(path);
	if (!audio) {
		audio = new Audio(path);
		audio.preload = 'auto';
		cache.set(path, audio);
	}

	audio.volume = volume;
	audio.currentTime = 0;
	audio.play().catch(() => {});
}

export function playClick() {
	play(paths.click);
}

export function playDraw() {
	const index = Math.floor(Math.random() * drawPaths.length);
	play(drawPaths[index], drawVolume);
}

export function playOpen() {
	play(paths.open);
}

export function playPopup() {
	play(paths.popup);
}

/** @param {string} pathname @param {Set<string>} postIds */
export function isPostPath(pathname, postIds) {
	const match = pathname.match(/^\/([^/]+)$/);
	return Boolean(match && postIds.has(match[1]));
}
