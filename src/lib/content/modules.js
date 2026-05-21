/**
 * Полные mdsvex-модули (`default` + `metadata`) для рендера постов.
 */

/** @type {Record<string, { default: import('svelte').Component; metadata: Record<string, unknown> }>} */
export const contentModules = import.meta.glob('/content/**/*.md', { eager: true });
