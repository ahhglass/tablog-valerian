<script>
	import config from '/src/config';
	import ArchiveSection from '$lib/components/ArchiveSection.svelte';
	import PostSection from '$lib/components/PostSection.svelte';
	import SEO from '$lib/components/SEO.svelte';

	let { data } = $props();
</script>

<SEO
	title={`${data.post.title} — ${config.siteTitle}`}
	description={data.post.description}
	og={{ title: data.post.title }}
/>

<PostSection post={data.post} />

<ArchiveSection />
