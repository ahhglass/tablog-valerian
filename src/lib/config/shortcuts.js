/** @typedef {'toggleTheme' | 'toggleSound' | 'closePin' | 'navigate'} ShortcutAction */

/**
 * @typedef {Object} ShortcutEntry
 * @property {string} code
 * @property {string} key
 * @property {ShortcutAction} action
 * @property {string} [tooltip]
 * @property {string} [href]
 * @property {string} [label]
 */

/** @type {Record<string, ShortcutEntry>} */
export const shortcuts = {
	theme: { code: 'KeyD', key: 'D', action: 'toggleTheme' },
	sound: { code: 'KeyS', key: 'S', action: 'toggleSound' },
	pinClose: { code: 'Escape', key: 'Esc', action: 'closePin' },
	feed: {
		code: 'KeyL',
		key: 'L',
		action: 'navigate',
		tooltip: 'RSS-лента',
		href: '/feed.xml',
		label: 'Лента',
	},
	changelog: {
		code: 'KeyH',
		key: 'H',
		action: 'navigate',
		tooltip: 'Хотите взглянуть?',
		href: '/changelog',
	},
	'style-guide': {
		code: 'KeyG',
		key: 'G',
		action: 'navigate',
		tooltip: 'Примеры оформления',
		href: '/style-guide',
	},
};

/** @param {string} pageId */
export function navShortcutForPage(pageId) {
	const item = shortcuts[pageId];
	return item?.action === 'navigate' && pageId !== 'feed' ? item : null;
}
