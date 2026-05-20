<script>
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { canUseCursorTooltip, initCursorTooltip } from '$lib/utils/cursorTooltip.js';
	import { onMount } from 'svelte';

	let tooltip = $state(/** @type {HTMLElement | undefined} */ (undefined));
	let hideTooltip = () => {};

	beforeNavigate(() => {
		hideTooltip();
	});

	afterNavigate(() => {
		hideTooltip();
	});

	onMount(() => {
		if (!canUseCursorTooltip() || !tooltip) return;

		let api = /** @type {{ destroy: () => void; hide: () => void } | undefined} */ (undefined);

		initCursorTooltip(tooltip).then((result) => {
			api = result;
			if (api) hideTooltip = api.hide;
		});

		return () => {
			api?.destroy();
			hideTooltip = () => {};
		};
	});
</script>

<div bind:this={tooltip} class="cursor-tooltip" aria-hidden="true">
	<p></p>
</div>
