<script>
	import { afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';

	import { isPostPath, playClick, playOpen } from '$lib/sound';

	let { postIds } = $props();

	const posts = $derived(new Set(postIds));

	afterNavigate(({ to, from }) => {
		if (!to || !from || to.url.pathname === from.url.pathname) return;
		if (!isPostPath(to.url.pathname, posts)) return;
		playOpen();
	});

	onMount(() => {
		const onPointerUp = (event) => {
			const target = event.target;
			if (!(target instanceof Element)) return;
			if (!target.closest('button, a.button, a.site-logo, footer a')) return;
			playClick();
		};

		document.addEventListener('pointerup', onPointerUp);
		return () => document.removeEventListener('pointerup', onPointerUp);
	});
</script>
