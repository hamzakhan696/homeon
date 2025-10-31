export const API_BASE_URL = process.env.REACT_APP_API_URL;
export async function apiGet(path, opts) {
	const r = await fetch(`${API_BASE_URL}${path}`, { headers: { Accept: 'application/json' }, ...opts });
	if (!r.ok) throw await r.json().catch(() => new Error(r.statusText));
	return r.json();
}

export async function apiJson(method, path, body) {
	const r = await fetch(`${API_BASE_URL}${path}`, {
		method,
		headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
		body: JSON.stringify(body),
	});
	if (!r.ok) throw await r.json().catch(() => new Error(r.statusText));
	return r.json();
}

export async function apiDelete(path) {
	const r = await fetch(`${API_BASE_URL}${path}`, { method: 'DELETE' });
	if (!r.ok) throw await r.json().catch(() => new Error(r.statusText));
	return r.json();
}


