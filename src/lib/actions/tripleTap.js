const DEFAULT_WINDOW_MS = 600;

/**
 * Calls `onTriple` after three clicks or taps within a short window.
 * @param {HTMLElement} node
 * @param {() => void} onTriple
 * @param {number} [windowMs]
 */
export function tripleTap(node, onTriple, windowMs = DEFAULT_WINDOW_MS) {
	let count = 0;
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let timer;

	function reset() {
		count = 0;
		if (timer !== undefined) {
			clearTimeout(timer);
			timer = undefined;
		}
	}

	function handler() {
		count += 1;
		if (timer !== undefined) clearTimeout(timer);

		if (count >= 3) {
			reset();
			onTriple();
			return;
		}

		timer = setTimeout(reset, windowMs);
	}

	node.addEventListener('click', handler);

	return {
		/** @param {() => void} next */
		update(next) {
			onTriple = next;
		},
		destroy() {
			reset();
			node.removeEventListener('click', handler);
		},
	};
}
