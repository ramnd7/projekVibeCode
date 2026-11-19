# SPEC.md — MaruemGear

> Spesifikasi kebutuhan perangkat lunak (SRS) untuk **MaruemGear**, sistem penyewaan gear hiking berbasis web untuk latihan 1 hari.
> Status: **Disetujui untuk implementasi**. Dokumen ini **belum berisi kode aplikasi**.
> Hubungan dengan dokumen lain: `UI.md` mengatur tampilan; dokumen ini menang untuk **aturan bisnis, data, dan kriteria penerimaan fungsional**. Jika keduanya bertentangan, ikuti dokumen ini lalu sinkronkan `UI.md`.

---

## 1. Tujuan

1. Menyediakan katalog 10 gear hiking contoh yang dapat dicari, difilter, diurutkan, dan dicek ketersediaannya untuk rentang waktu tertentu.
2. Memungkinkan calon penyewa menyusun pesanan multi-item, menghitung durasi dan biaya secara otomatis, lalu mengirim ringkasan pesanan via WhatsApp tanpa backend.
3. Menyediakan dashboard **Mode Demo** bagi pengelola untuk mengelola gear, mengubah status pesanan, melihat ringkasan, dan mengonfigurasi aturan denda — seluruhnya tersimpan di `localStorage` perangkat.
4. Menjadi latihan 1 hari yang aman: tanpa API key, tanpa data pribadi nyata, tanpa dependensi selain Vite, dan tanpa login palsu.

**Prinsip:** semua aturan dapat diverifikasi dengan klik dan angka di layar, bukan hanya dengan membaca kode.

---

## 2. Pengguna

| Peran | Akses | Kebutuhan utama |
|---|---|---|
| **Calon penyewa** | Halaman publik: `#/katalog`, `#/keranjang` | Melihat gear dan harga, memilih jadwal ambil/kembali, mengetahui sisa unit, menyusun keranjang, mengisi nama, mengirim ringkasan via WhatsApp. Tidak memasukkan kata sandi. |
| **Pengelola rental (admin demo)** | Halaman terpisah `#/dashboard`, diberi label **Mode Demo** | CRUD gear, mengonfirmasi/mengubah status pesanan, melihat ringkasan, mengatur toleransi & tarif denda, mereset data contoh. |

**Konteks pemakaian:** satu perangkat, satu browser, bergantian. Tidak ada sinkronisasi antarperangkat. Penyewa dan admin adalah orang yang sama dalam latihan ini.

---

## 3. Daftar Fitur (prioritas Must / Should / Could)

### 3.1 Must — wajib ada untuk MVP

| ID | Fitur | Ringkasan |
|---|---|---|
| M-01 | Seed katalog | 10 gear contoh, kategori, harga/hari, jumlah unit, kondisi, deskripsi, gambar/placeholder lokal. |
| M-02 | Pencarian & filter | Cari berdasarkan nama/deskripsi; filter kategori; filter "hanya tersedia" pada jadwal terpilih. |
| M-03 | Sorting | Unggulan (default), harga termurah, harga termahal, nama A–Z. |
| M-04 | Jadwal sewa | Input tanggal + jam untuk `waktuAmbil` dan `waktuKembaliJadwal`; validasi urutan; hitung durasi otomatis. |
| M-05 | Ketersediaan | Hitung sisa unit per gear untuk rentang waktu terpilih; tampilkan "Tersedia N unit", "Tersisa N", atau "Habis di jadwal ini". |
| M-06 | Keranjang | Multi item dengan jumlah; tambah/ubah/hapus; batas jumlah tidak boleh melebihi unit tersedia; hitung total otomatis. |
| M-07 | Form pesanan | Nama penyewa wajib; catatan opsional; ringkasan biaya. |
| M-08 | Kirim via WhatsApp | Membuka `https://wa.me/<nomor>?text=<encodeURIComponent(ringkasan)>`; nomor admin adalah placeholder; setelah itu pesanan tersimpan dengan status awal **Menunggu Konfirmasi** dan keranjang dikosongkan. |
| M-09 | Dashboard demo | Banner Mode Demo; ringkasan (total gear, pesanan aktif, estimasi pendapatan); daftar pesanan; CRUD gear. |
| M-10 | Manajemen status | Transisi manual admin: Terbooking, Terpinjam, Dikembalikan, Dibatalkan. Status otomatis: Kedaluwarsa, Tidak Diambil. Label turunan: Terlambat. |
| M-11 | Perhitungan denda | Toleransi 60 menit (konfigurabel), 10%/jam setelah toleransi, pembulatan ke atas per jam, plafon 100% tarif harian. |
| M-12 | Penyimpanan | `localStorage` untuk gear, pesanan, keranjang, konfigurasi; seed otomatis hanya saat kunci belum ada. |
| M-13 | Input aman | Seluruh teks pengguna dirender sebagai teks (`textContent`/DOM API), bukan `innerHTML`; `imageUrl` dibatasi path lokal relatif. |

### 3.2 Should — sangat dianjurkan

| ID | Fitur | Ringkasan |
|---|---|---|
| S-01 | Halaman Pengaturan di dashboard | Ubah toleransi (menit), persentase denda/jam, plafon, batas kedaluwarsa, batas tidak diambil, nomor WhatsApp placeholder. |
| S-02 | Pratinjau pesan WhatsApp | Lihat teks yang akan dikirim sebelum tombol ditekan. |
| S-03 | Detail pesanan | Rincian item, biaya, waktu, dan **rumus denda** sebelum admin menekan "Tandai dikembalikan". |
| S-04 | Dialog konfirmasi | Untuk hapus gear, batalkan pesanan, tandai dikembalikan, dan reset data contoh. |
| S-05 | Toast & empty state | Umpan balik singkat; pesan "Tidak ada gear yang cocok" + tombol Reset filter. |
| S-06 | Kartu ringkasan tambahan | "Ambil/kembali hari ini" dan "Terlambat" di dashboard (melengkapi 3 kartu wajib). |
| S-07 | Filter & pencarian pesanan | Berdasarkan status, kode sewa, atau nama penyewa. |
| S-08 | Ekspor/impor JSON | Unduh dan unggah cadangan data lokal (tanpa jaringan). |

### 3.3 Could — opsional jika waktu masih ada

| ID | Fitur | Ringkasan |
|---|---|---|
| C-01 | Input `waktuKembaliAktual` manual oleh admin di detail pesanan (default: waktu saat tombol ditekan). |
| C-02 | Skeleton saat memuat dan animasi ≤150 ms, hormati `prefers-reduced-motion`. |
| C-03 | Toast `aria-live="polite"` untuk perubahan total biaya dan jumlah keranjang. |
| C-04 | Kategori "Jam layanan" di footer (informasi statis, bukan validasi). |

---

## 4. Model Data

### 4.1 Gear

| Field | Tipe | Aturan |
|---|---|---|
| `id` | string | Unik, stabil, contoh `G-01`. Tidak diubah saat edit. |
| `nama` | string | Wajib, 2–60 karakter. |
| `kategori` | string | Wajib; salah satu dari: `Tenda`, `Tas & carrier`, `Tidur`, `Masak`, `Penerangan`, `Aksesori`. |
| `hargaPerHari` | number | Angka ≥ 0, ditampilkan sebagai `Rp 35.000`. |
| `jumlahUnit` | integer | Bilangan bulat ≥ 0. |
| `kondisi` | enum | `Baik` \| `Perlu perawatan`. Gear "Perlu perawatan" **tidak bisa disewa** (tombol nonaktif). |
| `deskripsi` | string | Teks bebas; ikut dicari. |
| `imageUrl` | string | Path lokal relatif, contoh `/images/gear/g-01.svg`. Jika gagal dimuat → placeholder lokal. |

### 4.2 Pesanan

| Field | Tipe | Aturan |
|---|---|---|
| `id` | string | Unik, internal. |
| `kodeSewa` | string | Format `RG-YYYYMMDD-NNN`, contoh `RG-20261121-001` (mengikuti prefix pada wireframe `ui.md`). `NNN` urutan harian. |
| `namaPenyewa` | string | Wajib, 1–60 karakter, bukan hanya spasi. |
| `tanggalMulai` | string | `YYYY-MM-DD`, turunan dari `waktuAmbil` (kompatibilitas dengan model awal). |
| `tanggalSelesai` | string | `YYYY-MM-DD`, turunan dari `waktuKembaliJadwal`. |
| `waktuAmbil` | string | `YYYY-MM-DDTHH:mm` (waktu lokal perangkat). |
| `waktuKembaliJadwal` | string | `YYYY-MM-DDTHH:mm`, harus > `waktuAmbil`. |
| `waktuKembaliAktual` | string \| null | `YYYY-MM-DDTHH:mm`; diisi saat status → Dikembalikan. |
| `items` | array | `[{ gearId, jumlah }]`; minimal 1 item; `jumlah` integer ≥ 1 dan ≤ unit tersedia. |
| `totalBiaya` | number | `Σ(hargaPerHari × jumlah × durasiHari)`, dihitung saat pesanan dibuat, bukan dipercaya dari input. |
| `status` | enum | Lihat §6.2. |
| `dibuat` | string | ISO timestamp saat pesanan dibuat. |
| `catatan` | string | Opsional, ≤ 300 karakter. |
| `denda` | number | Opsional, default 0; diisi saat Dikembalikan. |
| `totalAkhir` | number | Opsional, `totalBiaya + denda`. |

### 4.3 Konfigurasi & keranjang

```js
// maruemgear:v1:config
{
  toleransiMenit: 60,          // konfigurabel
  dendaPersenPerJam: 10,       // 10%
  plafonDendaPersen: 100,      // 100% dari tarif sewa 1 hari
  batasKedaluwarsaMenit: 0,    // setelah waktuAmbil
  batasTidakDiambilMenit: 120, // setelah waktuAmbil
  whatsappAdmin: "6280000000000", // PLACEHOLDER, bukan data pribadi
  jamLayanan: "08:00-20:00"
}

// maruemgear:v1:cart
{ jadwal: { waktuAmbil, waktuKembaliJadwal }, items: [{ gearId, jumlah }] }
```

### 4.4 Kunci `localStorage`

| Kunci | Isi |
|---|---|
| `maruemgear:v1:gear` | Array gear |
| `maruemgear:v1:orders` | Array pesanan |
| `maruemgear:v1:cart` | Keranjang aktif |
| `maruemgear:v1:config` | Konfigurasi di atas |
| `maruemgear:v1:meta` | Versi seed, tanggal seed terakhir |

Seed hanya dijalankan jika kunci belum ada. Tombol **Reset data contoh** (dengan konfirmasi) menimpa data secara sengaja.

### 4.5 Data contoh (10 gear)

| id | Nama | Kategori | Harga/hari | Unit | Kondisi |
|---|---|---|---:|---:|---|
| G-01 | Tenda Dome 2P | Tenda | 35.000 | 3 | Baik |
| G-02 | Tenda Dome 3P | Tenda | 50.000 | 2 | Baik |
| G-03 | Carrier 50L | Tas & carrier | 30.000 | 2 | Baik |
| G-04 | Carrier 65L | Tas & carrier | 40.000 | 2 | Perlu perawatan |
| G-05 | Sleeping Bag -5°C | Tidur | 20.000 | 4 | Baik |
| G-06 | Matras Gulung | Tidur | 10.000 | 7 | Baik |
| G-07 | Kompor Portable | Masak | 25.000 | 3 | Baik |
| G-08 | Nesting Set | Masak | 15.000 | 4 | Baik |
| G-09 | Headlamp Rechargeable | Penerangan | 12.000 | 5 | Baik |
| G-10 | Trekking Pole | Aksesori | 15.000 | 4 | Baik |

Total 10 jenis / 36 unit. Nama penyewa pada data contoh (jika ada) memakai nama fiktif: Ayu, Bagas, Citra, Dewa. Nomor WhatsApp selalu placeholder.

---

## 5. Aturan Bisnis

### 5.1 Waktu, durasi, dan biaya sewa

1. Semua waktu disimpan sebagai string `YYYY-MM-DDTHH:mm` dalam **waktu lokal perangkat**. Tidak ada konversi UTC agar tidak terjadi pergeseran tanggal saat perbandingan string.
2. Perbandingan rentang memakai interval **setengah terbuka** `[mulai, selesai)`: `mulaiA < selesaiB && mulaiB < selesaiA`.
3. `waktuKembaliJadwal` harus lebih besar dari `waktuAmbil`. Jika tidak, tampilkan error dan **jangan hitung** ketersediaan maupun biaya.
4. `durasiMenit = waktuKembaliJadwal - waktuAmbil`.
5. `durasiHari = max(1, ceil(durasiMenit / 1440))`. Pembulatan ke atas: 1 menit lebih dari 24 jam = 2 hari.
6. `tarifHarian = Σ(hargaPerHari × jumlah)` untuk semua item di pesanan.
7. `totalBiaya = tarifHarian × durasiHari`.
8. Contoh: 21 Nov 09:00 → 23 Nov 18:00 = 57 jam → `ceil(57/24) = 3 hari`; Tenda Dome 2P (35.000×1) + Carrier 50L (30.000×1) = 65.000/hari → **195.000**.

### 5.2 Status dan transisi

Status tersimpan (enum): **Menunggu Konfirmasi, Terbooking, Terpinjam, Dikembalikan, Dibatalkan, Kedaluwarsa, Tidak Diambil**.

**Terlambat bukan status tersimpan** — hanya label turunan yang muncul di UI saat `status === "Terpinjam"` dan `now > waktuKembaliJadwal + toleransiMenit`.

| Status saat ini | Aksi manual admin | Otomatis saat aplikasi dimuat |
|---|---|---|
| Menunggu Konfirmasi | → Terbooking, → Dibatalkan | → Kedaluwarsa |
| Terbooking | → Terpinjam, → Dibatalkan | → Tidak Diambil |
| Terpinjam | → Dikembalikan (hitung denda) | — (label Terlambat muncul di UI) |
| Dikembalikan, Dibatalkan, Kedaluwarsa, Tidak Diambil | Terminal, hanya Detail | — |

Aturan tambahan:
- Status awal saat penyewa menekan "Kirim Pesanan via WhatsApp" adalah **Menunggu Konfirmasi**.
- Admin tidak bisa langsung membuat status Terpinjam tanpa melalui Terbooking.
- Transisi Terpinjam → Dikembalikan wajib mengisi `waktuKembaliAktual` (default `now`) dan menyimpan `denda` + `totalAkhir`.

### 5.3 Status otomatis (dievaluasi saat aplikasi dimuat)

Dievaluasi sekali saat aplikasi dimuat (dan sebelum render dashboard), berdasarkan `Date.now()`:

1. **Kedaluwarsa**: `status === "Menunggu Konfirmasi"` dan `now > waktuAmbil + batasKedaluwarsaMenit`.
2. **Tidak Diambil**: `status === "Terbooking"` dan `now > waktuAmbil + batasTidakDiambilMenit`.
3. Perubahan ditulis kembali ke `localStorage` agar konsisten setelah reload.
4. Evaluasi **tidak** menjalankan `setInterval` dan **tidak** mengubah status-terminal lain.
5. Unit yang dilepaskan oleh Kedaluwarsa/Tidak Diambil langsung ikut dihitung di §5.4.

### 5.4 Ketersediaan unit

```
terpakai(gear, mulai, selesai) =
  Σ item.jumlah
  untuk setiap pesanan dengan status ∈ {Menunggu Konfirmasi, Terbooking, Terpinjam}
  dan item.gearId === gear.id
  dan intervalsOverlap(pesanan.waktuAmbil, pesanan.waktuKembaliJadwal, mulai, selesai)

tersedia = gear.jumlahUnit - terpakai
```

- `intervalsOverlap(a1,a2,b1,b2) = a1 < b2 && b1 < a2`.
- Status **Dibatalkan, Kedaluwarsa, Tidak Diambil, Dikembalikan** tidak mengurangi stok.
- Untuk perhitungan ini dipakai **rentang jadwal**, bukan `waktuKembaliAktual`.
- `kondisi === "Perlu perawatan"` → tersedia ditampilkan 0 dan tombol sewa nonaktif.
- Jika `tersedia === 0` → teks "Habis di jadwal ini", tombol nonaktif dengan label teks (bukan hanya warna).
- Jika belum ada jadwal valid → teks "Pilih jadwal untuk melihat ketersediaan"; ketersediaan tidak dihitung.
- `jumlah` di keranjang dibatasi `1..tersedia`; tombol `+` berhenti di batas dengan teks "Maksimal N unit".
- Jika jadwal diubah dan item yang sudah ada jadi tidak tersedia → tampilkan error per item dan blokir pengiriman sampai diperbaiki.

**Contoh irisan (G-01, 3 unit):** pesanan P1 `21/11 09:00–23/11 18:00`, 2 unit, Terpinjam.

| Cek jadwal | Beririsan? | Tersedia |
|---|---|---:|
| `23/11 18:00–24/11 18:00` | Tidak (tepat bersentuhan) | 3 |
| `22/11 12:00–24/11 18:00` | Ya | 1 |
| `20/11 08:00–21/11 09:00` | Tidak | 3 |
| `21/11 08:00–21/11 10:00` | Ya | 1 |

Jika P2 menambah 1 unit pada jadwal yang sama (total 3), semua jadwal yang beririsan menjadi **Habis**; jika P2 dibatalkan, stok kembali 3.

### 5.5 Denda keterlambatan

Definisi:

```
tarifHarian       = totalBiaya / durasiHari        // = Σ(hargaPerHari × jumlah)
batasToleransi    = waktuKembaliJadwal + toleransiMenit   // default 60 menit
telatMenit        = max(0, waktuKembaliAktual - batasToleransi)
jamDenda          = ceil(telatMenit / 60)           // pembulatan ke atas per jam
dendaMentah       = jamDenda × (dendaPersenPerJam/100) × tarifHarian
plafon            = (plafonDendaPersen/100) × tarifHarian   // default = 1 × tarifHarian
denda             = min(dendaMentah, plafon)
totalAkhir        = totalBiaya + denda
```

Ketentuan:
- Jika `waktuKembaliAktual ≤ batasToleransi` → `denda = 0` (termasuk kembali lebih awal).
- Denda dihitung **dari akhir toleransi**, bukan dari jadwal kembali.
- Jam yang tidak penuh tetap dihitung 1 jam penuh.
- Plafon berlaku per pesanan; dengan nilai default, plafon tercapai setelah 10 jam melewati toleransi.
- Denda hanya dihitung/didisimpan saat status berubah menjadi Dikembalikan. Sebelumnya UI menampilkan **perkiraan** denda berdasarkan `now`.

**Contoh dengan data §5.1** (`tarifHarian = 65.000`, jadwal kembali `18:00`, toleransi sampai `19:00`):

| `waktuKembaliAktual` | `telatMenit` | `jamDenda` | Perhitungan | Denda |
|---|---:|---:|---|---:|
| 18:30 | 0 | 0 | dalam jadwal | 0 |
| 19:00 | 0 | 0 | tepat di akhir toleransi | 0 |
| 19:30 | 30 | 1 | 10% × 65.000 | 6.500 |
| 20:30 | 90 | 2 | 2 × 10% × 65.000 | 13.000 |
| 05:00 (hari berikutnya) | 600 | 10 | 100% × 65.000 | 65.000 (plafon) |
| 07:00 (hari berikutnya) | 720 | 12 | 120% → dipotong plafon | 65.000 |

### 5.6 Validasi input

| Input | Aturan | Pesan error contoh |
|---|---|---|
| Nama gear | 2–60 karakter | "Nama gear wajib diisi (2–60 karakter)." |
| Harga per hari | number ≥ 0 | "Harga tidak boleh negatif." |
| Jumlah unit | integer ≥ 0 | "Jumlah unit harus bilangan bulat ≥ 0." |
| Jadwal | selesai > mulai | "Waktu kembali harus setelah waktu ambil." |
| Jumlah item | 1..tersedia | "Maksimal 1 unit pada jadwal ini." |
| Nama penyewa | 1–60 karakter, bukan spasi | "Nama penyewa wajib diisi." |
| Pengiriman | keranjang tidak kosong, jadwal valid, semua item tersedia, nama terisi | Alasan tampil sebagai teks di dekat tombol. |
| `imageUrl` | hanya path relatif `/...` atau `./...` | "Gunakan path gambar lokal." |

### 5.7 Ringkasan WhatsApp

- Teks memuat: kode sewa, nama penyewa, jadwal ambil–kembali, durasi, daftar item + jumlah + subtotal, total biaya, status awal, dan catatan opsional.
- Teks disusun dengan `encodeURIComponent()` dan dibuka via `https://wa.me/<whatsappAdmin>?text=...`.
- Nomor admin bersifat **placeholder**; tidak ada API, token, atau API key.
- Tidak ada pengiriman otomatis: browser membuka tab WhatsApp, pengguna menekan kirim sendiri.

---

## 6. Nonfunctional Requirements

| ID | Kategori | Persyaratan |
|---|---|---|
| N-01 | Teknologi | Vite + JavaScript vanilla. **Tanpa framework, tanpa dependensi runtime selain Vite.** |
| N-02 | Arsitektur | Tanpa backend, tanpa database, tanpa layanan pihak ketiga kecuali tautan `wa.me`. |
| N-03 | Keamanan | Tidak menyimpan API key/token/kredensial. Gunakan `textContent`/DOM API untuk semua input pengguna. Dilarang `innerHTML` pada data dinamis. Batasi `imageUrl` ke path lokal relatif. |
| N-04 | Privasi | Data contoh nonpribadi: nama fiktif, nomor WhatsApp placeholder. Tidak ada field nomor telepon penyewa yang disimpan. |
| N-05 | Browser | Chrome, Edge, Firefox versi terbaru. Tidak perlu dukungan IE. |
| N-06 | Responsif | Utuh pada lebar 360 px hingga desktop ≥1024 px, tanpa scroll horizontal; mengikuti `ui.md`. |
| N-07 | Aksesibilitas | Label form terlihat, error terkait lewat `aria-describedby`, fokus terlihat, target sentuh ≥44 px, status tidak hanya dibedakan warna. |
| N-08 | Kinerja | Halaman awal siap pakai < 2 detik di localhost untuk 10 gear dan < 100 pesanan. Tanpa permintaan jaringan saat memuat. |
| N-09 | Konsistensi | Format uang `Rp 35.000`, tanggal `21 Nov 2026`, jam 24 jam `09:00`, bahasa Indonesia. |
| N-10 | Ketahanan data | `localStorage` dibaca dengan `try/catch`; jika rusak, tampilkan pesan dan tawarkan Reset data contoh. Jangan menimpa data tanpa konfirmasi. |
| N-11 | Deterministik | Semua perhitungan (durasi, total, stok, denda, status otomatis) berasal dari satu modul aturan bisnis yang dipakai bersama halaman publik dan dashboard. |
| N-12 | Perintah | Tidak menjalankan perintah berbahaya; tidak ada skrip instalasi di luar `npm install`/`npm run dev` standar Vite. |

---

## 7. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| `localStorage` terhapus saat browser dibersihkan | Data pesanan hilang | Banner "Data hanya di browser ini"; ekspor/impor JSON (S-08); tombol Reset data contoh dengan konfirmasi. |
| Satu perangkat dipakai bergantian | Penyewa melihat perubahan admin | Ini disepakati untuk latihan; dashboard selalu berlabel Mode Demo; tidak ada klaim sinkronisasi. |
| Salah hitung denda | Kepercungan pada angka dashboard turun | Satu fungsi denda bersama; tabel contoh §5.5 dijadikan kriteria penerimaan; rumus ditampilkan di detail pesanan. |
| Beda zona waktu / DST | Tanggal bergeser satu hari | Simpan `YYYY-MM-DDTHH:mm` lokal, bandingkan string, tidak pakai `Date.toISOString()` untuk tampilan. |
| Nomor WhatsApp placeholder tidak aktif | Pengguna mengira pesanan terkirim otomatis | Teks tombol "Kirim Pesanan via WhatsApp" + penjelasan bahwa browser hanya membuka WhatsApp; pesanan tetap tercatat lokal. |
| Admin demo dapat diakses siapa saja | Perubahan data oleh penyewa | Diterima karena Mode Demo; tidak ada login palsu (login sungguhan out-of-scope). |
| Input nama mengandung HTML | XSS | Render sebagai teks; belum lagi `innerHTML` untuk data pengguna; AC-17 menguji ini. |
| Gear dihapus saat masih disewa | Pesanan kehilangan referensi gear | Hapus ditolak jika `gearId` dipakai pesanan berstatus Menunggu/Terbooking/Terpinjam; tampilkan alasan. |
| Perubahan jadwal keranjang membuat stok tidak cukup | Pesanan ganda | Validasi ulang semua item saat jadwal diubah dan saat pengiriman. |

---

## 8. Out-of-Scope

1. Login sungguhan, registrasi, kata sandi, OAuth, manajemen peran, atau "login palsu" apa pun.
2. Backend, API server, database, hosting bersama, dan sinkronisasi antarperangkat.
3. Pembayaran online, deposit/jaminan, invoice, atau kwitansi (baris deposit pada wireframe `ui.md` dihapus).
4. Pengiriman notifikasi otomatis, email, push notification, atau WhatsApp API/Business API.
5. API key, token, webhook, atau kredensial apa pun.
6. Scan QR/barcode, tanda tangan digital, foto kondisi barang, dan GPS.
7. Multi-bahasa, mode gelap, tema tambahan, animasi kompleks, dan tampilan cetak.
8. Manajemen stok lintas lokasi/gudang, supply chain, dan laporan pajak.
9. Uji otomatis/CI, deployment produksi, dan monitoring.

---

## 9. Acceptance Criteria (pemeriksaan manual)

Semua kriteria dapat dicek dengan browser + DevTools, tanpa menjalankan skrip berbahaya.

| ID | Langkah manual | Hasil yang diharapkan |
|---|---|---|
| AC-01 | Buka aplikasi pertama kali | 10 gear tampil dari seed; gambar tampil atau fallback placeholder lokal; tidak ada permintaan jaringan selain aset lokal. |
| AC-02 | Cari "tenda"; lalu pilih kategori Tidur; lalu ubah sorting ke "Harga termahal" | Hasil pencarian, filter, dan urutan sesuai; teks "Menampilkan X dari Y gear" benar; tombol Reset filter mengembalikan 10 gear. |
| AC-03 | Isi ambil `23/11 09:00`, kembali `22/11 09:00` | Error "Waktu kembali harus setelah waktu ambil"; ketersediaan dan biaya tidak dihitung. |
| AC-04 | Isi `21/11 09:00` – `23/11 18:00`; masukkan Tenda Dome 2P ×1 dan Carrier 50L ×1 | Durasi terbaca **3 hari**; subtotal **Rp 195.000**; angka berubah otomatis saat jumlah diubah. |
| AC-05 | Buat pesanan P1 (G-01 ×2, `21/11 09:00–23/11 18:00`, Terpinjam), lalu cek jadwal `23/11 18:00–24/11 18:00` | Tersedia **3** — jadwal yang tepat bersentuhan **tidak** dianggap irisan. |
| AC-06 | Dengan P1 tetap ada, cek `22/11 12:00–24/11 18:00`, lalu coba ambil 2 unit | Tersedia **1**; tombol `+` berhenti di 1 dengan teks "Maksimal 1 unit"; memasukkan 2 ditolak. |
| AC-07 | Buat P2 (G-01 ×1) pada jadwal yang beririsan dengan P1, status Terbooking, lalu cek jadwal `22/11 12:00–24/11 18:00` | Tersedia **0**, muncul "Habis di jadwal ini" dan tombol nonaktif berlabel "Tidak tersedia". |
| AC-08 | Batalkan P2, lalu muat ulang halaman | Stok kembali **1** (masih dipakai P1); perubahan tersimpan setelah reload. |
| AC-09 | Ubah status P1 → Dikembalikan, lalu cek jadwal `22/11 12:00–24/11 18:00` | Stok kembali **3**; status terminal tidak bisa diubah lagi. |
| AC-10 | Isi keranjang valid tetapi nama penyewa kosong | Tombol WhatsApp nonaktif dan alasan tampil sebagai teks; setelah nama diisi tombol aktif. |
| AC-11 | Klik "Kirim Pesanan via WhatsApp" | Tab WhatsApp terbuka dengan teks ringkasan yang sudah ter-encode; muncul toast sukses; keranjang kosong; pesanan baru berstatus **Menunggu Konfirmasi** dengan kode `RG-YYYYMMDD-NNN`. |
| AC-12 | Buka dashboard, ubah status: Menunggu → Terbooking → Terpinjam → Dikembalikan | Semua transisi berhasil lewat aksi yang tersedia; tombol "Tandai dikembalikan" meminta konfirmasi; tidak ada transisi lintas status yang melompat. |
| AC-13 | Di DevTools → Local Storage, ubah `waktuAmbil` salah satu pesanan Menunggu ke tanggal kemarin lalu muat ulang | Status otomatis menjadi **Kedaluwarsa**. Ulangi untuk pesanan Terbooking dengan `batasTidakDiambilMenit = 120` → **Tidak Diambil**. |
| AC-14 | Pesanan Terpinjam dengan jadwal kembali 18:00; lihat label saat "sekarang" 19:30 | Badge **Terlambat** muncul berdampingan dengan Terpinjam; status tersimpan tetap `Terpinjam` (cek di Local Storage). |
| AC-15 | Kembali jam 18:30 atau 19:00, lalu tandai dikembalikan | Denda **Rp 0**, total akhir = total biaya. |
| AC-16 | Kembali jam 19:30 (`tarifHarian` 65.000), lihat detail sebelum konfirmasi | Denda **Rp 6.500** dengan penjelasan "30 menit → 1 jam × 10% × Rp 65.000"; total akhir **Rp 201.500**. |
| AC-17 | Kembali jam 20:30 | Denda **Rp 13.000** (2 jam). |
| AC-18 | Kembali jam 05:00 hari berikutnya, lalu jam 07:00 pada pesanan lain dengan tarif harian sama | Keduanya denda **Rp 65.000** (plafon 100%), bukan 130.000. |
| AC-19 | Ubah `toleransiMenit` di Pengaturan menjadi 30, lalu ulangi AC-16 | Denda berubah sesuai toleransi baru (19:30 → 1 jam setelah 18:30 → 6.500); nilai tersimpan setelah reload. |
| AC-20 | Lihat Ringkasan dashboard | Tertampil total gear = 10, jumlah pesanan aktif benar (Menunggu + Terbooking + Terpinjam), estimasi pendapatan = jumlah `totalAkhir`/`totalBiaya` pesanan Dikembalikan sesuai definisi di UI. |
| AC-21 | Tambah gear dengan harga `-1`, lalu dengan unit `1.5` | Muncul error di bawah kolom; data tidak tersimpan. |
| AC-22 | Hapus gear yang masih dipakai pesanan aktif | Dialog memberi peringatan dan tombol hapus dinonaktifkan; membatalkan dialog tidak mengubah data. |
| AC-23 | Isi nama penyewa `<img src=x onerror=alert(1)>`, kirim pesanan, buka detail di dashboard | Teks tampil apa adanya sebagai tulisan; **tidak ada** popup/alert; tidak ada elemen `<img>` baru di DOM. |
| AC-24 | Muat ulang aplikasi setelah beberapa pesanan | Gear, pesanan, status, denda, dan konfigurasi tetap sama. |
| AC-25 | Klik "Reset data contoh" lalu Batal; lalu ulangi lalu Konfirmasi | Batal tidak mengubah apa pun; Konfirmasi mengembalikan 10 gear, 0 pesanan, dan konfigurasi default. |
| AC-26 | Periksa DevTools → Network dan sources | Tidak ada permintaan ke API eksternal, tidak ada string API key/token, tidak ada kredensial di kode maupun `localStorage`. |
| AC-27 | Buka di 360 px, 700 px, 1200 px | Tidak ada scroll horizontal; grid 1 → 2 → 3 kolom; banner Mode Demo selalu terlihat di dashboard. |

---

## 10. Implementation Plan per Iterasi

| Iterasi | Fokus | Deliverable | Exit criteria |
|---|---|---|---|
| **0 — Fondasi** | Setup & kontrak data | Inisialisasi Vite, struktur folder (`data/`, `domain/`, `storage/`, `ui/`), seed 10 gear, modul konfigurasi, placeholder SVG lokal, `README` singkat. | `npm run dev` berjalan; seed tampil; belum ada logika sewa. |
| **1 — Katalog** | M-01, M-02, M-03 | Halaman katalog, kartu gear, pencarian, chip kategori, sorting, empty state, gambar fallback. | AC-01, AC-02 lulus. |
| **2 — Jadwal & stok** | M-04, M-05 | Panel jadwal, modul `durasiHari`/`totalBiaya`, modul `intervalsOverlap`/`tersedia`, indikator stok di kartu. | AC-03, AC-04, AC-05, AC-06 lulus. |
| **3 — Sewa & kirim** | M-06, M-07, M-08, S-02 | Keranjang multi-item, validasi stok dinamis, form nama, ringkasan WhatsApp, status awal, penyimpanan pesanan. | AC-07, AC-08, AC-10, AC-11 lulus. |
| **4 — Dashboard** | M-09, M-10, S-01, S-03, S-04, S-05, S-06, S-07 | Halaman `#/dashboard` bertanda Mode Demo, ringkasan, tabel/kartu pesanan, transisi manual, auto status saat load, CRUD gear, Pengaturan. | AC-09, AC-12, AC-13, AC-20, AC-21, AC-22, AC-25, AC-27 lulus. |
| **5 — Denda & hardening** | M-11, M-12, M-13, S-08, C-01..C-04 | Modul denda tunggal, rumus di detail, konfirmasi pengembalian, render aman, ekspor/impor JSON, aksesibilitas & microcopy. | AC-14..AC-19, AC-23, AC-24, AC-26 lulus; seluruh AC diperiksa ulang. |

**Catatan urutan:** modul aturan bisnis (`durasiHari`, `tersedia`, `hitungDenda`, `evaluasiStatusOtomatis`) dibuat sekali dan dipakai oleh kedua halaman. Dilarang menduplikasi rumus di UI.

---

## 11. Keputusan yang Mengunci Pertanyaan Terbuka `ui.md`

1. **Navigasi dashboard:** sidebar kiri di desktop, bilah tab bawah di mobile — sesuai usulan `ui.md`.
2. **Daftar pesanan desktop:** tabel; mobile memakai kartu bertumpuk.
3. **Pengaturan:** tampil di dashboard (S-01), karena toleransi harus konfigurabel sesuai aturan bisnis.
4. **Deposit:** **tidak ada** (out-of-scope). Hapus baris "Deposit (jaminan)" dari wireframe keranjang `ui.md`.
5. **Kartu ringkasan:** 3 kartu wajib (total gear, pesanan aktif, estimasi pendapatan) + 2 kartu Should (ambil/kembali hari ini, Terlambat).
6. **Kode sewa:** `RG-YYYYMMDD-NNN`; contoh `RG-1121-001` pada wireframe bersifat ilustratif dan disesuaikan saat implementasi.
7. **Rumus denda pada wireframe detail** (`1 jam × 10% × Rp 65.000`) sudah sesuai dengan §5.5 dan dijadikan acuan angka.

---

## 12. Definition of Done

- Seluruh fitur **Must** dan kriteria AC-01..AC-27 lulus pemeriksaan manual.
- Tidak ada dependensi selain Vite; tidak ada kredensial; tidak ada data pribadi nyata.
- Rumus bisnis hanya ada di satu modul bersama.
- `ui.md` sudah diselaraskan dengan keputusan di §11.
- Dokumen ini diperbarui jika ada perubahan aturan saat implementasi.
