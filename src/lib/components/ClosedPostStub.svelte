<script>
	import Button from '$lib/components/Button.svelte';
	import Header from '$lib/components/Header.svelte';
	import Lock from '$lib/icons/Lock.svelte';
	import { tripleTap } from '$lib/actions/tripleTap';
	import { openClosedPin } from '$lib/stores/closedPin.svelte.js';

	let { post } = $props();

	function openPin() {
		openClosedPin({ id: post.id, title: post.title });
	}
</script>

<section class="py-8">
	<article>
		<Header>{post.title}</Header>

		<div class="px-4 py-8 md:p-8">
			<div class="copy text-xl" use:tripleTap={openPin}>
				<p class="flex flex-row items-start gap-3">
					<span class="mt-1 shrink-0 text-current/60"><Lock /></span>
					<span>
						Эта запись закрыта. Введите код доступа, чтобы прочитать текст.
					</span>
				</p>
			</div>
		</div>
	</article>
</section>

<div class="px-4 pb-8 md:px-8">
	<Button primary onclick={openPin}>Ввести код доступа</Button>
</div>
