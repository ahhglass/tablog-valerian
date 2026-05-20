/**
 * Форматирование чисел для UI (счётчики символов и т.п.) — локаль `ru-RU`.
 */

export function formatCount(value) {
	return new Intl.NumberFormat('ru-RU').format(value);
}
