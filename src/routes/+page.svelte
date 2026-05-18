<script>
	import config from '/src/config';
	import ArchiveSection from '$lib/components/ArchiveSection.svelte';
	import PostSection from '$lib/components/PostSection.svelte';
	import SEO from '$lib/components/SEO.svelte';

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
