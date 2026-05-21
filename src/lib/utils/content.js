/**
 * Загрузка Markdown из `/content`: посты, страницы, теги, closedness, описание и время чтения.
 * Используется в `+layout.server.js`, маршрутах постов и RSS.
 */

import { render } from 'svelte/server';

import config from '/src/config';
import { isClosed } from '$lib/content/closedness.js';
import { pathToContentId } from '$lib/content/id.js';
import { contentModules } from '$lib/content/modules.js';
import slugify from '$lib/utils/slugify';

export { isClosed };

const pages = Object.entries(contentModules)
	.map(([path, mod]) => ({
		id: pathToContentId(path),
		meta: mod.metadata,
		Page: mod.default,
	}))
	.filter((x) => x.meta && !x.meta.draft);

const closedSlugSet = new Set(
	pages.filter((page) => isClosed(page.meta)).map((page) => page.id),
);

/** @param {string} id */
export function isClosedSlug(id) {
	return closedSlugSet.has(id);
}

/** @param {string} id */
export const isClosedPage = isClosedSlug;

/** Все slug для prerender (`entries` в `[slug]`). */
export function allContentSlugs() {
	return pages.map((x) => x.id);
}

/** Заглушка закрытого поста без тела (prerender / без cookie). */
export function loadPageStub(id) {
	const page = pages.find((x) => x.id === id);
	if (!page || !isClosed(page.meta)) return;

	return {
		id: page.id,
		title: page.meta.title,
		date: page.meta.date,
		pinned: page.meta.pinned,
		closed: true,
		author: page.meta.author,
		authorId: slugify(page.meta.author),
		tags: parseTags(page.meta.tags),
		description: page.meta.description,
		content: null,
		charCount: 0,
		readingMinutes: 0,
	};
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
		renderDescription: false,
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
			const needsBody =
				opt.content ||
				(opt.description &&
					opt.renderDescription &&
					!page.meta.description);
			const content = needsBody ? renderContentBody(page.Page) : null;

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
					? page.meta.description || (content ? createDescription(content) : undefined)
					: undefined,
				content: opt.content ? content : undefined,
			};
		});
}

export function loadPage(id, { allowClosed = false } = {}) {
	const page = pages.find((x) => x.id === id);
	if (!page) return;
	if (isClosed(page.meta) && !allowClosed) return loadPageStub(id);
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
