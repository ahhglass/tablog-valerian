<script>
	const LENGTH = 4;

	let { value = $bindable(''), disabled = false, onsubmit } = $props();

	/** @type {HTMLInputElement[]} */
	let inputs = $state([]);

	/** @param {number} index */
	function cellValue(index) {
		return value[index] ?? '';
	}

	/** @param {number} index @param {string} digit */
	function setDigit(index, digit) {
		const chars = value.split('');
		while (chars.length < LENGTH) chars.push('');
		chars[index] = digit;
		value = chars.join('').replace(/\D/g, '').slice(0, LENGTH);
	}

	/** @param {number} index */
	function focusAt(index) {
		const el = inputs[index];
		if (el) {
			el.focus();
			el.select();
		}
	}

	/** @param {InputEvent} event @param {number} index */
	function onInput(event, index) {
		const input = /** @type {HTMLInputElement} */ (event.currentTarget);
		const digit = input.value.replace(/\D/g, '').slice(-1);

		if (!digit) {
			setDigit(index, '');
			return;
		}

		setDigit(index, digit);
		if (index < LENGTH - 1) focusAt(index + 1);
	}

	/** @param {KeyboardEvent} event @param {number} index */
	function onKeydown(event, index) {
		if (event.key === 'Backspace' && !cellValue(index) && index > 0) {
			event.preventDefault();
			setDigit(index - 1, '');
			focusAt(index - 1);
		}

		if (event.key === 'ArrowLeft' && index > 0) {
			event.preventDefault();
			focusAt(index - 1);
		}

		if (event.key === 'ArrowRight' && index < LENGTH - 1) {
			event.preventDefault();
			focusAt(index + 1);
		}

		if (event.key === 'Enter' && value.length === LENGTH) {
			event.preventDefault();
			onsubmit?.();
		}
	}

	/** @param {ClipboardEvent} event */
	function onPaste(event) {
		event.preventDefault();
		const pasted = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, LENGTH);
		if (!pasted) return;

		value = pasted;
		focusAt(Math.min(pasted.length, LENGTH - 1));
	}

	export function focusFirst() {
		focusAt(0);
	}

	export function clear() {
		value = '';
		focusAt(0);
	}
</script>

<div class="pin-code" role="group" aria-label="Пин-код из четырёх цифр">
	{#each Array(LENGTH) as _, index (index)}
		<input
			bind:this={inputs[index]}
			class="pin-code__cell"
			type="text"
			inputmode="numeric"
			autocomplete={index === 0 ? 'one-time-code' : 'off'}
			maxlength="1"
			aria-label="Цифра {index + 1}"
			{disabled}
			value={cellValue(index)}
			oninput={(e) => onInput(e, index)}
			onkeydown={(e) => onKeydown(e, index)}
			onpaste={onPaste}
			onfocus={(e) => e.currentTarget.select()}
		/>
	{/each}
</div>
