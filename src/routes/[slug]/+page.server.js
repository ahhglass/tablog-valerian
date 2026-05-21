import { building } from '$app/environment';
import { error } from '@sveltejs/kit';

import { takeUnlock } from '$lib/server/closedAccess';
import { allContentSlugs, isClosedPage, loadPage, loadPageStub } from '$lib/utils/content';

export function entries() {
	return allContentSlugs().map((slug) => ({ slug }));
}

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, cookies, url }) {
	const { slug } = params;
	const unlocked = building ? false : takeUnlock(cookies, url, slug);

	if (isClosedPage(slug) && !unlocked) {
		const post = loadPageStub(slug);
		if (!post) error(404, { message: 'Не найдено' });
		return { post, locked: true };
	}

	const post = loadPage(slug, { allowClosed: unlocked || !isClosedPage(slug) });
	if (!post) error(404, { message: 'Не найдено' });

	return { post, locked: false };
}
