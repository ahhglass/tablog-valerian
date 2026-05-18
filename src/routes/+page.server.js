import { loadPage } from '$lib/utils/content';

export async function load({ parent }) {
	const data = await parent();
	const latest = data.posts.find((item) => !item.closed);

	if (!latest) {
		return { post: null };
	}

	return {
		post: loadPage(latest.id),
	};
}
