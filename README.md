# OpenDesa Way Ilahan

Proyek ini adalah website statis untuk Sistem Informasi Transparansi Desa Way Ilahan.

## Fitur utama

- Halaman publik dengan profil desa, berita, pengumuman, galeri, dokumen, dan kontak.
- Dashboard admin sederhana dengan fitur rudimenter untuk penduduk, APBDes, berita, dan dokumen.
- Integrasi Firebase Authentication, Firestore, dan Storage (placeholder konfigurasi).
- PWA dengan service worker dan manifest.

## Struktur folder

- `OpenDesa-Way-Ilahan/` - semua halaman dan aset website.
- `OpenDesa-Way-Ilahan/assets/` - CSS, JavaScript, ikon, dan gambar.
- `OpenDesa-Way-Ilahan/firebase/` - konfigurasi dan skrip Firebase.
- `OpenDesa-Way-Ilahan/data/` - data sample JSON.

## Menjalankan lokal

1. Buka `OpenDesa-Way-Ilahan/index.html` di browser.
2. Atau gunakan server lokal sederhana untuk memastikan PWA dan fetch JSON bekerja:

```bash
cd OpenDesa-Way-Ilahan
python3 -m http.server 8000
```

Lalu buka `http://localhost:8000`.

## Deployment GitHub Pages

- Website sekarang sudah siap di-Deploy dari branch `main`.
- GitHub Actions akan otomatis menerbitkan konten root ke Pages.
- Pastikan GitHub Pages di repository diatur ke branch `gh-pages` (jika menggunakan deployment otomatis) atau root `main`.

> URL publik: `https://kelompokciki.github.io/desa/`

## Firebase

- Isi konfigurasi Firebase di `OpenDesa-Way-Ilahan/firebase/firebase-config.js`.
- Gunakan Firestore collection sesuai struktur yang ada pada data sample.
