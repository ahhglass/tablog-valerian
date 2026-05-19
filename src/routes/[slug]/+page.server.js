import { error } from '@sveltejs/kit';

import { takeUnlock } from '$lib/server/closedAccess';
import { isClosedPage, loadPage } from '$lib/utils/content';

export const prerender = false;

export async function load({ params, cookies, url }) {
	const { slug } = params;
	const unlocked = takeUnlock(cookies, url, slug);

	if (isClosedPage(slug) && !unlocked) {
		error(403, { message: 'Эта запись закрыта' });
	}

	const post = loadPage(slug, { allowClosed: unlocked });

	if (!post) {
		error(404, { message: 'Не найдено' });
	}

	return { post };
}
