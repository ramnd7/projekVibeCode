// Validasi input. Sumber: SPEC.md §5.6, AC-21, UI-SPEC.md §6.2.

import { jadwalValid } from './waktu.js';
import { KATEGORI, KONDISI } from './products.js';

export function validasiNamaGear(nama) {
  const s = String(nama ?? '').trim();
  if (s.length < 2 || s.length > 60) return 'Nama gear wajib diisi (2–60 karakter).';
  return '';
}

export function validasiHarga(harga) {
  const n = Number(harga);
  if (!Number.isFinite(n) || n < 0) return 'Harga tidak boleh negatif.';
  return '';
}

export function validasiUnit(unit) {
  const n = Number(unit);
  if (!Number.isInteger(n) || n < 0) return 'Jumlah unit harus bilangan bulat ≥ 0.';
  return '';
}

export function validasiKategori(kategori) {
  return KATEGORI.includes(kategori) ? '' : 'Pilih kategori yang tersedia.';
}

export function validasiKondisi(kondisi) {
  return KONDISI.includes(kondisi) ? '' : 'Pilih kondisi gear.';
}

export function validasiImageUrl(url) {
  const s = String(url ?? '').trim();
  if (!s) return '';
  if (!(s.startsWith('/') || s.startsWith('./'))) return 'Gunakan path gambar lokal.';
  return '';
}

export function validasiJadwal(mulai, selesai) {
  return jadwalValid(mulai, selesai) ? '' : 'Waktu kembali harus setelah waktu ambil.';
}

export function validasiNamaPenyewa(nama) {
  const s = String(nama ?? '').trim();
  if (!s || s.length > 60) return 'Nama penyewa wajib diisi.';
  return '';
}

export function validasiCatatan(catatan) {
  return String(catatan ?? '').length <= 300 ? '' : 'Catatan maksimal 300 karakter.';
}

export function validasiGear(form) {
  const errors = {};
  const cek = {
    nama: validasiNamaGear(form.nama),
    kategori: validasiKategori(form.kategori),
    hargaPerHari: validasiHarga(form.hargaPerHari),
    jumlahUnit: validasiUnit(form.jumlahUnit),
    kondisi: validasiKondisi(form.kondisi),
    imageUrl: validasiImageUrl(form.imageUrl),
    deskripsi: String(form.deskripsi ?? '').length <= 300 ? '' : 'Deskripsi maksimal 300 karakter.',
  };
  for (const [kunci, pesan] of Object.entries(cek)) if (pesan) errors[kunci] = pesan;
  return errors;
}
