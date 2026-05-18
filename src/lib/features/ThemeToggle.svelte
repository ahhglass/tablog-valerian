<script>
	import Moon from '$lib/icons/Moon.svelte';
	import Sun from '$lib/icons/Sun.svelte';
	import { tooltipDismiss } from '$lib/actions/tooltipDismiss';
	import { isDarkMode, setTheme } from '$lib/utils/theme';
	import { onMount } from 'svelte';

	let dark = $state(false);

	onMount(() => {
		dark = isDarkMode();
	});

	function onChange() {
		setTheme(dark ? 'dark' : 'light');
	}
</script>

<div
	class="theme-toggle-wrap tooltip tooltip-left md:tooltip-bottom"
	use:tooltipDismiss={600}
>
	<div class="tooltip-content">
		<div class="text-base md:text-xs">
			{dark ? 'Включить светлую тему' : 'Включить тёмную тему'}
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
