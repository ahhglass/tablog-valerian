/** @type {Promise<typeof gsap | null> | null} */
let corePromise = null;

/** @type {Promise<typeof gsap | null> | null} */
let drawPromise = null;

/** @returns {Promise<typeof gsap | null>} */
export function loadGsapCore() {
	if (typeof window === 'undefined') return Promise.resolve(null);

	if (window.gsap) return Promise.resolve(window.gsap);

	if (!corePromise) {
		corePromise = loadScript('/vendor/gsap.min.js').then(() => window.gsap ?? null);
	}

	return corePromise;
}

/** @returns {Promise<typeof gsap | null>} */
export function loadGsap() {
	if (typeof window === 'undefined') return Promise.resolve(null);

	if (window.gsap?.plugins?.drawSVG) return Promise.resolve(window.gsap);

	if (!drawPromise) {
		drawPromise = (async () => {
			const gsap = await loadGsapCore();
			if (!gsap) return null;
			if (!window.gsap?.plugins?.drawSVG) {
				await loadScript('/vendor/DrawSVGPlugin.min.js');
			}
			return window.gsap?.plugins?.drawSVG ? window.gsap : null;
		})();
	}

	return drawPromise;
}

/** @param {string} src */
function loadScript(src) {
	return new Promise((resolve, reject) => {
		const existing = document.querySelector(`script[src="${src}"]`);
		if (existing) {
			if (existing.dataset.loaded === 'true') {
				resolve();
				return;
			}
			existing.addEventListener('load', () => resolve(), { once: true });
			existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), {
				once: true,
			});
			return;
		}

		const script = document.createElement('script');
		script.src = src;
		script.async = false;
		script.onload = () => {
			script.dataset.loaded = 'true';
			resolve();
		};
		script.onerror = () => reject(new Error(`Failed to load ${src}`));
		document.head.appendChild(script);
	});
}
