import adapter from '@sveltejs/adapter-vercel';
import { mdsvex } from 'mdsvex';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md', '.svx'],
	kit: {
		adapter: adapter(),
		prerender: {
			handleHttpError: ({ status, path, referrer }) => {
				if (status === 404) {
					console.warn(`Prerender: ${status} ${path} (from ${referrer?.pathname ?? referrer})`);
					return;
				}
			},
		},
	},
	preprocess: [
		mdsvex({
			extensions: ['.md', '.svx'],
			remarkPlugins: [remarkGfm],
			rehypePlugins: [
				rehypeSlug,
				[
					rehypeAutolinkHeadings,
					{
						behavior: 'append',
						properties: {
							className: ['heading-anchor'],
							ariaLabel: 'Ссылка на раздел',
						},
						content: {
							type: 'text',
							value: '¶',
						},
					},
				],
			],
		}),
	],
};

export default config;
