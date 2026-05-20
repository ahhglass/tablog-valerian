/**
 * Светлая/тёмная тема: `data-theme` на `<html>`, localStorage, учёт `prefers-color-scheme`.
 */

const storageKey = 'theme';

/** @returns {'light' | 'dark' | null} */
export function getStoredTheme() {
	if (typeof localStorage === 'undefined') return null;
	try {
		const value = localStorage.getItem(storageKey);
		return value === 'light' || value === 'dark' ? value : null;
	} catch {
		return null;
	}
}

/** @param {'light' | 'dark'} theme */
export function applyTheme(theme) {
	document.documentElement.dataset.theme = theme;
}

/** @param {'light' | 'dark'} theme */
export function setTheme(theme) {
	try {
		localStorage.setItem(storageKey, theme);
	} catch {
		/* private mode / storage disabled */
	}
	applyTheme(theme);
}

export function systemPrefersDark() {
	return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function isDarkMode() {
	if (typeof document === 'undefined') return false;

	const theme = document.documentElement.dataset.theme;
	if (theme === 'dark') return true;
	if (theme === 'light') return false;

	return systemPrefersDark();
}

/** @returns {boolean} активна ли тёмная тема после переключения */
export function toggleTheme() {
	const next = isDarkMode() ? 'light' : 'dark';
	setTheme(next);
	return next === 'dark';
}
