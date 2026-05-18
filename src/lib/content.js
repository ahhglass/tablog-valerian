import { render } from 'svelte/server';

import config from '/src/config';
import slugify from '$lib/slugify';

const pages = Object.entries(import.meta.glob('/content/**/*.md', { eager: true }))
	.map(([path, Page]) => ({
		id: path.match(/content\/(.*)\.\w+$/)[1],
		meta: Page.metadata,
		Page: Page.default,
	}))
	.filter((x) => x.meta && !x.meta.draft);

/** @param {Record<string, unknown> | undefined} meta */
export function isClosed(meta) {
	const value = meta?.closedness;
	if (value === true) return true;
	if (typeof value === 'string') {
		const normalized = value.trim().toLowerCase();
		return normalized === 'yes' || normalized === 'true';
	}
	return false;
}

/** @param {string} id */
export function isClosedPage(id) {
	const page = pages.find((x) => x.id === id);
	return Boolean(page && isClosed(page.meta));
}

export function loadPages() {
	return pages
		.filter((x) => !x.meta.date && !isClosed(x.meta))
		.sort((a, b) => a.id.localeCompare(b.id))
		.map((x) => ({
			id: x.id,
			title: x.meta.title,
		}));
}

export function loadPosts(props) {
	const opt = {
		pinned: true,
		description: false,
		content: false,
		...props,
	};
	return pages
		.filter((x) => x.meta.date)
		.sort(
			(a, b) =>
				(opt.pinned ? !a.meta.pinned - !b.meta.pinned : 0) ||
				new Date(b.meta.date) - new Date(a.meta.date),
		)
		.map((page) => {
			const content =
				opt.content || opt.description ? renderContentBody(page.Page) : null;
			return {
				id: page.id,
				title: page.meta.title,
				date: page.meta.date,
				pinned: page.meta.pinned,
				closed: isClosed(page.meta),
				author: page.meta.author,
				authorId: slugify(page.meta.author),
				tags: parseTags(page.meta.tags),
				description: opt.description
					? page.meta.description || createDescription(content)
					: undefined,
				content: opt.content ? content : undefined,
			};
		});
}

export function loadPage(id) {
	const page = pages.find((x) => x.id === id);
	if (!page || isClosed(page.meta)) return;
	const content = renderContentBody(page.Page);
	const stats = getReadingStats(content);

	return {
		...page.meta,
		id: page.id,
		content,
		authorId: slugify(page.meta.author),
		tags: parseTags(page.meta.tags),
		description: page.meta.description || createDescription(content),
		charCount: stats.charCount,
		readingMinutes: stats.readingMinutes,
	};
}

function renderContentBody(Page) {
	return render(Page).body.replaceAll('<!---->', '');
}

function parseTags(tags) {
	return tags?.split(',').map((x) => [slugify(x), x.trim()]);
}

function createDescription(html) {
	return html.split('\n')[0].replace(/<.+?>/g, '');
}

function htmlToText(html) {
	return html
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function getReadingStats(html) {
	const charCount = htmlToText(html).length;
	const readingMinutes = Math.max(
		1,
		Math.ceil(charCount / config.readingCharsPerMinute),
	);

	return { charCount, readingMinutes };
}
