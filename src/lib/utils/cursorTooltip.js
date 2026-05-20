/**
 * Плавающий тултип для элементов с `data-cursor` (описания постов в архиве).
 * Показ после удержания курсора; только мышь/trackpad (не touch). GSAP + делегирование на document.
 */

import { loadGsapCore } from '$lib/utils/loadGsap.js';

const xOffset = 6;
const yOffset = 20;
const yOffsetBottom = -60;
/** Задержка перед показом при наведении на ссылку (мс). */
const HOLD_MS = 1000;

const finePointerMq = '(hover: hover) and (pointer: fine)';

function isTouchLike() {
	return window.matchMedia('(hover: none), (pointer: coarse)').matches;
}

/** Можно ли включать тултип в текущем окружении (SSR / touch / reduced-motion). */
export function canUseCursorTooltip() {
	if (typeof window === 'undefined') return false;
	if (isTouchLike()) return false;
	if (!window.matchMedia(finePointerMq).matches) return false;
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
	return true;
}

/**
 * @param {HTMLElement} tooltip — корневой `.cursor-tooltip`
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
	/** @type {HTMLElement | null} */
	let pendingTarget = null;
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let revealTimer;
	let lastText = '';
	let cursorOnRight = false;

	function clearRevealTimer() {
		if (revealTimer !== undefined) {
			clearTimeout(revealTimer);
			revealTimer = undefined;
		}
	}

	function scheduleReveal(target) {
		clearRevealTimer();
		pendingTarget = target;
		revealTimer = setTimeout(() => {
			revealTimer = undefined;
			if (pendingTarget !== target) return;
			pendingTarget = null;
			onEnter(target);
		}, HOLD_MS);
	}

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

	function cursorText(target) {
		return target.getAttribute('data-cursor')?.trim() ?? '';
	}

	function setText(target) {
		const next = cursorText(target);
		if (!next || next === lastText) return;
		textEl.textContent = next;
		lastText = next;
	}

	function onMove(event) {
		const anchor = currentTarget ?? pendingTarget;
		if (!anchor) return;

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
		clearRevealTimer();
		pendingTarget = null;
		currentTarget = null;
		lastText = '';
		fadeOut();
	}

	function cursorTargetFromEvent(event) {
		if (!(event.target instanceof Element)) return null;
		const el = event.target.closest('[data-cursor]');
		return el instanceof HTMLElement ? el : null;
	}

	function onPointerOver(event) {
		if (event.pointerType !== 'mouse') return;
		const target = cursorTargetFromEvent(event);
		if (!target) return;
		if (event.relatedTarget instanceof Node && target.contains(event.relatedTarget)) return;
		if (!cursorText(target)) return;
		if (currentTarget === target) return;
		scheduleReveal(target);
	}

	function onPointerOut(event) {
		if (event.pointerType !== 'mouse') return;
		const target = cursorTargetFromEvent(event);
		if (!target) return;
		if (event.relatedTarget instanceof Node && target.contains(event.relatedTarget)) return;

		if (pendingTarget === target) {
			clearRevealTimer();
			pendingTarget = null;
		}
		if (currentTarget === target) hide();
	}

	function onPointerDown(event) {
		if (event.pointerType !== 'mouse') return;
		if (cursorTargetFromEvent(event)) hide();
	}

	function onFinePointerChange() {
		if (!canUseCursorTooltip()) hide();
	}

	const fineMq = window.matchMedia(finePointerMq);
	const touchMq = window.matchMedia('(hover: none), (pointer: coarse)');

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
