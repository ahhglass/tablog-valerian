<script>
	import VolumeOff from '$lib/icons/VolumeOff.svelte';
	import VolumeOn from '$lib/icons/VolumeOn.svelte';
	import TooltipHint from '$lib/components/TooltipHint.svelte';
	import { playTapHaptic } from '$lib/utils/haptic';
	import { shortcuts } from '$lib/config/shortcuts';
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

<TooltipHint
	tag="label"
	text={enabled ? 'Выключить звуки' : 'Включить звуки'}
	shortcutKey={shortcuts.sound.key}
	placement="right"
	mdPlacement="top"
	class="sound-toggle swap cursor-pointer"
>
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
</TooltipHint>
