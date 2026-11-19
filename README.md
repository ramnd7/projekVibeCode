# MaruemGear

Aplikasi web latihan untuk penyewaan gear hiking: Vite + JavaScript vanilla, tanpa backend, tanpa login. Seluruh data tersimpan di `localStorage` browser perangkat yang dipakai.

## Menjalankan

```bash
npm install
npm run dev
```

Build produksi:

```bash
npm run build
npm run preview
```

## Fitur

- Katalog 10 gear dengan pencarian, filter kategori/ketersediaan, dan sorting.
- Jadwal sewa dengan durasi otomatis dan pengecekan stok berdasarkan irisan jadwal.
- Keranjang multi-item, form penyewa, dan ringkasan pesanan yang dibuka lewat tautan `wa.me`.
- Dashboard Mode Demo: ringkasan, manajemen status pesanan, denda keterlambatan, CRUD gear, pengaturan, ekspor/impor JSON, dan reset data contoh.

## Aturan penting

- Waktu disimpan lokal sebagai `YYYY-MM-DDTHH:mm` dan dibandingkan sebagai string.
- Durasi sewa minimal 1 hari (`ceil(menit / 1440)`).
- Stok dihitung dari pesanan Menunggu Konfirmasi, Terbooking, dan Terpinjam dengan interval setengah terbuka `[mulai, selesai)`.
- Denda dihitung dari akhir toleransi, dibulatkan per jam, dan dibatasi plafon persentase tarif harian.
- "Terlambat" hanya label UI; status tersimpan tetap Terpinjam.
- Nomor WhatsApp admin diisi di `Dashboard → Pengaturan` (nilai bawaan sudah memakai nomor pemilik proyek). Tidak ada API key atau token. Sesuai `SPEC.md`, data contoh penyewa tetap fiktif dan tidak menyimpan nomor telepon penyewa.
- Tidak ada deposit, pembayaran online, backend, atau pengiriman otomatis.

## Deployment (langkah manual pemilik proyek)

Aplikasi ini menghasilkan artefak statis di folder `dist`. Login, pembuatan akun, import repositori, dan konfigurasi project hosting menjadi tanggung jawab pemilik proyek. Pilih build statis dengan direktori keluaran `dist` dan jangan tambahkan variabel lingkungan berisi rahasia. Setelah deploy, buka URL publik dan pastikan katalog menampilkan 10 gear.

## Sumber

Aturan bisnis dan kriteria penerimaan: `SPEC.md`. Tampilan dan design token: `UI-SPEC.md`. Rencana kerja: `TASKS.md`.
