// Enum status, transisi, dan evaluasi otomatis. Sumber: SPEC.md §5.2, §5.3, AC-12–AC-14.

import { parseLokal, tambahMenit } from './format.js';

export const STATUS = {
  MENUNGGU: 'Menunggu Konfirmasi',
  TERBOOKING: 'Terbooking',
  TERPINJAM: 'Terpinjam',
  DIKEMBALIKAN: 'Dikembalikan',
  DIBATALKAN: 'Dibatalkan',
  KEDALUWARSA: 'Kedaluwarsa',
  TIDAK_DIAMBIL: 'Tidak Diambil',
};

export const TERMINAL = [STATUS.DIKEMBALIKAN, STATUS.DIBATALKAN, STATUS.KEDALUWARSA, STATUS.TIDAK_DIAMBIL];

export const TRANSISI = {
  [STATUS.MENUNGGU]: [STATUS.TERBOOKING, STATUS.DIBATALKAN],
  [STATUS.TERBOOKING]: [STATUS.TERPINJAM, STATUS.DIBATALKAN],
  [STATUS.TERPINJAM]: [STATUS.DIKEMBALIKAN],
  [STATUS.DIKEMBALIKAN]: [],
  [STATUS.DIBATALKAN]: [],
  [STATUS.KEDALUWARSA]: [],
  [STATUS.TIDAK_DIAMBIL]: [],
};

export function transisiDiperbolehkan(dari, ke) {
  return (TRANSISI[dari] || []).includes(ke);
}

export function evaluasiOtomatis(orders, config, sekarang = new Date()) {
  let berubah = false;
  for (const order of orders) {
    if (TERMINAL.includes(order.status) || order.status === STATUS.TERPINJAM) continue;
    const batas = parseLokal(tambahMenit(order.waktuAmbil,
      order.status === STATUS.MENUNGGU ? config.batasKedaluwarsaMenit : config.batasTidakDiambilMenit));
    if (!batas) continue;
    if (sekarang.getTime() <= batas.getTime()) continue;
    if (order.status === STATUS.MENUNGGU) order.status = STATUS.KEDALUWARSA;
    else if (order.status === STATUS.TERBOOKING) order.status = STATUS.TIDAK_DIAMBIL;
    berubah = true;
  }
  return berubah;
}

export function infoStatus(order, config, sekarang = new Date()) {
  const batas = parseLokal(tambahMenit(order.waktuKembaliJadwal, config.toleransiMenit));
  const terlambat = order.status === STATUS.TERPINJAM && !!batas && sekarang.getTime() > batas.getTime();
  const label = order.status === STATUS.MENUNGGU ? 'Menunggu' : order.status;
  return { terlambat, label, status: order.status };
}

export const IKON_STATUS = {
  [STATUS.MENUNGGU]: '◷',
  [STATUS.TERBOOKING]: '✓',
  [STATUS.TERPINJAM]: '▣',
  [STATUS.DIKEMBALIKAN]: '↩',
  [STATUS.DIBATALKAN]: '✕',
  [STATUS.KEDALUWARSA]: '✕',
  [STATUS.TIDAK_DIAMBIL]: '✕',
};
