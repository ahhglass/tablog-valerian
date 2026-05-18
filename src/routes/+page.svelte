<script>
	import config from '/src/config';
	import ArchiveSection from '$lib/ArchiveSection.svelte';
	import PostSection from '$lib/PostSection.svelte';
	import SEO from '$lib/SEO.svelte';

	let { data } = $props();
</script>

<SEO
	title={`${config.siteTitle} — ${config.siteTagline}`}
	description={data.post?.description ?? config.siteTagline}
	og={{ title: config.siteTagline }}
/>

{#if data.post}
	<PostSection post={data.post} />
{/if}

<ArchiveSection />
