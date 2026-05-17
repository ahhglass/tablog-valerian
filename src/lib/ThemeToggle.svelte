<script>
	import Moon from '$lib/icons/Moon.svelte';
	import Sun from '$lib/icons/Sun.svelte';
	import { isDarkMode, setTheme } from '$lib/theme';

	function toggle() {
		setTheme(isDarkMode() ? 'light' : 'dark');
	}
</script>

<button
	class="theme-toggle cursor-pointer"
	type="button"
	onclick={toggle}
	aria-label="Переключить тему"
	title="Переключить тему"
>
	<span class="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true"><Sun /></span>
	<span class="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true"><Moon /></span>
</button>
