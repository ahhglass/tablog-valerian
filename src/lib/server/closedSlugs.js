/** @param {Record<string, unknown> | undefined} meta */
const isClosed = (meta) => {
	const value = meta?.closedness;
	if (value === true) return true;
	if (typeof value === 'string') {
		const n = value.trim().toLowerCase();
		return n === 'yes' || n === 'true';
	}
	return false;
};

const closed = new Set(
	Object.entries(import.meta.glob('/content/**/*.md', { eager: true }))
		.filter(([, mod]) => mod.metadata && !mod.metadata.draft && isClosed(mod.metadata))
		.map(([path]) => path.match(/content\/(.*)\.\w+$/)[1]),
);

export const isClosedSlug = (id) => closed.has(id);
