<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import PinCodeInput from '$lib/components/PinCodeInput.svelte';
	import { playPopup } from '$lib/utils/sound';
	import { unlockClosedPost } from '$lib/utils/unlockClosed';

	let displayTitle = $state('');
	let displayId = $state('');
	let dialog = $state(/** @type {HTMLDialogElement | null} */ (null));
	let pin = $state('');
	let error = $state('');
	let busy = $state(false);
	/** @type {PinCodeInput | null} */
	let pinInput = $state(null);

	let subtitle = $derived(
		displayTitle ? `Введите код для «${displayTitle}»` : 'Введите четырёхзначный код доступа',
	);

	export function open(/** @type {{ title?: string; id?: string }} */ opts = {}) {
		displayTitle = opts.title ?? '';
		displayId = opts.id ?? '';
		pin = '';
		error = '';
		dialog?.showModal();
		playPopup();
		queueMicrotask(() => pinInput?.focusFirst());
	}

	export function close() {
		pin = '';
		error = '';
		pinInput?.clear();
		dialog?.close();
	}

	async function onSubmit() {
		if (!displayId) {
			error = 'Запись не выбрана';
			return;
		}
		if (pin.length < 4) return;

		busy = true;
		error = '';
		const res = await unlockClosedPost(pin, displayId);
		busy = false;

		if (res.status === 503) {
			error = 'PIN не настроен на сервере';
			return;
		}
		if (res.status === 429) {
			error = 'Слишком много попыток. Подождите 15 минут.';
			return;
		}
		if (!res.ok) {
			error = res.status === 401 ? 'Неверный код' : 'Не удалось проверить код';
			pin = '';
			pinInput?.clear();
			return;
		}

		const id = displayId;
		close();
		await goto(`/${id}`, { invalidateAll: true });
	}
</script>

<dialog
	bind:this={dialog}
	class="pin-modal"
	aria-labelledby="pin-modal-title"
	aria-describedby="pin-modal-desc"
	onclick={(e) => e.target === dialog && close()}
	onclose={() => (pin = '')}
	oncancel={(e) => {
		e.preventDefault();
		close();
	}}
>
	<div class="pin-modal__panel">
		<header class="pin-modal__header">
			<h2 id="pin-modal-title" class="pin-modal__title">Код доступа</h2>
			<p id="pin-modal-desc" class="pin-modal__subtitle">{subtitle}</p>
		</header>

		<PinCodeInput bind:this={pinInput} bind:value={pin} disabled={busy} onsubmit={onSubmit} />

		{#if error}<p class="pin-modal__error">{error}</p>{/if}

		<div class="pin-modal__actions text-action pt-3">
			<Button onclick={close} disabled={busy}>Отмена</Button>
			<Button primary disabled={busy || pin.length < 4} onclick={onSubmit}>Подтвердить</Button>
		</div>
	</div>
</dialog>
