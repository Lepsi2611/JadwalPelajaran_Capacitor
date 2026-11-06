# Jadwal Pelajaran

Aplikasi jadwal pelajaran per hari (Senin–Jumat), offline, dibungkus jadi APK Android dengan Capacitor.
Data jadwal ada di `data/jadwal.json` (TA 2026/2027, jurusan RPL). Ganti isi file itu untuk semester berikutnya, tanpa mengubah kode.

## Fitur
- Halaman utama berisi daftar hari, dengan penanda "Hari ini"
- Halaman jadwal per hari: mata pelajaran, jam mulai/selesai, guru, dan total mapel (dihitung otomatis)
- Tab pindah hari, tombol kembali, tampilan jika belum ada jadwal
- Semua data dibaca dari JSON, berjalan tanpa internet

## Struktur
```
index.html  css/style.css  js/script.js  data/jadwal.json
assets/icon/  scripts/copy-web.js  capacitor.config.json  package.json
.github/workflows/build-apk.yml
```

## Format `jadwal.json`
```json
{ "hari": [ { "nama": "Senin", "daftarMapel": [
  { "nama": "Matematika", "jamMulai": "07:00", "jamSelesai": "08:30", "guru": "Pak Budi" }
] } ] }
```
Field `jamKe` (mis. `"3-4"`) bersifat opsional.

## Jalankan di komputer
Buka dengan Live Server (VS Code) atau `npx serve .`. Membuka `index.html` langsung lewat `file://` tidak bisa membaca JSON.

## Build APK
**Otomatis lewat GitHub Actions:** push ke `main` (atau Actions > Build APK > Run workflow). APK ada di Artifacts (`JadwalPelajaran-apk`). Push tag `v1.0.0` untuk membuat GitHub Release berisi APK.

**Manual** (Node 18+, JDK 17, Android SDK):
```bash
npm install
npm run web
npx cap add android   # sekali saja
npx cap sync android
cd android && ./gradlew assembleDebug
```
Hasil: `android/app/build/outputs/apk/debug/app-debug.apk`

## Upload ke GitHub
```bash
git init
git add .
git commit -m "Initial commit: Jadwal Pelajaran"
git branch -M main
git remote add origin https://github.com/USERNAME/jadwal-pelajaran.git
git push -u origin main
```

## Teknologi
HTML, CSS, JavaScript, JSON, Capacitor, Gradle. Package ID: `com.jadwalpelajaran.app`.
