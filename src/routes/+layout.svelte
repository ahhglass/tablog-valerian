<script>
	import '/src/css/index.css';

	import config from '/src/config';
	import Logo from '$lib/components/Logo.svelte';
	import TooltipHint from '$lib/components/TooltipHint.svelte';
	import SoundManager from '$lib/features/SoundManager.svelte';
	import SoundToggle from '$lib/features/SoundToggle.svelte';
	import ThemeToggle from '$lib/features/ThemeToggle.svelte';
	import ArrowUpRightIcon from '$lib/icons/ArrowUpRight.svelte';

	import ClosedPostPinModal from '$lib/components/ClosedPostPinModal.svelte';
	import { navShortcutForPage, shortcuts } from '$lib/config/shortcuts';
	import { setClosedPinModal } from '$lib/stores/closedPin.svelte.js';
	import { registerKeyboardShortcuts } from '$lib/utils/keyboard';

	import PageLoader from './PageLoader.svelte';
	import { onMount } from 'svelte';

	let { data, children } = $props();

	/** @type {ClosedPostPinModal | undefined} */
	let pinModal = $state();

	$effect(() => {
		setClosedPinModal(pinModal ?? null);
		return () => setClosedPinModal(null);
	});

	const postIds = $derived(data.posts.map((post) => post.id));

	onMount(registerKeyboardShortcuts);
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="alternate" type="application/rss+xml" title="RSS" href="/feed.xml" />
</svelte:head>

<PageLoader />
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

	<footer class="mt-8">
		<nav class="py-4 text-xl md:p-4">
			<ul class="flex flex-row flex-wrap gap-x-2 p-2">
				<li>
					<TooltipHint
						text={shortcuts.feed.tooltip}
						shortcutKey={shortcuts.feed.key}
						placement="top"
						mdPlacement="top"
						href={shortcuts.feed.href}
						class="footer-nav-link inline-flex flex-row gap-0.5 p-2 underline"
					>
						{shortcuts.feed.label}
					</TooltipHint>
				</li>
				{#each data.pages as item (item.id)}
					{@const nav = navShortcutForPage(item.id)}
					<li>
						{#if nav}
							<TooltipHint
								text={nav.tooltip}
								shortcutKey={nav.key}
								placement="top"
								mdPlacement="top"
								href={nav.href}
								class="footer-nav-link inline-flex flex-row gap-0.5 p-2 underline"
							>
								{item.title}
							</TooltipHint>
						{:else}
							<a class="block p-2 underline" href="/{item.id}">{item.title}</a>
						{/if}
					</li>
				{/each}
				{#each config.social as item (item.href)}
					<li>
						<a
							class="inline-flex flex-row items-center gap-1 p-2"
							href={item.href}
							target="_blank"
							rel="external noreferrer nofollow"
							><span class="underline">{item.label}</span><span
								class="inline-flex shrink-0 items-center self-center text-[1.15em] leading-none text-current/20 [&_svg]:block"
								><ArrowUpRightIcon /></span
							></a
						>
					</li>
				{/each}
			</ul>
		</nav>

		<div class="copy px-4 py-8 text-xl md:p-8">
			<div class="flex flex-wrap items-center gap-y-1">
				<p class="m-0">
					&copy; {new Date().getFullYear()}
					{config.siteTitle} <span class="mx-2 inline-block text-current/20">|</span> На базе
					<a href={config.themeUrl} target="_blank" rel="external noreferrer"
						>темы {config.themeName}</a
					>
					для SvelteKit в редакции
					<a href={config.authorUrl}>{config.authorName}</a>
				</p>
				<span class="mx-3 inline-block text-current/20">|</span>
				<SoundToggle />
			</div>
		</div>
	</footer>
</div>

<ClosedPostPinModal bind:this={pinModal} />
