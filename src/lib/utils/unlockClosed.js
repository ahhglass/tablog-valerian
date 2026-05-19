/** @param {string} pin @param {string} slug */
export async function unlockClosedPost(pin, slug) {
	return fetch('/api/closed/unlock', {
		method: 'POST',
		credentials: 'same-origin',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ pin, slug }),
	});
}
