# RoadMate — Teman Perjalanan Anda

Situs satu halaman yang bisa dipasang di layar utama Android. Menampilkan penyedia terdekat (SPBU, bengkel, tambal ban, tempat makan, penginapan, rumah sakit, dan lain-lain) serta informasi jalan per koridor. Perjalanan dijalankan di Google Maps. Tanpa AI, tanpa peta sendiri, tanpa server.

Berkas ini **belum berisi data apa pun**. Semua data Anda isi sendiri lewat Google Sheets.

## Isi folder

- `index.html` — aplikasi (pengaturan ada di bagian `CONFIG` dekat awal skrip)
- `manifest.webmanifest`, `sw.js`, `icons/` — agar bisa dipasang dan terbuka tanpa internet
- `templat-data/` — empat berkas CSV berisi judul kolom saja, untuk diimpor ke Google Sheets

## Langkah 1 — Siapkan data di Google Sheets

1. Buat satu Google Sheets dengan empat tab: `Penyedia`, `InfoJalan`, `Koridor`, `KontakDarurat`.
2. Di tiap tab, impor berkas CSV yang sesuai dari `templat-data/` (Berkas → Impor → Unggah → ganti lembar saat ini).
3. Isi baris data. Aturan penting:
   - `kategori`: spbu, spklu, bengkel, tambalban, derek, parkir, makan, penginapan, musala, toilet, minimarket, atm, rs, apotek, polisi.
   - `lat`, `lng`: koordinat desimal (contoh -6.81, 107.61).
   - `status_verifikasi`: hanya baris berisi `terverifikasi` yang tampil. Isi setelah Anda memeriksa sendiri.
   - `sumber` dan `diperbarui` (tahun-bulan-tanggal): isi selalu. Data lebih dari 180 hari diberi tanda "mungkin sudah lama".
   - `InfoJalan.berlaku_hingga`: informasi yang lewat tanggal ini otomatis disembunyikan.
   - `Koridor.singgah`: titik singgah dipisah tanda `|` (maksimal 9).
   - `Koridor.jalur_geojson`: garis rute (LineString) untuk gambar skematis, atau isi `gambar_peta` dengan tautan gambar.
   - `KontakDarurat`: isi hanya nomor yang sudah Anda verifikasi ke instansi resmi.
4. Jangan menyalin data dari Google Maps/Places. Kumpulkan sendiri lewat survei, atau dari sumber yang lisensinya mengizinkan (OpenStreetMap wajib mencantumkan atribusi).

## Langkah 2 — Terbitkan tiap tab sebagai CSV

Untuk setiap tab: Berkas → Bagikan → Terbitkan ke web → pilih tab itu → format **CSV** → Terbitkan. Salin tautannya.

Buka `index.html` dengan editor teks, lalu tempel keempat tautan di:

```js
sumber: { penyedia: '...', infojalan: '...', koridor: '...', kontak: '...' },
kontakAdmin: { wa: '08xxxxxxxxxx', email: '' },   // tujuan tombol "Laporkan data keliru"
```

Data yang diterbitkan ke web bisa dibaca siapa saja yang punya tautannya. Jangan taruh data pribadi di tab ini.

## Langkah 3 — Pasang di GitHub Pages (pola yang sama dengan web Bani Ilyas)

1. Buat repositori publik baru, unggah seluruh isi folder ini (kecuali `templat-data/` bila tidak diperlukan).
2. Settings → Pages → Branch `main`, folder `/ (root)` → Save.
3. Alamat situs muncul beberapa menit kemudian, bentuknya `https://<akun>.github.io/<repositori>/`.

## Langkah 4 — Pasang di Android

Buka alamat situs di Chrome → menu ⋮ → **Pasang aplikasi** (atau Tambahkan ke layar utama). Setelah terpasang, aplikasi terbuka layar penuh dan tetap menampilkan data terakhir saat sinyal hilang. Izinkan lokasi saat diminta.

## Memperbarui

- Data: ubah isi Google Sheets. Aplikasi mengambil data terbaru saat dibuka (tautan terbitan bisa tertunda beberapa menit).
- Tampilan: ganti berkas di GitHub. Bila perubahan belum muncul, tutup aplikasi lalu buka lagi dua kali. Naikkan nomor `VERSI` di `sw.js` agar cache lama dibuang.

## Cadangan dari OpenStreetMap

Saat ikon kategori diklik dan data terverifikasi Anda di sekitar lokasi pengguna kurang dari 3 tempat (dalam radius `jarakJauhKm`), aplikasi otomatis mencari tempat terdekat dari OpenStreetMap lewat layanan Overpass. Hasilnya diberi tanda "OpenStreetMap • belum diverifikasi" dan atribusi © kontributor OpenStreetMap (lisensi ODbL). Yang dikirim hanya koordinat yang dibulatkan (sekitar 1 km) dan jenis tempat. Hasil disimpan sementara agar tidak mencari ulang. Kategori derek tidak punya data yang andal di OpenStreetMap, jadi tetap memakai tombol Google Maps. Untuk mematikan fitur ini, ubah `osm: true` menjadi `osm: false` di `CONFIG`. Layanan Overpass publik punya batas pemakaian wajar; bila pengguna sudah banyak, pertimbangkan mengandalkan data Google Sheets sendiri.

## Alat uji data

Tab Info → "Untuk pengelola data": tempel baris CSV penyedia untuk mencoba tanpa mengubah Google Sheets. Data uji hanya tersimpan di perangkat itu dan diberi tanda "data uji". Hapus lewat tombol di bawahnya.

## Yang perlu Anda ketahui

- Jarak dihitung di ponsel; koordinat tidak dikirim ke server RoadMate. Tombol Menuju dan Mulai perjalanan membuka Google Maps.
- Tombol "Cari ... di Google Maps" muncul bila data suatu kategori masih kosong.
- Aplikasi bersifat panduan; kondisi lapangan dan petunjuk petugas selalu didahulukan.
- Skema bayar sekali beli belum ada di berkas ini. Untuk tahap awal, aplikasi terbuka bebas; pembatasan akses perlu dirancang tersendiri.
