const storageKey = 'theme';

/** @returns {'light' | 'dark' | null} */
export function getStoredTheme() {
	if (typeof localStorage === 'undefined') return null;
	const value = localStorage.getItem(storageKey);
	return value === 'light' || value === 'dark' ? value : null;
}

/** @param {'light' | 'dark'} theme */
export function applyTheme(theme) {
	document.documentElement.dataset.theme = theme;
}

/** @param {'light' | 'dark'} theme */
export function setTheme(theme) {
	localStorage.setItem(storageKey, theme);
	applyTheme(theme);
}

export function systemPrefersDark() {
	return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/** @returns {boolean} */
export function isDarkMode() {
	if (typeof document === 'undefined') return false;

	const theme = document.documentElement.dataset.theme;
	if (theme === 'dark') return true;
	if (theme === 'light') return false;

	return systemPrefersDark();
}
