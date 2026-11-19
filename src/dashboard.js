// Dashboard Mode Demo: ringkasan, pesanan, gear, dan pengaturan.
// Sumber: UI-SPEC.md §8; SPEC.md M-09–M-11, S-01–S-08; AC-12–AC-25.

import { el, tombol, bidang } from './dom.js';
import {
  getState, getGear, getOrders, getConfig, setConfig,
  tambahGear, ubahGear, hapusGear, resetState, eksporData, imporData, ubahOrder,
} from './store.js';
import { KATEGORI, KONDISI } from './products.js';
import { STATUS, TRANSISI, TERMINAL, transisiDiperbolehkan, infoStatus } from './status.js';
import { tersedia } from './ketersediaan.js';
import { hitungDenda } from './denda.js';
import { validasiGear } from './validasi.js';
import { rupiah, tanggalJam, keLokal } from './format.js';
import { durasiHari } from './waktu.js';
import { navbar, footer, bannerDemo, badgeStatus } from './layout.js';
import { pergi } from './router.js';
import { toast } from './toast.js';
import { konfirmasi } from './dialog.js';
import { render } from './ui.js';

const ui = { tab: 'ringkasan', filter: 'Semua', cari: '', formGear: null };

const TAB = [
  { id: 'ringkasan', label: 'Ringkasan' },
  { id: 'pesanan', label: 'Pesanan' },
  { id: 'gear', label: 'Kelola gear' },
  { id: 'pengaturan', label: 'Lainnya' },
];

function gantiTab(tab) { ui.tab = tab; render(); }

function sidebar() {
  const nav = el('nav', { kelas: 'sidebar' });
  nav.append(el('a', { teks: 'MaruemGear', kelas: 'brand', atribut: { href: '#/katalog' } }));
  nav.append(el('p', { teks: 'Dashboard', kelas: 'sidebar-judul' }));
  for (const item of TAB) {
    const teks = item.id === 'pengaturan' ? 'Pengaturan' : item.label;
    nav.append(tombol(teks, { kelas: `sidebar-item ${ui.tab === item.id ? 'aktif' : ''}`, klik: () => gantiTab(item.id) }));
  }
  nav.append(tombol('Ke katalog', { kelas: 'btn btn-sekunder btn-penuh', klik: () => pergi('katalog') }));
  return nav;
}

function tabBar() {
  const bar = el('nav', { kelas: 'tab-bar' });
  TAB.forEach((item) => bar.append(tombol(item.label, { kelas: `tab-item ${ui.tab === item.id ? 'aktif' : ''}`, klik: () => gantiTab(item.id) })));
  return bar;
}

function kartuAngka(judul, angka, keterangan, bahaya = false) {
  return el('article', { kelas: `kartu-angka ${bahaya && angka > 0 ? 'kartu-bahaya' : ''}` },
    el('p', { teks: judul, kelas: 'kartu-label' }),
    el('p', { teks: String(angka), kelas: 'kartu-nilai' }),
    el('p', { teks: keterangan, kelas: 'kartu-ket' }),
  );
}

// Satu aksi manual admin untuk mengubah status sewa gear (SPEC.md §4.2 `kondisi`).
async function toggleKondisiGear(g) {
  const perawatan = g.kondisi === 'Perlu perawatan';
  const dipakai = getOrders().some((o) =>
    [STATUS.MENUNGGU, STATUS.TERBOOKING, STATUS.TERPINJAM].includes(o.status)
    && o.items.some((i) => i.gearId === g.id));
  const yakin = await konfirmasi({
    judul: perawatan ? 'Tandai siap disewa?' : 'Tandai perlu perawatan?',
    pesan: perawatan
      ? `${g.nama} akan tampil lagi di katalog dan bisa disewa pada jadwal yang tersedia.`
      : `${g.nama} akan dikeluarkan dari pilihan sewa.${dipakai ? ' Pesanan aktif yang sudah memakainya tetap berjalan.' : ''}`,
    teksAksi: perawatan ? 'Tandai siap sewa' : 'Tandai perawatan',
  });
  if (!yakin) return;
  ubahGear(g.id, { kondisi: perawatan ? 'Baik' : 'Perlu perawatan' });
  toast(perawatan ? `${g.nama} siap disewa.` : `${g.nama} ditandai perlu perawatan.`);
  render();
}

function badgeKondisi(g) {
  const perawatan = g.kondisi === 'Perlu perawatan';
  return el('span', {
    kelas: `badge ${perawatan ? 'badge-warning' : 'badge-terbooking'}`,
    teks: perawatan ? 'Perlu perawatan' : 'Siap disewa',
  });
}

function ringkasan() {
  const orders = getOrders();
  const config = getConfig();
  const aktif = orders.filter((o) => [STATUS.MENUNGGU, STATUS.TERBOOKING, STATUS.TERPINJAM].includes(o.status));
  const perluKonfirmasi = orders.filter((o) => o.status === STATUS.MENUNGGU).length;
  const hariIni = keLokal(new Date()).slice(0, 10);
  const ambilHariIni = orders.filter((o) => o.waktuAmbil.slice(0, 10) === hariIni && !TERMINAL.includes(o.status)).length;
  const kembaliHariIni = orders.filter((o) => o.waktuKembaliJadwal.slice(0, 10) === hariIni && !TERMINAL.includes(o.status)).length;
  const terlambat = orders.filter((o) => infoStatus(o, config).terlambat).length;
  const pendapatan = orders.filter((o) => o.status === STATUS.DIKEMBALIKAN)
    .reduce((n, o) => n + (o.totalAkhir ?? o.totalBiaya ?? 0), 0);

  const section = el('section', { kelas: 'dashboard-section' });
  section.append(el('h2', { teks: 'Ringkasan', kelas: 'judul-bagian' }));
  const grid = el('div', { kelas: 'grid-ringkasan' });
  grid.append(
    kartuAngka('Total gear', getGear().length, `${getGear().filter((g) => g.kondisi === 'Perlu perawatan').length} perlu perawatan`),
    kartuAngka('Pesanan aktif', aktif.length, `${perluKonfirmasi} perlu konfirmasi`),
    kartuAngka('Estimasi pendapatan', rupiah(pendapatan), 'dari pesanan kembali'),
    kartuAngka('Ambil / kembali hari ini', `${ambilHariIni} / ${kembaliHariIni}`, 'berdasarkan jadwal'),
    kartuAngka('Terlambat', terlambat, 'lewat toleransi', true),
  );
  section.append(grid);

  const statusBox = el('section', { kelas: 'box status-gear-cepat' });
  statusBox.append(el('h2', { teks: 'Ubah status ketersediaan gear', kelas: 'judul-bagian' }));
  statusBox.append(el('p', { kelas: 'rumus', teks: 'Tombol ini mengubah status manual. Sisa unit tetap dihitung otomatis dari jadwal dan pesanan aktif.' }));
  const daftar = el('div', { kelas: 'daftar-status-gear' });
  getGear().forEach((g) => {
    const perawatan = g.kondisi === 'Perlu perawatan';
    const baris = el('div', { kelas: 'baris-status-gear' });
    baris.append(
      el('span', { teks: g.nama, kelas: 'nama-status-gear' }),
      badgeKondisi(g),
      tombol(perawatan ? 'Siap sewa' : 'Perawatan', {
        kelas: perawatan ? 'btn btn-utama btn-kecil' : 'btn btn-sekunder btn-kecil',
        klik: () => toggleKondisiGear(g),
      }),
    );
    daftar.append(baris);
  });
  statusBox.append(daftar);
  section.append(statusBox);
  return section;
}

function aksiUtama(order) {
  if (order.status === STATUS.MENUNGGU) return tombol('Konfirmasi', { kelas: 'btn btn-utama btn-kecil', klik: () => prosesStatus(order, STATUS.TERBOOKING) });
  if (order.status === STATUS.TERBOOKING) return tombol('Tandai diambil', { kelas: 'btn btn-utama btn-kecil', klik: () => prosesStatus(order, STATUS.TERPINJAM) });
  if (order.status === STATUS.TERPINJAM) return tombol('Tandai dikembalikan', { kelas: 'btn btn-utama btn-kecil', klik: () => bukaDetail(order) });
  return tombol('Detail', { kelas: 'btn btn-sekunder btn-kecil', klik: () => bukaDetail(order) });
}

async function prosesStatus(order, ke, waktuKembaliAktual) {
  if (!transisiDiperbolehkan(order.status, ke)) { toast('Transisi status tidak diizinkan.'); return; }
  const patch = { status: ke };
  if (ke === STATUS.DIKEMBALIKAN) {
    const aktual = waktuKembaliAktual || keLokal(new Date());
    const hari = durasiHari(order.waktuAmbil, order.waktuKembaliJadwal);
    const hasil = hitungDenda({
      totalBiaya: order.totalBiaya,
      durasiHari: hari,
      waktuKembaliJadwal: order.waktuKembaliJadwal,
      waktuKembaliAktual: aktual,
      config: getConfig(),
    });
    patch.waktuKembaliAktual = aktual;
    patch.denda = hasil.denda;
    patch.totalAkhir = hasil.totalAkhir;
  }
  ubahOrder(order.id, patch);
  toast(`Status ${order.kodeSewa} menjadi ${ke}.`);
  render();
}

function daftarPesanan() {
  const orders = getOrders();
  const config = getConfig();
  let hasil = orders.filter((o) => {
    if (ui.filter === 'Aktif') return [STATUS.MENUNGGU, STATUS.TERBOOKING, STATUS.TERPINJAM].includes(o.status);
    if (ui.filter === 'Selesai') return o.status === STATUS.DIKEMBALIKAN;
    if (ui.filter === 'Batal') return [STATUS.DIBATALKAN, STATUS.KEDALUWARSA, STATUS.TIDAK_DIAMBIL].includes(o.status);
    return true;
  });
  const cari = ui.cari.trim().toLowerCase();
  if (cari) hasil = hasil.filter((o) => `${o.kodeSewa} ${o.namaPenyewa}`.toLowerCase().includes(cari));

  const section = el('section', { kelas: 'dashboard-section' });
  section.append(el('h2', { teks: 'Pesanan', kelas: 'judul-bagian' }));
  const kontrol = el('div', { kelas: 'kontrol-pesanan' });
  const inputCari = el('input', { atribut: { type: 'search', id: 'cari-pesanan', placeholder: 'Cari kode / nama...', 'aria-label': 'Cari kode atau nama penyewa' } });
  inputCari.value = ui.cari;
  inputCari.addEventListener('input', () => { ui.cari = inputCari.value; render(); });
  const pilihan = el('select', { atribut: { id: 'filter-status', 'aria-label': 'Filter status' } });
  ['Semua', 'Aktif', 'Selesai', 'Batal'].forEach((s) => {
    const o = el('option', { teks: s, atribut: { value: s } });
    if (ui.filter === s) o.selected = true;
    pilihan.append(o);
  });
  pilihan.addEventListener('change', () => { ui.filter = pilihan.value; render(); });
  kontrol.append(inputCari, pilihan);
  section.append(kontrol, el('p', { teks: `Menampilkan ${hasil.length} dari ${orders.length} pesanan` }));

  if (!hasil.length) {
    section.append(el('p', { teks: 'Belum ada pesanan yang cocok.' }));
    return section;
  }

  const tabel = el('table', { kelas: 'tabel-pesanan' });
  const head = el('tr');
  ['Kode', 'Penyewa', 'Ambil–kembali', 'Total', 'Status', 'Aksi'].forEach((t) => head.append(el('th', { teks: t })));
  const thead = el('thead'); thead.append(head); tabel.append(thead);
  const tbody = el('tbody');
  hasil.forEach((o) => {
    const tr = el('tr', { kelas: 'baris-klik' });
    tr.append(
      el('td', { teks: o.kodeSewa }),
      el('td', { teks: o.namaPenyewa }),
      el('td', { teks: `${tanggalJam(o.waktuAmbil)} – ${tanggalJam(o.waktuKembaliJadwal)}` }),
      el('td', { teks: rupiah(o.totalAkhir ?? o.totalBiaya) }),
    );
    const tdStatus = el('td'); tdStatus.append(badgeStatus(o, config)); tr.append(tdStatus);
    const tdAksi = el('td'); tdAksi.append(aksiUtama(o), tombol('Detail', { kelas: 'btn btn-teks btn-kecil', klik: () => bukaDetail(o) })); tr.append(tdAksi);
    tbody.append(tr);
  });
  tabel.append(tbody);
  const wadahTabel = el('div', { kelas: 'tabel-scroll' });
  wadahTabel.append(tabel);
  section.append(wadahTabel);
  return section;
}

function bukaDetail(order) {
  const pemicu = document.activeElement;
  const config = getConfig();
  const dialog = el('dialog', { kelas: 'dialog dialog-detail' });
  const tutup = tombol('Tutup', { kelas: 'btn btn-sekunder btn-kecil', atribut: { 'aria-label': 'Tutup detail' }, klik: () => dialog.close() });
  const header = el('div', { kelas: 'dialog-header' }, el('h2', { teks: `Detail pesanan ${order.kodeSewa}` }), tutup);
  dialog.append(header, el('p', { teks: `Penyewa: ${order.namaPenyewa}` }), el('p', { teks: `Jadwal: ${tanggalJam(order.waktuAmbil)} – ${tanggalJam(order.waktuKembaliJadwal)}` }));
  const statusWrap = el('div', { kelas: 'dialog-status' });
  statusWrap.append(badgeStatus(order, config));
  dialog.append(statusWrap);

  const tabel = el('table', { kelas: 'tabel-rincian' });
  const head = el('tr');
  ['Item', 'Qty', 'Subtotal'].forEach((t) => head.append(el('th', { teks: t })));
  const thead = el('thead'); thead.append(head); tabel.append(thead);
  const tbody = el('tbody');
  const hari = durasiHari(order.waktuAmbil, order.waktuKembaliJadwal);
  order.items.forEach((i) => {
    const g = getGear().find((x) => x.id === i.gearId);
    const tr = el('tr');
    tr.append(
      el('td', { teks: g ? g.nama : i.gearId }),
      el('td', { teks: String(i.jumlah) }),
      el('td', { teks: rupiah((g ? g.hargaPerHari : 0) * i.jumlah * hari) }),
    );
    tbody.append(tr);
  });
  tabel.append(tbody);
  dialog.append(tabel, el('p', { teks: `Subtotal sewa ${rupiah(order.totalBiaya)}` }));

  if (order.status === STATUS.TERPINJAM) {
    const sekarang = keLokal(new Date());
    const perkiraan = hitungDenda({
      totalBiaya: order.totalBiaya,
      durasiHari: hari,
      waktuKembaliJadwal: order.waktuKembaliJadwal,
      waktuKembaliAktual: sekarang,
      config,
    });
    dialog.append(el('p', { teks: `Denda keterlambatan (perkiraan): ${rupiah(perkiraan.denda)}` }));
    dialog.append(el('p', { kelas: 'rumus', teks: perkiraan.penjelasan }));
    dialog.append(el('p', { teks: `Perkiraan total akhir: ${rupiah(perkiraan.totalAkhir)}` }));
  } else if (order.status === STATUS.DIKEMBALIKAN) {
    dialog.append(el('p', { teks: `Denda: ${rupiah(order.denda || 0)}` }), el('p', { teks: `Total akhir: ${rupiah(order.totalAkhir ?? order.totalBiaya)}` }));
  }

  if (order.status === STATUS.TERPINJAM) {
    const inputWaktu = el('input', { atribut: { type: 'datetime-local', id: 'waktu-kembali-aktual', 'aria-label': 'Waktu kembali aktual' } });
    inputWaktu.value = keLokal(new Date());
    dialog.append(bidang('Waktu kembali aktual', inputWaktu, { id: 'waktu-kembali-aktual' }));
    dialog.append(tombol('Tandai dikembalikan', { kelas: 'btn btn-utama', klik: async () => {
      const hasil = hitungDenda({
        totalBiaya: order.totalBiaya,
        durasiHari: hari,
        waktuKembaliJadwal: order.waktuKembaliJadwal,
        waktuKembaliAktual: inputWaktu.value || keLokal(new Date()),
        config,
      });
      const yakin = await konfirmasi({
        judul: 'Tandai dikembalikan?',
        pesan: `Denda ${rupiah(hasil.denda)}. Total akhir ${rupiah(hasil.totalAkhir)}. Status tidak bisa diubah setelah ini.`,
        teksAksi: 'Tandai dikembalikan',
      });
      if (!yakin) return;
      dialog.close();
      await prosesStatus(order, STATUS.DIKEMBALIKAN, inputWaktu.value || keLokal(new Date()));
    } }));
  } else if (transisiDiperbolehkan(order.status, STATUS.DIBATALKAN)) {
    dialog.append(tombol('Batalkan pesanan', { kelas: 'btn btn-bahaya', klik: async () => {
      const yakin = await konfirmasi({ judul: 'Batalkan pesanan?', pesan: `Pesanan ${order.kodeSewa} dibatalkan dan unitnya dilepaskan.`, teksAksi: 'Batalkan', bahaya: true });
      if (!yakin) return;
      dialog.close();
      await prosesStatus(order, STATUS.DIBATALKAN);
    } }));
  }

  dialog.addEventListener('close', () => {
    dialog.remove();
    if (pemicu && typeof pemicu.focus === 'function') pemicu.focus();
  });
  document.body.append(dialog);
  dialog.showModal();
}

function formGearDialog(gear) {
  const pemicu = document.activeElement;
  const dialog = el('dialog', { kelas: 'dialog' });
  const dia = ui.formGear || (gear ? { ...gear } : { nama: '', kategori: KATEGORI[0], hargaPerHari: '', jumlahUnit: '', kondisi: KONDISI[0], deskripsi: '', imageUrl: '' });
  ui.formGear = dia;
  dialog.append(el('h2', { teks: gear ? 'Ubah gear' : 'Tambah gear' }));
  const inputs = {};
  const buat = (label, kunci, tipe = 'text', wajib = true) => {
    const input = el('input', { atribut: { type: tipe, id: `gear-${kunci}` } });
    input.value = dia[kunci] ?? '';
    input.addEventListener('input', () => { dia[kunci] = tipe === 'number' ? input.value : input.value; });
    inputs[kunci] = input;
    return bidang(label, input, { wajib, id: `gear-${kunci}` });
  };
  const kategori = el('select', { atribut: { id: 'gear-kategori' } });
  KATEGORI.forEach((k) => {
    const o = el('option', { teks: k, atribut: { value: k } });
    if (dia.kategori === k) o.selected = true;
    kategori.append(o);
  });
  kategori.addEventListener('change', () => { dia.kategori = kategori.value; });
  const kondisi = el('select', { atribut: { id: 'gear-kondisi' } });
  KONDISI.forEach((k) => {
    const o = el('option', { teks: k, atribut: { value: k } });
    if (dia.kondisi === k) o.selected = true;
    kondisi.append(o);
  });
  kondisi.addEventListener('change', () => { dia.kondisi = kondisi.value; });
  const areaError = el('div', { kelas: 'error-box' });

  dialog.append(
    buat('Nama gear', 'nama'),
    bidang('Kategori', kategori, { wajib: true, id: 'gear-kategori' }),
    buat('Harga per hari (Rp)', 'hargaPerHari', 'number'),
    buat('Jumlah unit', 'jumlahUnit', 'number'),
    bidang('Kondisi / status sewa', kondisi, { wajib: true, id: 'gear-kondisi' }),
    buat('Deskripsi', 'deskripsi', 'text', false),
    buat('Gambar (path lokal)', 'imageUrl', 'text', false),
    areaError,
    el('div', { kelas: 'dialog-aksi' },
      tombol('Batal', { kelas: 'btn btn-sekunder', klik: () => dialog.close() }),
      tombol('Simpan', { kelas: 'btn btn-utama', klik: () => {
        const payload = { ...dia, hargaPerHari: Number(dia.hargaPerHari), jumlahUnit: Number(dia.jumlahUnit) };
        const errors = validasiGear(payload);
        areaError.replaceChildren();
        if (Object.keys(errors).length) {
          Object.values(errors).forEach((pesan) => areaError.append(el('p', { kelas: 'error', teks: `! ${pesan}` })));
          return;
        }
        if (gear) ubahGear(gear.id, payload); else tambahGear(payload);
        ui.formGear = null;
        dialog.close();
        toast(gear ? 'Gear diperbarui.' : 'Gear ditambahkan.');
        render();
      } }),
    ),
  );
  dialog.addEventListener('close', () => {
    dialog.remove();
    ui.formGear = null;
    if (pemicu && typeof pemicu.focus === 'function') pemicu.focus();
  });
  document.body.append(dialog);
  dialog.showModal();
}

function daftarGearSection() {
  const gear = getGear();
  const orders = getOrders();
  const section = el('section', { kelas: 'dashboard-section' });
  section.append(el('h2', { teks: `Gear (${gear.length} jenis, ${gear.reduce((n, g) => n + g.jumlahUnit, 0)} unit)`, kelas: 'judul-bagian' }));
  const aksiWrap = el('div', { kelas: 'kontrol-pesanan' });
  aksiWrap.append(
    tombol('+ Tambah gear', { kelas: 'btn btn-utama btn-kecil', klik: () => formGearDialog(null) }),
    tombol('Reset data contoh', { kelas: 'btn btn-sekunder btn-kecil', klik: async () => {
      const yakin = await konfirmasi({ judul: 'Reset data contoh?', pesan: 'Seluruh gear, pesanan, dan pengaturan akan kembali ke nilai awal.', teksAksi: 'Reset', bahaya: true });
      if (yakin) { resetState(); toast('Data contoh dikembalikan.'); render(); }
    } }),
    tombol('Ekspor JSON', { kelas: 'btn btn-sekunder btn-kecil', klik: () => unduhJSON() }),
  );
  const fileImpor = el('input', { atribut: { type: 'file', accept: 'application/json', id: 'impor-json' } });
  fileImpor.addEventListener('change', async () => {
    const file = fileImpor.files?.[0];
    if (!file) return;
    const teks = await file.text();
    if (imporData(teks)) { toast('Data berhasil diimpor.'); render(); }
    else toast('File JSON tidak valid. Data lama tidak diubah.');
  });
  const labelImpor = el('label', { teks: 'Impor JSON', kelas: 'btn btn-sekunder btn-kecil', atribut: { for: 'impor-json' } });
  aksiWrap.append(labelImpor, fileImpor);
  section.append(aksiWrap);

  section.append(el('p', { kelas: 'rumus', teks: 'Status manual menentukan apakah gear bisa disewa. Sisa unit tetap dihitung otomatis dari jadwal dan pesanan aktif.' }));
  const tabel = el('table', { kelas: 'tabel-gear' });
  const head = el('tr');
  ['Nama', 'Kategori', 'Harga/hari', 'Unit', 'Status sewa', 'Aksi'].forEach((t) => head.append(el('th', { teks: t })));
  const thead = el('thead'); thead.append(head); tabel.append(thead);
  const tbody = el('tbody');
  gear.forEach((g) => {
    const tr = el('tr');
    const perawatan = g.kondisi === 'Perlu perawatan';
    const dipakai = orders.some((o) => [STATUS.MENUNGGU, STATUS.TERBOOKING, STATUS.TERPINJAM].includes(o.status) && o.items.some((i) => i.gearId === g.id));
    const statusCell = el('td');
    statusCell.append(badgeKondisi(g));
    tr.append(
      el('td', { teks: g.nama }), el('td', { teks: g.kategori }),
      el('td', { teks: rupiah(g.hargaPerHari) }), el('td', { teks: String(g.jumlahUnit) }),
      statusCell,
    );
    const aksi = el('td');
    aksi.append(
      tombol(perawatan ? 'Tandai siap sewa' : 'Tandai perawatan', {
        kelas: perawatan ? 'btn btn-utama btn-kecil' : 'btn btn-sekunder btn-kecil',
        klik: () => toggleKondisiGear(g),
      }),
      tombol('Edit', { kelas: 'btn btn-sekunder btn-kecil', klik: () => formGearDialog(g) }),
      tombol('Hapus', { kelas: 'btn btn-bahaya btn-kecil', klik: async () => {
        const yakin = await konfirmasi({
          judul: 'Hapus gear?',
          pesan: dipakai ? `${g.nama} masih dipakai pesanan aktif dan tidak bisa dihapus.` : `${g.nama} akan dihapus dari katalog.`,
          teksAksi: 'Hapus',
          bahaya: true,
          aksiTidakAktif: dipakai,
          alasan: dipakai ? 'Gear masih dipakai pesanan Menunggu, Terbooking, atau Terpinjam.' : '',
        });
        if (yakin && !dipakai) { hapusGear(g.id); toast('Gear dihapus.'); render(); }
      } }),
    );
    tr.append(aksi);
    tbody.append(tr);
  });
  tabel.append(tbody);
  const wadahTabel = el('div', { kelas: 'tabel-scroll' });
  wadahTabel.append(tabel);
  section.append(wadahTabel);
  return section;
}

function unduhJSON() {
  const blob = new Blob([eksporData()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = el('a', { atribut: { href: url, download: 'maruemgear-cadangan.json' } });
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function pengaturanSection() {
  const config = getConfig();
  const section = el('section', { kelas: 'dashboard-section' });
  section.append(el('h2', { teks: 'Pengaturan demo', kelas: 'judul-bagian' }));
  const inputs = {};
  const form = el('form', { kelas: 'form-pengaturan' });
  const tambah = (label, kunci, tipe = 'number') => {
    const input = el('input', { atribut: { type: tipe, id: `cfg-${kunci}` } });
    input.value = String(config[kunci] ?? '');
    input.addEventListener('input', () => { inputs[kunci] = tipe === 'number' ? Number(input.value) : input.value; });
    form.append(bidang(label, input, { id: `cfg-${kunci}` }));
  };
  tambah('Toleransi keterlambatan (menit)', 'toleransiMenit');
  tambah('Denda per jam (%)', 'dendaPersenPerJam');
  tambah('Plafon denda (%)', 'plafonDendaPersen');
  tambah('Batas kedaluwarsa (menit)', 'batasKedaluwarsaMenit');
  tambah('Batas tidak diambil (menit)', 'batasTidakDiambilMenit');
  tambah('Nomor WhatsApp admin', 'whatsappAdmin', 'text');
  tambah('Jam layanan', 'jamLayanan', 'text');
  form.append(tombol('Simpan pengaturan', { kelas: 'btn btn-utama', klik: (e) => {
    e.preventDefault();
    const patch = { ...config, ...inputs };
    if (patch.toleransiMenit < 0 || patch.dendaPersenPerJam < 0 || patch.plafonDendaPersen < 0 || patch.batasKedaluwarsaMenit < 0 || patch.batasTidakDiambilMenit < 0) {
      toast('Nilai pengaturan tidak boleh negatif.');
      return;
    }
    setConfig(patch);
    toast('Pengaturan disimpan.');
    render();
  } }));
  section.append(form);
  return section;
}

export function renderDashboard(app) {
  const isi = el('div', { kelas: 'dashboard-isi' });
  isi.append(bannerDemo());
  if (getState().rusak) {
    isi.append(el('div', { kelas: 'banner-rusak', teks: '⚠ Data lokal rusak. Tombol Reset data contoh tersedia di tab Gear.' }));
  }
  if (ui.tab === 'ringkasan') isi.append(ringkasan());
  if (ui.tab === 'pesanan') isi.append(daftarPesanan());
  if (ui.tab === 'gear') isi.append(daftarGearSection());
  if (ui.tab === 'pengaturan') isi.append(pengaturanSection());

  const halaman = el('div', { kelas: 'dashboard' });
  halaman.append(sidebar(), isi, tabBar());
  app.append(navbar('dashboard'), halaman, footer());
}
