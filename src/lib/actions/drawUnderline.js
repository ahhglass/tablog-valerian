/** @param {HTMLElement} node */
export function drawUnderline(node) {
	let cleanup = () => {};
	/** @type {number | undefined} */
	let idleId;

	if (typeof window === 'undefined') {
		return { destroy: cleanup };
	}

	const init = () => {
		import('$lib/utils/drawRandomUnderline.js').then(async ({ initDrawRandomUnderline }) => {
			cleanup = await initDrawRandomUnderline(node);
		});
	};

	if ('requestIdleCallback' in window) {
		idleId = requestIdleCallback(init, { timeout: 2500 });
	} else {
		idleId = window.setTimeout(init, 1);
	}

	return {
		destroy() {
			if (idleId !== undefined) {
				if ('requestIdleCallback' in window) cancelIdleCallback(idleId);
				else clearTimeout(idleId);
			}
			cleanup();
		},
	};
}
