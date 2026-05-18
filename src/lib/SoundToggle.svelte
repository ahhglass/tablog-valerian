<script>
	import VolumeOff from '$lib/icons/VolumeOff.svelte';
	import VolumeOn from '$lib/icons/VolumeOn.svelte';
	import { isSoundEnabled, playClick, setSoundEnabled } from '$lib/sound';
	import { onMount } from 'svelte';

	let enabled = $state(false);

	onMount(() => {
		enabled = isSoundEnabled();
	});

	function onChange() {
		setSoundEnabled(enabled);
		if (enabled) playClick();
	}
</script>

<label class="sound-toggle swap tooltip tooltip-right md:tooltip-top cursor-pointer">
	<div class="tooltip-content">
		<div class="text-base md:text-xs">
			{enabled ? 'Выключить звуки' : 'Включить звуки'}
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
