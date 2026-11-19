// Halaman keranjang multi-item dan form pesanan. Sumber: UI-SPEC.md §7.4, SPEC.md M-06, M-07.

import { el, tombol, bidang } from './dom.js';
import { getCart, setCart, getGear, getOrders, getConfig, nomorSewaBerikut } from './store.js';
import { tersedia } from './ketersediaan.js';
import { getJadwal, jadwalSiap } from './jadwal.js';
import { hitungBiaya, rincianItem, durasiHari } from './waktu.js';
import { rupiah, tanggalJam } from './format.js';
import { navbar, footer, panelJadwal } from './layout.js';
import { pergi } from './router.js';
import { toast } from './toast.js';
import { konfirmasi } from './dialog.js';
import { susunPesan } from './pesan.js';
import { cekPengiriman, buatDanKirim } from './pesanan.js';
import { render } from './ui.js';

const form = { namaPenyewa: '', catatan: '' };
let pratinjauTerbuka = false;
let ubahJadwalTerbuka = false;

function simpanItem(items) {
  setCart({ ...getCart(), items, jadwal: getJadwal() });
  render();
}

function daftarItem(cek) {
  const cart = getCart();
  const gear = getGear();
  const orders = getOrders();
  const j = getJadwal();
  const hari = jadwalSiap() ? durasiHari(j.waktuAmbil, j.waktuKembaliJadwal) : 0;
  const daftar = el('div', { kelas: 'daftar-item' });

  if (!cart.items.length) {
    daftar.append(el('p', { teks: 'Keranjang masih kosong.' }));
    return daftar;
  }

  for (const item of cart.items) {
    const g = gear.find((x) => x.id === item.gearId);
    const nama = g ? g.nama : item.gearId;
    const sisa = jadwalSiap() && g ? tersedia(g, orders, j.waktuAmbil, j.waktuKembaliJadwal) : null;
    const bermasalah = cek.itemBermasalah.includes(item.gearId);
    const kartu = el('article', { kelas: `item-keranjang ${bermasalah ? 'item-error' : ''}` });
    kartu.append(
      el('h3', { teks: nama }),
      el('p', { teks: `${rupiah(g ? g.hargaPerHari : 0)} × ${hari} hari = ${rupiah((g ? g.hargaPerHari : 0) * item.jumlah * hari)}` }),
    );
    if (bermasalah) kartu.append(el('p', { kelas: 'error', teks: `! Stok tidak cukup pada jadwal ini (maksimal ${sisa ?? 0} unit).` }));

    const angka = el('span', { teks: String(item.jumlah), kelas: 'qty-angka' });
    const kurang = tombol('−', { kelas: 'btn btn-kecil btn-qty', atribut: { 'aria-label': `Kurangi ${nama}` }, klik: () => {
      const items = getCart().items.map((i) => i === item ? { ...i, jumlah: Math.max(1, i.jumlah - 1) } : i);
      simpanItem(items);
    } });
    const maks = sisa ?? 0;
    const tambah = tombol('+', { kelas: 'btn btn-kecil btn-qty', atribut: { 'aria-label': `Tambah ${nama}` }, klik: () => {
      if (item.jumlah >= maks) { toast(`Maksimal ${maks} unit`); return; }
      const items = getCart().items.map((i) => i === item ? { ...i, jumlah: i.jumlah + 1 } : i);
      simpanItem(items);
    } });
    const stepper = el('div', { kelas: 'stepper' });
    stepper.append(kurang, angka, tambah);
    const hapus = tombol('Hapus', { kelas: 'btn btn-bahaya btn-kecil', klik: async () => {
      const yakin = await konfirmasi({ judul: 'Hapus item?', pesan: `${nama} akan dikeluarkan dari keranjang.`, teksAksi: 'Hapus', bahaya: true });
      if (yakin) simpanItem(getCart().items.filter((i) => i !== item));
    } });
    kartu.append(stepper, hapus);
    daftar.append(kartu);
  }
  return daftar;
}

export function renderKeranjang(app) {
  const cart = getCart();
  const j = getJadwal();
  const cek = cekPengiriman(cart, form);
  const hitung = jadwalSiap() ? hitungBiaya(cart.items, getGear(), j.waktuAmbil, j.waktuKembaliJadwal) : { durasiHari: 0, tarifHarian: 0, totalBiaya: 0 };
  const rincian = jadwalSiap() ? rincianItem(cart.items, getGear(), j.waktuAmbil, j.waktuKembaliJadwal) : [];

  const utama = el('main', { kelas: 'halaman-keranjang' });
  utama.append(tombol('‹ Kembali ke katalog', { kelas: 'btn btn-teks', klik: () => pergi('katalog') }));
  utama.append(el('h1', { teks: `Keranjang (${cart.items.length} item)` }));

  const jadwalBox = el('section', { kelas: 'box' });
  jadwalBox.append(el('h2', { teks: 'Jadwal', kelas: 'judul-bagian' }));
  if (j.waktuAmbil) jadwalBox.append(el('p', { teks: `${tanggalJam(j.waktuAmbil)} - ${tanggalJam(j.waktuKembaliJadwal)}` }));
  jadwalBox.append(el('p', { teks: `Durasi ${hitung.durasiHari} hari` }));
  jadwalBox.append(tombol(ubahJadwalTerbuka ? 'Tutup jadwal' : 'Ubah jadwal', { kelas: 'btn btn-sekunder btn-kecil', klik: () => { ubahJadwalTerbuka = !ubahJadwalTerbuka; render(); } }));
  if (ubahJadwalTerbuka) jadwalBox.append(panelJadwal());
  utama.append(jadwalBox);

  const boxItem = el('section', { kelas: 'box' });
  boxItem.append(el('h2', { teks: 'Item sewa', kelas: 'judul-bagian' }), daftarItem(cek));
  utama.append(boxItem);

  const inputNama = el('input', { atribut: { type: 'text', id: 'nama-penyewa', maxlength: '60', autocomplete: 'name' } });
  inputNama.value = form.namaPenyewa;
  inputNama.addEventListener('input', () => { form.namaPenyewa = inputNama.value; perbaruiTombol(); });
  const inputCatatan = el('textarea', { atribut: { id: 'catatan-penyewa', rows: '3', maxlength: '300' } });
  inputCatatan.value = form.catatan;
  inputCatatan.addEventListener('input', () => { form.catatan = inputCatatan.value; perbaruiTombol(); });

  const formBox = el('section', { kelas: 'box' });
  formBox.append(
    bidang('Nama penyewa', inputNama, { wajib: true, id: 'nama-penyewa' }),
    bidang('Catatan', inputCatatan, { id: 'catatan-penyewa' }),
  );
  utama.append(formBox);

  const rincianBox = el('section', { kelas: 'box' });
  rincianBox.append(el('h2', { teks: 'Rincian biaya', kelas: 'judul-bagian' }));
  rincian.forEach((i) => rincianBox.append(el('p', { teks: `${i.nama} ×${i.jumlah} — ${rupiah(i.subtotal)}` })));
  rincianBox.append(el('p', { kelas: 'total', teks: `Subtotal sewa ${rupiah(hitung.totalBiaya)}`, atribut: { 'aria-live': 'polite' } }));
  rincianBox.append(el('p', { teks: 'Status awal: Menunggu Konfirmasi.' }));
  utama.append(rincianBox);

  const alasan = el('p', { kelas: cek.bisa ? 'alasan-kirim' : 'error', teks: cek.bisa ? 'Pesanan siap dikirim.' : `Belum bisa kirim: ${cek.alasan.join(' ')}` });
  const kirim = tombol('Kirim Pesanan via WhatsApp', {
    kelas: 'btn btn-utama btn-penuh',
    nonaktif: !cek.bisa,
    klik: () => {
      const ulang = cekPengiriman(getCart(), form);
      if (!ulang.bisa) { toast(`Belum bisa kirim: ${ulang.alasan.join(' ')}`); return; }
      const order = buatDanKirim(getCart(), form);
      form.namaPenyewa = '';
      form.catatan = '';
      pratinjauTerbuka = false;
      ubahJadwalTerbuka = false;
      toast(`Pesanan ${order.kodeSewa} tercatat dengan status Menunggu Konfirmasi`);
      render();
    },
  });
  function perbaruiTombol() {
    const hasil = cekPengiriman(getCart(), form);
    kirim.disabled = !hasil.bisa;
    alasan.textContent = hasil.bisa ? 'Pesanan siap dikirim.' : `Belum bisa kirim: ${hasil.alasan.join(' ')}`;
    alasan.className = hasil.bisa ? 'alasan-kirim' : 'error';
  }
  const pratinjauBtn = tombol(pratinjauTerbuka ? 'Sembunyikan isi pesan' : 'Lihat isi pesan', { kelas: 'btn btn-teks', klik: () => { pratinjauTerbuka = !pratinjauTerbuka; render(); } });
  const kirimBox = el('section', { kelas: 'box' });
  kirimBox.append(pratinjauBtn);
  if (pratinjauTerbuka) {
    const sementara = {
      kodeSewa: nomorSewaBerikut(),
      namaPenyewa: form.namaPenyewa || '(nama penyewa)',
      waktuAmbil: j.waktuAmbil,
      waktuKembaliJadwal: j.waktuKembaliJadwal,
      items: cart.items,
      totalBiaya: hitung.totalBiaya,
      catatan: form.catatan,
    };
    kirimBox.append(el('pre', { kelas: 'pratinjau', teks: susunPesan(sementara, getGear(), getConfig()) }));
  }
  kirimBox.append(alasan, kirim);
  utama.append(kirimBox);

  app.append(navbar('keranjang'), utama, footer());
}
