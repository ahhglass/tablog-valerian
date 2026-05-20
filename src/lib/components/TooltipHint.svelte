<script>
	import { tooltipDismiss } from '$lib/actions/tooltipDismiss';

	/**
	 * @typedef {'left' | 'right' | 'top' | 'bottom'} Placement
	 */

	/** @type {{
	 *   text: string;
	 *   shortcutKey?: string;
	 *   placement?: Placement;
	 *   mdPlacement?: Placement;
	 *   tag?: string;
	 *   class?: string;
	 *   children: import('svelte').Snippet;
	 *   [key: string]: unknown;
	 * }} */
	let {
		text,
		shortcutKey,
		placement = 'top',
		mdPlacement = placement,
		tag,
		class: className = '',
		children,
		...rest
	} = $props();

	const element = $derived(tag ?? (rest.href != null ? 'a' : 'div'));

	const tooltipClass = $derived(
		[
			'tooltip',
			`tooltip-${placement}`,
			mdPlacement !== placement ? `md:tooltip-${mdPlacement}` : '',
			className,
		]
			.filter(Boolean)
			.join(' '),
	);
</script>

<svelte:element this={element} class={tooltipClass} use:tooltipDismiss={600} {...rest}>
	<span class="tooltip-content">
		<div class="text-base md:text-xs">
			{text}
			{#if shortcutKey}
				<span class="hidden items-center gap-1 md:inline-flex">
					<kbd>{shortcutKey}</kbd>
				</span>
			{/if}
		</div>
	</span>
	{@render children()}
</svelte:element>
