// Titik render aplikasi: memilih halaman sesuai rute hash.
// Sumber: TASKS.md T0.1, T0.2.

import { getRoute } from './router.js';
import { renderKatalog } from './katalog.js';
import { renderKeranjang } from './keranjang.js';
import { renderDashboard } from './dashboard.js';
import { pasangAreaToast } from './toast.js';

export function render() {
  const app = document.getElementById('app');
  if (!app) return;
  app.replaceChildren();
  pasangAreaToast();

  const rute = getRoute();
  if (rute === 'keranjang') renderKeranjang(app);
  else if (rute === 'dashboard') renderDashboard(app);
  else renderKatalog(app);
}
