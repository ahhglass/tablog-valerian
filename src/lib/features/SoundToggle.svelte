<script>
	import VolumeOff from '$lib/icons/VolumeOff.svelte';
	import VolumeOn from '$lib/icons/VolumeOn.svelte';
	import { tooltipDismiss } from '$lib/actions/tooltipDismiss';
	import { playTapHaptic } from '$lib/utils/haptic';
	import { soundChangeEvent } from '$lib/utils/keyboard';
	import { isSoundEnabled, playClick, setSoundEnabled } from '$lib/utils/sound';
	import { onMount } from 'svelte';

	let enabled = $state(false);

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

<label
	class="sound-toggle swap tooltip tooltip-right md:tooltip-top cursor-pointer"
	use:tooltipDismiss={600}
>
	<div class="tooltip-content">
		<div class="text-base md:text-xs">
			{enabled ? 'Выключить звуки' : 'Включить звуки'}
			<span class="hidden items-center gap-1 md:inline-flex">
				<kbd>S</kbd>
			</span>
		</div>
	</div>
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
