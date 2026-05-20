/**
 * Короткая вибрация на touch-устройствах при включённом звуке (кнопки, горячие клавиши).
 */

import { browser } from '$app/environment';

import { isSoundEnabled } from '$lib/utils/sound';

const TAP_MS = 10;

function canVibrate() {
	if (!browser || !isSoundEnabled()) return false;
	if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return false;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
	if (!window.matchMedia('(pointer: coarse)').matches) return false;
	return true;
}

export function playTapHaptic() {
	if (!canVibrate()) return;
	try {
		navigator.vibrate(TAP_MS);
	} catch {
		/* ignore */
	}
}
