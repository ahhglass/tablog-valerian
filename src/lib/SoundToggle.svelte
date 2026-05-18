<script>
	import { browser } from '$app/environment';

	import VolumeOff from '$lib/icons/VolumeOff.svelte';
	import VolumeOn from '$lib/icons/VolumeOn.svelte';
	import { isSoundEnabled, playClick, setSoundEnabled } from '$lib/sound';

	let enabled = $state(browser ? isSoundEnabled() : true);

	function toggle() {
		enabled = !enabled;
		setSoundEnabled(enabled);
		if (enabled) playClick();
	}
</script>

<button
	class="sound-toggle inline-flex cursor-pointer items-center gap-1 underline-offset-2 hover:underline"
	type="button"
	onclick={toggle}
	aria-label={enabled ? 'Выключить звуки' : 'Включить звуки'}
	aria-pressed={enabled}
	title={enabled ? 'Выключить звуки' : 'Включить звуки'}
>
	<span class="inline-flex shrink-0 items-center text-[1.15em] leading-none [&_svg]:block">
		{#if enabled}
			<VolumeOn />
		{:else}
			<VolumeOff />
		{/if}
	</span>
	<span class="sr-only">{enabled ? 'Звук вкл.' : 'Звук выкл.'}</span>
</button>
