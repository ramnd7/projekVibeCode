// Ketersediaan unit dengan interval setengah terbuka [mulai, selesai).
// Sumber: SPEC.md §5.4, AC-05 sampai AC-09.

import { parseLokal } from './format.js';
import { jadwalValid } from './waktu.js';

export const STATUS_PENGURANG_STOK = ['Menunggu Konfirmasi', 'Terbooking', 'Terpinjam'];

export function intervalsOverlap(a1, a2, b1, b2) {
  const A1 = parseLokal(a1);
  const A2 = parseLokal(a2);
  const B1 = parseLokal(b1);
  const B2 = parseLokal(b2);
  if (!A1 || !A2 || !B1 || !B2) return false;
  return A1.getTime() < B2.getTime() && B1.getTime() < A2.getTime();
}

export function terpakai(gearId, orders, mulai, selesai) {
  if (!jadwalValid(mulai, selesai)) return 0;
  return orders.reduce((total, order) => {
    if (!STATUS_PENGURANG_STOK.includes(order.status)) return total;
    if (!intervalsOverlap(order.waktuAmbil, order.waktuKembaliJadwal, mulai, selesai)) return total;
    return total + (order.items || []).filter((i) => i.gearId === gearId).reduce((s, i) => s + i.jumlah, 0);
  }, 0);
}

export function tersedia(gear, orders, mulai, selesai) {
  if (!jadwalValid(mulai, selesai)) return null;
  if (gear.kondisi === 'Perlu perawatan') return 0;
  return Math.max(0, gear.jumlahUnit - terpakai(gear.id, orders, mulai, selesai));
}

export function labelKetersediaan(gear, orders, mulai, selesai) {
  if (!jadwalValid(mulai, selesai)) {
    return { tersedia: null, teks: 'Pilih jadwal untuk melihat ketersediaan', bisa: false, perawatan: gear.kondisi === 'Perlu perawatan' };
  }
  const sisa = tersedia(gear, orders, mulai, selesai);
  if (gear.kondisi === 'Perlu perawatan') {
    return { tersedia: 0, teks: 'Perlu perawatan', bisa: false, perawatan: true };
  }
  if (sisa === 0) {
    return { tersedia: 0, teks: 'Habis di jadwal ini', bisa: false, perawatan: false };
  }
  return {
    tersedia: sisa,
    teks: sisa <= 2 ? `Tersisa ${sisa}` : `Tersedia ${sisa} unit di jadwal ini`,
    bisa: true,
    perawatan: false,
  };
}
