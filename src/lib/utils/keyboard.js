import { goto } from '$app/navigation';

import { shortcuts } from '$lib/config/shortcuts';
import { closeClosedPin, isClosedPinOpen } from '$lib/stores/closedPin.svelte.js';
import { playTapHaptic } from '$lib/utils/haptic';
import { isSoundEnabled, playClick, toggleSound } from '$lib/utils/sound';
import { toggleTheme } from '$lib/utils/theme';

export const themeChangeEvent = 'tablog:theme-change';
export const soundChangeEvent = 'tablog:sound-change';

/** Click + haptic after a keyboard shortcut, only when sound is on. */
export function playShortcutFeedback() {
	if (!isSoundEnabled()) return;
	playClick();
	playTapHaptic();
}

/** @param {EventTarget | null} target */
export function isTypingTarget(target) {
	if (!(target instanceof Element)) return false;
	const tag = target.tagName;
	if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
	return target.isContentEditable;
}

/** @param {KeyboardEvent} event */
export function shouldHandleKeydown(event) {
	if (event.defaultPrevented) return false;
	if (event.metaKey || event.ctrlKey || event.altKey) return false;
	if (isTypingTarget(document.activeElement)) return false;
	if (isTypingTarget(event.target)) return false;
	return true;
}

function dispatchThemeChange() {
	window.dispatchEvent(new CustomEvent(themeChangeEvent));
}

function dispatchSoundChange() {
	window.dispatchEvent(new CustomEvent(soundChangeEvent));
}

/** @param {string} href */
async function goNav(href) {
	if (href.endsWith('.xml')) {
		window.location.assign(href);
		return;
	}
	await goto(href);
}

/** @type {Record<string, () => void>} */
const shortcutHandlers = {
	[shortcuts.theme.code]: () => {
		toggleTheme();
		dispatchThemeChange();
		playShortcutFeedback();
	},
	[shortcuts.sound.code]: () => {
		toggleSound();
		dispatchSoundChange();
		playShortcutFeedback();
	},
};

for (const item of Object.values(shortcuts)) {
	if (item.action !== 'navigate' || !item.href) continue;
	shortcutHandlers[item.code] = () => {
		void goNav(item.href);
		playShortcutFeedback();
	};
}

function assertNoShortcutConflicts() {
	if (!import.meta.env.DEV) return;

	const codes = Object.values(shortcuts)
		.filter((item) => item.action !== 'closePin')
		.map((item) => item.code);

	if (codes.length !== new Set(codes).size) {
		console.warn('[keyboard] Duplicate shortcut codes in config:', codes);
	}
}

assertNoShortcutConflicts();

/** @param {KeyboardEvent} event */
export function handleKeyboardShortcut(event) {
	if (event.code === shortcuts.pinClose.code) {
		if (isClosedPinOpen()) {
			closeClosedPin();
			event.preventDefault();
			return true;
		}
		return false;
	}

	if (!shouldHandleKeydown(event)) return false;

	const handler = shortcutHandlers[event.code];
	if (!handler) return false;

	handler();
	event.preventDefault();
	return true;
}

/** @param {(event: KeyboardEvent) => void} handler */
export function registerKeyboardShortcuts(handler = handleKeyboardShortcut) {
	const onKeydown = (event) => handler(event);
	window.addEventListener('keydown', onKeydown);
	return () => window.removeEventListener('keydown', onKeydown);
}
