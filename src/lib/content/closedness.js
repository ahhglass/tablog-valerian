/**
 * Проверка `closedness` в frontmatter markdown.
 */

/** @param {Record<string, unknown> | undefined} meta */
export function isClosed(meta) {
	const value = meta?.closedness;
	if (value === true) return true;
	if (typeof value === 'string') {
		const normalized = value.trim().toLowerCase();
		return normalized === 'yes' || normalized === 'true';
	}
	return false;
}
