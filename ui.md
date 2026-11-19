# UI-SPEC.md — MaruemGear

> Spesifikasi antarmuka untuk MaruemGear, sistem penyewaan gear hiking berbasis web.
> Gaya: **abu-abu industrial + hijau daun pisang**. Font sans-serif. Mobile-first. Kontras aman.
> **Dokumen ini belum berisi kode aplikasi.** Nilai warna dan ukuran di bawah adalah *design token* untuk dipakai saat implementasi.

**Referensi:** aturan bisnis dan fitur mengikuti rancangan penyewaan gear yang sudah dibahas: katalog, pilih tanggal dan jam, keranjang, kirim pesanan via WhatsApp, status pesanan (Menunggu Konfirmasi, Terbooking, Terpinjam, Dikembalikan, Dibatalkan, Kedaluwarsa, Tidak Diambil, serta label turunan Terlambat), toleransi keterlambatan, dan dashboard demo tanpa login. Jika `SPEC.md` utama berbeda dari itu, `SPEC.md` yang menang untuk aturan bisnis, sedangkan dokumen ini menang untuk tampilan.

---

## 1. Tujuan dan Ruang Lingkup

**Tujuan:** tampilan yang terasa kokoh dan fungsional seperti perlengkapan lapangan, mudah dipakai di ponsel, dan terbaca jelas bagi semua pengguna.

**Cakupan halaman:**
1. Halaman publik: navbar, hero, jadwal sewa, katalog (filter, pencarian, sorting, grid produk), keranjang, kirim pesanan via WhatsApp.
2. Dashboard demo: ringkasan, daftar pesanan dan aksi status, kelola gear (CRUD), pengaturan (opsional).

**Di luar cakupan UI:** mode gelap, animasi kompleks, ilustrasi dekoratif, tampilan cetak, dan multi-bahasa.

## 2. Prinsip Desain

1. **Fungsi dulu.** Informasi inti (harga per hari, ketersediaan di jadwal terpilih, total) selalu tampak tanpa harus membuka apa pun.
2. **Industrial tapi hangat.** Dasar abu-abu netral yang tegas, dengan hijau daun pisang sebagai satu-satunya warna aksen utama.
3. **Satu aksi utama per layar.** Tombol hijau penuh hanya untuk aksi terpenting (Tambah, Kirim Pesanan, Simpan, aksi status berikutnya).
4. **Status tidak hanya berupa warna.** Setiap status memakai teks dan ikon, bukan hanya warna.
5. **Tidak generik.** Hindari gradien ungu, tiga kartu fitur yang seragam, emoji sebagai ikon utama, dan teks pengisi klise. Pakai data nyata (nama gear, harga, jadwal).
6. **Mobile-first.** Rancang dari lebar 360 px, lalu perluas ke layar lebih besar.

## 3. Palet Warna

### 3.1 Token

**Abu-abu industrial (netral)**

| Token | Hex | Pemakaian |
|---|---|---|
| `--granite-900` | `#2B3136` | Navbar, footer, sidebar dashboard |
| `--ink` | `#1E2327` | Teks utama |
| `--muted` | `#566068` | Teks sekunder, label kecil |
| `--border` | `#7A848B` | Garis tepi kontrol (input, tombol sekunder) |
| `--divider` | `#D9DDE0` | Garis pemisah dekoratif, tepi kartu |
| `--surface-2` | `#E8EBED` | Latar area gambar, header tabel, kolom nonaktif |
| `--bg` | `#F4F5F6` | Latar halaman |
| `--surface` | `#FFFFFF` | Kartu, form, dialog |

**Hijau daun pisang (aksen)**

| Token | Hex | Pemakaian |
|---|---|---|
| `--leaf-900` | `#244A15` | Teks di atas hijau muda, status aktif |
| `--leaf-800` | `#2F5A1B` | Tombol saat hover |
| `--leaf-700` | `#3B6A22` | **Warna utama**: tombol utama, tautan, tab aktif |
| `--leaf-400` | `#8DB85A` | Aksen di atas latar gelap, garis penanda menu aktif |
| `--leaf-300` | `#A9CB7E` | Teks aksen di atas latar gelap |
| `--leaf-100` | `#D3E5B8` | Latar hijau muda (chip terpilih) |
| `--leaf-50` | `#E6F0D8` | Latar hero, badge Terbooking |

**Status dan sistem**

| Token | Hex | Pemakaian |
|---|---|---|
| `--danger` | `#B3261E` | Tombol hapus/batalkan, error |
| `--danger-bg` / `--danger-text` | `#F9DEDC` / `#8F1D17` | Badge Terlambat, pesan error |
| `--warn-bg` / `--warn-text` | `#FBE9C0` / `#7A4B00` | Menunggu Konfirmasi, stok menipis, Perlu perawatan |
| `--neutral-bg` / `--neutral-text` | `#E1E5E8` / `#2B3136` | Dikembalikan |
| `--focus-light` | `#1F5FBF` | Cincin fokus di atas latar terang |
| `--focus-dark` | `#F2C94C` | Cincin fokus di atas latar gelap (navbar, sidebar) |

**Aturan pemakaian:** komposisi sekitar 60% netral terang, 30% abu gelap (navbar, sidebar, footer), 10% hijau. Tidak ada warna di luar token ini.

### 3.2 Pengecekan kontras (sudah dihitung dengan rumus WCAG 2.x)

| Pasangan | Rasio | Syarat | Lulus |
|---|---|---|---|
| `--ink` di atas `--bg` | 14,52 : 1 | 4,5 : 1 | Ya |
| `--ink` di atas `--surface` | 15,85 : 1 | 4,5 : 1 | Ya |
| `--muted` di atas `--surface` | 6,42 : 1 | 4,5 : 1 | Ya |
| `--muted` di atas `--bg` | 5,89 : 1 | 4,5 : 1 | Ya |
| `--muted` di atas `--surface-2` | 5,37 : 1 | 4,5 : 1 | Ya |
| Putih di atas `--leaf-700` (tombol utama) | 6,42 : 1 | 4,5 : 1 | Ya |
| Putih di atas `--leaf-800` (hover) | 8,08 : 1 | 4,5 : 1 | Ya |
| `--leaf-700` sebagai teks/tautan di atas `--surface` | 6,42 : 1 | 4,5 : 1 | Ya |
| `--leaf-700` sebagai teks di atas `--bg` | 5,88 : 1 | 4,5 : 1 | Ya |
| `--leaf-900` di atas `--leaf-50` | 8,63 : 1 | 4,5 : 1 | Ya |
| `--ink` di atas `--leaf-100` | 11,83 : 1 | 4,5 : 1 | Ya |
| Putih di atas `--granite-900` | 13,16 : 1 | 4,5 : 1 | Ya |
| `#D9DDE0` di atas `--granite-900` (menu sidebar) | 9,63 : 1 | 4,5 : 1 | Ya |
| `--leaf-300` di atas `--granite-900` (menu aktif) | 7,23 : 1 | 4,5 : 1 | Ya |
| `--leaf-400` di atas `--granite-900` | 5,73 : 1 | 4,5 : 1 | Ya |
| `--danger` di atas `--surface` | 6,54 : 1 | 4,5 : 1 | Ya |
| Putih di atas `--danger` | 6,54 : 1 | 4,5 : 1 | Ya |
| `--danger-text` di atas `--danger-bg` | 7,01 : 1 | 4,5 : 1 | Ya |
| `--warn-text` di atas `--warn-bg` | 6,18 : 1 | 4,5 : 1 | Ya |
| `--neutral-text` di atas `--neutral-bg` | 10,39 : 1 | 4,5 : 1 | Ya |
| `--border` di atas `--surface` (tepi input) | 3,82 : 1 | 3 : 1 (komponen UI) | Ya |
| `--focus-light` di atas `--surface` | 6,09 : 1 | 3 : 1 | Ya |
| `--focus-dark` di atas `--granite-900` | 8,30 : 1 | 3 : 1 | Ya |

**Catatan:** `--leaf-400` dan `--divider` tidak boleh dipakai sebagai warna teks di atas latar terang. Teks nonaktif memakai `#6F7881` di atas `--surface-2` (3,75 : 1); WCAG membebaskan elemen nonaktif, tetapi teksnya tetap harus terbaca.

## 4. Tipografi

- **Font:** sans-serif bawaan sistem, tanpa font eksternal (lebih cepat dan tetap bekerja tanpa jaringan).
  `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- **Angka harga** memakai angka tabular agar kolom harga rapi.
- **Label kategori dan label kecil:** huruf kapital, jarak antarhuruf sedikit lebih lebar, kesan label perlengkapan.

| Gaya | Mobile | Desktop (≥1024 px) | Berat |
|---|---|---|---|
| H1 (hero) | 28 px | 40 px | 700 |
| H2 (judul bagian) | 22 px | 28 px | 700 |
| H3 (nama produk, judul kartu) | 18 px | 20 px | 600 |
| Body | 16 px | 16 px | 400 |
| Kecil (info, label) | 14 px | 14 px | 400 / 600 |
| Label kapital | 12 px | 12 px | 700 |

Tinggi baris 1,5 untuk teks, 1,25 untuk judul. Ukuran teks minimum 14 px (label kapital 12 px hanya untuk kategori).

## 5. Spasi, Bentuk, dan Titik Henti

- **Skala spasi:** kelipatan 4 px (4, 8, 12, 16, 24, 32, 48).
- **Radius:** 6 px untuk kartu, tombol, dan input (tegas, tidak terlalu bulat).
- **Garis tepi:** 1 px; bayangan sangat tipis atau tanpa bayangan.
- **Target sentuh:** minimal 44 × 44 px untuk semua tombol dan kontrol.
- **Lebar konten maksimum:** 1200 px, rata tengah.

| Titik henti | Lebar | Grid katalog | Perilaku utama |
|---|---|---|---|
| Dasar (mobile) | < 640 px | 1 kolom | Filter di panel buka-tutup; keranjang layar penuh; navbar hamburger |
| Kecil | 640–1023 px | 2 kolom | Filter di panel; keranjang panel samping |
| Besar | ≥ 1024 px | 3 kolom + sidebar filter | Navbar penuh; keranjang panel kanan 400 px |

## 6. Komponen

### 6.1 Tombol

| Varian | Tampilan | Pemakaian |
|---|---|---|
| Utama | Latar `--leaf-700`, teks putih; hover `--leaf-800` | Tambah ke keranjang, Kirim Pesanan via WhatsApp, Simpan, aksi status berikutnya |
| Sekunder | Latar putih, tepi `--border`, teks `--ink` | Batal, Ubah jadwal, Reset filter |
| Bahaya | Latar `--danger`, teks putih | Hapus, Batalkan pesanan (selalu lewat konfirmasi) |
| Teks | Tanpa latar, teks `--leaf-700` bergaris bawah | Tautan dan aksi ringan |
| Nonaktif | Latar `--surface-2`, teks `#6F7881`, kursor tidak-boleh | Stok habis di jadwal, form belum valid |

Semua tombol: tinggi minimal 44 px, label berupa kata kerja jelas, cincin fokus 2 px dengan jarak 2 px.

### 6.2 Input dan form

- Label **selalu terlihat** di atas kolom (bukan placeholder saja). Kolom wajib bertanda `*`.
- Tepi `--border` 1 px; saat fokus tepi `--focus-light` 2 px.
- Pesan error: teks `--danger-text` di bawah kolom disertai ikon, dikaitkan ke kolom lewat `aria-describedby`. Tidak hanya mengubah warna tepi.
- Input tanggal dan jam memakai kontrol bawaan browser agar ramah ponsel.

### 6.3 Kartu produk

Susunan dari atas: gambar 4:3 (latar `--surface-2`, placeholder lokal bila gagal dimuat) → label kategori → nama gear → harga per hari → status ketersediaan pada jadwal terpilih → pengatur jumlah (− 1 +) → tombol **Tambah ke keranjang**.

| Kondisi | Tampilan |
|---|---|
| Tersedia | Teks "Tersedia N unit di jadwal ini" |
| Stok menipis (≤ 2 unit) | Badge kuning "Tersisa N" |
| Habis di jadwal terpilih | Teks "Habis di jadwal ini", tombol nonaktif berlabel "Tidak tersedia" |
| Perlu perawatan | Badge kuning "Perlu perawatan", tombol nonaktif |
| Jadwal belum dipilih | Teks "Pilih jadwal untuk melihat ketersediaan" |

### 6.4 Badge status pesanan

| Status | Latar / teks | Ikon + teks |
|---|---|---|
| Menunggu Konfirmasi | `--warn-bg` / `--warn-text` | Ikon jam + "Menunggu" |
| Terbooking | `--leaf-50` / `--leaf-900` | Ikon centang + "Terbooking" |
| Terpinjam | `--leaf-700` / putih | Ikon kotak + "Terpinjam" |
| Dikembalikan | `--neutral-bg` / `--neutral-text` | Ikon panah kembali + "Dikembalikan" |
| Dibatalkan, Kedaluwarsa, Tidak Diambil | `--surface-2` / `--muted` | Ikon silang + nama status |
| **Terlambat** (label turunan, tampil berdampingan dengan Terpinjam) | `--danger-bg` / `--danger-text` | Ikon peringatan + "Terlambat" |

### 6.5 Komponen lain

- **Chip kategori:** pil dengan tepi `--border`; terpilih berlatar `--leaf-100` dengan teks `--ink` dan ikon centang.
- **Dialog konfirmasi:** judul jelas, penjelasan konsekuensi, dua tombol (Batal sekunder, aksi bahaya/utama). Fokus berpindah ke dialog dan kembali ke pemicu saat ditutup; `Esc` menutup.
- **Toast:** muncul di bawah, hilang otomatis setelah 5 detik, dapat ditutup, dibaca pembaca layar (`aria-live="polite"`).
- **Empty state:** pesan singkat dan satu tombol tindakan (mis. "Tidak ada gear yang cocok. [Reset filter]").
- **Banner Mode Demo:** latar `--warn-bg`, teks `--warn-text`, ikon peringatan, selalu tampak di dashboard.

---

## 7. Halaman Publik

### 7.1 Navbar

- Latar `--granite-900`, teks putih, tinggi 56 px (mobile) dan 64 px (desktop).
- **Mobile:** tombol Menu, nama "MaruemGear", tombol Keranjang dengan penanda jumlah item. Menu membuka daftar tautan: Katalog, Cara Sewa, Dashboard.
- **Desktop:** nama di kiri; tautan Katalog dan Cara Sewa; di kanan Keranjang (jumlah item) dan tombol Dashboard bertanda "Demo".
- Tautan aktif ditandai garis bawah `--leaf-400` 3 px, bukan hanya warna.

### 7.2 Hero

- Latar `--leaf-50`, teks `--ink`.
- Judul (H1): **"Sewa perlengkapan hiking per hari."** Sub: "Pilih gear, tentukan jadwal, pesan lewat WhatsApp."
- Satu tombol utama: **Lihat Katalog** (menggulir ke katalog).
- **Kartu Jadwal Sewa** (ambil dan kembali: tanggal + jam, durasi otomatis). Di desktop berada di kanan hero; di mobile di bawah teks hero. Jadwal yang dipilih tetap terlihat saat menelusuri katalog (baris ringkas melekat di atas grid pada mobile).

### 7.3 Katalog

- **Mobile:** kolom pencarian, tombol Filter (menampilkan jumlah filter aktif) dan Urutkan, deretan chip kategori yang dapat digeser, grid 1 kolom, baris keranjang melekat di bawah layar.
- **Desktop:** sidebar filter kiri (kategori, "Hanya tersedia", Reset filter), toolbar pencarian + urutan di atas grid 3 kolom.
- **Urutan:** Unggulan dulu (default), Harga termurah, Harga termahal, Nama A–Z.
- Teks hasil: "Menampilkan X dari Y gear". Hasil kosong memakai empty state.

**Wireframe mobile (360 px) — beranda dan katalog**

```
+--------------------------------------+
| [Menu]  MaruemGear   [Keranjang 2]   |
+--------------------------------------+
| SEWA GEAR HIKING                     |
| Perlengkapan hiking per hari.        |
| Pilih gear, tentukan jadwal,         |
| pesan lewat WhatsApp.                |
|                                      |
| [ Lihat Katalog ]                    |
+--------------------------------------+
| JADWAL SEWA                          |
| Ambil     [21 Nov 2026] [09:00]      |
| Kembali   [23 Nov 2026] [18:00]      |
| Durasi: 3 hari                       |
+--------------------------------------+
| [ Cari gear...                   ]   |
| [ Filter (1) ]   Urutkan [Unggulan v]|
| (Semua) (Tenda) (Tas) (Tidur) >      |
| Menampilkan 10 dari 10 gear          |
|                                      |
| +----------------------------------+ |
| | [ gambar 4:3 ]                   | |
| |                                  | |
| | TENDA                            | |
| | Tenda Dome 2P                    | |
| | Rp 35.000 / hari                 | |
| | Tersedia 3 unit di jadwal ini    | |
| | [ - ] 1 [ + ]                    | |
| | [ Tambah ke keranjang ]          | |
| +----------------------------------+ |
|                                      |
| +----------------------------------+ |
| | [ gambar 4:3 ]                   | |
| |                                  | |
| | TIDUR                            | |
| | Sleeping Bag -5 C                | |
| | Rp 20.000 / hari                 | |
| | Habis di jadwal ini              | |
| | [ Tidak tersedia ]  (nonaktif)   | |
| +----------------------------------+ |
|                                      |
+--------------------------------------+
| Keranjang: 2 item   Rp 195.000       |
| [ Lihat keranjang ]                  |
+--------------------------------------+
```

**Wireframe desktop (≥ 1024 px) — beranda dan katalog**

```
+--------------------------------------------------------------------------------------------+
| MaruemGear      Katalog   Cara Sewa                       [Keranjang (2)]  [Dashboard]     |
+--------------------------------------------------------------------------------------------+
| SEWA GEAR HIKING                                  +----------------------------------+     |
| Perlengkapan hiking per hari.                     | Cek ketersediaan                 |     |
| Pilih gear, tentukan jadwal,                      | Ambil     [21 Nov 2026] [09:00]  |     |
| pesan lewat WhatsApp.                             | Kembali   [23 Nov 2026] [18:00]  |     |
|                                                   | Durasi: 3 hari                   |     |
| [ Lihat Katalog ]                                 | [ Terapkan jadwal ]              |     |
|                                                   +----------------------------------+     |
+--------------------------------------------------------------------------------------------+
| KATALOG                                                                                    |
|                                                                                            |
| +----------------------+   [ Cari gear...                  ]  Urutkan [Unggulan v]         |
| | FILTER               |   Menampilkan 10 dari 10 gear                                     |
| |                      |                                                                   |
| | Kategori             |  +------------------+ +------------------+ +------------------+   |
| | (o) Semua            |  | [gambar 4:3]     | | [gambar 4:3]     | | [gambar 4:3]     |   |
| | ( ) Tenda            |  |                  | |                  | |                  |   |
| | ( ) Tas & carrier    |  | TENDA            | | TAS              | | TIDUR            |   |
| | ( ) Tidur            |  | Tenda Dome 2P    | | Carrier 50L      | | Sleeping Bag     |   |
| | ( ) Masak            |  | Rp 35.000/hari   | | Rp 30.000/hari   | | Rp 20.000/hari   |   |
| | ( ) Penerangan       |  | Tersedia 3 unit  | | Tersedia 2 unit  | | Habis di jadwal  |   |
| | ( ) Aksesori         |  | [-] 1 [+]        | | [-] 1 [+]        | | [-] 0 [+]        |   |
| |                      |  | [ Tambah ]       | | [ Tambah ]       | | [ Tak tersedia ] |   |
| | Ketersediaan         |  +------------------+ +------------------+ +------------------+   |
| | [x] Hanya tersedia   |                                                                   |
| |                      |   ...baris berikutnya...                                          |
| | [ Reset filter ]     |                                                                   |
| +----------------------+                                                                   |
|                                                                                            |
+--------------------------------------------------------------------------------------------+
| Tanya admin lewat WhatsApp        Jam layanan 08.00 - 20.00        Mode Demo               |
+--------------------------------------------------------------------------------------------+
```

### 7.4 Keranjang dan Kirim Pesanan

- Mobile: layar penuh. Desktop: panel kanan 400 px dengan isi yang sama.
- Isi: jadwal (dapat diubah), daftar item dengan rumus "harga × hari", pengatur jumlah, hapus item, nama penyewa (wajib), catatan (opsional), rincian biaya.
- **Tombol WhatsApp:** tombol utama hijau penuh berlabel **"Kirim Pesanan via WhatsApp"**. Nonaktif jika keranjang kosong, jadwal belum valid, atau nama kosong; alasannya ditampilkan sebagai teks di dekat tombol. Tidak memakai warna merek WhatsApp agar palet tetap konsisten.
- Opsional (Could): tautan "Lihat isi pesan" yang membuka pratinjau teks yang akan dikirim.
- Setelah dikirim: toast "Pesanan tercatat dengan status Menunggu Konfirmasi" dan keranjang dikosongkan.
- Footer berisi tautan "Tanya admin lewat WhatsApp" dan jam layanan.

**Wireframe mobile — keranjang**

```
+--------------------------------------+
| [<] Keranjang (2 item)               |
+--------------------------------------+
| Jadwal                               |
| 21 Nov 09:00 - 23 Nov 18:00          |
| Durasi 3 hari         [Ubah jadwal]  |
+--------------------------------------+
| Tenda Dome 2P                        |
| Rp 35.000 x 3 hari        Rp 105.000 |
| [ - ] 1 [ + ]                [Hapus] |
|                                      |
| Carrier 50L                          |
| Rp 30.000 x 3 hari         Rp 90.000 |
| [ - ] 1 [ + ]                [Hapus] |
+--------------------------------------+
| Nama penyewa *                       |
| [                                ]   |
| Catatan (opsional)                   |
| [                                ]   |
+--------------------------------------+
| Subtotal sewa              Rp 195.000|
| Deposit (jaminan) *        Rp 100.000|
| Total saat pengambilan     Rp 295.000|
| * tampil jika fitur deposit aktif    |
+--------------------------------------+
| [ Kirim Pesanan via WhatsApp ]       |
| Status awal: Menunggu Konfirmasi.    |
+--------------------------------------+
```

---

## 8. Dashboard Demo (rancangan untuk ditinjau)

Bagian ini adalah **usulan rancangan dashboard** untuk dikomentari sebelum dikunci. Lihat pertanyaan terbuka di bagian 12.

### 8.1 Struktur dan navigasi

- **Desktop:** sidebar kiri `--granite-900` (lebar 224 px) berisi Ringkasan, Pesanan, Gear, Pengaturan, dan tautan "Ke katalog". Item aktif: teks `--leaf-300` dengan garis kiri `--leaf-400` 3 px.
- **Mobile:** bilah atas ringkas dan **bilah tab bawah** (Ringkasan, Pesanan, Gear, Lainnya) agar mudah dijangkau ibu jari.
- **Banner Mode Demo** selalu tampak di atas konten: "Mode demo: tanpa login. Data hanya tersimpan di browser ini."

### 8.2 Ringkasan

Empat kartu angka: **Pesanan aktif** (dengan catatan jumlah yang perlu konfirmasi), **Ambil / kembali hari ini**, **Terlambat** (lewat toleransi), dan **Pendapatan** (estimasi dari pesanan selesai ditambah denda). Kartu Terlambat memakai ikon dan teks peringatan; angka 0 tidak memakai warna bahaya.

### 8.3 Pesanan

- Tabel di desktop; **kartu bertumpuk** di mobile (tabel lebar tidak nyaman di ponsel).
- Kolom: Kode, Penyewa, Ambil–kembali, Total, Status, Aksi.
- Filter status (chip) dan pencarian kode atau nama.
- **Satu aksi utama per baris sesuai status**, aksi lain di dalam detail:

| Status saat ini | Aksi utama (tombol hijau) | Aksi lain (di detail) |
|---|---|---|
| Menunggu Konfirmasi | Konfirmasi | Batalkan |
| Terbooking | Tandai diambil | Batalkan |
| Terpinjam | Tandai dikembalikan | (tidak ada) |
| Dikembalikan, Dibatalkan, Kedaluwarsa, Tidak Diambil | Detail | (tidak ada) |

- Status Kedaluwarsa dan Tidak Diambil muncul otomatis; label Terlambat dihitung dari waktu saat ini setiap halaman dibuka.
- **Detail pesanan** (dialog di desktop, layar penuh di mobile) menampilkan rincian item, biaya, dan **perkiraan denda berikut rumusnya**, supaya admin paham angkanya sebelum menekan "Tandai dikembalikan". Penekanan tombol itu meminta konfirmasi yang menampilkan total akhir.

**Wireframe mobile — dashboard ringkasan dan pesanan**

```
+----------------------------------------+
| [Menu] Dashboard       [MODE DEMO]     |
+----------------------------------------+
| [!] Mode demo: tanpa login. Data       |
|     hanya tersimpan di browser ini.    |
+----------------------------------------+
| Ringkasan                              |
| +----------------+ +----------------+  |
| | Pesanan aktif  | | Ambil / kembali|  |
| | 4              | | 2 / 1          |  |
| | 1 perlu konf.  | | hari ini       |  |
| +----------------+ +----------------+  |
| +----------------+ +----------------+  |
| | Terlambat      | | Pendapatan     |  |
| | 1              | | Rp 1.240.000   |  |
| | lewat toleransi| | pesanan selesai|  |
| +----------------+ +----------------+  |
+----------------------------------------+
| Pesanan                                |
| (Semua) (Aktif) (Selesai) (Batal) >    |
| +----------------------------------+   |
| | RG-1121-001        Terpinjam     |   |
| | Ayu - 2 item - Rp 195.000        |   |
| | 21/11 09:00 - 23/11 18:00        |   |
| | [!] Terlambat 1 jam              |   |
| | [ Tandai dikembalikan ]          |   |
| +----------------------------------+   |
|                                        |
| +----------------------------------+   |
| | RG-1122-002       Menunggu       |   |
| | Bagas - 1 item - Rp 60.000       |   |
| | 24/11 08:00 - 25/11 17:00        |   |
| | [ Konfirmasi ]   [ Batalkan ]    |   |
| +----------------------------------+   |
|                                        |
+----------------------------------------+
| [Ringkasan] [Pesanan] [Gear] [Lain]    |
+----------------------------------------+
```

**Wireframe desktop — dashboard (ringkasan dan daftar pesanan)**

```
+--------------++------------------------------------------------------------------------------------+
| MaruemGear   || [!] MODE DEMO: tanpa login. Data hanya tersimpan di browser ini.                   |
| Dashboard    |+------------------------------------------------------------------------------------+
+--------------+| Ringkasan                                                                          |
| > Ringkasan  || +-----------------+ +-----------------+ +-----------------+ +-----------------+    |
|   Pesanan    || | Pesanan aktif   | | Ambil / kembali | | Terlambat       | | Pendapatan      |    |
|   Gear       || | 4               | | 2 / 1           | | 1               | | Rp 1.240.000    |    |
|   Pengaturan || | 1 perlu konf.   | | hari ini        | | lewat toleransi | | pesanan selesai |    |
|              || +-----------------+ +-----------------+ +-----------------+ +-----------------+    |
|              |+------------------------------------------------------------------------------------+
|              || Pesanan        [ Cari kode / nama... ]  Status [ Semua v ]                         |
|              || Kode         Penyewa  Ambil - kembali           Total       Status       Aksi      |
|              || RG-1121-001  Ayu      21/11 09:00-23/11 18:00   Rp 195.000  Terlambat!   [Kembali] |
|              || RG-1122-002  Bagas    24/11 08:00-25/11 17:00   Rp 60.000   Menunggu     [Konfirm.]|
|              || RG-1122-003  Citra    26/11 07:00-27/11 18:00   Rp 140.000  Terbooking   [Diambil] |
|              || RG-1118-004  Dewa     18/11 09:00-19/11 17:00   Rp 85.000   Dikembalikan [Detail]  |
+--------------+|                                                                                    |
| [Ke katalog] || Klik baris untuk membuka detail. Batalkan ada di dalam detail.                     |
|              || Menampilkan 4 dari 4 pesanan                                         [<]  1  [>]   |
+--------------++------------------------------------------------------------------------------------+
```

**Wireframe desktop — detail pesanan (dialog)**

```
+----------------------------------------------------------+
| Detail pesanan RG-1121-001                    [Tutup X]  |
+----------------------------------------------------------+
| Penyewa : Ayu                                            |
| Jadwal  : 21 Nov 09:00 - 23 Nov 18:00 (3 hari)           |
| Status  : [Terpinjam]  [Terlambat]                       |
+----------------------------------------------------------+
| Item                         Qty        Subtotal         |
| Tenda Dome 2P                  1      Rp 105.000         |
| Carrier 50L                    1       Rp 90.000         |
+----------------------------------------------------------+
| Subtotal sewa                          Rp 195.000        |
| Denda keterlambatan (perkiraan)          Rp 6.500        |
|   Jatuh tempo 18:00, toleransi s.d. 19:00,               |
|   sekarang 19:30 -> 1 jam x 10% x Rp 65.000              |
| Total                                  Rp 201.500        |
+----------------------------------------------------------+
| [ Batalkan pesanan ]        [ Tandai dikembalikan ]      |
+----------------------------------------------------------+
```

Contoh angka pada wireframe memakai asumsi: denda 10% dari total harga sewa per hari (Rp 65.000) per jam, dibulatkan ke atas per jam setelah toleransi 60 menit. Aturan final mengikuti `SPEC.md`.

### 8.4 Gear (CRUD)

- Tabel di desktop, daftar kartu di mobile. Kolom: Nama, Kategori, Harga/hari, Unit, Kondisi, Aksi (Edit, Hapus).
- Tombol **+ Tambah gear** membuka form (dialog di desktop, layar penuh di mobile).
- Validasi: nama wajib (2–60 karakter), kategori wajib, harga angka ≥ 0, unit bilangan bulat ≥ 0, kondisi wajib. Error tampil di bawah kolom.
- Hapus selalu lewat dialog konfirmasi. Jika gear masih ada di pesanan aktif, dialog memberi peringatan jelas dan tombol hapus dinonaktifkan.
- Tombol **Reset data contoh** (dengan konfirmasi) ada di bawah tabel.

**Wireframe desktop — daftar gear**

```
+----------------------------------------------------------------------------------+
| Gear (10 jenis, 36 unit)                                       [ + Tambah gear ] |
+----------------------------------------------------------------------------------+
| Nama             Kategori    Harga/hari   Unit  Kondisi            Aksi          |
| Tenda Dome 2P    Tenda       Rp 35.000    3     Baik               [Edit] [Hapus]|
| Carrier 50L      Tas         Rp 30.000    2     Baik               [Edit] [Hapus]|
| Sleeping Bag     Tidur       Rp 20.000    4     Perlu perawatan    [Edit] [Hapus]|
|                                                                                  |
| [ Reset data contoh ]                                                            |
+----------------------------------------------------------------------------------+
```

**Wireframe desktop — form tambah/edit gear**

```
+--------------------------------------------------------+
| Tambah gear                                 [Tutup X]  |
+--------------------------------------------------------+
| Nama gear *            [                          ]    |
| Kategori *             [ Pilih kategori         v ]    |
| Harga per hari (Rp) *  [                          ]    |
|   ! Harga tidak boleh negatif.   (contoh pesan error)  |
| Jumlah unit *          [                          ]    |
| Kondisi *              (o) Baik  ( ) Perlu perawatan   |
| Deskripsi              [                          ]    |
| Gambar (path lokal)    [ /images/tenda-dome.svg   ]    |
+--------------------------------------------------------+
| [ Batal ]                                [ Simpan ]    |
+--------------------------------------------------------+
```

### 8.5 Pengaturan (Could)

Kolom untuk toleransi keterlambatan (menit), persentase denda, batas kedaluwarsa pesanan, dan nomor WhatsApp admin (berisi placeholder pada data contoh). Disimpan di penyimpanan lokal bersama data lain.

---

## 9. State dan Interaksi

| Situasi | Perilaku |
|---|---|
| Memuat data | Kerangka kartu abu-abu (skeleton) sederhana, bukan putaran besar |
| Hasil kosong | Empty state dengan tombol Reset filter |
| Jadwal tidak valid (selesai sebelum mulai, durasi < 1 hari) | Pesan error di bawah kolom jadwal; ketersediaan tidak dihitung |
| Jumlah melebihi unit tersedia | Tombol + berhenti di batas, teks "Maksimal N unit" |
| Aksi berhasil | Toast singkat |
| Aksi berisiko (hapus, batalkan, tandai dikembalikan) | Dialog konfirmasi |
| Gambar gagal dimuat | Placeholder lokal |
| Gerak | Transisi maksimal 150 ms; hormati `prefers-reduced-motion` (tanpa transisi) |

## 10. Aksesibilitas

1. Kontras sesuai tabel 3.2; status tidak hanya dibedakan lewat warna.
2. Semua elemen interaktif dapat dijangkau dengan keyboard dalam urutan logis; cincin fokus selalu terlihat (`--focus-light` di latar terang, `--focus-dark` di latar gelap).
3. Semua kolom form memiliki `label`; error dikaitkan lewat `aria-describedby`.
4. Tombol ikon (menu, keranjang, tutup) memiliki `aria-label`. Gambar memiliki `alt` yang menyebut nama gear.
5. Perubahan total biaya dan jumlah keranjang diumumkan lewat `aria-live="polite"`.
6. Dialog menjebak fokus, dapat ditutup dengan `Esc`, dan mengembalikan fokus ke pemicu.
7. Tata letak tetap utuh pada zoom 200% dan teks diperbesar tanpa scroll horizontal pada lebar 360 px.
8. Atribut bahasa halaman `id`; struktur judul berurutan (satu H1 per halaman).
9. Target sentuh minimal 44 × 44 px.

## 11. Gaya Teks (Microcopy)

- Bahasa Indonesia yang lugas, tanpa slogan klise. Kalimat pendek, kata kerja jelas.
- Tombol: "Tambah ke keranjang", "Kirim Pesanan via WhatsApp", "Tandai dikembalikan", "Simpan", "Batal".
- Error menyebut masalah dan perbaikannya: "Harga tidak boleh negatif." bukan "Input tidak valid."
- Format uang: `Rp 35.000`. Format tanggal: `21 Nov 2026`, jam 24 jam `09:00`.
- Data contoh memakai nama fiktif dan nomor WhatsApp placeholder, tidak ada data pribadi nyata.

## 12. Acceptance Criteria UI (pemeriksaan manual)

| ID | Langkah | Hasil yang diharapkan |
|---|---|---|
| UI-01 | Periksa warna di DevTools pada semua halaman | Hanya token pada bagian 3 yang dipakai |
| UI-02 | Cek kontras 8 pasangan utama (teks utama, tombol utama, menu sidebar, badge Terlambat, tepi input, fokus) dengan pengecek kontras browser | Semua memenuhi rasio pada tabel 3.2 |
| UI-03 | Buka di lebar 360 px | Tidak ada scroll horizontal; semua kontrol berukuran ≥ 44 px |
| UI-04 | Buka menu hamburger di mobile lalu tekan `Esc` | Menu membuka dan menutup; fokus kembali ke tombol Menu |
| UI-05 | Ubah lebar jendela 360 → 700 → 1200 px | Grid berubah 1 → 2 → 3 kolom; filter berpindah dari panel ke sidebar |
| UI-06 | Klik "Lihat Katalog" di hero | Halaman menggulir ke katalog |
| UI-07 | Pilih jadwal lalu telusuri katalog | Jadwal terpilih tetap terlihat dan ketersediaan di kartu mengikuti jadwal |
| UI-08 | Lihat kartu gear yang habis di jadwal terpilih | Ada teks "Habis di jadwal ini" dan tombol nonaktif berlabel teks, bukan hanya berubah warna |
| UI-09 | Buka keranjang dengan nama kosong | Tombol WhatsApp nonaktif dan alasan tampil sebagai teks |
| UI-10 | Isi keranjang valid lalu kirim | Tombol WhatsApp aktif, tab WhatsApp terbuka, toast status muncul |
| UI-11 | Buka dashboard di desktop dan mobile | Desktop: sidebar kiri; mobile: bilah tab bawah; banner Mode Demo selalu tampak |
| UI-12 | Lihat baris pesanan berstatus Menunggu, Terbooking, Terpinjam | Tiap baris hanya menampilkan satu aksi utama sesuai tabel 8.3 |
| UI-13 | Lihat pesanan Terpinjam yang lewat toleransi | Muncul badge Terlambat dengan ikon dan teks, plus perkiraan denda dan rumusnya di detail |
| UI-14 | Isi form gear dengan harga `-1` | Pesan error muncul di bawah kolom harga, data tidak tersimpan |
| UI-15 | Hapus gear lewat dialog | Dialog konfirmasi muncul; Batal tidak mengubah data |
| UI-16 | Navigasi seluruh halaman hanya dengan keyboard | Semua kontrol terjangkau dan fokus selalu terlihat |
| UI-17 | Perbesar tampilan ke 200% | Tidak ada konten terpotong atau tumpang tindih |
| UI-18 | Aktifkan pengaturan "kurangi gerak" di sistem operasi | Transisi dimatikan |
| UI-19 | Periksa semua tombol ikon dengan pembaca layar atau inspeksi atribut | Setiap tombol ikon memiliki label teks |

## 13. Pertanyaan Terbuka dan Catatan Keputusan

**Untuk ditinjau pada rancangan dashboard (bagian 8):**
1. Navigasi desktop: sidebar kiri (usulan ini) atau tab horizontal di atas?
2. Daftar pesanan di desktop: tabel (usulan) atau kartu seperti di mobile?
3. Apakah **Pengaturan** (toleransi, tarif denda, nomor WhatsApp admin) perlu tampil di dashboard, atau cukup di file konfigurasi?
4. Apakah **deposit** ditampilkan? Jika tidak, baris deposit dihapus dari keranjang dan detail pesanan.
5. Perlu kartu ringkasan tambahan (mis. gear paling sering disewa)?

**Keputusan yang sudah diambil:**
- Hijau daun pisang dibuat lebih tua (`#3B6A22`) sebagai warna utama agar teks putih di atasnya lulus kontras; hijau yang lebih terang hanya dipakai sebagai aksen di atas latar gelap atau sebagai latar muda.
- Tombol WhatsApp tidak memakai warna merek WhatsApp, supaya palet tetap satu aksen.
- Tabel tidak dipaksakan di mobile; diganti kartu bertumpuk.
- Font memakai bawaan sistem, tanpa unduhan font.
