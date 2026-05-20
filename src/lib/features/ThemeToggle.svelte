<script>
	/**
	 * Переключатель светлой/тёмной темы в шапке: `data-theme`, подсказка с <kbd>D</kbd>.
	 * Слушает `themeChangeEvent` после горячих клавиш.
	 */
	import Moon from '$lib/icons/Moon.svelte';
	import Sun from '$lib/icons/Sun.svelte';
	import { tooltipDismiss } from '$lib/actions/tooltipDismiss';
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

<div class="theme-toggle-wrap tooltip tooltip-left md:tooltip-bottom" use:tooltipDismiss={600}>
	<div class="tooltip-content">
		<div class="text-base md:text-xs">
			{dark ? 'Включить светлую тему' : 'Включить тёмную тему'}
			<span class="hidden items-center gap-1 md:inline-flex">
				<kbd>D</kbd>
			</span>
		</div>
	</div>
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
</div>
