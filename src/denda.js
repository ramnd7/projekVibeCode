// Denda keterlambatan. Sumber: SPEC.md §5.5, AC-15 sampai AC-19.

import { parseLokal, selisihMenit, rupiah, tambahMenit } from './format.js';

export function hitungDenda({ totalBiaya, durasiHari, waktuKembaliJadwal, waktuKembaliAktual, config }) {
  const tarifHarian = durasiHari > 0 ? totalBiaya / durasiHari : totalBiaya;
  const batas = tambahMenit(waktuKembaliJadwal, config.toleransiMenit);
  const telat = selisihMenit(batas, waktuKembaliAktual);
  const telatMenit = Math.max(0, telat);
  const jamDenda = Math.ceil(telatMenit / 60);
  const dendaMentah = jamDenda * (config.dendaPersenPerJam / 100) * tarifHarian;
  const plafon = (config.plafonDendaPersen / 100) * tarifHarian;
  const denda = Math.min(dendaMentah, plafon);
  const penjelasan = telatMenit === 0
    ? `Kembali dalam toleransi (sampai ${batas.slice(11)}). Denda Rp 0.`
    : `${telatMenit} menit → ${jamDenda} jam × ${config.dendaPersenPerJam}% × ${rupiah(tarifHarian)}`;
  return { telatMenit, jamDenda, tarifHarian, batas, denda, totalAkhir: totalBiaya + denda, penjelasan };
}

export function perkiraanDenda(order, config, now) {
  if (!parseLokal(order.waktuKembaliAktual)) return null;
  const hari = Math.max(1, Math.ceil(selisihMenit(order.waktuAmbil, order.waktuKembaliJadwal) / 1440));
  return hitungDenda({
    totalBiaya: order.totalBiaya,
    durasiHari: hari,
    waktuKembaliJadwal: order.waktuKembaliJadwal,
    waktuKembaliAktual: now,
    config,
  });
}
