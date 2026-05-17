<script>
	import { page } from '$app/state';
	import Action from '$lib/Action.svelte';
	import Button from '$lib/Button.svelte';
	import Header from '$lib/Header.svelte';
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
			{:else}
				<p>{page.error.message}.</p>
			{/if}
		</div>
	</div>

	<Action class="px-4 py-8 md:p-8">
		<Button href="/">На главную</Button>
	</Action>
</section>
