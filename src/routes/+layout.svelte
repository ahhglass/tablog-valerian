<script>
	import '/src/css/index.css';

	import config from '/src/config';
	import Logo from '$lib/Logo.svelte';
	import ThemeToggle from '$lib/ThemeToggle.svelte';
	import ArrowUpRightIcon from '$lib/icons/ArrowUpRight.svelte';

	import PageLoader from './PageLoader.svelte';

	let { data, children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="alternate" type="application/rss+xml" title="RSS" href="/feed.xml" />
</svelte:head>

<PageLoader />

<div class="max-w-container mx-auto flex min-h-dvh flex-col">
	<header class="flex flex-row items-center justify-between px-4 py-8 md:p-8">
		<figure>
			<a
				class="flex flex-row items-center gap-4 transition-transform duration-200 hover:scale-[1.035] active:scale-[0.98]"
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
			<ul class="flex flex-row flex-wrap gap-x-6 p-2">
				<li><a class="flex flex-row gap-0.5 p-2 underline" href="/feed.xml">Лента</a></li>
				{#each data.pages as item (item.id)}
					<li><a class="block p-2 underline" href="/{item.id}">{item.title}</a></li>
				{/each}
				{#each config.social as item (item.href)}
					<li>
						<a
							class="flex flex-row gap-0.5 p-2"
							href={item.href}
							target="_blank"
							rel="external noreferrer nofollow"
							><span class="underline">{item.label}</span><span class="text-current/20"
								><ArrowUpRightIcon /></span
							></a
						>
					</li>
				{/each}
			</ul>
		</nav>

		<div class="copy px-4 py-8 text-xl md:p-8">
			<p>
				&copy; {new Date().getFullYear()}
				{config.siteTitle} <span class="mx-2 inline-block text-current/20">|</span> На базе
				<a href={config.themeUrl} target="_blank" rel="external noreferrer">темы {config.themeName}</a>
				для SvelteKit ·
				<a href={config.authorUrl}>{config.authorName}</a>
			</p>
		</div>
	</footer>
</div>
