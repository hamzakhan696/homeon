export function showToast(message, type = 'success') {
	const existing = document.querySelector('.ho-toast');
	if (existing) existing.remove();
	const el = document.createElement('div');
	el.className = `ho-toast ho-toast-${type}`;
	el.innerText = message;
	Object.assign(el.style, {
		position: 'fixed',
		right: '24px',
		top: '24px',
		zIndex: 9999,
		padding: '12px 16px',
		borderRadius: '6px',
		background: type === 'error' ? '#e74c3c' : type === 'info' ? '#3498db' : '#27ae60',
		color: '#fff',
		boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
		fontWeight: 600,
		fontSize: '14px',
	});
	document.body.appendChild(el);
	setTimeout(() => {
		el.style.transition = 'opacity 300ms ease';
		el.style.opacity = '0';
		setTimeout(() => el.remove(), 320);
	}, 2500);
}


