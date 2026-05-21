import { json } from '@sveltejs/kit';
import { takeUnlock } from '$lib/server/closedAccess';
import { isClosedSlug } from '$lib/server/closedSlugs';
import { loadPage } from '$lib/utils/content';

export const prerender = false;

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies }) {
	const slug = url.searchParams.get('slug');
	if (!slug || !isClosedSlug(slug)) {
		return json({ error: 'bad_request' }, { status: 400 });
	}

	if (!takeUnlock(cookies, url, slug)) {
		return json({ error: 'locked' }, { status: 403 });
	}

	const post = loadPage(slug, { allowClosed: true });
	if (!post) {
		return json({ error: 'not_found' }, { status: 404 });
	}

	return json({ post });
}
