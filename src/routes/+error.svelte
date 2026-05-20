<script>
	import config from '/src/config';
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

	const errorDescription = $derived.by(() => {
		if (page.status === 404) {
			return `Запрошенная страница не найдена. ${config.siteTitle} — вернуться на главную.`;
		}
		if (page.status === 403) {
			return 'Запись закрыта. При наличии PIN её можно открыть с этой страницы.';
		}
		const msg = page.error?.message;
		if (msg) return `${msg} — ${config.siteTitle}.`;
		return `Ошибка ${page.status ?? ''}. ${config.siteTitle}.`;
	});
</script>

<svelte:head>
	<title>Ошибка {page.status}</title>
	<meta name="description" content={errorDescription} />
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
