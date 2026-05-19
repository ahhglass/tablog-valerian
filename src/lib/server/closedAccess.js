import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '$env/dynamic/private';
import { CLOSED_PIN as STATIC_PIN } from '$env/static/private';

const NAME = 'tablog_closed';

const secret = () =>
	String(env.CLOSED_PIN ?? STATIC_PIN ?? process.env.CLOSED_PIN ?? '')
		.trim()
		.replace(/^["']|["']$/g, '');

const sign = (payload, pin) => createHmac('sha256', pin).update(payload).digest('base64url');

/** @param {string | undefined} raw */
const parseRaw = (raw) => {
	if (!raw) return null;
	const i = raw.indexOf('.');
	if (i < 0) return null;
	const slugs = raw.slice(i + 1);
	const sig = raw.slice(0, i);
	if (!sig || !slugs) return null;
	return { sig, slugs };
};

const cookieOpts = (url) => ({
	path: '/',
	httpOnly: true,
	sameSite: 'lax',
	secure: url.protocol === 'https:',
});

/** @param {import('@sveltejs/kit').Cookies} cookies */
const readGrant = (cookies) => {
	const pin = secret();
	if (!pin) return null;
	const parsed = parseRaw(cookies.get(NAME));
	if (!parsed || parsed.sig !== sign(parsed.slugs, pin)) return null;
	return { pin, slugs: parsed.slugs.split(',').filter(Boolean) };
};

/** @param {import('@sveltejs/kit').Cookies} cookies @param {URL} url @param {string[]} slugs @param {string} pin */
const saveGrant = (cookies, url, slugs, pin) => {
	if (!slugs.length) {
		cookies.delete(NAME, cookieOpts(url));
		return;
	}
	const payload = slugs.join(',');
	cookies.set(NAME, `${sign(payload, pin)}.${payload}`, cookieOpts(url));
};

export const pinConfigured = () => secret().length > 0;

export const checkPin = (pin) => {
	const expected = secret();
	const got = String(pin).replace(/\D/g, '');
	if (!expected.length || got.length !== expected.length) return false;
	return timingSafeEqual(Buffer.from(got), Buffer.from(expected));
};

/** @param {import('@sveltejs/kit').Cookies} cookies @param {URL} url @param {string} slug */
export const takeUnlock = (cookies, url, slug) => {
	const grant = readGrant(cookies);
	if (!grant || !slug || !grant.slugs.includes(slug)) return false;
	saveGrant(
		cookies,
		url,
		grant.slugs.filter((s) => s !== slug),
		grant.pin,
	);
	return true;
};

/** @param {import('@sveltejs/kit').Cookies} cookies @param {URL} url @param {string} slug */
export const setUnlock = (cookies, url, slug) => {
	const pin = secret();
	if (!pin || !slug) return false;
	const grant = readGrant(cookies);
	const slugs = new Set(grant?.slugs ?? []);
	slugs.add(slug);
	saveGrant(cookies, url, [...slugs], pin);
	return true;
};
