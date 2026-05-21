/**
 * UI-звуки из config.sounds: группы, random, громкость master × group × file.
 */

import { browser } from '$app/environment';
import config from '../../config.js';

const storageKey = 'sound';
const sfx = '/sfx/';

/** @type {Map<string, HTMLAudioElement>} */
const cache = new Map();

/** @type {Map<string, { path: string, volume: number }[]>} */
const registry = buildRegistry();

/** @param {import('../../config.js').default['sounds']['groups'][string]} def */
function resolveEntries(def) {
	if (!def) return [];

	const master = clamp01(config.sounds?.volume ?? 1);
	const groupMul = clamp01(def.volume ?? 1);

	/** @param {string} file @param {number} [entryMul] */
	const entry = (file, entryMul = 1) => ({
		path: file.startsWith('/') ? file : `${sfx}${file}`,
		volume: master * groupMul * clamp01(entryMul),
	});

	if (def.paths?.length) {
		return def.paths.flatMap((item) => {
			if (typeof item === 'string') return [entry(item)];
			return [entry(item.path, item.volume ?? 1)];
		});
	}

	if (def.pattern && def.count > 0) {
		const from = def.from ?? 1;
		const pattern = def.pattern.replace(/^\//, '');
		return Array.from({ length: def.count }, (_, i) =>
			entry(pattern.replaceAll('{n}', String(from + i)))
		);
	}

	return [];
}

function buildRegistry() {
	/** @type {Map<string, { path: string, volume: number }[]>} */
	const map = new Map();
	const groups = config.sounds?.groups;
	if (!groups) return map;

	for (const [id, def] of Object.entries(groups)) {
		const entries = resolveEntries(def);
		if (entries.length) map.set(id, entries);
	}
	return map;
}

/** @param {number} v */
function clamp01(v) {
	return Math.min(1, Math.max(0, v));
}

export function isSoundEnabled() {
	if (!browser) return true;
	try {
		return localStorage.getItem(storageKey) !== 'off';
	} catch {
		return true;
	}
}

/** @param {boolean} enabled */
function applySound(enabled) {
	const root = document.documentElement;
	if (enabled) delete root.dataset.sound;
	else root.dataset.sound = 'off';
}

/** @param {boolean} enabled */
export function setSoundEnabled(enabled) {
	if (!browser) return;
	try {
		localStorage.setItem(storageKey, enabled ? 'on' : 'off');
	} catch {
		/* ignore */
	}
	applySound(enabled);
}

export function toggleSound() {
	const next = !isSoundEnabled();
	setSoundEnabled(next);
	return next;
}

/** @param {string} path @param {number} volume */
function playPath(path, volume) {
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

/** @param {string} groupId @param {{ random?: boolean }} [opts] */
function playGroup(groupId, opts = {}) {
	const entries = registry.get(groupId);
	if (!entries?.length) return;

	const pick = opts.random
		? entries[Math.floor(Math.random() * entries.length)]
		: entries[0];
	playPath(pick.path, pick.volume);
}

export function playClick() {
	playGroup('click');
}

export function playOpen() {
	playGroup('open', { random: true });
}

export function playDraw() {
	playGroup('draw', { random: true });
}

export function playPopup() {
	playGroup('popup');
}

/** @param {string} pathname @param {Set<string>} postIds */
export function isPostPath(pathname, postIds) {
	const match = pathname.match(/^\/([^/]+)$/);
	return Boolean(match && postIds.has(match[1]));
}
