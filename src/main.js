import './style.css';
import { loadState, getState, simpanSemua } from './store.js';
import { evaluasiOtomatis } from './status.js';
import { initRouter } from './router.js';
import { render } from './ui.js';

loadState();
if (evaluasiOtomatis(getState().orders, getState().config)) simpanSemua();
initRouter(render);
render();

// Satu pendengar Escape untuk menu mobile (UI-04).
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const menu = document.querySelector('.menu-mobile:not([hidden])');
  if (!menu) return;
  menu.hidden = true;
  const tombolMenu = document.querySelector('.btn-menu');
  if (tombolMenu) {
    tombolMenu.setAttribute('aria-expanded', 'false');
    tombolMenu.focus();
  }
});
