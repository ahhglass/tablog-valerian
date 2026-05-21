/** @param {string} path */
export function pathToContentId(path) {
	const match = path.match(/content\/(.*)\.\w+$/);
	return match?.[1] ?? path;
}
