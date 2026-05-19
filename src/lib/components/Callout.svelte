<script>
	/** @type {'note' | 'tip' | 'important'} */
	let { variant = 'note', title = undefined, children } = $props();

	const defaultTitles = {
		note: 'Заметка',
		tip: 'Совет',
		important: 'Важно',
	};
</script>

<aside class="callout callout--{variant}">
	<p class="callout__label">{title ?? defaultTitles[variant]}</p>
	<div class="callout__body">
		{@render children()}
	</div>
</aside>
