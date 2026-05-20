import { closeClosedPin, isClosedPinOpen } from '$lib/stores/closedPin.svelte.js';
import { playTapHaptic } from '$lib/utils/haptic';
import { playClick, toggleSound } from '$lib/utils/sound';
import { toggleTheme } from '$lib/utils/theme';

/** @typedef {{ code: string; label: string; key: string }} Shortcut */

/** @type {Record<string, Shortcut>} */
export const shortcuts = {
	theme: { code: 'KeyD', label: 'Тема', key: 'D' },
	sound: { code: 'KeyS', label: 'Звук', key: 'S' },
	pinClose: { code: 'Escape', label: 'Закрыть', key: 'Esc' },
};

export const themeChangeEvent = 'tablog:theme-change';
export const soundChangeEvent = 'tablog:sound-change';

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

	switch (event.code) {
		case shortcuts.theme.code:
			toggleTheme();
			dispatchThemeChange();
			event.preventDefault();
			return true;
		case shortcuts.sound.code: {
			const enabled = toggleSound();
			dispatchSoundChange();
			if (enabled) {
				playClick();
				playTapHaptic();
			}
			event.preventDefault();
			return true;
		}
		default:
			return false;
	}
}

/** @param {(event: KeyboardEvent) => void} handler */
export function registerKeyboardShortcuts(handler = handleKeyboardShortcut) {
	const onKeydown = (event) => handler(event);
	window.addEventListener('keydown', onKeydown);
	return () => window.removeEventListener('keydown', onKeydown);
}
