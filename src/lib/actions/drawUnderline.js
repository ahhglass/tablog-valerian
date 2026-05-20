/** @param {HTMLElement} node */
export function drawUnderline(node) {
	let cleanup = () => {};

	if (typeof window === 'undefined') {
		return { destroy: cleanup };
	}

	import('$lib/utils/drawRandomUnderline.js').then(async ({ initDrawRandomUnderline }) => {
		cleanup = await initDrawRandomUnderline(node);
	});

	return {
		destroy() {
			cleanup();
		},
	};
}
