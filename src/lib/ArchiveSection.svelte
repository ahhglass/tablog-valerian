<script>
	import { format } from 'date-fns';

	import config from '/src/config';
	import { page } from '$app/state';
	import Action from '$lib/Action.svelte';
	import Button from '$lib/Button.svelte';
	import Header from '$lib/Header.svelte';
	import PinIcon from '$lib/icons/PinIcon.svelte';
	import ArrowRightIcon from '$lib/icons/ArrowRight.svelte';

	let { limit = 5, posts = page.data.posts.slice(0, limit || Infinity), header } = $props();
</script>

<section class="py-8">
	<Header
		>{#if header}{@render header()}{:else}{config.archiveTitle}{/if}</Header
	>
	<div class="px-4 py-7 md:px-8">
		<ul class="text-metadata space-y-2 sm:space-y-0">
			{#each posts as item (item.id)}
				<li>
					<a
						class="archive-link block py-1 sm:flex sm:flex-row sm:items-start sm:gap-4"
						href="/{item.id}"
					>
						<span class="block">
							{#if item.pinned}<span class="float-left mr-1 flex"><PinIcon /></span>{/if}
							<span class="underline sm:flex-1">{item.title}</span>
						</span>
						<span class="mt-3 min-w-4 flex-1 border-b border-dashed pt-0.5 text-current/20"></span>
						<span class="whitespace-nowrap text-current/60 sm:text-current"
							>{format(new Date(item.date), config.dateFormat, { locale: config.dateLocale })}</span
						>
					</a>
				</li>
			{/each}
		</ul>
	</div>
	{#if limit}
		<Action class="px-4 py-8 md:p-8">
			<Button href="/archive">Все записи <ArrowRightIcon /></Button>
		</Action>
	{/if}
</section>
