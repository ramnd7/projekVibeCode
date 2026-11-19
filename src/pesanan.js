// Validasi pengiriman dan pembuatan record pesanan. Sumber: TASKS.md T4.5, AC-10, AC-11.

import { getState, getGear, getOrders, nomorSewaBerikut, tambahOrder, setCart } from './store.js';
import { jadwalValid, hitungBiaya } from './waktu.js';
import { tersedia } from './ketersediaan.js';
import { validasiNamaPenyewa, validasiCatatan } from './validasi.js';
import { getJadwal } from './jadwal.js';
import { susunPesan, tautanWA } from './pesan.js';

export function cekPengiriman(cart, form) {
  const alasan = [];
  if (!cart.items.length) alasan.push('Keranjang masih kosong.');
  const j = getJadwal();
  if (!jadwalValid(j.waktuAmbil, j.waktuKembaliJadwal)) alasan.push('Jadwal belum valid.');
  const namaError = validasiNamaPenyewa(form.namaPenyewa);
  if (namaError) alasan.push(namaError);
  const catatanError = validasiCatatan(form.catatan);
  if (catatanError) alasan.push(catatanError);

  const gear = getGear();
  const orders = getOrders();
  const itemBermasalah = [];
  for (const item of cart.items) {
    const g = gear.find((x) => x.id === item.gearId);
    if (!g) { itemBermasalah.push(item.gearId); alasan.push('Ada gear yang sudah tidak tersedia.'); continue; }
    const totalCart = cart.items.filter((i) => i.gearId === item.gearId).reduce((n, i) => n + i.jumlah, 0);
    const sisa = tersedia(g, orders, j.waktuAmbil, j.waktuKembaliJadwal);
    if (sisa === null || totalCart > sisa) itemBermasalah.push(item.gearId);
  }
  if (itemBermasalah.length && !alasan.some((a) => a.includes('tersedia'))) alasan.push('Jumlah gear melebihi stok pada jadwal ini.');
  return { bisa: alasan.length === 0, alasan, itemBermasalah };
}

export function buatDanKirim(cart, form, bukaTautan = true) {
  const j = getJadwal();
  const gear = getGear();
  const hitung = hitungBiaya(cart.items, gear, j.waktuAmbil, j.waktuKembaliJadwal);
  const order = {
    id: `o-${Date.now()}`,
    kodeSewa: nomorSewaBerikut(),
    namaPenyewa: String(form.namaPenyewa).trim(),
    tanggalMulai: j.waktuAmbil.slice(0, 10),
    tanggalSelesai: j.waktuKembaliJadwal.slice(0, 10),
    waktuAmbil: j.waktuAmbil,
    waktuKembaliJadwal: j.waktuKembaliJadwal,
    waktuKembaliAktual: null,
    items: cart.items.map((i) => ({ ...i })),
    totalBiaya: hitung.totalBiaya,
    status: 'Menunggu Konfirmasi',
    dibuat: new Date().toISOString(),
    catatan: String(form.catatan || '').trim(),
    denda: 0,
    totalAkhir: hitung.totalBiaya,
  };
  tambahOrder(order);
  setCart({ jadwal: { ...j }, items: [] });
  if (bukaTautan) {
    const teks = susunPesan(order, gear, getState().config);
    window.open(tautanWA(teks, getState().config), '_blank', 'noopener');
  }
  return order;
}
