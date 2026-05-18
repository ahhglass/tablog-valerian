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
	class="sound-toggle"
	class:sound-toggle--muted={!enabled}
	type="button"
	onclick={toggle}
	aria-label={enabled ? 'Выключить звуки' : 'Включить звуки'}
	aria-pressed={enabled}
	title={enabled ? 'Выключить звуки' : 'Включить звуки'}
>
	<span class="sound-toggle__icon sound-toggle__icon--on" aria-hidden="true"><VolumeOn /></span>
	<span class="sound-toggle__icon sound-toggle__icon--off" aria-hidden="true"><VolumeOff /></span>
	<span class="sr-only">{enabled ? 'Звук вкл.' : 'Звук выкл.'}</span>
</button>
