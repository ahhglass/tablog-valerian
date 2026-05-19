<script>
	let { href, primary = false, disabled = false, onclick, children } = $props();
</script>

{#if href}
	<a class="button" class:button--primary={primary} {href}>{@render children()}</a>
{:else}
	<button type="button" class="button" class:button--primary={primary} {disabled} {onclick}>
		{@render children()}
	</button>
{/if}
