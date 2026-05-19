import { json } from '@sveltejs/kit';
import { checkPin, pinConfigured, setUnlock } from '$lib/server/closedAccess';
import { isClosedSlug } from '$lib/server/closedSlugs';
import { isRateLimited, recordFailedAttempt } from '$lib/server/rateLimit';

export async function POST({ request, cookies, url, getClientAddress }) {
	if (!pinConfigured()) return json({ ok: false }, { status: 503 });

	const ip = getClientAddress();
	if (isRateLimited(ip)) return json({ ok: false }, { status: 429 });

	const { pin, slug } = await request.json();
	if (!slug || !isClosedSlug(slug)) return json({ ok: false }, { status: 400 });

	if (!checkPin(String(pin ?? ''))) {
		recordFailedAttempt(ip);
		return json({ ok: false }, { status: 401 });
	}

	setUnlock(cookies, url, slug);
	return json({ ok: true });
}
