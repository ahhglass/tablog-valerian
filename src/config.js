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
};

export default config;
