<script>
	import { onMount } from 'svelte';

	import config from '/src/config';
	import ArchiveSection from '$lib/components/ArchiveSection.svelte';
	import ClosedPostStub from '$lib/components/ClosedPostStub.svelte';
	import PostSection from '$lib/components/PostSection.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { fetchClosedPostContent } from '$lib/utils/unlockClosed';

	let { data } = $props();

	let post = $state(data.post);
	let locked = $state(data.locked);
	let loadingUnlock = $state(false);

	$effect(() => {
		post = data.post;
		locked = data.locked;
	});

	onMount(async () => {
		if (!locked) return;
		loadingUnlock = true;
		const unlocked = await fetchClosedPostContent(post.id);
		loadingUnlock = false;
		if (unlocked) {
			post = unlocked;
			locked = false;
		}
	});
</script>

<SEO
	title={`${post.title} — ${config.siteTitle}`}
	description={post.description}
	og={{ title: post.title }}
/>

{#if locked}
	<ClosedPostStub {post} />
	{#if loadingUnlock}
		<p class="text-metadata px-4 md:px-8">Проверка доступа…</p>
	{/if}
{:else}
	<PostSection {post} />
{/if}

<ArchiveSection />
