import { loadGsapCore } from '$lib/utils/loadGsap.js';

const xOffset = 6;
const yOffset = 20;
const yOffsetBottom = -60;

const finePointerMq = '(hover: hover) and (pointer: fine)';

/** Touch-first / coarse pointers (same idea as tooltipDismiss). */
function isTouchLike() {
	return window.matchMedia('(hover: none), (pointer: coarse)').matches;
}

/** Desktop mouse/trackpad only — not phones/tablets in touch mode. */
export function canUseCursorTooltip() {
	if (typeof window === 'undefined') return false;
	if (isTouchLike()) return false;
	if (!window.matchMedia(finePointerMq).matches) return false;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
	return true;
}

/**
 * Floating tooltip that follows the pointer (Osmo data-cursor pattern).
 * @param {HTMLElement} tooltip
 * @returns {Promise<{ destroy: () => void; hide: () => void } | undefined>}
 */
export async function initCursorTooltip(tooltip) {
	if (typeof window === 'undefined') return;
	if (!canUseCursorTooltip()) return;

	const textEl = tooltip.querySelector('p');
	if (!(textEl instanceof HTMLParagraphElement)) return;

	const gsap = await loadGsapCore();
	if (!gsap) return;

	/** @type {HTMLElement | null} */
	let currentTarget = null;
	let lastText = '';
	let cursorOnRight = false;

	gsap.set(tooltip, { xPercent: xOffset, yPercent: yOffset, opacity: 0 });

	const xTo = gsap.quickTo(tooltip, 'x', { duration: 0.45, ease: 'power3' });
	const yTo = gsap.quickTo(tooltip, 'y', { duration: 0.45, ease: 'power3' });

	function fadeIn() {
		gsap.killTweensOf(tooltip, 'opacity');
		gsap.to(tooltip, { opacity: 1, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
	}

	function fadeOut() {
		gsap.killTweensOf(tooltip, 'opacity');
		gsap.to(tooltip, { opacity: 0, duration: 0.12, ease: 'power2.in', overwrite: 'auto' });
	}

	/** @param {HTMLElement} target @returns {string} */
	function cursorText(target) {
		return target.getAttribute('data-cursor')?.trim() ?? '';
	}

	/** @param {HTMLElement} target */
	function setText(target) {
		const next = cursorText(target);
		if (!next || next === lastText) return;
		textEl.textContent = next;
		lastText = next;
	}

	/** @param {MouseEvent} event */
	function onMove(event) {
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;
		const scrollY = window.scrollY;
		const cursorX = event.clientX;
		const cursorY = event.clientY + scrollY;

		let xPercent = xOffset;
		let yPercent = yOffset;

		if (cursorX > windowWidth * 0.66) {
			cursorOnRight = true;
			xPercent = -100;
		} else {
			cursorOnRight = false;
		}

		if (cursorY > scrollY + windowHeight * 0.9) {
			yPercent = yOffsetBottom;
		}

		if (currentTarget) {
			const easteregg = currentTarget.getAttribute('data-cursor-easteregg');
			if (easteregg && cursorOnRight) {
				if (easteregg !== lastText) {
					textEl.textContent = easteregg;
					lastText = easteregg;
				}
			} else {
				setText(currentTarget);
			}
		}

		gsap.to(tooltip, { xPercent, yPercent, duration: 0.45, ease: 'power3' });
		xTo(cursorX);
		yTo(cursorY - scrollY);
	}

	/** @param {HTMLElement} target */
	function onEnter(target) {
		const next = cursorText(target);
		if (!next) {
			hide();
			return;
		}

		currentTarget = target;
		if (next !== lastText) {
			textEl.textContent = next;
			lastText = next;
		}
		fadeIn();
	}

	function hide() {
		currentTarget = null;
		lastText = '';
		fadeOut();
	}

	/** @param {Event} event */
	function cursorTargetFromEvent(event) {
		if (!(event.target instanceof Element)) return null;
		const el = event.target.closest('[data-cursor]');
		return el instanceof HTMLElement ? el : null;
	}

	/** @param {PointerEvent} event */
	function onPointerOver(event) {
		if (event.pointerType !== 'mouse') return;
		const target = cursorTargetFromEvent(event);
		if (!target) return;
		if (event.relatedTarget instanceof Node && target.contains(event.relatedTarget)) return;
		if (!cursorText(target)) return;
		onEnter(target);
	}

	/** @param {PointerEvent} event */
	function onPointerOut(event) {
		if (event.pointerType !== 'mouse') return;
		const target = cursorTargetFromEvent(event);
		if (!target || currentTarget !== target) return;
		if (event.relatedTarget instanceof Node && target.contains(event.relatedTarget)) return;
		hide();
	}

	/** @param {PointerEvent} event */
	function onPointerDown(event) {
		if (event.pointerType !== 'mouse') return;
		if (cursorTargetFromEvent(event)) hide();
	}

	function onFinePointerChange() {
		if (!canUseCursorTooltip()) hide();
	}

	const fineMq = window.matchMedia(finePointerMq);
	const touchMq = window.matchMedia('(hover: none), (pointer: coarse)');

	// Delegation: new [data-cursor] nodes after client navigation keep working
	document.addEventListener('pointerover', onPointerOver);
	document.addEventListener('pointerout', onPointerOut);
	document.addEventListener('pointerdown', onPointerDown);
	window.addEventListener('mousemove', onMove);
	fineMq.addEventListener('change', onFinePointerChange);
	touchMq.addEventListener('change', onFinePointerChange);
	function onVisibilityChange() {
		if (document.hidden) hide();
	}

	document.addEventListener('visibilitychange', onVisibilityChange);
	window.addEventListener('pagehide', hide);

	function destroy() {
		document.removeEventListener('pointerover', onPointerOver);
		document.removeEventListener('pointerout', onPointerOut);
		document.removeEventListener('pointerdown', onPointerDown);
		window.removeEventListener('mousemove', onMove);
		fineMq.removeEventListener('change', onFinePointerChange);
		touchMq.removeEventListener('change', onFinePointerChange);
		document.removeEventListener('visibilitychange', onVisibilityChange);
		window.removeEventListener('pagehide', hide);
		hide();
		textEl.textContent = '';
	}

	return { destroy, hide };
}
