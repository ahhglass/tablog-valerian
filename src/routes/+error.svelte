<script>
	import { page } from '$app/state';
	import Action from '$lib/components/Action.svelte';
	import Button from '$lib/components/Button.svelte';
	import Header from '$lib/components/Header.svelte';
	import { tripleTap } from '$lib/actions/tripleTap';
	import { openClosedPin } from '$lib/stores/closedPin.svelte.js';

	const closedSlug = $derived(page.status === 403 ? page.url.pathname.replace(/^\//, '') : '');

	function openPinModal() {
		if (!closedSlug) return;
		openClosedPin({ id: closedSlug });
	}
</script>

<svelte:head>
	<title>Ошибка {page.status}</title>
</svelte:head>

<section class="py-8">
	<Header>Ошибка {page.status}</Header>

	<div class="px-4 py-8 md:p-8">
		<div class="copy text-xl">
			{#if page.status === 404}
				<p>Страница не найдена.</p>
			{:else if page.status === 403}
				<p use:tripleTap={openPinModal}>
					{page.error?.message ?? 'Доступ к этой записи закрыт'}.
				</p>
			{:else}
				<p>{page.error?.message}.</p>
			{/if}
		</div>
	</div>

	<Action class="px-4 py-8 md:p-8">
		<Button href="/">На главную</Button>
	</Action>
</section>
