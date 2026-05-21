<script>
	import '/src/css/index.css';

	import config from '/src/config';
	import Logo from '$lib/components/Logo.svelte';
	import CursorTooltip from '$lib/features/CursorTooltip.svelte';
	import KeyboardShortcuts from '$lib/features/KeyboardShortcuts.svelte';
	import SoundManager from '$lib/features/SoundManager.svelte';
	import SoundToggle from '$lib/features/SoundToggle.svelte';
	import ThemeToggle from '$lib/features/ThemeToggle.svelte';
	import ArrowUpRightIcon from '$lib/icons/ArrowUpRight.svelte';

	import { drawUnderline } from '$lib/actions/drawUnderline';
	import ClosedPostPinModal from '$lib/components/ClosedPostPinModal.svelte';
	import { setClosedPinModal } from '$lib/stores/closedPin.svelte.js';

	import PageLoader from './PageLoader.svelte';
	import { loadGsap } from '$lib/utils/loadGsap.js';
	import { onMount } from 'svelte';

	let { data, children } = $props();

	onMount(() => {
		document.documentElement.dataset.uiReady = '';

		const warmGsap = () => loadGsap();
		if ('requestIdleCallback' in window) {
			requestIdleCallback(warmGsap, { timeout: 3000 });
		} else {
			setTimeout(warmGsap, 1);
		}
	});

	/** @type {ClosedPostPinModal | undefined} */
	let pinModal = $state();

	$effect(() => {
		setClosedPinModal(pinModal ?? null);
		return () => setClosedPinModal(null);
	});

	const postIds = $derived(data.posts.map((post) => post.id));
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="alternate" type="application/rss+xml" title="RSS" href="/feed.xml" />
	<link rel="preload" href="/vendor/gsap.min.js" as="script" />
</svelte:head>

<PageLoader />
<CursorTooltip />
<KeyboardShortcuts />
<SoundManager {postIds} />

<div class="max-w-container mx-auto flex min-h-dvh flex-col">
	<header class="flex flex-row items-center justify-between px-4 py-8 md:p-8">
		<figure>
			<a
				class="site-logo flex flex-row items-center gap-4 transition-transform duration-200 hover:scale-[1.035] active:scale-[0.98]"
				href="/"
				title={config.siteTitle}
			>
				<Logo />
				<!-- display site title next to the logo
        <h1 class="text-3xl leading-none tracking-tight">{config.siteTitle}</h1>
        -->
			</a>
		</figure>
		<ThemeToggle />
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="mt-8" use:drawUnderline>
		<nav class="py-4 text-xl md:p-4">
			<ul class="flex flex-row flex-wrap gap-x-2 p-2">
				<li>
					<a class="text-draw p-2" data-draw-line href="/feed.xml">
						<span class="text-draw__label">Лента</span>
						<span class="text-draw__box" data-draw-line-box aria-hidden="true"></span>
					</a>
				</li>
				{#each data.pages as item (item.id)}
					<li>
						<a class="text-draw p-2" data-draw-line href="/{item.id}">
							<span class="text-draw__label">{item.title}</span>
							<span class="text-draw__box" data-draw-line-box aria-hidden="true"></span>
						</a>
					</li>
				{/each}
				{#each config.social as item (item.href)}
					<li>
						<a
							class="text-draw text-draw--with-icon p-2"
							data-draw-line
							href={item.href}
							target="_blank"
							rel="external noreferrer nofollow"
						>
							<span class="text-draw__inner">
								<span class="text-draw__label">{item.label}</span>
								<span class="text-draw__box" data-draw-line-box aria-hidden="true"></span>
							</span>
							<span
								class="text-draw__icon text-[1.15em] leading-none text-current/20 [&_svg]:block"
								aria-hidden="true"><ArrowUpRightIcon /></span
							>
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<div class="copy px-4 py-8 text-xl md:p-8">
			<div class="flex flex-wrap items-center gap-y-1">
				<p class="m-0">
					&copy; {new Date().getFullYear()}
					{config.siteTitle} <span class="mx-2 inline-block text-current/20">|</span> На базе
					<a
						class="text-draw"
						data-draw-line
						href={config.themeUrl}
						target="_blank"
						rel="external noreferrer"
						><span class="text-draw__label">темы {config.themeName}</span><span
							class="text-draw__box"
							data-draw-line-box
							aria-hidden="true"
						></span></a
					>
					для SvelteKit в редакции
					<a class="text-draw" data-draw-line href={config.authorUrl}
						><span class="text-draw__label">{config.authorName}</span><span
							class="text-draw__box"
							data-draw-line-box
							aria-hidden="true"
						></span></a
					>
				</p>
				<span class="mx-3 inline-block text-current/20">|</span>
				<SoundToggle />
			</div>
		</div>
	</footer>
</div>

<ClosedPostPinModal bind:this={pinModal} />
