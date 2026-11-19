# TASKS.md — MaruemGear

> Rencana kerja implementasi MaruemGear. Dokumen perencanaan ini **bukan kode** dan tidak menjalankan perintah apa pun.
> Sumber kebenaran: `SPEC.md` untuk aturan bisnis, data, dan acceptance criteria; `ui.md` (judul internal: `UI-SPEC.md`) untuk tampilan.
> Aturan penulisan: satu tugas ≈ satu sesi kerja (maksimal ~90 menit) dan menghasilkan satu commit.

**Konvensi path:** semua path di bawah relatif terhadap root proyek `C:\laragon\www\projekOpenCode\`.
**Struktur folder yang diusulkan (asumsi, lihat §Asumsi):** `src/data/`, `src/domain/`, `src/storage/`, `src/ui/`, `public/images/gear/`.

---

## Daftar Milestone

| Milestone | Nama | Jumlah tugas |
|---|---|---:|
| M0 | Scaffold dan konfigurasi proyek | 3 |
| M1 | Data, logika domain, dan localStorage | 8 |
| M2 | Katalog dan tampilan dasar | 3 |
| M3 | Interaksi pencarian, filter, dan sorting | 3 |
| M4 | Jadwal sewa, keranjang, dan pembuatan pesanan | 5 |
| M5 | Pesan via WhatsApp | 2 |
| M6 | Dashboard | 6 |
| M7 | Testing manual | 5 |
| M8 | Security dan aksesibilitas | 6 |
| M9 | Build | 2 |
| M10 | Deployment dan dokumentasi (README) | 3 |
| **Total** | | **46** |

---

## M0 — Scaffold dan konfigurasi proyek

**Tujuan:** Menyiapkan kerangka Vite + JavaScript vanilla, entry point, routing hash, dan aset placeholder lokal sehingga milestone berikutnya hanya mengisi modul.

**Daftar tugas:** T0.1, T0.2, T0.3.

### T0.1 Inisialisasi proyek Vite dan entry point
- Prioritas: Must
- Referensi: SPEC.md N-01, N-02, N-12, §10 Iterasi 0; UI-SPEC.md §1
- Bergantung pada: tidak ada
- Deskripsi: Buat struktur dasar Vite tanpa framework dan tanpa dependensi runtime selain Vite. Siapkan `index.html` dengan atribut `lang="id"`, judul MaruemGear, dan satu titik mount untuk aplikasi.
- Berkas yang mungkin berubah: `package.json (baru)`, `index.html (baru)`, `vite.config.js (baru)`, `src/main.js (baru)`
- Acceptance criteria:
  - [ ] File `package.json` hanya memuat Vite sebagai dependensi pengembangan; tidak ada framework atau library UI.
  - [ ] `index.html` memiliki `<html lang="id">`, judul "MaruemGear", dan elemen root tempat aplikasi dirender.
  - [ ] Halaman kosong yang dihasilkan terbuka di browser melalui server pengembangan tanpa error di konsol.
- Pesan commit yang disarankan: `chore: scaffold Vite dan entry point MaruemGear`

### T0.2 Router hash untuk tiga halaman
- Prioritas: Must
- Referensi: SPEC.md §2, §10 Iterasi 0; UI-SPEC.md §7, §8.1
- Bergantung pada: T0.1
- Deskripsi: Siapkan routing berbasis hash untuk `#/katalog`, `#/keranjang`, dan `#/dashboard` dengan tampilan sementara berupa placeholder teks. Pastikan perubahan hash tidak memuat ulang halaman.
- Berkas yang mungkin berubah: `src/router.js (baru)`, `src/main.js (ubah)`
- Acceptance criteria:
  - [ ] Membuka `#/katalog`, `#/keranjang`, dan `#/dashboard` menampilkan label halaman yang berbeda.
  - [ ] Berpindah hash tidak menyebabkan reload penuh dan tidak menimbulkan error konsol.
  - [ ] Hash yang tidak dikenal jatuh ke `#/katalog`.
- Pesan commit yang disarankan: `feat: tambah router hash untuk katalog, keranjang, dan dashboard`

### T0.3 Aset placeholder lokal untuk 10 gear
- Prioritas: Must
- Referensi: SPEC.md M-01, §4.5, N-08; UI-SPEC.md §6.3, §9
- Bergantung pada: T0.1
- Deskripsi: Siapkan placeholder SVG lokal untuk setiap gear contoh agar katalog tetap memiliki gambar tanpa permintaan jaringan. File dipakai sebagai fallback saat `imageUrl` gagal dimuat.
- Berkas yang mungkin berubah: `public/images/gear/g-01.svg (baru)` sampai `public/images/gear/g-10.svg (baru)`, `public/images/gear/placeholder.svg (baru)`
- Acceptance criteria:
  - [ ] Tersedia 11 file SVG lokal (10 placeholder gear + 1 fallback umum).
  - [ ] Seluruh gambar dapat dibuka langsung dari browser tanpa error dan tidak memuat sumber daya eksternal.
  - [ ] DevTools → Network tidak menunjukkan permintaan ke domain luar saat aset ditampilkan.
- Pesan commit yang disarankan: `feat: tambah placeholder SVG lokal untuk katalog gear`

**Selesai jika:** server pengembangan berjalan, tiga rute hash dapat dibuka, dan aset placeholder lokal tersedia; belum ada logika sewa maupun tampilan akhir.

---

## M1 — Data, logika domain, dan localStorage

**Tujuan:** Membangun satu lapisan aturan bisnis bersama (waktu, durasi, stok, denda, status, validasi) dan lapisan penyimpanan lokal yang dipakai baik halaman publik maupun dashboard.

**Daftar tugas:** T1.1–T1.8.

### T1.1 Seed 10 gear dan konfigurasi default
- Prioritas: Must
- Referensi: SPEC.md M-01, S-01, §4.1, §4.3, §4.5, N-04; UI-SPEC.md §8.5
- Bergantung pada: T0.1
- Deskripsi: Definisikan 10 gear contoh sesuai tabel `SPEC.md` §4.5 beserta kategori, harga, unit, kondisi, deskripsi, dan path gambar lokal. Sertakan konfigurasi default dengan nomor WhatsApp bertanda placeholder, bukan nomor pribadi.
- Berkas yang mungkin berubah: `src/data/seed.js (baru)`, `src/storage/config.js (baru)`
- Acceptance criteria:
  - [ ] Seed berisi tepat 10 gear dengan total 36 unit dan satu gear ber-kondisi "Perlu perawatan" sesuai `SPEC.md` §4.5.
  - [ ] Setiap `hargaPerHari` ≥ 0, `jumlahUnit` bilangan bulat ≥ 0, dan `imageUrl` berupa path lokal relatif.
  - [ ] Konfigurasi memuat toleransi 60 menit, denda 10%/jam, plafon 100%, batas kedaluwarsa 0, batas tidak diambil 120 menit, dan nomor WhatsApp placeholder.
  - [ ] Tidak ada nama, nomor telepon, atau kredensial pribadi di dalam seed maupun konfigurasi.
- Pesan commit yang disarankan: `feat(data): seed 10 gear dan konfigurasi demo`

### T1.2 Repository localStorage dan seed awal
- Prioritas: Must
- Referensi: SPEC.md M-12, §4.4, N-10, AC-24, AC-25; UI-SPEC.md §8.4
- Bergantung pada: T1.1
- Deskripsi: Buat pembaca/penulis untuk kelima kunci `maruemgear:v1:*` dengan seeding hanya saat kunci belum ada. Sediakan fungsi reset data contoh yang dipanggil oleh tombol dengan konfirmasi di T6.5.
- Berkas yang mungkin berubah: `src/storage/keys.js (baru)`, `src/storage/repository.js (baru)`
- Acceptance criteria:
  - [ ] Pertama kali dibuka, kelima kunci tersedia di DevTools → Local Storage dengan isi sesuai seed dan konfigurasi.
  - [ ] Mengubah data lalu memuat ulang halaman tidak mengembalikan data ke seed.
  - [ ] Fungsi reset mengembalikan 10 gear, 0 pesanan, keranjang kosong, dan konfigurasi default.
  - [ ] Pembacaan dibungkus penanganan error sehingga data rusak tidak membuat aplikasi blank (diperkuat di T8.5).
- Pesan commit yang disarankan: `feat(storage): repository localStorage dan seed awal`

### T1.3 Modul waktu, durasi, dan biaya sewa
- Prioritas: Must
- Referensi: SPEC.md M-04, §4.2, §5.1, N-09, N-11, AC-03, AC-04; UI-SPEC.md §9, §11
- Bergantung pada: T1.1
- Deskripsi: Hitung `durasiMenit`, `durasiHari = max(1, ceil(menit/1440))`, `tarifHarian`, dan `totalBiaya` dari waktu lokal berformat `YYYY-MM-DDTHH:mm`. Sediakan juga format rupiah dan format tanggal sesuai `UI-SPEC.md` §11.
- Berkas yang mungkin berubah: `src/domain/waktu.js (baru)`, `src/domain/format.js (baru)`
- Acceptance criteria:
  - [ ] `21/11 09:00` sampai `23/11 18:00` menghasilkan durasi 3 hari dan tarif harian 65.000 untuk Tenda Dome 2P ×1 + Carrier 50L ×1.
  - [ ] Total biaya contoh tersebut terbaca Rp 195.000 dan berubah otomatis saat jumlah diubah.
  - [ ] Waktu kembali yang sama atau lebih awal dari waktu ambil ditandai tidak valid dan tidak menghasilkan biaya.
  - [ ] Format angka memakai `Rp 35.000`, tanggal `21 Nov 2026`, dan jam 24 jam `09:00`.
- Pesan commit yang disarankan: `feat(domain): hitung durasi dan total biaya sewa`

### T1.4 Modul ketersediaan dan irisan jadwal
- Prioritas: Must
- Referensi: SPEC.md M-05, §5.4, N-11, AC-05, AC-06, AC-07, AC-08, AC-09; UI-SPEC.md §6.3
- Bergantung pada: T1.2, T1.3
- Deskripsi: Hitung unit tersedia dengan interval setengah terbuka `[mulai, selesai)` dan hanya pesanan berstatus Menunggu Konfirmasi/Terbooking/Terpinjam yang beririsan. Kembalikan alasan "Perlu perawatan" dan "Belum ada jadwal" sebagai kondisi terpisah.
- Berkas yang mungkin berubah: `src/domain/ketersediaan.js (baru)`
- Acceptance criteria:
  - [ ] Untuk G-01 (3 unit) dan P1 (2 unit, `21/11 09:00–23/11 18:00`), jadwal `23/11 18:00–24/11 18:00` menghasilkan tersedia 3 (bersentuhan bukan irisan).
  - [ ] Jadwal `22/11 12:00–24/11 18:00` menghasilkan tersedia 1; setelah P2 menambah 1 unit pada irisan yang sama menjadi 0 ("Habis di jadwal ini").
  - [ ] Membatalkan P2 atau mengembalikan P1 mengembalikan stok sesuai aturan `SPEC.md` §5.4.
  - [ ] Gear "Perlu perawatan" selalu menghasilkan tersedia 0 dan tombol sewa nonaktif.
- Pesan commit yang disarankan: `feat(domain): hitung ketersediaan unit berdasarkan irisan jadwal`

### T1.5 Modul denda dan toleransi
- Prioritas: Must
- Referensi: SPEC.md M-11, §5.5, N-11, AC-15, AC-16, AC-17, AC-18, AC-19; UI-SPEC.md §8.3
- Bergantung pada: T1.3
- Deskripsi: Implementasikan satu fungsi denda yang memakai konfigurasi toleransi, persen per jam, dan plafon. Fungsi ini dipakai untuk perkiraan di detail pesanan maupun nilai final saat pengembalian.
- Berkas yang mungkin berubah: `src/domain/denda.js (baru)`
- Acceptance criteria:
  - [ ] Dengan tarif harian 65.000 dan jadwal kembali 18:00, pengembalian 18:30 serta 19:00 menghasilkan denda Rp 0.
  - [ ] Pengembalian 19:30 menghasilkan Rp 6.500; 20:30 menghasilkan Rp 13.000.
  - [ ] Pengembalian 05:00 dan 07:00 hari berikutnya sama-sama menghasilkan Rp 65.000 (plafon 100%), bukan Rp 130.000.
  - [ ] Mengubah toleransi menjadi 30 menit mengubah hasil perhitungan sesuai konfigurasi baru tanpa mengubah rumus di UI.
- Pesan commit yang disarankan: `feat(domain): hitung denda keterlambatan dan plafon`

### T1.6 Modul status pesanan dan evaluasi otomatis
- Prioritas: Must
- Referensi: SPEC.md M-10, §5.2, §5.3, N-11, AC-12, AC-13, AC-14; UI-SPEC.md §6.4, §8.3
- Bergantung pada: T1.2, T1.3
- Deskripsi: Definisikan enum status, transisi yang diizinkan, dan evaluasi Kedaluwarsa/Tidak Diambil sekali saat aplikasi dimuat. Sediakan penentu label turunan Terlambat tanpa mengubah status tersimpan.
- Berkas yang mungkin berubah: `src/domain/status.js (baru)`
- Acceptance criteria:
  - [ ] Status awal pesanan baru adalah "Menunggu Konfirmasi" dan hanya transisi yang tercantum di `SPEC.md` §5.2 yang diterima.
  - [ ] Pesanan Menunggu dengan `waktuAmbil` lampau berubah menjadi "Kedaluwarsa" setelah dimuat ulang; pesanan Terbooking yang lewat batas menjadi "Tidak Diambil".
  - [ ] Evaluasi tidak menjalankan timer berkala dan tidak mengubah status terminal.
  - [ ] "Terlambat" hanya muncul sebagai label UI; nilai `status` di Local Storage tetap "Terpinjam".
- Pesan commit yang disarankan: `feat(domain): aturan status dan evaluasi otomatis saat memuat`

### T1.7 Validasi input domain
- Prioritas: Must
- Referensi: SPEC.md M-13, §5.6, AC-21; UI-SPEC.md §6.2, §8.4, §11
- Bergantung pada: T1.1
- Deskripsi: Kumpulkan aturan validasi untuk nama gear, harga, unit, jadwal, jumlah item, nama penyewa, catatan, dan `imageUrl` dengan pesan error yang menyebut masalah dan perbaikannya. Fungsi dipakai ulang oleh form katalog, keranjang, dan dashboard.
- Berkas yang mungkin berubah: `src/domain/validasi.js (baru)`
- Acceptance criteria:
  - [ ] Harga `-1` dan jumlah unit `1.5` ditolak dengan pesan "Harga tidak boleh negatif." dan "Jumlah unit harus bilangan bulat ≥ 0."
  - [ ] Nama gear kurang dari 2 karakter, nama penyewa kosong/spasi, dan catatan lebih dari 300 karakter ditolak.
  - [ ] `imageUrl` yang bukan path relatif ditolak dengan pesan "Gunakan path gambar lokal."
  - [ ] Pesan error tidak hanya berupa perubahan warna tepi, melainkan teks yang dapat dikaitkan ke kolom.
- Pesan commit yang disarankan: `feat(domain): validasi input dan pesan error`

### T1.8 Ekspor dan impor cadangan JSON
- Prioritas: Should
- Referensi: SPEC.md S-08, §7; UI-SPEC.md §8.4
- Bergantung pada: T1.2
- Deskripsi: Tambahkan fungsi unduh JSON berisi kelima kunci penyimpanan dan fungsi unggah yang mengganti data setelah konfirmasi. Tidak ada pengiriman data ke jaringan; tombol UI-nya dibuat di T6.6.
- Berkas yang mungkin berubah: `src/storage/repository.js (ubah)`
- Acceptance criteria:
  - [ ] Fungsi ekspor menghasilkan file JSON yang memuat gear, pesanan, keranjang, konfigurasi, dan meta.
  - [ ] Mengimpor file valid mengembalikan seluruh data dan tetap terbaca setelah memuat ulang halaman.
  - [ ] Mengimpor file rusak menampilkan pesan error dan data lama tidak berubah.
- Pesan commit yang disarankan: `feat(storage): ekspor dan impor cadangan JSON lokal`

**Selesai jika:** seluruh modul domain menghasilkan angka contoh yang sesuai dengan `SPEC.md` §5, data tersimpan di Local Storage, dan belum ada tampilan akhir yang bergantung pada UI.

---

## M2 — Katalog dan tampilan dasar

**Tujuan:** Mewujudkan tampilan publik statis sesuai design token: warna, tipografi, navbar, hero, kartu jadwal, grid produk, dan footer.

**Daftar tugas:** T2.1–T2.3.

### T2.1 Design token dan gaya dasar
- Prioritas: Must
- Referensi: SPEC.md N-06, N-07, N-09; UI-SPEC.md §3, §4, §5, §6.1, §6.2
- Bergantung pada: T0.1
- Deskripsi: Terjemahkan palet, tipografi, skala spasi, radius, dan varian tombol/input menjadi CSS variable dan kelas dasar. Sertakan cincin fokus, target sentuh 44 px, dan format angka tabular.
- Berkas yang mungkin berubah: `src/ui/tokens.css (baru)`, `src/ui/base.css (baru)`
- Acceptance criteria:
  - [ ] DevTools menunjukkan hanya warna yang tercantum di `UI-SPEC.md` §3 yang dipakai.
  - [ ] Kontras pasangan utama (teks, tombol utama, menu gelap, badge Terlambat, tepi input, fokus) sesuai tabel `UI-SPEC.md` §3.2.
  - [ ] Tombol dan input memiliki tinggi minimal 44 px dan cincin fokus yang terlihat saat di-tab.
- Pesan commit yang disarankan: `style: design token dan gaya dasar MaruemGear`

### T2.2 Navbar, hero, kartu jadwal, dan footer
- Prioritas: Must
- Referensi: SPEC.md M-01, C-04, N-06; UI-SPEC.md §7.1, §7.2, §7.4, §11
- Bergantung pada: T2.1, T0.2
- Deskripsi: Bangun navbar dengan menu mobile dan penanda keranjang, hero dengan tombol Lihat Katalog, kartu jadwal sewa, serta footer berisi tautan WhatsApp dan jam layanan. Tautan "Cara Sewa" diarahkan ke anchor yang tersedia (lihat Pertanyaan terbuka Q11).
- Berkas yang mungkin berubah: `src/ui/layout.js (baru)`, `src/main.js (ubah)`
- Acceptance criteria:
  - [ ] Klik "Lihat Katalog" menggulir ke bagian katalog.
  - [ ] Di 360 px muncul tombol Menu dan penanda keranjang; di desktop muncul tautan Katalog, Cara Sewa, dan tombol Dashboard bertanda "Demo".
  - [ ] Hero menampilkan judul "Sewa perlengkapan hiking per hari." dan subteks sesuai `UI-SPEC.md` §7.2.
  - [ ] Footer menampilkan jam layanan statis dan tautan WhatsApp dengan nomor placeholder.
- Pesan commit yang disarankan: `feat(ui): navbar, hero, kartu jadwal, dan footer`

### T2.3 Grid produk dan kartu gear statis
- Prioritas: Must
- Referensi: SPEC.md M-01, AC-01; UI-SPEC.md §6.3, §7.3, §9
- Bergantung pada: T1.1, T2.1, T0.3
- Deskripsi: Tampilkan 10 kartu gear dari seed dalam grid 1/2/3 kolom sesuai titik henti. Kartu memuat gambar 4:3, label kategori, nama, harga per hari, dan placeholder teks untuk status ketersediaan yang akan dihubungkan di T4.2.
- Berkas yang mungkin berubah: `src/ui/katalog.js (baru)`
- Acceptance criteria:
  - [ ] AC-01: 10 gear tampil dari seed, gambar tampil atau fallback placeholder lokal, dan tidak ada permintaan jaringan eksternal.
  - [ ] Grid berubah 1 kolom di 360 px, 2 kolom di 700 px, dan 3 kolom di 1200 px tanpa scroll horizontal.
  - [ ] Saat gambar gagal dimuat, fallback lokal tampil dan `alt` menyebut nama gear.
  - [ ] Belum ada jadwal → kartu menampilkan teks "Pilih jadwal untuk melihat ketersediaan".
- Pesan commit yang disarankan: `feat(ui): grid katalog dan kartu gear`

**Selesai jika:** halaman publik dapat dibuka dan menampilkan katalog lengkap sesuai token UI, sebelum interaksi pencarian dan jadwal ditambahkan.

---

## M3 — Interaksi pencarian, filter, dan sorting

**Tujuan:** Membuat katalog dapat dicari, difilter berdasarkan kategori dan ketersediaan, serta diurutkan sesuai `UI-SPEC.md` §7.3.

**Daftar tugas:** T3.1–T3.3.

### T3.1 Pencarian nama dan deskripsi
- Prioritas: Must
- Referensi: SPEC.md M-02; UI-SPEC.md §7.3, §9
- Bergantung pada: T2.3
- Deskripsi: Hubungkan kolom pencarian ke daftar gear dengan pencarian case-insensitive pada `nama` dan `deskripsi`. Perbarui teks "Menampilkan X dari Y gear" setiap perubahan.
- Berkas yang mungkin berubah: `src/ui/katalog.js (ubah)`
- Acceptance criteria:
  - [ ] Mengetik "tenda" menampilkan hanya gear yang nama atau deskripsinya mengandung "tenda".
  - [ ] Teks "Menampilkan X dari Y gear" selalu sesuai dengan jumlah hasil dan total gear.
  - [ ] Menghapus teks pencarian mengembalikan seluruh gear yang lolos filter lain.
- Pesan commit yang disarankan: `feat(katalog): pencarian nama dan deskripsi gear`

### T3.2 Filter kategori dan hanya tersedia
- Prioritas: Must
- Referensi: SPEC.md M-02, §5.4; UI-SPEC.md §7.3, §9
- Bergantung pada: T3.1, T1.4
- Deskripsi: Tambahkan chip kategori di mobile, sidebar kategori di desktop, dan opsi "Hanya tersedia" yang mengikuti jadwal terpilih. Sertakan tombol Reset filter yang mengembalikan semua kriteria awal.
- Berkas yang mungkin berubah: `src/ui/katalog.js (ubah)`
- Acceptance criteria:
  - [ ] Memilih kategori Tidur hanya menampilkan gear kategori Tidur; memilih "(Semua)" mengembalikan semua hasil.
  - [ ] "Hanya tersedia" menyembunyikan gear dengan stok 0 pada jadwal terpilih dan gear "Perlu perawatan".
  - [ ] AC-02: kombinasi pencarian "tenda", kategori Tidur, dan sorting menghasilkan daftar yang sesuai aturan filter.
  - [ ] Reset filter mengembalikan 10 gear dan menghapus penanda filter aktif.
- Pesan commit yang disarankan: `feat(katalog): filter kategori dan ketersediaan`

### T3.3 Sorting, empty state, dan penanda filter aktif
- Prioritas: Must
- Referensi: SPEC.md M-03, S-05, AC-02; UI-SPEC.md §7.3, §9
- Bergantung pada: T3.2
- Deskripsi: Tambahkan empat mode urutan (Unggulan, Harga termurah, Harga termahal, Nama A–Z) dan tampilan hasil kosong dengan tombol Reset filter. Tampilkan jumlah filter aktif pada tombol Filter di mobile.
- Berkas yang mungkin berubah: `src/ui/katalog.js (ubah)`
- Acceptance criteria:
  - [ ] AC-02: "Harga termahal" mengurutkan harga menurun; "Nama A–Z" mengurutkan nama secara alfabetis; "Unggulan" mengembalikan urutan seed.
  - [ ] Hasil kosong menampilkan pesan singkat dan tombol Reset filter yang berfungsi.
  - [ ] Tombol Filter di mobile menampilkan angka jumlah kriteria aktif.
  - [ ] UI-05: lebar 360 → 700 → 1200 px mengubah grid 1 → 2 → 3 kolom dan memindahkan filter dari panel ke sidebar.
- Pesan commit yang disarankan: `feat(katalog): sorting dan empty state`

**Selesai jika:** AC-01 dan AC-02 lulus dan perilaku filter/sorting konsisten di tiga lebar layar.

---

## M4 — Jadwal sewa, keranjang, dan pembuatan pesanan

**Tujuan:** Menghubungkan jadwal ke ketersediaan, membangun keranjang multi-item, dan mencatat pesanan baru dengan status awal yang benar.

**Daftar tugas:** T4.1–T4.5.

### T4.1 Panel jadwal sewa interaktif
- Prioritas: Must
- Referensi: SPEC.md M-04, §5.1, AC-03, AC-04; UI-SPEC.md §7.2, §9
- Bergantung pada: T1.3, T2.2
- Deskripsi: Hubungkan input tanggal dan jam ambil/kembali ke modul durasi. Tampilkan durasi yang diperbarui otomatis dan pesan error bila waktu kembali tidak setelah waktu ambil.
- Berkas yang mungkin berubah: `src/ui/jadwal.js (baru)`, `src/ui/layout.js (ubah)`
- Acceptance criteria:
  - [ ] AC-03: ambil `23/11 09:00` dan kembali `22/11 09:00` memunculkan error "Waktu kembali harus setelah waktu ambil" dan ketersediaan tidak dihitung.
  - [ ] AC-04: pasangan `21/11 09:00`–`23/11 18:00` menampilkan "Durasi: 3 hari".
  - [ ] UI-07: jadwal terpilih tetap terlihat sebagai baris ringkas saat menggulir katalog.
  - [ ] Input memakai kontrol tanggal dan jam bawaan browser.
- Pesan commit yang disarankan: `feat(jadwal): panel jadwal dan durasi otomatis`

### T4.2 Indikator ketersediaan pada kartu
- Prioritas: Must
- Referensi: SPEC.md M-05, §5.4, AC-05, AC-06, AC-07, AC-09; UI-SPEC.md §6.3, §7.3, UI-08
- Bergantung pada: T1.4, T4.1, T2.3
- Deskripsi: Tampilkan jumlah unit tersedia pada setiap kartu sesuai jadwal terpilih, termasuk badge "Tersisa N" untuk stok ≤ 2 dan kondisi habis. Tombol Tambah dinonaktifkan dengan label teks saat gear tidak dapat disewa.
- Berkas yang mungkin berubah: `src/ui/katalog.js (ubah)`
- Acceptance criteria:
  - [ ] AC-05: jadwal yang tepat bersentuhan dengan akhir pesanan lain menampilkan "Tersedia 3 unit di jadwal ini".
  - [ ] AC-06 dan AC-07: jadwal yang beririsan menampilkan "Tersisa 1" atau "Habis di jadwal ini" sesuai sisa unit.
  - [ ] UI-08: kondisi habis menampilkan teks "Habis di jadwal ini" dan tombol nonaktif berlabel "Tidak tersedia", bukan hanya perubahan warna.
  - [ ] Gear "Perlu perawatan" menampilkan badge kuning dan tombol nonaktif.
- Pesan commit yang disarankan: `feat(katalog): indikator ketersediaan per jadwal`

### T4.3 Keranjang multi-item
- Prioritas: Must
- Referensi: SPEC.md M-06, §5.4, §5.6, AC-04, AC-06, AC-07; UI-SPEC.md §7.4, §9
- Bergantung pada: T4.2, T1.7
- Deskripsi: Bangun keranjang dengan penambahan, pengubahan jumlah, dan penghapusan item. Simpan jadwal di dalam keranjang, validasi ulang stok saat jadwal diubah, dan tampilkan rincian "harga × hari".
- Berkas yang mungkin berubah: `src/ui/keranjang.js (baru)`, `src/storage/repository.js (ubah)`
- Acceptance criteria:
  - [ ] AC-04: dua item dengan tarif harian 65.000 dan durasi 3 hari menampilkan subtotal Rp 195.000.
  - [ ] AC-06: tombol `+` berhenti di batas stok dan menampilkan "Maksimal N unit".
  - [ ] AC-07: jika jadwal diubah hingga stok habis, item bermasalah diberi error dan tombol kirim tetap nonaktif.
  - [ ] Keranjang tersimpan di `maruemgear:v1:cart` dan terbaca kembali setelah memuat ulang halaman.
  - [ ] UI-SPEC.md §7.4: mobile memakai layar penuh, desktop memakai panel kanan 400 px; tanpa baris deposit.
- Pesan commit yang disarankan: `feat(keranjang): keranjang sewa multi-item dan validasi stok`

### T4.4 Komponen toast dan dialog konfirmasi
- Prioritas: Should
- Referensi: SPEC.md S-04, S-05, C-03; UI-SPEC.md §6.5, §9
- Bergantung pada: T2.1
- Deskripsi: Sediakan toast singkat dengan `aria-live="polite"` dan dialog konfirmasi dengan fokus masuk, `Esc` untuk menutup, serta pengembalian fokus ke pemicu. Dipakai oleh T4.5 dan milestone dashboard.
- Berkas yang mungkin berubah: `src/ui/toast.js (baru)`, `src/ui/dialog.js (baru)`
- Acceptance criteria:
  - [ ] Toast muncul di bawah, hilang setelah sekitar 5 detik, dapat ditutup, dan terbaca pembaca layar.
  - [ ] Dialog menampilkan judul, penjelasan konsekuensi, tombol Batal, dan tombol aksi; `Esc` menutupnya.
  - [ ] Fokus berpindah ke dialog saat dibuka dan kembali ke tombol pemicu saat ditutup.
  - [ ] C-03: perubahan total biaya dan jumlah keranjang diumumkan lewat `aria-live`.
- Pesan commit yang disarankan: `feat(ui): komponen toast dan dialog konfirmasi`

### T4.5 Form pesanan dan pembuatan catatan sewa
- Prioritas: Must
- Referensi: SPEC.md M-07, M-08, §4.2, §5.1, §5.2, §5.6, AC-10, AC-11, AC-23; UI-SPEC.md §7.4, §11
- Bergantung pada: T4.3, T4.4, T1.6, T1.7
- Deskripsi: Tambahkan kolom nama penyewa wajib dan catatan opsional, lalu buat record pesanan dengan kode `RG-YYYYMMDD-NNN`, total biaya hasil hitung ulang, dan status "Menunggu Konfirmasi". Tombol kirim dinonaktifkan dengan alasan teks bila prasyarat belum terpenuhi.
- Berkas yang mungkin berubah: `src/ui/pesanan.js (baru)`, `src/ui/keranjang.js (ubah)`, `src/storage/repository.js (ubah)`
- Acceptance criteria:
  - [ ] AC-10: nama kosong membuat tombol WhatsApp nonaktif dan alasan tampil sebagai teks; setelah diisi tombol aktif.
  - [ ] AC-11: setelah dikirim, pesanan tersimpan dengan status "Menunggu Konfirmasi", kode berformat `RG-YYYYMMDD-NNN`, dan keranjang menjadi kosong.
  - [ ] AC-04: `totalBiaya` dihitung ulang dari domain, bukan diambil dari nilai yang ditampilkan di form.
  - [ ] Toast "Pesanan tercatat dengan status Menunggu Konfirmasi" muncul setelah pengiriman.
  - [ ] AC-23: nama penyewa dirender sebagai teks, bukan sebagai HTML.
- Pesan commit yang disarankan: `feat(pesanan): form penyewa dan pembuatan pesanan`

**Selesai jika:** jadwal, stok, keranjang, dan pembuatan pesanan bekerja bersama; pesanan baru tercatat dengan status dan biaya yang benar.

---

## M5 — Pesan via WhatsApp

**Tujuan:** Menyusun ringkasan pesanan menjadi teks yang siap dikirim pengguna lewat WhatsApp tanpa API, token, atau nomor pribadi.

**Daftar tugas:** T5.1–T5.2.

### T5.1 Ringkasan pesan, pratinjau, dan tautan WhatsApp
- Prioritas: Must
- Referensi: SPEC.md M-08, S-02, §5.7, N-02, AC-10, AC-11; UI-SPEC.md §7.4, UI-09, UI-10
- Bergantung pada: T4.5
- Deskripsi: Susun teks berisi kode sewa, nama, jadwal, durasi, item, total biaya, status awal, dan catatan opsional. Buka `https://wa.me/<placeholder>?text=...` dengan `encodeURIComponent` dan sediakan pratinjau teks sebelum pengiriman.
- Berkas yang mungkin berubah: `src/domain/pesan.js (baru)`, `src/ui/pesanan.js (ubah)`
- Acceptance criteria:
  - [ ] AC-11 dan UI-10: tombol membuka tab WhatsApp dengan seluruh ringkasan terbaca utuh setelah dekode URL.
  - [ ] UI-09: tombol tetap nonaktif dengan alasan teks bila nama kosong, jadwal invalid, atau keranjang kosong.
  - [ ] S-02: "Lihat isi pesan" menampilkan teks yang sama persis dengan isi tautan.
  - [ ] Tidak ada permintaan API; tautan hanya membuka WhatsApp dan pengguna menekan kirim sendiri.
- Pesan commit yang disarankan: `feat(whatsapp): ringkasan pesanan dan tautan wa.me`

### T5.2 Tautan bantuan dan jam layanan di footer
- Prioritas: Could
- Referensi: SPEC.md C-04, N-04; UI-SPEC.md §7.4
- Bergantung pada: T2.2, T5.1
- Deskripsi: Hubungkan tautan "Tanya admin lewat WhatsApp" di footer ke nomor placeholder yang sama dengan konfigurasi. Tampilkan jam layanan sebagai informasi statis sesuai konfigurasi.
- Berkas yang mungkin berubah: `src/ui/layout.js (ubah)`, `src/storage/config.js (ubah)`
- Acceptance criteria:
  - [ ] Klik tautan footer membuka WhatsApp dengan nomor placeholder dari konfigurasi.
  - [ ] Jam layanan tampil sesuai nilai konfigurasi dan tidak dipakai sebagai aturan validasi.
  - [ ] Tidak ada nomor telepon pribadi yang tertulis di kode maupun tampilan.
- Pesan commit yang disarankan: `feat(ui): tautan bantuan WhatsApp dan jam layanan`

**Selesai jika:** AC-10, AC-11, UI-09, dan UI-10 lulus tanpa menambah layanan pengiriman otomatis.

---

## M6 — Dashboard

**Tujuan:** Menyediakan halaman admin bertanda Mode Demo berisi ringkasan, daftar dan aksi status pesanan, kelola gear, serta pengaturan.

**Daftar tugas:** T6.1–T6.6.

### T6.1 Kerangka dashboard dan banner Mode Demo
- Prioritas: Must
- Referensi: SPEC.md M-09, §2, N-06; UI-SPEC.md §8.1, UI-11
- Bergantung pada: T0.2, T2.1
- Deskripsi: Bangun tata letak dashboard dengan sidebar kiri di desktop, bilah tab bawah di mobile, dan banner Mode Demo yang selalu tampak. Sertakan tautan "Ke katalog".
- Berkas yang mungkin berubah: `src/ui/dashboard/index.js (baru)`, `src/ui/layout.js (ubah)`
- Acceptance criteria:
  - [ ] UI-11: desktop menampilkan sidebar kiri; mobile menampilkan bilah tab bawah; banner Mode Demo selalu terlihat.
  - [ ] Tautan "Ke katalog" kembali ke `#/katalog` tanpa reload penuh.
  - [ ] Tidak ada kolom kata sandi, halaman login, atau formulir autentikasi palsu.
  - [ ] Teks banner menyatakan data hanya tersimpan di browser ini.
- Pesan commit yang disarankan: `feat(dashboard): kerangka dan banner Mode Demo`

### T6.2 Kartu ringkasan
- Prioritas: Must
- Referensi: SPEC.md M-09, S-06, §11 keputusan 5, AC-20; UI-SPEC.md §8.2
- Bergantung pada: T6.1, T1.2, T1.5
- Deskripsi: Tampilkan tiga kartu wajib (total gear, pesanan aktif, estimasi pendapatan) dan dua kartu Should (ambil/kembali hari ini, Terlambat). Hitung angka dari repository dan modul domain yang sama dengan halaman publik.
- Berkas yang mungkin berubah: `src/ui/dashboard/ringkasan.js (baru)`
- Acceptance criteria:
  - [ ] AC-20: total gear = 10; pesanan aktif = jumlah status Menunggu Konfirmasi + Terbooking + Terpinjam.
  - [ ] Estimasi pendapatan dihitung dari `totalAkhir` pesanan Dikembalikan (sesuai `SPEC.md` §5.5) dan diformat `Rp 35.000`.
  - [ ] Kartu Terlambat memakai ikon dan teks; angka 0 tidak memakai warna bahaya.
  - [ ] Angka berubah setelah status pesanan diubah tanpa memuat ulang seluruh halaman.
- Pesan commit yang disarankan: `feat(dashboard): kartu ringkasan gear, pesanan, dan pendapatan`

### T6.3 Daftar pesanan dan filter
- Prioritas: Must
- Referensi: SPEC.md M-09, S-07; UI-SPEC.md §8.3, UI-12
- Bergantung pada: T6.1, T1.6
- Deskripsi: Tampilkan tabel di desktop dan kartu bertumpuk di mobile dengan kolom kode, penyewa, jadwal, total, status, dan aksi. Tambahkan filter status serta pencarian kode/nama.
- Berkas yang mungkin berubah: `src/ui/dashboard/pesanan.js (baru)`
- Acceptance criteria:
  - [ ] UI-12: setiap baris hanya menampilkan satu aksi utama sesuai tabel `UI-SPEC.md` §8.3.
  - [ ] Status ditampilkan dengan ikon dan teks, bukan hanya warna; label Terlambat muncul berdampingan dengan Terpinjam bila lewat toleransi.
  - [ ] Filter status dan pencarian kode/nama menghasilkan daftar yang sesuai dan menampilkan jumlah hasil.
  - [ ] Pesanan terminal hanya memiliki aksi Detail.
- Pesan commit yang disarankan: `feat(dashboard): daftar pesanan dan filter status`

### T6.4 Aksi status dan detail pesanan
- Prioritas: Must
- Referensi: SPEC.md M-10, M-11, S-03, C-01, §5.2–§5.5, AC-08, AC-09, AC-12, AC-13, AC-14, AC-16, AC-17, AC-18, AC-19; UI-SPEC.md §8.3, UI-13
- Bergantung pada: T6.3, T1.5, T1.6, T4.4
- Deskripsi: Implementasikan transisi manual yang diizinkan, konfirmasi sebelum pengembalian, dan detail yang menampilkan rincian item serta rumus denda. Simpan `waktuKembaliAktual`, `denda`, dan `totalAkhir` saat status menjadi Dikembalikan.
- Berkas yang mungkin berubah: `src/ui/dashboard/pesanan.js (ubah)`, `src/domain/status.js (ubah)`
- Acceptance criteria:
  - [ ] AC-12: Menunggu → Terbooking → Terpinjam → Dikembalikan berhasil; Dibatalkan tersedia di detail untuk status yang mengizinkan; tidak ada transisi melompat.
  - [ ] AC-13: setelah `waktuAmbil` diubah ke tanggal lampau di Local Storage dan halaman dimuat ulang, status menjadi Kedaluwarsa/Tidak Diambil sesuai aturan.
  - [ ] AC-14: label Terlambat muncul di UI tetapi `status` tersimpan tetap "Terpinjam".
  - [ ] AC-16: detail sebelum konfirmasi menampilkan "30 menit → 1 jam × 10% × Rp 65.000", denda Rp 6.500, dan total akhir Rp 201.500.
  - [ ] AC-17 dan AC-18: denda 2 jam = Rp 13.000; kasus melewati plafon tetap Rp 65.000.
  - [ ] AC-08 dan AC-09: pembatalan dan pengembalian melepaskan unit sesuai `SPEC.md` §5.4.
  - [ ] C-01: admin dapat mengisi `waktuKembaliAktual` manual dengan nilai default waktu saat tombol ditekan.
- Pesan commit yang disarankan: `feat(dashboard): aksi status, detail pesanan, dan perhitungan denda`

### T6.5 CRUD gear dan reset data contoh
- Prioritas: Must
- Referensi: SPEC.md M-09, S-04, §4.1, §5.6, AC-21, AC-22, AC-25; UI-SPEC.md §8.4, UI-14, UI-15
- Bergantung pada: T6.1, T1.2, T1.7, T4.4
- Deskripsi: Bangun daftar gear, form tambah/edit, validasi, dan penghapusan dengan konfirmasi. Tolak hapus bila gear masih dipakai pesanan aktif dan sediakan tombol Reset data contoh.
- Berkas yang mungkin berubah: `src/ui/dashboard/gear.js (baru)`
- Acceptance criteria:
  - [ ] AC-21: harga `-1` dan unit `1.5` memunculkan error di bawah kolom dan data tidak tersimpan.
  - [ ] AC-22: menghapus gear yang dipakai pesanan Menunggu/Terbooking/Terpinjam menampilkan peringatan dan tombol hapus dinonaktifkan.
  - [ ] AC-25: Batal pada dialog Reset tidak mengubah data; Konfirmasi mengembalikan 10 gear, 0 pesanan, dan konfigurasi default.
  - [ ] UI-14 dan UI-15: error dan dialog konfirmasi tampil sesuai `UI-SPEC.md`.
  - [ ] Tabel di desktop berubah menjadi daftar kartu di mobile tanpa scroll horizontal.
- Pesan commit yang disarankan: `feat(dashboard): CRUD gear dan reset data contoh`

### T6.6 Pengaturan demo
- Prioritas: Should
- Referensi: SPEC.md S-01, S-08, §4.3, AC-19; UI-SPEC.md §8.5
- Bergantung pada: T6.1, T1.1, T1.8
- Deskripsi: Sediakan form untuk toleransi menit, persen denda per jam, plafon, batas kedaluwarsa, batas tidak diambil, dan nomor WhatsApp placeholder. Simpan perubahan ke konfigurasi lokal dan tampilkan tombol ekspor/impor dari T1.8.
- Berkas yang mungkin berubah: `src/ui/dashboard/pengaturan.js (baru)`, `src/storage/config.js (ubah)`
- Acceptance criteria:
  - [ ] AC-19: mengubah toleransi menjadi 30 menit mengubah perkiraan denda sesuai aturan dan tetap tersimpan setelah memuat ulang.
  - [ ] Mengubah nomor WhatsApp placeholder mengubah tautan di halaman publik dan footer.
  - [ ] Tombol ekspor/impor tersedia dan berperilaku sesuai T1.8.
  - [ ] Tidak ada kolom untuk API key, token, atau kredensial lain.
- Pesan commit yang disarankan: `feat(dashboard): halaman pengaturan demo`

**Selesai jika:** seluruh alur admin dapat dijalankan di satu perangkat dan angka di dashboard konsisten dengan angka di katalog dan keranjang.

---

## M7 — Testing manual

**Tujuan:** Memverifikasi seluruh acceptance criteria `SPEC.md` AC-01–AC-27 dan UI-SPEC.md UI-01–UI-19 menggunakan checklist manual, tanpa menambah framework pengujian.

**Daftar tugas:** T7.1–T7.5.

### T7.1 Uji katalog, pencarian, filter, dan sorting
- Prioritas: Must
- Referensi: SPEC.md AC-01, AC-02; UI-SPEC.md UI-01, UI-02, UI-03, UI-04, UI-05, UI-06
- Bergantung pada: T3.3
- Deskripsi: Jalankan checklist katalog dan catat hasil lulus/gagal per kriteria. Perbaikan kecil dilakukan dalam tugas yang sama bila masih dalam satu sesi.
- Berkas yang mungkin berubah: `README.md (ubah)` bila hasil uji perlu dicatat, `src/ui/katalog.js (ubah)` bila ada perbaikan kecil
- Acceptance criteria:
  - [ ] AC-01 dan AC-02 lulus dengan langkah dan hasil sesuai tabel `SPEC.md` §9.
  - [ ] UI-01 sampai UI-06 lulus, termasuk token warna, kontras, 360 px, `Esc` pada menu, dan tombol Lihat Katalog.
  - [ ] Setiap kriteria memiliki catatan hasil lulus/gagal, bukan asumsi.
- Pesan commit yang disarankan: `test(manual): checklist katalog dan pencarian`

### T7.2 Uji jadwal, stok, dan keranjang
- Prioritas: Must
- Referensi: SPEC.md AC-03, AC-04, AC-05, AC-06, AC-07, AC-08, AC-09; UI-SPEC.md UI-07, UI-08
- Bergantung pada: T4.5
- Deskripsi: Verifikasi Durasi, biaya, dan seluruh skenario irisan/stok habis dengan data contoh G-01 dan dua pesanan buatan. Uji pula pelepasan stok setelah batal dan dikembalikan.
- Berkas yang mungkin berubah: `src/domain/ketersediaan.js (ubah)` bila ada perbaikan kecil, `README.md (ubah)`
- Acceptance criteria:
  - [ ] AC-03 sampai AC-09 lulus, termasuk kasus jadwal bersentuhan (tersedia 3) dan stok habis (tersedia 0).
  - [ ] UI-07 dan UI-08 lulus: jadwal tetap terlihat dan teks stok habis disertai tombol nonaktif berlabel teks.
  - [ ] Skenario irisan dicatat dengan tanggal dan angka yang dipakai agar dapat diulang.
- Pesan commit yang disarankan: `test(manual): checklist jadwal, irisan, dan stok habis`

### T7.3 Uji pesanan dan WhatsApp
- Prioritas: Must
- Referensi: SPEC.md AC-10, AC-11; UI-SPEC.md UI-09, UI-10
- Bergantung pada: T5.1
- Deskripsi: Verifikasi validasi tombol, isi pesan, pembukaan tab WhatsApp, toast, dan pembuatan record pesanan. Pastikan nomor yang dipakai tetap placeholder.
- Berkas yang mungkin berubah: `src/ui/pesanan.js (ubah)` bila ada perbaikan kecil
- Acceptance criteria:
  - [ ] AC-10: tombol nonaktif dengan alasan teks saat nama kosong dan aktif setelah nama diisi.
  - [ ] AC-11 dan UI-10: tab WhatsApp terbuka dengan ringkasan utuh, toast muncul, keranjang kosong, pesanan berstatus Menunggu Konfirmasi.
  - [ ] UI-09: alasan ketidakaktifan tombol terbaca sebagai teks, bukan hanya warna.
- Pesan commit yang disarankan: `test(manual): checklist pesanan dan WhatsApp`

### T7.4 Uji dashboard, status, dan denda
- Prioritas: Must
- Referensi: SPEC.md AC-12–AC-22; UI-SPEC.md UI-11, UI-12, UI-13, UI-14, UI-15
- Bergantung pada: T6.6
- Deskripsi: Jalankan seluruh checklist transisi status, status otomatis, label Terlambat, tabel denda, ringkasan, dan CRUD gear. Pakai angka contoh dari `SPEC.md` §5.5.
- Berkas yang mungkin berubah: `src/ui/dashboard/pesanan.js (ubah)`, `src/ui/dashboard/gear.js (ubah)` bila ada perbaikan kecil
- Acceptance criteria:
  - [ ] AC-12 sampai AC-22 lulus, termasuk denda 0 / 6.500 / 13.000 / plafon 65.000.
  - [ ] UI-11 sampai UI-15 lulus, termasuk banner Mode Demo, satu aksi utama per baris, dan dialog konfirmasi.
  - [ ] Status Kedaluwarsa dan Tidak Diambil diuji dengan mengubah `waktuAmbil` di DevTools → Local Storage lalu memuat ulang halaman.
- Pesan commit yang disarankan: `test(manual): checklist dashboard, status, dan denda`

### T7.5 Uji regresi, persistensi, keamanan dasar, dan tampilan
- Prioritas: Must
- Referensi: SPEC.md AC-23, AC-24, AC-25, AC-26, AC-27, N-05, N-06; UI-SPEC.md UI-16, UI-17, UI-18, UI-19
- Bergantung pada: T7.1, T7.2, T7.3, T7.4
- Deskripsi: Uji ulang seluruh alur setelah perbaikan, termasuk input berbahaya, persistensi, reset, dan aksesibilitas keyboard. Catat browser yang dipakai.
- Berkas yang mungkin berubah: `README.md (ubah)`
- Acceptance criteria:
  - [ ] AC-23: nama `<img src=x onerror=alert(1)>` tampil sebagai teks tanpa popup dan tanpa elemen `<img>` baru.
  - [ ] AC-24 dan AC-25: data bertahan setelah reload; reset dengan Konfirmasi mengembalikan kondisi awal.
  - [ ] AC-26: Network tidak menampilkan API eksternal dan tidak ada kredensial di kode maupun Local Storage.
  - [ ] AC-27 serta UI-16–UI-19 lulus: responsif 360/700/1200 px, navigasi keyboard, zoom 200%, reduced motion, dan label tombol ikon.
  - [ ] UI-05 diulang di Chrome dan salah satu dari Edge/Firefox sesuai N-05.
- Pesan commit yang disarankan: `test(manual): regresi, persistensi, dan aksesibilitas`

**Selesai jika:** seluruh AC-01–AC-27 dan UI-01–UI-19 memiliki hasil manual lulus dan tidak ada temuan yang belum ditangani.

---

## M8 — Security dan aksesibilitas

**Tujuan:** Mengunci hasil uji keamanan dan aksesibilitas sesuai N-03, N-04, N-07, M-13, dan `UI-SPEC.md` §10.

**Daftar tugas:** T8.1–T8.6.

### T8.1 Render aman untuk semua input pengguna
- Prioritas: Must
- Referensi: SPEC.md M-13, N-03, AC-23; UI-SPEC.md §10
- Bergantung pada: T7.5
- Deskripsi: Audit seluruh titik render nama gear, nama penyewa, catatan, deskripsi, dan konfigurasi. Pastikan semuanya memakai `textContent` atau DOM API dan tidak ada `innerHTML` untuk data dinamis.
- Berkas yang mungkin berubah: `src/ui/katalog.js (ubah)`, `src/ui/keranjang.js (ubah)`, `src/ui/pesanan.js (ubah)`, `src/ui/dashboard/pesanan.js (ubah)`, `src/ui/dashboard/gear.js (ubah)`
- Acceptance criteria:
  - [ ] Tidak ada penggunaan `innerHTML` yang menerima nilai dari form, Local Storage, atau URL.
  - [ ] AC-23 lulus ulang setelah audit.
  - [ ] `imageUrl` hanya diterima bila berupa path relatif `/...` atau `./...`; nilai lain jatuh ke placeholder lokal.
- Pesan commit yang disarankan: `fix(security): render input sebagai teks dan validasi path gambar`

### T8.2 Audit secret dan data pribadi
- Prioritas: Must
- Referensi: SPEC.md N-03, N-04, AC-26, §8
- Bergantung pada: T1.1
- Deskripsi: Telusuri seluruh file proyek dengan pencarian teks di editor untuk pola kunci, token, rahasia, dan deretan digit nomor telepon. Pastikan yang ditemukan hanyalah penjelasan dokumentasi bahwa kredensial tidak dipakai; audit README dilakukan ulang di T10.2.
- Berkas yang mungkin berubah: `src/data/seed.js (ubah)`, `src/storage/config.js (ubah)`
- Acceptance criteria:
  - [ ] Tidak ada API key, token, secret, atau variabel kredensial di kode, konfigurasi, maupun Local Storage.
  - [ ] Tidak ada nomor telepon pribadi; nomor WhatsApp hanya berupa placeholder yang jelas ditandai.
  - [ ] Nama pada data contoh hanya Ayu, Bagas, Citra, Dewa, atau nama fiktif lain sesuai `SPEC.md` §4.5.
  - [ ] AC-26 lulus ulang setelah audit.
- Pesan commit yang disarankan: `chore(security): audit kredensial dan data pribadi`

### T8.3 Validasi menyeluruh pada semua form
- Prioritas: Must
- Referensi: SPEC.md M-13, §5.6, AC-21; UI-SPEC.md §6.2, §8.4
- Bergantung pada: T1.7, T6.5
- Deskripsi: Pastikan setiap form memanggil fungsi validasi domain sebelum menyimpan, termasuk form gear, jadwal, keranjang, pesanan, dan pengaturan. Error ditampilkan di bawah kolom dan dikaitkan dengan `aria-describedby`.
- Berkas yang mungkin berubah: `src/domain/validasi.js (ubah)`, `src/ui/jadwal.js (ubah)`, `src/ui/keranjang.js (ubah)`, `src/ui/pesanan.js (ubah)`, `src/ui/dashboard/gear.js (ubah)`, `src/ui/dashboard/pengaturan.js (ubah)`
- Acceptance criteria:
  - [ ] AC-21 dan UI-14 lulus ulang untuk harga negatif dan unit desimal.
  - [ ] Setiap kolom wajib memiliki label terlihat dan penanda `*`.
  - [ ] Error tidak hanya berupa warna tepi; pesan teks dapat dibaca dan dikaitkan ke kolom.
  - [ ] Data tidak tersimpan bila ada satu saja kolom tidak valid.
- Pesan commit yang disarankan: `fix(security): validasi menyeluruh pada form`

### T8.4 Dependensi sesuai persetujuan
- Prioritas: Must
- Referensi: SPEC.md N-01, N-02, N-12, AC-26; UI-SPEC.md §4
- Bergantung pada: T0.1, T5.1
- Deskripsi: Periksa `package.json` dan hasil build untuk memastikan tidak ada dependensi runtime selain Vite dan tidak ada font atau aset eksternal. Perbaiki bila ada dependensi tambahan.
- Berkas yang mungkin berubah: `package.json (ubah)`, `index.html (ubah)`, `vite.config.js (ubah)`
- Acceptance criteria:
  - [ ] Hanya Vite yang terdaftar sebagai dependensi proyek; tidak ada framework, library UI, atau font eksternal.
  - [ ] Tidak ada tag yang memuat sumber daya dari domain luar di `index.html`.
  - [ ] Satu-satunya tautan eksternal adalah `wa.me` yang dibuka pada aksi pengguna.
- Pesan commit yang disarankan: `chore: pastikan dependensi hanya Vite`

### T8.5 Penanganan localStorage rusak
- Prioritas: Must
- Referensi: SPEC.md N-10, AC-24; UI-SPEC.md §9
- Bergantung pada: T1.2, T7.5
- Deskripsi: Perkuat pembacaan penyimpanan agar JSON rusak, kunci hilang, atau kuota penuh tidak membuat aplikasi blank. Tampilkan pesan dan tawarkan Reset data contoh dengan konfirmasi.
- Berkas yang mungkin berubah: `src/storage/repository.js (ubah)`, `src/ui/dashboard/gear.js (ubah)`
- Acceptance criteria:
  - [ ] Mengisi salah satu kunci dengan teks bukan JSON lalu memuat ulang halaman tidak menampilkan halaman kosong atau error konsol yang tidak tertangani.
  - [ ] Muncul pesan bahwa data lokal rusak dan tombol Reset data contoh tersedia.
  - [ ] Setelah reset, aplikasi kembali menampilkan 10 gear dan konfigurasi default.
  - [ ] Data sehat tidak berubah hanya karena halaman dimuat ulang.
- Pesan commit yang disarankan: `fix(storage): tangani data localStorage rusak`

### T8.6 Aksesibilitas lanjutan
- Prioritas: Must
- Referensi: SPEC.md N-07, C-02, C-03; UI-SPEC.md §9, §10, UI-04, UI-16, UI-17, UI-18, UI-19
- Bergantung pada: T2.1, T4.4, T7.5
- Deskripsi: Rapikan urutan tab, cincin fokus, `aria-label` tombol ikon, `alt` gambar, struktur judul, skeleton saat memuat, dan transisi ≤150 ms yang dimatikan pada `prefers-reduced-motion`.
- Berkas yang mungkin berubah: `src/ui/base.css (ubah)`, `src/ui/layout.js (ubah)`, `src/ui/katalog.js (ubah)`, `src/ui/dialog.js (ubah)`, `src/ui/toast.js (ubah)`
- Acceptance criteria:
  - [ ] UI-16: seluruh halaman dapat dinavigasi hanya dengan keyboard dan fokus selalu terlihat.
  - [ ] UI-17 dan UI-19: zoom 200% tidak memotong konten; semua tombol ikon memiliki label teks.
  - [ ] UI-18: mengaktifkan "kurangi gerak" di sistem operasi mematikan transisi.
  - [ ] C-02 dan C-03: skeleton abu-abu tampil saat memuat; perubahan jumlah dan total diumumkan lewat `aria-live="polite"`.
  - [ ] Satu H1 per halaman dan struktur judul berurutan.
- Pesan commit yang disarankan: `fix(a11y): fokus, aria, skeleton, dan reduced motion`

**Selesai jika:** AC-23–AC-26 dan UI-16–UI-19 lulus ulang, tidak ada secret/nomor asli, dan seluruh form tervalidasi.

---

## M9 — Build

**Tujuan:** Menghasilkan artefak statis produksi yang dapat dipindahkan ke hosting tanpa perubahan kode.

**Daftar tugas:** T9.1–T9.2.

### T9.1 Konfigurasi build Vite
- Prioritas: Must
- Referensi: SPEC.md N-01, N-08, N-12
- Bergantung pada: T8.6
- Deskripsi: Pastikan `vite.config.js` dan skrip pada `package.json` menghasilkan build statis dengan jalur aset relatif yang benar untuk folder `dist`. Tidak menambah plugin atau dependensi.
- Berkas yang mungkin berubah: `vite.config.js (ubah)`, `package.json (ubah)`, `index.html (ubah)`
- Acceptance criteria:
  - [ ] Skrip build tersedia dan menghasilkan folder `dist` tanpa error.
  - [ ] Seluruh SVG lokal ikut tersalin ke dalam artefak build.
  - [ ] Tidak ada dependensi atau plugin baru yang ditambahkan.
- Pesan commit yang disarankan: `chore(build): konfigurasi build statis Vite`

### T9.2 Verifikasi artefak produksi
- Prioritas: Must
- Referensi: SPEC.md N-05, N-08, AC-26; UI-SPEC.md §3, §10
- Bergantung pada: T9.1
- Deskripsi: Buka hasil build melalui server statis lokal dan ulangi pemeriksaan ringkas: katalog tampil, aset lokal terbaca, tidak ada permintaan eksternal, dan halaman siap digunakan kurang dari 2 detik di localhost.
- Berkas yang mungkin berubah: `README.md (ubah)`
- Acceptance criteria:
  - [ ] Katalog, keranjang, dan dashboard dapat dibuka dari artefak build tanpa error konsol.
  - [ ] DevTools → Network hanya menunjukkan aset lokal dan tautan WhatsApp saat diklik.
  - [ ] Waktu sampai halaman siap pakai di localhost di bawah 2 detik untuk 10 gear dan kurang dari 100 pesanan.
  - [ ] Chrome, Edge, dan Firefox versi terbaru menampilkan halaman tanpa kerusakan tata letak.
- Pesan commit yang disarankan: `test(build): verifikasi artefak produksi`

**Selesai jika:** build statis berhasil, seluruh halaman berfungsi dari artefak, dan tidak ada permintaan jaringan di luar aset lokal serta `wa.me`.

---

## M10 — Deployment dan dokumentasi (README)

**Tujuan:** Mendokumentasikan cara menjalankan proyek, menyelaraskan UI-SPEC dengan keputusan SPEC, dan menyiapkan panduan deployment yang dijalankan manual oleh pemilik proyek.

**Daftar tugas:** T10.1–T10.3.

### T10.1 README proyek
- Prioritas: Must
- Referensi: SPEC.md N-01, N-12, §10 Iterasi 0, §11, §12; UI-SPEC.md §11
- Bergantung pada: T9.2
- Deskripsi: Tulis README berisi gambaran aplikasi, struktur folder, cara menjalankan pengembangan dan build, ringkasan aturan bisnis, serta penjelasan bahwa data hanya lokal dan nomor WhatsApp bersifat placeholder.
- Berkas yang mungkin berubah: `README.md (baru)`
- Acceptance criteria:
  - [ ] README menjelaskan Vite + JavaScript vanilla tanpa backend dan tanpa login.
  - [ ] Struktur dokumen mengikuti struktur folder yang dipakai implementasi.
  - [ ] Tidak ada API key, token, atau nomor telepon asli di README.
  - [ ] Pembaca baru dapat mengikuti langkah menjalankan proyek tanpa bertanya lagi.
- Pesan commit yang disarankan: `docs: tambah README MaruemGear`

### T10.2 Panduan deployment Vercel (langkah manual pemilik proyek)
- Prioritas: Should
- Referensi: SPEC.md §8 butir 9, N-12; UI-SPEC.md §1
- Bergantung pada: T10.1
- Deskripsi: Tulis langkah deployment statis ke Vercel di README. Login, pembuatan akun, import repositori, dan konfigurasi project dilakukan sendiri oleh pemilik proyek; agen tidak menjalankan langkah yang membutuhkan akun.
- Berkas yang mungkin berubah: `README.md (ubah)`
- Acceptance criteria:
  - [ ] README menyebut secara eksplisit bahwa login/akun Vercel menjadi tanggung jawab pemilik proyek.
  - [ ] Langkah menuliskan pengaturan build statis yang menghasilkan `dist` dan tidak menambah variabel lingkungan berisi rahasia.
  - [ ] Tidak ada perintah atau tindakan yang dijalankan agen dalam tugas ini.
  - [ ] Pemilik dapat memverifikasi hasil deployment dengan membuka URL publik dan mengulang AC-01.
- Pesan commit yang disarankan: `docs: tambah panduan deployment statis untuk pemilik proyek`

### T10.3 Sinkronisasi UI-SPEC dengan keputusan SPEC
- Prioritas: Must
- Referensi: SPEC.md §11 keputusan 1–7, §12; UI-SPEC.md §7.4, §8.2, §8.5, §12, §13
- Bergantung pada: T10.1
- Deskripsi: Sesuaikan dokumen UI dengan keputusan yang sudah dikunci `SPEC.md`: hapus baris deposit, samakan jumlah kartu ringkasan, prioritas Pengaturan dan pratinjau pesan, format kode sewa, dan kondisi gear contoh. Tidak mengubah aturan bisnis di `SPEC.md`.
- Berkas yang mungkin berubah: `ui.md (ubah)`
- Acceptance criteria:
  - [ ] Wireframe keranjang tidak lagi memuat baris Deposit atau Total saat pengambilan.
  - [ ] Jumlah kartu ringkasan dan prioritas fitur di UI sesuai `SPEC.md` §11.
  - [ ] Format kode sewa dan data contoh di wireframe sesuai `SPEC.md` §4.2 dan §4.5.
  - [ ] Pertanyaan terbuka di `UI-SPEC.md` §13 yang sudah diputuskan ditandai sebagai selesai.
- Pesan commit yang disarankan: `docs: selaraskan UI-SPEC dengan keputusan SPEC`

**Selesai jika:** README tersedia, panduan deployment jelas sebagai langkah manual pemilik, dan tidak ada konflik dokumen yang tersisa selain yang tercatat di Pertanyaan terbuka.

---

## 1. Tabel keterlacakan

### 1.1 Kebutuhan fungsional dan nonfungsional SPEC.md

| Kebutuhan | Sumber | ID tugas |
|---|---|---|
| M-01 Seed katalog | SPEC §3.1 | T0.3, T1.1, T2.3 |
| M-02 Pencarian & filter | SPEC §3.1 | T3.1, T3.2 |
| M-03 Sorting | SPEC §3.1 | T3.3 |
| M-04 Jadwal sewa | SPEC §3.1 | T1.3, T2.2, T4.1 |
| M-05 Ketersediaan | SPEC §3.1 | T1.4, T4.2 |
| M-06 Keranjang | SPEC §3.1 | T4.3 |
| M-07 Form pesanan | SPEC §3.1 | T4.5 |
| M-08 Kirim via WhatsApp | SPEC §3.1 | T4.5, T5.1 |
| M-09 Dashboard demo | SPEC §3.1 | T6.1, T6.2, T6.3, T6.5 |
| M-10 Manajemen status | SPEC §3.1 | T1.6, T6.4 |
| M-11 Perhitungan denda | SPEC §3.1 | T1.5, T6.4 |
| M-12 Penyimpanan | SPEC §3.1 | T1.2, T8.5 |
| M-13 Input aman | SPEC §3.1 | T1.7, T8.1, T8.3 |
| S-01 Pengaturan | SPEC §3.2 | T1.1, T6.6 |
| S-02 Pratinjau pesan | SPEC §3.2 | T5.1 |
| S-03 Detail pesanan | SPEC §3.2 | T6.4 |
| S-04 Dialog konfirmasi | SPEC §3.2 | T4.4, T6.5 |
| S-05 Toast & empty state | SPEC §3.2 | T3.3, T4.4 |
| S-06 Kartu ringkasan tambahan | SPEC §3.2 | T6.2 |
| S-07 Filter & pencarian pesanan | SPEC §3.2 | T6.3 |
| S-08 Ekspor/impor JSON | SPEC §3.2 | T1.8, T6.6 |
| C-01 Waktu kembali aktual manual | SPEC §3.3 | T6.4 |
| C-02 Skeleton & reduced motion | SPEC §3.3 | T8.6 |
| C-03 Toast aria-live | SPEC §3.3 | T4.4, T8.6 |
| C-04 Jam layanan footer | SPEC §3.3 | T2.2, T5.2 |
| N-01 Teknologi Vite vanilla | SPEC §6 | T0.1, T8.4, T9.1, T10.1 |
| N-02 Tanpa backend | SPEC §6 | T0.1, T5.1, T8.4 |
| N-03 Keamanan & render aman | SPEC §6 | T8.1, T8.2 |
| N-04 Privasi data contoh | SPEC §6 | T1.1, T5.2, T8.2 |
| N-05 Browser | SPEC §6 | T7.5, T9.2 |
| N-06 Responsif | SPEC §6 | T2.1, T2.2, T6.1, T7.5 |
| N-07 Aksesibilitas | SPEC §6 | T2.1, T8.6 |
| N-08 Kinerja | SPEC §6 | T0.3, T9.2 |
| N-09 Konsistensi format | SPEC §6 | T1.3, T2.1 |
| N-10 Ketahanan data | SPEC §6 | T1.2, T8.5 |
| N-11 Deterministik satu modul domain | SPEC §6 | T1.3, T1.4, T1.5, T1.6 |
| N-12 Perintah aman | SPEC §6 | T0.1, T8.4, T9.1, T10.1, T10.2 |
| Model gear | SPEC §4.1 | T1.1, T1.7, T6.5 |
| Model pesanan | SPEC §4.2 | T1.3, T4.5, T6.4 |
| Konfigurasi & keranjang | SPEC §4.3 | T1.1, T4.3, T6.6 |
| Kunci localStorage | SPEC §4.4 | T1.2, T8.5 |
| Data contoh 10 gear | SPEC §4.5 | T1.1, T8.2 |
| Waktu & biaya sewa | SPEC §5.1 | T1.3, T4.1 |
| Status & transisi | SPEC §5.2 | T1.6, T6.4 |
| Status otomatis | SPEC §5.3 | T1.6, T6.4 |
| Ketersediaan unit | SPEC §5.4 | T1.4, T4.2 |
| Denda keterlambatan | SPEC §5.5 | T1.5, T6.4 |
| Validasi input | SPEC §5.6 | T1.7, T8.3 |
| Ringkasan WhatsApp | SPEC §5.7 | T5.1 |
| Iterasi 0–5 | SPEC §10 | T0.1–T6.6 |
| Keputusan ui.md | SPEC §11 | T10.3 |
| Definition of Done | SPEC §12 | T7.5, T8.2, T9.2, T10.3 |

### 1.2 Acceptance criteria fungsional SPEC.md

| AC | ID tugas | AC | ID tugas |
|---|---|---|---|
| AC-01 | T2.3, T7.1 | AC-15 | T1.5, T6.4, T7.4 |
| AC-02 | T3.1, T3.2, T3.3, T7.1 | AC-16 | T1.5, T6.4, T7.4 |
| AC-03 | T1.3, T4.1, T7.2 | AC-17 | T1.5, T6.4, T7.4 |
| AC-04 | T1.3, T4.1, T4.3, T7.2 | AC-18 | T1.5, T6.4, T7.4 |
| AC-05 | T1.4, T4.2, T7.2 | AC-19 | T1.1, T1.5, T6.6, T7.4 |
| AC-06 | T1.4, T4.2, T4.3, T7.2 | AC-20 | T6.2, T7.4 |
| AC-07 | T1.4, T4.2, T4.3, T7.2 | AC-21 | T1.7, T6.5, T7.4, T8.3 |
| AC-08 | T1.2, T1.4, T6.4, T7.2 | AC-22 | T6.5, T7.4 |
| AC-09 | T1.4, T6.4, T7.2 | AC-23 | T4.5, T8.1, T7.5 |
| AC-10 | T4.5, T5.1, T7.3 | AC-24 | T1.2, T8.5, T7.5 |
| AC-11 | T4.5, T5.1, T7.3 | AC-25 | T1.2, T6.5, T7.5 |
| AC-12 | T1.6, T6.4, T7.4 | AC-26 | T8.2, T8.4, T9.2, T7.5 |
| AC-13 | T1.6, T6.4, T7.4 | AC-27 | T2.1, T2.2, T6.1, T7.5 |
| AC-14 | T1.6, T6.4, T7.4 | | |

### 1.3 Acceptance criteria tampilan UI-SPEC.md

| UI | ID tugas | UI | ID tugas |
|---|---|---|---|
| UI-01 | T2.1, T7.1 | UI-11 | T6.1, T7.4 |
| UI-02 | T2.1, T7.1 | UI-12 | T6.3, T7.4 |
| UI-03 | T2.1, T7.1 | UI-13 | T6.4, T7.4 |
| UI-04 | T7.1, T8.6 | UI-14 | T6.5, T7.4, T8.3 |
| UI-05 | T3.3, T7.1, T7.5 | UI-15 | T6.5, T7.4 |
| UI-06 | T2.2, T7.1 | UI-16 | T8.6, T7.5 |
| UI-07 | T4.1, T7.2 | UI-17 | T8.6, T7.5 |
| UI-08 | T4.2, T7.2 | UI-18 | T8.6, T7.5 |
| UI-09 | T5.1, T7.3 | UI-19 | T8.6, T7.5 |
| UI-10 | T5.1, T7.3 | | |

---

## 2. Asumsi

1. **Penamaan dokumen:** file `ui.md` adalah UI-SPEC yang dimaksud. Bukti: judul internalnya `UI-SPEC.md — MaruemGear`, `SPEC.md` merujuk ke `ui.md`, dan keduanya membahas MaruemGear. Tidak ada file bernama `UI-SPEC.md` di disk saat perencanaan dibuat (lihat Q1).
2. **Struktur folder:** `SPEC.md` §10 menyebut `data/`, `domain/`, `storage/`, `ui/` tanpa menentukan root. Rencana ini menempatkannya di bawah `src/` dan menambah `public/images/gear/`. Belum ada file kode di proyek saat rencana ini ditulis.
3. **Kode sewa:** memakai format `RG-YYYYMMDD-NNN` sesuai `SPEC.md` §4.2/§11, bukan format pendek pada wireframe UI.
4. **Waktu:** seluruh waktu lokal perangkat berformat `YYYY-MM-DDTHH:mm`; tidak ada konversi UTC dan tidak ada sinkronisasi antarperangkat.
5. **Satu perangkat:** penyewa dan admin bergantian memakai browser yang sama; data tidak dienkripsi karena bukan data pribadi.
6. **Pemeriksaan manual:** AC dan UI-AC dijalankan di browser dengan bantuan DevTools → Local Storage dan Network; tidak ada framework pengujian.
7. **Commit:** satu tugas menghasilkan satu commit; pesan commit pada dokumen ini bersifat usulan dan tidak dijalankan oleh agen dalam fase perencanaan.
8. **Tanpa perintah:** dalam penyusunan `TASKS.md` tidak ada perintah yang dijalankan; satu-satunya berkas yang dibuat adalah `TASKS.md`.
9. **Estimasi pendapatan:** memakai `totalAkhir` pesanan Dikembalikan (sudah termasuk denda) sesuai `SPEC.md` §5.5 dan AC-20.

---

## 3. Pertanyaan terbuka (termasuk konflik antar-dokumen)

Aturan penyelesaian: `SPEC.md` menang untuk aturan bisnis, `ui.md` menang untuk tampilan. Semua konflik dicatat di sini tanpa keputusan diam-diam.

| ID | Konflik / ketidakjelasan | Sumber | Perlakuan dalam rencana |
|---|---|---|---|
| Q1 | Tidak ada file bernama `UI-SPEC.md`; yang ada `ui.md` dengan judul internal `UI-SPEC.md — MaruemGear` | Filesystem vs judul dokumen | Dipakai sebagai UI-SPEC berdasarkan isi dan rujukan `SPEC.md`; perlu dikonfirmasi pemilik proyek bila ingin mengganti nama file. |
| Q2 | Wireframe keranjang menampilkan Deposit Rp 100.000 dan "Total saat pengambilan", tetapi `SPEC.md` menyatakan deposit out-of-scope dan baris tersebut dihapus | UI §7.4 vs SPEC §8 butir 3, §11 keputusan 4 | Ikuti `SPEC.md`: tidak ada deposit; T4.3 dan T10.3 menghapus baris tersebut. |
| Q3 | UI menyebut "Empat kartu angka", `SPEC.md` menetapkan 3 kartu wajib + 2 kartu Should (total 5) | UI §8.2 vs SPEC §11 keputusan 5 | Ikuti `SPEC.md`: T6.2 membangun 3 wajib + 2 Should; UI perlu diselaraskan di T10.3. |
| Q4 | Pengaturan ditandai "(Could)" di UI, tetapi "Should" (S-01) di `SPEC.md` dan sudah diputuskan tampil di dashboard | UI §8.5 vs SPEC §3.2, §11 keputusan 3 | Ikuti `SPEC.md`: Should, dikerjakan di T6.6. |
| Q5 | Kode contoh UI berformat `RG-1121-001`, `SPEC.md` menetapkan `RG-YYYYMMDD-NNN` | UI §8.3 wireframe vs SPEC §4.2, §11 keputusan 6 | Ikuti `SPEC.md`; wireframe diperbarui di T10.3. |
| Q6 | UI menunjukkan Sleeping Bag ber-kondisi "Perlu perawatan", sedangkan `SPEC.md` menetapkan G-05 Sleeping Bag "Baik" dan G-04 Carrier 65L "Perlu perawatan" | UI §8.4 wireframe vs SPEC §4.5 | Ikuti `SPEC.md` untuk data; T10.3 menyelaraskan wireframe. |
| Q7 | UI menyebut error untuk "durasi < 1 hari", tetapi `SPEC.md` hanya mensyaratkan waktu kembali > waktu ambil dan `durasiHari` minimum 1 | UI §9 vs SPEC §5.1 butir 3–5 | Ikuti `SPEC.md`: jadwal 12 jam tetap 1 hari dan valid; UI perlu diperjelas di T10.3. |
| Q8 | Pratinjau pesan disebut "Opsional (Could)" di UI, tetapi S-02 di `SPEC.md` berprioritas Should | UI §7.4 vs SPEC §3.2 | Ikuti `SPEC.md`: Should, dikerjakan di T5.1. |
| Q9 | Badge UI memakai teks pendek "Menunggu", sementara nilai status adalah "Menunggu Konfirmasi" | UI §6.4 vs SPEC §5.2 | Bukan konflik data: UI menang untuk tampilan, nilai tersimpan tetap "Menunggu Konfirmasi". |
| Q10 | AC-20 menyebut `totalAkhir`/`totalBiaya`, UI menyebut pendapatan "pesanan selesai ditambah denda" | SPEC AC-20, §5.5 vs UI §8.2 | Dipakai `totalAkhir = totalBiaya + denda` sesuai rumus `SPEC.md`; asumsi dicatat. |
| Q11 | Tautan navigasi "Cara Sewa" disebut di UI tetapi tidak ada spesifikasi bagian/isi tersendiri | UI §7.1 | T2.2 mengarahkan ke anchor yang sudah ada; bila pemilik ingin halaman khusus, masuk ke Saran dan belum dimasukkan ke tugas. |
| Q12 | UI §8.5 hanya menyebut toleransi, persen denda, batas kedaluwarsa, dan nomor WhatsApp; konfigurasi `SPEC.md` juga memuat plafon dan batas tidak diambil | UI §8.5 vs SPEC §4.3 | Ikuti `SPEC.md`: T6.6 menyediakan semua field konfigurasi. |
| Q13 | Wireframe dashboard desktop menampilkan kontrol pagination `[<] 1 [>]`, tetapi tidak ada kebutuhan pagination di `SPEC.md` maupun daftar fitur UI | UI §8.3 wireframe | Tidak dijadikan tugas; masuk Saran (opsional) dan menunggu keputusan pemilik. |

---

## 4. Saran (opsional)

Semua poin di bawah **tidak termasuk tugas** dan tidak menambah fitur di luar kedua spesifikasi.

1. **Pagination daftar pesanan** bila jumlah pesanan melebihi satu layar (Q13). Perlu keputusan pemilik karena tidak ada di `SPEC.md`.
2. **Halaman "Cara Sewa" tersendiri** dengan tiga langkah ringkas bila tautan di navbar dianggap perlu tujuan khusus (Q11).
3. **Tombol "Isi tanggal kemarin untuk uji" di Pengaturan** agar AC-13 tidak perlu menyunting Local Storage manual. Ini memerlukan perubahan `SPEC.md` karena menyentuh data contoh.
4. **Ringkasan gear paling sering disewa** di dashboard bila latihan diperpanjang (semula ditanyakan di UI §13 butir 5).
5. **Pemisahan berkas CSS per halaman** bila `base.css` menjadi terlalu besar; tidak mengubah design token.
6. **Panduan kontribusi (`CONTRIBUTING.md`)** berisi konvensi commit bila proyek dipakai bersama, meski saat ini hanya latihan satu perangkat.
