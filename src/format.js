// Format tampilan dan konversi waktu lokal. Sumber: UI-SPEC.md §11, SPEC.md §5.1.

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export function rupiah(nilai) {
  const angka = String(Math.round(Number(nilai) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp ${angka}`;
}

export function parseLokal(str) {
  if (!str || typeof str !== 'string' || str.length < 16) return null;
  const [tanggal, jam] = str.split('T');
  const [tahun, bulan, hari] = tanggal.split('-').map(Number);
  const [jamJam, jamMenit] = jam.split(':').map(Number);
  if (!tahun || !bulan || !hari || Number.isNaN(jamJam) || Number.isNaN(jamMenit)) return null;
  return new Date(tahun, bulan - 1, hari, jamJam, jamMenit, 0, 0);
}

export function keLokal(date) {
  const p = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}`;
}

export function tambahMenit(str, menit) {
  const d = parseLokal(str);
  if (!d) return '';
  return keLokal(new Date(d.getTime() + menit * 60000));
}

export function selisihMenit(mulai, selesai) {
  const a = parseLokal(mulai);
  const b = parseLokal(selesai);
  if (!a || !b) return 0;
  return Math.round((b.getTime() - a.getTime()) / 60000);
}

export function tanggal(str) {
  const d = parseLokal(str);
  if (!d) return '—';
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

export function jam(str) {
  const d = parseLokal(str);
  if (!d) return '—';
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function tanggalJam(str) {
  const d = parseLokal(str);
  return d ? `${tanggal(str)} ${jam(str)}` : '—';
}

export function tanggalPendek(str) {
  const d = parseLokal(str);
  if (!d) return '—';
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')} ${jam(str)}`;
}
