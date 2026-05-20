<script>
	import { format } from 'date-fns';

	import config from '/src/config';
	import { page } from '$app/state';
	import Action from '$lib/components/Action.svelte';
	import Button from '$lib/components/Button.svelte';
	import Header from '$lib/components/Header.svelte';
	import Lock from '$lib/icons/Lock.svelte';
	import PinIcon from '$lib/icons/PinIcon.svelte';
	import ArrowRightIcon from '$lib/icons/ArrowRight.svelte';
	import { tripleTap } from '$lib/actions/tripleTap';
	import { openClosedPin } from '$lib/stores/closedPin.svelte.js';

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
					{#if item.closed}
						<span
							class="archive-link archive-link--closed block py-1 sm:flex sm:flex-row sm:items-start sm:gap-4"
							title="Запись закрыта"
							use:tripleTap={() => openClosedPin({ id: item.id, title: item.title })}
						>
							<span class="archive-link__closed-head block">
								{#if item.pinned}<span class="float-left mr-1 flex"><PinIcon /></span>{/if}
								<span class="float-left mr-1 flex"><Lock /></span>
								<span class="underline sm:flex-1">{item.title}</span>
							</span>
							<span class="mt-3 min-w-4 flex-1 border-b border-dashed pt-0.5 text-current/20"
							></span>
							<span class="whitespace-nowrap text-current/60 sm:text-current"
								>{format(new Date(item.date), config.dateFormat, {
									locale: config.dateLocale,
								})}</span
							>
						</span>
					{:else}
						<a
							class="archive-link block py-1 sm:flex sm:flex-row sm:items-start sm:gap-4"
							href="/{item.id}"
						>
							<span class="block">
								{#if item.pinned}<span class="float-left mr-1 flex"><PinIcon /></span>{/if}
								<span class="underline sm:flex-1">{item.title}</span>
							</span>
							<span class="mt-3 min-w-4 flex-1 border-b border-dashed pt-0.5 text-current/20"
							></span>
							<span class="whitespace-nowrap text-current/60 sm:text-current"
								>{format(new Date(item.date), config.dateFormat, {
									locale: config.dateLocale,
								})}</span
							>
						</a>
					{/if}
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
