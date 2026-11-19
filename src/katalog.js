// Halaman katalog: pencarian, filter, sorting, dan kartu gear.
// Sumber: SPEC.md M-01–M-03; UI-SPEC.md §6.3, §7.3; AC-01, AC-02, AC-05–AC-08.

import { el, tombol } from './dom.js';
import { getGear, getCart, getOrders, setCart } from './store.js';
import { KATEGORI } from './products.js';
import { labelKetersediaan } from './ketersediaan.js';
import { getJadwal, jadwalSiap } from './jadwal.js';
import { hitungBiaya } from './waktu.js';
import { rupiah } from './format.js';
import { navbar, hero, footer, panelJadwal } from './layout.js';
import { pergi } from './router.js';
import { toast } from './toast.js';
import { render } from './ui.js';

const ui = { cari: '', kategori: '(Semua)', hanyaTersedia: false, urutan: 'Unggulan' };
const jumlah = new Map();

function filterAktif() {
  return (ui.cari ? 1 : 0) + (ui.kategori !== '(Semua)' ? 1 : 0) + (ui.hanyaTersedia ? 1 : 0);
}

function resetFilter() {
  ui.cari = '';
  ui.kategori = '(Semua)';
  ui.hanyaTersedia = false;
  ui.urutan = 'Unggulan';
  render();
}

function daftarGear() {
  const gear = getGear();
  const j = getJadwal();
  const cari = ui.cari.trim().toLowerCase();
  let hasil = gear.filter((g) => {
    if (cari && !`${g.nama} ${g.deskripsi}`.toLowerCase().includes(cari)) return false;
    if (ui.kategori !== '(Semua)' && g.kategori !== ui.kategori) return false;
    if (ui.hanyaTersedia && (!jadwalSiap() || labelKetersediaan(g, getOrders(), j.waktuAmbil, j.waktuKembaliJadwal).tersedia === 0)) return false;
    return true;
  });
  if (ui.urutan === 'Harga termurah') hasil = [...hasil].sort((a, b) => a.hargaPerHari - b.hargaPerHari);
  if (ui.urutan === 'Harga termahal') hasil = [...hasil].sort((a, b) => b.hargaPerHari - a.hargaPerHari);
  if (ui.urutan === 'Nama A–Z') hasil = [...hasil].sort((a, b) => String(a.nama).localeCompare(String(b.nama), 'id'));
  return hasil;
}

function gambarGear(gear) {
  const path = String(gear.imageUrl || '');
  const sumber = path.startsWith('/') || path.startsWith('./') ? path : '/images/gear/placeholder.svg';
  const img = el('img', { kelas: 'gambar-gear', atribut: { src: sumber, alt: gear.nama, loading: 'lazy' } });
  img.addEventListener('error', () => { if (!img.src.endsWith('placeholder.svg')) img.src = '/images/gear/placeholder.svg'; });
  return img;
}

function kartuGear(gear, orders) {
  const j = getJadwal();
  const info = labelKetersediaan(gear, orders, j.waktuAmbil, j.waktuKembaliJadwal);
  const kartu = el('article', { kelas: 'kartu-gear' });
  const gambarWrap = el('div', { kelas: 'gambar-wrap' });
  gambarWrap.append(gambarGear(gear));
  kartu.append(
    gambarWrap,
    el('p', { teks: String(gear.kategori).toUpperCase(), kelas: 'label-kapital' }),
    el('h3', { teks: gear.nama }),
    el('p', { teks: `${rupiah(gear.hargaPerHari)} / hari`, kelas: 'harga' }),
  );

  if (info.perawatan) kartu.append(el('span', { teks: 'Perlu perawatan', kelas: 'badge badge-warning' }));
  if (info.tersedia !== null && info.tersedia <= 2 && info.tersedia > 0) kartu.append(el('span', { teks: info.teks, kelas: 'badge badge-warning' }));
  kartu.append(el('p', { teks: info.teks, kelas: info.bisa ? 'stok' : 'stok stok-habis' }));

  const qty = jumlah.get(gear.id) || 1;
  const angka = el('span', { teks: String(qty), kelas: 'qty-angka', atribut: { 'aria-live': 'polite' } });
  const kurang = tombol('−', { kelas: 'btn btn-kecil btn-qty', atribut: { 'aria-label': `Kurangi jumlah ${gear.nama}` }, klik: () => { jumlah.set(gear.id, Math.max(1, qty - 1)); render(); } });
  const tambah = tombol('+', {
    kelas: 'btn btn-kecil btn-qty',
    atribut: { 'aria-label': `Tambah jumlah ${gear.nama}` },
    klik: () => {
      const batas = info.tersedia === null ? 1 : info.tersedia;
      if (qty >= batas) { toast(`Maksimal ${batas} unit`); return; }
      jumlah.set(gear.id, qty + 1);
      render();
    },
  });
  const stepper = el('div', { kelas: 'stepper' });
  stepper.append(kurang, angka, tambah);
  kartu.append(stepper);

  const tambahCart = tombol(info.bisa ? 'Tambah ke keranjang' : 'Tidak tersedia', {
    kelas: 'btn btn-utama btn-penuh',
    nonaktif: !info.bisa,
    klik: () => {
      if (!jadwalSiap()) { toast('Pilih jadwal yang valid terlebih dahulu.'); return; }
      const batas = info.tersedia;
      if (qty < 1 || qty > batas) { toast(`Maksimal ${batas} unit`); return; }
      const cart = getCart();
      const items = cart.items.map((i) => ({ ...i }));
      const ada = items.find((i) => i.gearId === gear.id);
      if (ada) ada.jumlah = Math.min(batas, ada.jumlah + qty);
      else items.push({ gearId: gear.id, jumlah: qty });
      setCart({ ...cart, items, jadwal: getJadwal() });
      toast(`${gear.nama} ditambahkan ke keranjang.`);
      render();
    },
  });
  kartu.append(tambahCart);
  return kartu;
}

function sidebarFilter() {
  const panel = el('aside', { kelas: 'filter-panel' });
  panel.append(el('h2', { teks: 'Filter', kelas: 'filter-judul' }));
  panel.append(el('h3', { teks: 'Kategori', kelas: 'filter-subjudul' }));
  for (const kategori of ['(Semua)', ...KATEGORI]) {
    const pilih = el('input', { atribut: { type: 'radio', name: 'kategori', id: `kat-${kategori.replace(/\W/g, '')}`, checked: ui.kategori === kategori ? '' : null } });
    if (ui.kategori !== kategori) pilih.removeAttribute('checked');
    pilih.addEventListener('change', () => { ui.kategori = kategori; render(); });
    const label = el('label', { teks: kategori, atribut: { for: `kat-${kategori.replace(/\W/g, '')}` } });
    panel.append(el('div', { kelas: 'pilihan' }, pilih, label));
  }
  panel.append(el('h3', { teks: 'Ketersediaan', kelas: 'filter-subjudul' }));
  const cek = el('input', { atribut: { type: 'checkbox', id: 'hanya-tersedia' } });
  cek.checked = ui.hanyaTersedia;
  cek.addEventListener('change', () => { ui.hanyaTersedia = cek.checked; render(); });
  panel.append(el('div', { kelas: 'pilihan' }, cek, el('label', { teks: 'Hanya tersedia', atribut: { for: 'hanya-tersedia' } })));
  panel.append(tombol('Reset filter', { kelas: 'btn btn-sekunder btn-penuh', klik: resetFilter }));
  return panel;
}

function toolbar(hasil, total) {
  const bar = el('div', { kelas: 'toolbar' });
  const cari = el('input', { atribut: { type: 'search', id: 'cari-gear', placeholder: 'Cari gear...', 'aria-label': 'Cari gear' } });
  cari.value = ui.cari;
  cari.addEventListener('input', () => { ui.cari = cari.value; render(); });

  const urut = el('select', { atribut: { id: 'urutan-gear', 'aria-label': 'Urutkan gear' } });
  for (const pilihan of ['Unggulan', 'Harga termurah', 'Harga termahal', 'Nama A–Z']) {
    const opsi = el('option', { teks: pilihan, atribut: { value: pilihan } });
    if (ui.urutan === pilihan) opsi.selected = true;
    urut.append(opsi);
  }
  urut.addEventListener('change', () => { ui.urutan = urut.value; render(); });

  const filterBtn = tombol(`Filter (${filterAktif()})`, { kelas: 'btn btn-sekunder btn-filter', klik: () => {
    const panel = document.getElementById('filter-panel');
    if (panel) panel.hidden = !panel.hidden;
  } });
  bar.append(cari, filterBtn, urut);
  const barisHasil = el('p', { teks: `Menampilkan ${hasil.length} dari ${total} gear`, kelas: 'hasil-count', atribut: { 'aria-live': 'polite' } });
  return { bar, barisHasil };
}

function barKeranjang() {
  const cart = getCart();
  const jumlahItem = cart.items.reduce((n, i) => n + i.jumlah, 0);
  const j = getJadwal();
  const biaya = jadwalSiap() ? hitungBiaya(cart.items, getGear(), j.waktuAmbil, j.waktuKembaliJadwal).totalBiaya : 0;
  const bar = el('div', { kelas: 'bar-keranjang' });
  bar.append(
    el('span', { teks: `Keranjang: ${jumlahItem} item   ${rupiah(biaya)}`, atribut: { 'aria-live': 'polite' } }),
    tombol('Lihat keranjang', { kelas: 'btn btn-utama btn-kecil', klik: () => pergi('keranjang') }),
  );
  return bar;
}

export function renderKatalog(app) {
  const orders = getOrders();
  const gear = getGear();
  const hasil = daftarGear();
  const { bar, barisHasil } = toolbar(hasil, gear.length);

  const katalog = el('section', { id: 'katalog', kelas: 'katalog' });
  katalog.append(el('h2', { teks: 'Katalog', kelas: 'judul-bagian' }));
  const layout = el('div', { kelas: 'katalog-layout' });
  const panel = sidebarFilter();
  panel.id = 'filter-panel';
  panel.hidden = window.innerWidth < 1024;
  layout.append(panel);

  const isi = el('div', { kelas: 'katalog-isi' });
  isi.append(bar, barisHasil);
  if (jadwalSiap()) isi.append(panelJadwal({ ringkas: true }));
  const grid = el('div', { kelas: 'grid-gear' });
  if (!hasil.length) {
    grid.append(el('div', { kelas: 'empty-state' },
      el('p', { teks: 'Tidak ada gear yang cocok.' }),
      tombol('Reset filter', { kelas: 'btn btn-sekunder', klik: resetFilter }),
    ));
  } else {
    hasil.forEach((g) => grid.append(kartuGear(g, orders)));
  }
  isi.append(grid);
  layout.append(isi);
  katalog.append(layout);

  app.append(navbar('katalog'), hero(), katalog, barKeranjang(), footer());
}
