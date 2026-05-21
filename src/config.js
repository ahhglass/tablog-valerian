import { ru } from 'date-fns/locale';

const config = {
	siteTitle: 'Tablog',
	siteTagline: 'Минималистичная тема блога для SvelteKit',
	archiveTitle: 'Архив',
	dateFormat: 'dd MMM yyyy',
	dateLocale: ru,
	readingCharsPerMinute: 1200,

	authorName: 'Valerian',
	authorUrl: '/author/valerian',

	themeName: 'Tablog',
	themeUrl: 'https://github.com/ahhglass/tablog-valerian',

	social: [
		{ label: 'GitHub', href: 'https://github.com/ahhglass' },
		{ label: 'Telegram', href: 'https://t.me/sad_lx4d' },
	],

	/**
	 * UI-звуки. Громкость: sounds.volume × group.volume × file.volume (0–1).
	 * paths: строка или { path, volume } — для отдельного файла.
	 * pattern + count — автосписок (ui-open-{n}.mp3, from: 1 по умолчанию).
	 */
	sounds: {
		volume: 1,
		groups: {
			click: { paths: ['ui-click.mp3'] },
			popup: { paths: ['ui-popup.mp3'], volume: 0.9 },
			open: {
				pattern: 'ui-open-{n}.mp3',
				count: 5,
				volume: 0.85,
				// или явно: paths: ['ui-open-1.mp3', { path: 'ui-open-2.mp3', volume: 0.7 }],
			},
			draw: { pattern: 'ui-draw-{n}.mp3', count: 7, volume: 0.3 },
		},
	},
};

export default config;
