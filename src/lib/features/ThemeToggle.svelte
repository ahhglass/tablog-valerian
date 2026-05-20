<script>
	import Moon from '$lib/icons/Moon.svelte';
	import Sun from '$lib/icons/Sun.svelte';
	import TooltipHint from '$lib/components/TooltipHint.svelte';
	import { shortcuts } from '$lib/config/shortcuts';
	import { themeChangeEvent } from '$lib/utils/keyboard';
	import { isDarkMode, setTheme } from '$lib/utils/theme';
	import { onMount } from 'svelte';

	let dark = $state(false);

	function syncDark() {
		dark = isDarkMode();
	}

	onMount(() => {
		syncDark();
		window.addEventListener(themeChangeEvent, syncDark);
		return () => window.removeEventListener(themeChangeEvent, syncDark);
	});

	function onChange() {
		setTheme(dark ? 'dark' : 'light');
	}
</script>

<TooltipHint
	text={dark ? 'Включить светлую тему' : 'Включить тёмную тему'}
	shortcutKey={shortcuts.theme.key}
	placement="left"
	mdPlacement="bottom"
	class="theme-toggle-wrap"
>
	<label class="theme-toggle swap swap-rotate cursor-pointer">
		<input
			type="checkbox"
			class="sr-only"
			bind:checked={dark}
			onchange={onChange}
			aria-label="Переключить тему"
		/>
		<span class="theme-toggle__icon swap-on" aria-hidden="true"><Sun /></span>
		<span class="theme-toggle__icon swap-off" aria-hidden="true"><Moon /></span>
	</label>
</TooltipHint>
