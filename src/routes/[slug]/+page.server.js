import { error } from '@sveltejs/kit';

import { isClosedPage, loadPage } from '$lib/utils/content';

export async function load({ params }) {
	if (isClosedPage(params.slug)) {
		error(403, { message: 'Эта запись закрыта' });
	}

	const post = loadPage(params.slug);

	if (!post) {
		error(404, { message: 'Не найдено' });
	}

	return {
		post,
	};
}
