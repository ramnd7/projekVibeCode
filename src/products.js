// Data contoh dan konstanta gear. Sumber: SPEC.md §4.1, §4.3, §4.5.

export const KATEGORI = ['Tenda', 'Tas & carrier', 'Tidur', 'Masak', 'Penerangan', 'Aksesori'];
export const KONDISI = ['Baik', 'Perlu perawatan'];

export const GEAR_SEED = [
  { id: 'G-01', nama: 'Tenda Dome 2P', kategori: 'Tenda', hargaPerHari: 35000, jumlahUnit: 3, kondisi: 'Baik', deskripsi: 'Tenda dome untuk dua orang, cocok untuk perkemahan ringan.', imageUrl: '/images/gear/g-01.svg' },
  { id: 'G-02', nama: 'Tenda Dome 3P', kategori: 'Tenda', hargaPerHari: 50000, jumlahUnit: 2, kondisi: 'Baik', deskripsi: 'Tenda dome tiga orang dengan ruang extra untuk perlengkapan.', imageUrl: '/images/gear/g-02.svg' },
  { id: 'G-03', nama: 'Carrier 50L', kategori: 'Tas & carrier', hargaPerHari: 30000, jumlahUnit: 2, kondisi: 'Baik', deskripsi: 'Carrier 50 liter untuk perjalanan satu hingga dua hari.', imageUrl: '/images/gear/g-03.svg' },
  { id: 'G-04', nama: 'Carrier 65L', kategori: 'Tas & carrier', hargaPerHari: 40000, jumlahUnit: 2, kondisi: 'Perlu perawatan', deskripsi: 'Carrier 65 liter. Sedang perawatan, belum tersedia disewa.', imageUrl: '/images/gear/g-04.svg' },
  { id: 'G-05', nama: 'Sleeping Bag -5°C', kategori: 'Tidur', hargaPerHari: 20000, jumlahUnit: 4, kondisi: 'Baik', deskripsi: 'Sleeping bag dengan kenyamanan hingga suhu minus lima derajat.', imageUrl: '/images/gear/g-05.svg' },
  { id: 'G-06', nama: 'Matras Gulung', kategori: 'Tidur', hargaPerHari: 10000, jumlahUnit: 7, kondisi: 'Baik', deskripsi: 'Matras gulung ringan sebagai alas tidur di lapangan.', imageUrl: '/images/gear/g-06.svg' },
  { id: 'G-07', nama: 'Kompor Portable', kategori: 'Masak', hargaPerHari: 25000, jumlahUnit: 3, kondisi: 'Baik', deskripsi: 'Kompor portabel untuk memasak di luar ruangan.', imageUrl: '/images/gear/g-07.svg' },
  { id: 'G-08', nama: 'Nesting Set', kategori: 'Masak', hargaPerHari: 15000, jumlahUnit: 4, kondisi: 'Baik', deskripsi: 'Set panci dan wadah masak yang bisa ditumpuk.', imageUrl: '/images/gear/g-08.svg' },
  { id: 'G-09', nama: 'Headlamp Rechargeable', kategori: 'Penerangan', hargaPerHari: 12000, jumlahUnit: 5, kondisi: 'Baik', deskripsi: 'Lampu kepala isi ulang untuk aktivitas malam.', imageUrl: '/images/gear/g-09.svg' },
  { id: 'G-10', nama: 'Trekking Pole', kategori: 'Aksesori', hargaPerHari: 15000, jumlahUnit: 4, kondisi: 'Baik', deskripsi: 'Tongkat hiking untuk menjaga keseimbangan di medan berat.', imageUrl: '/images/gear/g-10.svg' },
];

// Nomor WhatsApp admin diisi nomor pemilik proyek (diminta 19-11-2026).
// Catatan: SPEC.md/TASKS.md masih menyebut placeholder; dokumen tidak diubah.
export const CONFIG_DEFAULT = {
  toleransiMenit: 60,
  dendaPersenPerJam: 10,
  plafonDendaPersen: 100,
  batasKedaluwarsaMenit: 0,
  batasTidakDiambilMenit: 120,
  whatsappAdmin: '6285739105737',
  jamLayanan: '08:00-20:00',
};

export const CARTS_KOSONG = () => ({ jadwal: { waktuAmbil: '', waktuKembaliJadwal: '' }, items: [] });
