import { loadPages, loadPosts } from '$lib/utils/content';

export async function load({ url }) {
	return {
		host: url.host,
		posts: loadPosts({ description: true }),
		pages: loadPages(),
	};
}
