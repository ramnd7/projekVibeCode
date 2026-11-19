// Router hash untuk tiga halaman. Sumber: TASKS.md T0.2, SPEC.md §2.

const RUTE = ['katalog', 'keranjang', 'dashboard'];

export function getRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '').split('/')[0];
  return RUTE.includes(hash) ? hash : 'katalog';
}

export function initRouter(padaPerubahan) {
  window.addEventListener('hashchange', padaPerubahan);
  if (!window.location.hash) window.location.replace('#/katalog');
}

export function pergi(rute) {
  if (!RUTE.includes(rute)) rute = 'katalog';
  window.location.hash = `#/${rute}`;
}
