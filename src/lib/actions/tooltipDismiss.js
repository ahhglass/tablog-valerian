/** @returns {boolean} */
function isTouchLike() {
	return window.matchMedia('(hover: none), (pointer: coarse)').matches;
}

/**
 * Hides daisyUI tooltips on touch after a short delay (focus + sticky :hover).
 * @param {HTMLElement} node
 * @param {number} [delay=600]
 */
export function tooltipDismiss(node, delay = 600) {
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let timer;

	function clearTimer() {
		if (timer !== undefined) {
			clearTimeout(timer);
			timer = undefined;
		}
	}

	function blurWithin() {
		node.querySelectorAll('input, button, select, textarea, a[href], [tabindex]').forEach((el) => {
			if (el instanceof HTMLElement) el.blur();
		});

		const active = document.activeElement;
		if (active instanceof HTMLElement && node.contains(active)) {
			active.blur();
		}
	}

	/** @param {boolean} on */
	function setHoverSuppressed(on) {
		node.querySelectorAll('.theme-toggle, [data-touch-hover-reset]').forEach((el) => {
			el.classList.toggle('touch-hover-suppressed', on);
		});
	}

	function suppressTooltip() {
		node.classList.add('tooltip-suppressed');
		setHoverSuppressed(true);
		blurWithin();
	}

	/** @param {PointerEvent} event */
	function onPointerUp(event) {
		if (event.pointerType === 'mouse' && !isTouchLike()) return;

		clearTimer();
		node.classList.remove('tooltip-suppressed');

		timer = setTimeout(() => {
			timer = undefined;
			suppressTooltip();
		}, delay);
	}

	function onPointerDown() {
		clearTimer();
		node.classList.remove('tooltip-suppressed');
		setHoverSuppressed(false);
	}

	node.addEventListener('pointerup', onPointerUp);
	node.addEventListener('pointerdown', onPointerDown);
	node.addEventListener('pointercancel', clearTimer);

	return {
		destroy() {
			clearTimer();
			node.classList.remove('tooltip-suppressed');
			setHoverSuppressed(false);
			node.removeEventListener('pointerup', onPointerUp);
			node.removeEventListener('pointerdown', onPointerDown);
			node.removeEventListener('pointercancel', clearTimer);
		},
	};
}
