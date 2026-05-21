<script>
	/**
	 * Переключатель UI-звуков в шапке: localStorage, подсказка с <kbd>S</kbd>, клик при включении.
	 * Слушает `soundChangeEvent` после горячих клавиш.
	 */
	import VolumeOff from '$lib/icons/VolumeOff.svelte';
	import VolumeOn from '$lib/icons/VolumeOn.svelte';
	import { tooltipDismiss } from '$lib/actions/tooltipDismiss';
	import { playTapHaptic } from '$lib/utils/haptic';
	import { soundChangeEvent } from '$lib/utils/keyboard';
	import { browser } from '$app/environment';
	import { isSoundEnabled, playClick, setSoundEnabled } from '$lib/utils/sound';
	import { onMount } from 'svelte';

	let enabled = $state(browser ? isSoundEnabled() : false);

	function syncEnabled() {
		enabled = isSoundEnabled();
	}

	onMount(() => {
		syncEnabled();
		window.addEventListener(soundChangeEvent, syncEnabled);
		return () => window.removeEventListener(soundChangeEvent, syncEnabled);
	});

	function onChange() {
		setSoundEnabled(enabled);
		if (enabled) {
			playClick();
			playTapHaptic();
		}
	}
</script>

<div class="sound-toggle-wrap tooltip tooltip-right md:tooltip-top" use:tooltipDismiss={600}>
	<div class="tooltip-content">
		<div class="text-base md:text-xs">
			{enabled ? 'Выключить звуки' : 'Включить звуки'}
			<span class="hidden items-center gap-1 md:inline-flex">
				<kbd>S</kbd>
			</span>
		</div>
	</div>
	<label class="sound-toggle swap cursor-pointer">
		<input
			type="checkbox"
			class="sr-only"
			bind:checked={enabled}
			onchange={onChange}
			aria-label={enabled ? 'Выключить звуки' : 'Включить звуки'}
		/>
		<span class="sound-toggle__icon swap-on" aria-hidden="true"><VolumeOn /></span>
		<span class="sound-toggle__icon swap-off" aria-hidden="true"><VolumeOff /></span>
		<span class="sr-only">{enabled ? 'Звук вкл.' : 'Звук выкл.'}</span>
	</label>
</div>
