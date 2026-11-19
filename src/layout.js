// Navbar, hero, panel jadwal, footer, dan badge status.
// Sumber: UI-SPEC.md §6.4, §7.1, §7.2, §7.4, §8.1.

import { el, tombol } from './dom.js';
import { getCart, getConfig } from './store.js';
import { getJadwal, setJadwal, hariDipilih } from './jadwal.js';
import { validasiJadwal } from './validasi.js';
import { durasiHari } from './waktu.js';
import { pergi } from './router.js';
import { infoStatus, IKON_STATUS } from './status.js';
import { tautanWA } from './pesan.js';
import { toast } from './toast.js';
import { render } from './ui.js';

function jumlahCart() {
  return getCart().items.reduce((jumlah, item) => jumlah + item.jumlah, 0);
}

function tautanHalaman(teks, rute, aktif, kelas = '') {
  const a = el('a', { teks, kelas: `nav-link ${kelas} ${aktif === rute ? 'aktif' : ''}`, atribut: { href: `#/${rute}` } });
  return a;
}

export function navbar(aktif) {
  const header = el('header', { kelas: 'navbar' });

  const menuBtn = tombol('Menu', { kelas: 'btn-menu', atribut: { 'aria-label': 'Buka menu', 'aria-expanded': 'false' } });
  const menu = el('nav', { kelas: 'menu-mobile', atribut: { hidden: '' } });
  menu.append(
    tautanHalaman('Katalog', 'katalog', aktif, 'menu-item'),
    tautanHalaman('Dashboard', 'dashboard', aktif, 'menu-item'),
  );

  menuBtn.addEventListener('click', () => {
    menu.hidden = !menu.hidden;
    menuBtn.setAttribute('aria-expanded', String(!menu.hidden));
    if (!menu.hidden) menu.querySelector('a')?.focus();
  });

  const brand = el('a', { teks: 'MaruemGear', kelas: 'brand', atribut: { href: '#/katalog' } });
  const cart = tombol(`Keranjang (${jumlahCart()})`, { kelas: 'btn btn-sekunder btn-cart', klik: () => pergi('keranjang') });
  const desktop = el('nav', { kelas: 'nav-desktop' });
  desktop.append(tautanHalaman('Katalog', 'katalog', aktif));

  header.append(menuBtn, brand, desktop, cart);
  if (aktif === 'katalog') {
    const dash = tombol('Dashboard', { kelas: 'btn btn-utama btn-dash', klik: () => pergi('dashboard') });
    dash.append(el('span', { teks: 'Demo', kelas: 'chip-demo' }));
    header.append(dash);
  }
  header.append(menu);
  return header;
}

function pecah(str) {
  if (!str || str.length < 16) return { tanggal: '', jam: '' };
  return { tanggal: str.slice(0, 10), jam: str.slice(11, 16) };
}

export function panelJadwal({ ringkas = false } = {}) {
  const j = getJadwal();
  const ambil = pecah(j.waktuAmbil);
  const kembali = pecah(j.waktuKembaliJadwal);
  const kotak = el('section', { kelas: ringkas ? 'panel-jadwal panel-ringkas' : 'panel-jadwal' });

  if (ringkas) {
    kotak.append(el('span', { kelas: 'ringkas-teks', teks: `Jadwal: ${j.waktuAmbil ? `${ambil.tanggal} ${ambil.jam}` : 'belum dipilih'} → ${j.waktuKembaliJadwal ? `${kembali.tanggal} ${kembali.jam}` : '—'} · Durasi ${hariDipilih() || '—'} hari` }));
    const ubah = tombol('Ubah jadwal', { kelas: 'btn btn-sekunder btn-kecil', klik: () => document.getElementById('jadwal-ambil-tanggal')?.focus() });
    kotak.append(ubah);
    return kotak;
  }

  kotak.append(el('h2', { teks: 'Jadwal Sewa', kelas: 'panel-judul' }));
  const inputs = {};
  const buatBaris = (label, kunci, nilai) => {
    const baris = el('div', { kelas: 'baris-jadwal' });
    const tanggal = el('input', { atribut: { type: 'date', id: `jadwal-${kunci}-tanggal`, 'aria-label': `${label} tanggal` } });
    const jam = el('input', { atribut: { type: 'time', id: `jadwal-${kunci}-jam`, 'aria-label': `${label} jam` } });
    tanggal.value = nilai.tanggal;
    jam.value = nilai.jam;
    inputs[`${kunci}Tanggal`] = tanggal;
    inputs[`${kunci}Jam`] = jam;
    baris.append(el('label', { teks: label, atribut: { for: `jadwal-${kunci}-tanggal` } }), tanggal, jam);
    return baris;
  };

  // Nilai draf dibaca dari input, bukan dari state. Input tidak diganti saat diketik
  // supaya segmen tahun/jam pada kontrol bawaan browser tidak ter-reset.
  const bacaDraf = () => {
    const gabung = (kunci) => {
      const t = inputs[`${kunci}Tanggal`].value;
      const w = inputs[`${kunci}Jam`].value;
      return t && w ? `${t}T${w}` : '';
    };
    return { waktuAmbil: gabung('ambil'), waktuKembaliJadwal: gabung('kembali') };
  };

  const pesanError = el('p', { kelas: 'error', atribut: { 'aria-live': 'polite' } });
  const teksDurasi = el('p', { kelas: 'durasi', atribut: { 'aria-live': 'polite' } });

  const perbaruiPratinjau = () => {
    const draf = bacaDraf();
    const lengkap = Boolean(draf.waktuAmbil && draf.waktuKembaliJadwal);
    const pesan = validasiJadwal(draf.waktuAmbil, draf.waktuKembaliJadwal);
    pesanError.textContent = lengkap && pesan ? `! ${pesan}` : '';
    teksDurasi.textContent = `Durasi: ${!pesan ? durasiHari(draf.waktuAmbil, draf.waktuKembaliJadwal) : '—'} hari`;
  };

  Object.values(inputs).forEach((input) => input.addEventListener('input', perbaruiPratinjau));

  const terapkan = tombol('Terapkan jadwal', {
    kelas: 'btn btn-utama btn-kecil',
    klik: () => {
      const draf = bacaDraf();
      const pesan = validasiJadwal(draf.waktuAmbil, draf.waktuKembaliJadwal);
      if (pesan) {
        pesanError.textContent = `! ${pesan}`;
        toast(pesan);
        return;
      }
      setJadwal(draf);
      toast('Jadwal diterapkan.');
      render();
    },
  });

  kotak.append(
    buatBaris('Ambil', 'ambil', ambil),
    buatBaris('Kembali', 'kembali', kembali),
    pesanError,
    teksDurasi,
    terapkan,
  );
  perbaruiPratinjau();
  return kotak;
}

export function hero() {
  const section = el('section', { kelas: 'hero' });
  const copy = el('div', { kelas: 'hero-copy' });
  copy.append(
    el('p', { teks: 'SEWA GEAR HIKING', kelas: 'kicker' }),
    el('h1', { teks: 'Sewa perlengkapan hiking per hari.' }),
    el('p', { teks: 'Pilih gear, tentukan jadwal, pesan lewat WhatsApp.' }),
    tombol('Lihat Katalog', {
      kelas: 'btn btn-utama',
      klik: () => document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' }),
    }),
  );
  section.append(copy, panelJadwal());
  return section;
}

export function footer() {
  const config = getConfig();
  const footerEl = el('footer', { kelas: 'footer' });
  const wa = el('a', {
    teks: 'Tanya admin lewat WhatsApp',
    kelas: 'nav-link',
    atribut: { href: tautanWA('Halo, saya ingin bertanya tentang sewa gear.', config), target: '_blank', rel: 'noopener' },
  });
  footerEl.append(wa, el('span', { teks: `Jam layanan ${config.jamLayanan}` }), el('span', { teks: 'Mode Demo' }));
  return footerEl;
}

export function bannerDemo() {
  return el('div', { kelas: 'banner-demo', teks: '⚠ Mode demo: tanpa login. Data hanya tersimpan di browser ini.' });
}

export function badgeStatus(order, config) {
  const info = infoStatus(order, config);
  const grup = el('span', { kelas: 'badge-grup' });
  grup.append(el('span', { kelas: `badge badge-${info.label.toLowerCase().replace(/\s+/g, '-')}`, teks: `${IKON_STATUS[order.status] || '•'} ${info.label}` }));
  if (info.terlambat) grup.append(el('span', { kelas: 'badge badge-terlambat', teks: '⚠ Terlambat' }));
  return grup;
}
