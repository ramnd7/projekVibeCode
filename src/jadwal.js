// Jadwal terpilih disimpan di dalam keranjang agar persistennya satu sumber.
// Sumber: SPEC.md §4.3, TASKS.md T4.1.

import { getCart, setCart } from './store.js';
import { validasiJadwal } from './validasi.js';
import { jadwalValid, durasiHari } from './waktu.js';

export function getJadwal() {
  const j = getCart().jadwal;
  return { waktuAmbil: j?.waktuAmbil || '', waktuKembaliJadwal: j?.waktuKembaliJadwal || '' };
}

export function setJadwal(patch) {
  const cart = getCart();
  setCart({ ...cart, jadwal: { ...getJadwal(), ...patch } });
}

export function errorJadwal() {
  const j = getJadwal();
  return validasiJadwal(j.waktuAmbil, j.waktuKembaliJadwal);
}

export function jadwalSiap() {
  return jadwalValid(getJadwal().waktuAmbil, getJadwal().waktuKembaliJadwal);
}

export function hariDipilih() {
  const j = getJadwal();
  return jadwalSiap() ? durasiHari(j.waktuAmbil, j.waktuKembaliJadwal) : 0;
}
