/**
 * Клиентский запрос разблокировки закрытого поста по PIN (`/api/closed/unlock`).
 */

/** @param {string} pin @param {string} slug */
export async function unlockClosedPost(pin, slug) {
	return fetch('/api/closed/unlock', {
		method: 'POST',
		credentials: 'same-origin',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ pin, slug }),
	});
}

/** @param {string} slug @returns {Promise<Record<string, unknown> | null>} */
export async function fetchClosedPostContent(slug) {
	const res = await fetch(`/api/closed/content?slug=${encodeURIComponent(slug)}`, {
		credentials: 'same-origin',
	});
	if (!res.ok) return null;
	const body = await res.json();
	return body.post ?? null;
}
