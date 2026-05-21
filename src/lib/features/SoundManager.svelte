<script>
	/**
	 * Звуки навигации и кликов: `playOpen` при переходе на пост, `playClick` на кнопках/ссылках шапки и футера.
	 * Принимает `postIds` из layout data.
	 */
	import { afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';

	import { playTapHaptic } from '$lib/utils/haptic';
	import { isPostPath, playClick, playOpen } from '$lib/utils/sound';

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
			if (
				!target.closest(
					'button, a.button, a.site-logo, footer a, .theme-toggle-wrap, .theme-toggle, .sound-toggle-wrap, .sound-toggle'
				)
			)
				return;
			playClick();
			playTapHaptic();
		};

		document.addEventListener('pointerup', onPointerUp);
		return () => document.removeEventListener('pointerup', onPointerUp);
	});
</script>
