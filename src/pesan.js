// Ringkasan pesanan WhatsApp. Sumber: SPEC.md §5.7, AC-11, UI-10.

import { rupiah, tanggalJam } from './format.js';
import { durasiHari, rincianItem } from './waktu.js';

export function susunPesan(order, gear, config) {
  const hari = durasiHari(order.waktuAmbil, order.waktuKembaliJadwal);
  const rincian = rincianItem(order.items, gear, order.waktuAmbil, order.waktuKembaliJadwal);
  const baris = rincian.map((i) => `- ${i.nama} ×${i.jumlah} = ${rupiah(i.subtotal)}`).join('\n');
  const catatan = order.catatan ? `\nCatatan: ${order.catatan}` : '';
  return [
    'Pesanan sewa MaruemGear',
    `Kode sewa: ${order.kodeSewa}`,
    `Nama: ${order.namaPenyewa}`,
    `Jadwal: ${tanggalJam(order.waktuAmbil)} - ${tanggalJam(order.waktuKembaliJadwal)}`,
    `Durasi: ${hari} hari`,
    `Item:\n${baris}`,
    `Total biaya: ${rupiah(order.totalBiaya)}`,
    'Status awal: Menunggu Konfirmasi',
    `Jam layanan: ${config.jamLayanan}`,
  ].join('\n') + catatan;
}

export function tautanWA(teks, config) {
  const nomor = String(config.whatsappAdmin ?? '').replace(/[^\d]/g, '');
  return `https://wa.me/${nomor}?text=${encodeURIComponent(teks)}`;
}
