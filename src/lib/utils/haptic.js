import { browser } from '$app/environment';

import { isSoundEnabled } from '$lib/utils/sound';

/** Short tap for UI buttons (ms). */
const TAP_MS = 10;

/** @returns {boolean} */
function canVibrate() {
	if (!browser || !isSoundEnabled()) return false;
	if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return false;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
	if (!window.matchMedia('(pointer: coarse)').matches) return false;
	return true;
}

/** Light vibration on touch devices; follows the sound toggle. */
export function playTapHaptic() {
	if (!canVibrate()) return;
	try {
		navigator.vibrate(TAP_MS);
	} catch {
		/* ignore */
	}
}
