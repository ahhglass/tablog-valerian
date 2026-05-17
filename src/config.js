import { ru } from 'date-fns/locale';

const config = {
	siteTitle: 'Tablog',
	siteTagline: 'Минималистичная тема блога для SvelteKit',
	archiveTitle: 'Архив',
	dateFormat: 'dd MMM yyyy',
	dateLocale: ru,
	/** Символов в минуту для оценки времени чтения (русский текст). */
	readingCharsPerMinute: 1200,

	authorName: 'Valerain',
	authorUrl: '/author/valerain',

	themeName: 'Tablog',
	themeUrl: 'https://github.com/lemmon/tablog-svelte',

	/** Внешние ссылки в подвале (оставьте пустым, чтобы скрыть пункт). */
	social: [],
};

export default config;
