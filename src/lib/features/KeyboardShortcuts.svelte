<script>
	/**
	 * Подключает глобальные горячие клавиши (D/S/Esc) через `registerKeyboardShortcuts` в layout.
	 */
	import { registerKeyboardShortcuts } from '$lib/utils/keyboard';
	import { onMount } from 'svelte';

	onMount(registerKeyboardShortcuts);
</script>
