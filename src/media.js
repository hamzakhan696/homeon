import { API_BASE_URL } from './api';

export const MEDIA_BASE_URL = process.env.REACT_APP_MEDIA_BASE_URL || `${API_BASE_URL}/uploads`;

export function resolveMediaUrl(name) {
	if (!name) return '';
	if (typeof name === 'string' && /^data:(image|video)\//i.test(name)) return name;
	if (/^https?:\/\//i.test(name)) return name;
	return `${MEDIA_BASE_URL}/${String(name).replace(/^\//,'')}`;
}

export function getProjectThumb(p) {
	const list = [];
	if (p?.coverImage) list.push(p.coverImage);
	if (Array.isArray(p?.projectImages) && p.projectImages.length > 0) {
		const first = p.projectImages[0];
		list.push(first?.url || first?.name || first);
	}
	for (const c of list) {
		const u = resolveMediaUrl(c);
		if (u) return u;
	}
	return '';
}


