/** @type {import('$lib/components/ClosedPostPinModal.svelte').default | null} */
let modal = null;

/** @param {import('$lib/components/ClosedPostPinModal.svelte').default | null} instance */
export function setClosedPinModal(instance) {
	modal = instance;
}

/** @param {{ id?: string; title?: string }} opts */
export function openClosedPin(opts) {
	modal?.open(opts);
}

export function closeClosedPin() {
	modal?.close();
}

export function isClosedPinOpen() {
	return Boolean(modal?.isOpen?.());
}
