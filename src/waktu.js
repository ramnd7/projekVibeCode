// Aturan waktu, durasi, dan biaya sewa. Sumber: SPEC.md §5.1, AC-03, AC-04.

import { selisihMenit } from './format.js';

export function jadwalValid(mulai, selesai) {
  if (!mulai || !selesai) return false;
  return selisihMenit(mulai, selesai) > 0;
}

export function durasiMenit(mulai, selesai) {
  return jadwalValid(mulai, selesai) ? selisihMenit(mulai, selesai) : 0;
}

export function durasiHari(mulai, selesai) {
  return Math.max(1, Math.ceil(durasiMenit(mulai, selesai) / 1440));
}

// items: [{ gearId, jumlah }]; gear: array gear dari repository.
export function hitungBiaya(items, gear, mulai, selesai) {
  const hari = durasiHari(mulai, selesai);
  let tarifHarian = 0;
  for (const item of items) {
    const g = gear.find((x) => x.id === item.gearId);
    if (g) tarifHarian += g.hargaPerHari * item.jumlah;
  }
  return { durasiHari: hari, tarifHarian, totalBiaya: tarifHarian * hari };
}

export function rincianItem(items, gear, mulai, selesai) {
  const hari = durasiHari(mulai, selesai);
  return items.map((item) => {
    const g = gear.find((x) => x.id === item.gearId);
    return {
      gearId: item.gearId,
      nama: g ? g.nama : item.gearId,
      jumlah: item.jumlah,
      hargaPerHari: g ? g.hargaPerHari : 0,
      subtotal: (g ? g.hargaPerHari : 0) * item.jumlah * hari,
    };
  });
}
