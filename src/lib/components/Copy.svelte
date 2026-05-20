<script>
	import { onMount } from 'svelte';

	let { children } = $props();

	/** @type {HTMLDivElement | undefined} */
	let rootEl = $state();

	onMount(() => {
		const root = rootEl;
		if (!root) return;

		function onClick(e) {
			const raw = e.target;
			const el = raw instanceof Element ? raw : raw instanceof Node ? raw.parentElement : null;
			const a = el?.closest('a.heading-anchor');
			if (!a || !root.contains(a)) return;
			const hash = a.getAttribute('href');
			if (!hash?.startsWith('#')) return;
			const fullUrl = `${location.origin}${location.pathname}${location.search}${hash}`;
			navigator.clipboard?.writeText(fullUrl).catch(() => {});
		}

		root.addEventListener('click', onClick);
		return () => root.removeEventListener('click', onClick);
	});
</script>

<div class="px-4 py-8 md:p-8">
	<div bind:this={rootEl} class="copy copy--entry text-xl">
		{@render children()}
	</div>
</div>
