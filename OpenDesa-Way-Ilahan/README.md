# OpenDesa Way Ilahan

Sistem Informasi Transparansi Data, Keuangan, dan Pelayanan Publik Desa Way Ilahan.

## Struktur

- `index.html`: Halaman beranda publik.
- `login.html`: Halaman login admin.
- `profile.html`: Profil desa dan visi/misi.
- `apbdes.html`: Informasi APBDes dan grafik keuangan.
- `berita.html`: Daftar berita desa.
- `pengumuman.html`: Pengumuman penting desa.
- `galeri.html`: Galeri foto kegiatan desa.
- `dokumen.html`: Halaman dokumen publik.
- `kontak.html`: Halaman kontak dan formulir pesan.
- `admin/`: Halaman panel admin.
- `assets/`: CSS, JS, ikon, dan gambar.
- `firebase/`: Konfigurasi dan fungsi Firebase.
- `data/sample-data.json`: Data sample struktur desa.

## Cara pakai

1. Buka `index.html` di browser.
2. Atau jalankan server lokal:
   ```bash
   cd OpenDesa-Way-Ilahan
   python3 -m http.server 8000
   ```
3. Buka `http://localhost:8000`.

## Firebase Setup

- Isikan nilai Firebase di `firebase/firebase-config.js`.
- Gunakan Firebase Authentication untuk login admin.
- Tambahkan Firestore collections: `profilDesa`, `penduduk`, `apbdes`, `berita`, `pengumuman`, `galeri`, `dokumen`.

## Catatan

- PWA sudah tersedia dengan `manifest.json` dan `assets/js/sw.js`.
- Data awal diambil dari `data/sample-data.json`.
