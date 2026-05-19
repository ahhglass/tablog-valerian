const WINDOW_MS = 15 * 60 * 1000;
const MAX = 5;

/** @type {Map<string, { start: number; count: number }>} */
const hits = new Map();

/** @param {string} ip @param {string} [key] */
const entry = (ip, key = 'closed-unlock') => {
	const id = `${key}:${ip}`;
	const now = Date.now();
	let e = hits.get(id);
	if (!e || now - e.start > WINDOW_MS) {
		e = { start: now, count: 0 };
		hits.set(id, e);
	}
	return e;
};

/** Блок только после неудачных попыток */
export const isRateLimited = (ip, key = 'closed-unlock') => {
	const e = entry(ip, key);
	return e.count >= MAX;
};

/** Считаем только неверный PIN */
export const recordFailedAttempt = (ip, key = 'closed-unlock') => {
	const e = entry(ip, key);
	e.count += 1;
	hits.set(`${key}:${ip}`, e);
};
