# 🏛️ Sistem Manajemen Rapat & Daftar Hadir Digital
### Pemerintah Kabupaten Bekasi (Diskominfo)

Aplikasi web modern untuk manajemen siklus rapat kedinasan secara terpadu: mulai dari penjadwalan, absensi digital berbasis QR Code & tanda tangan elektronik, pencatatan notulen, dokumentasi kegiatan, hingga distribusi otomatis notulen rapat ke email peserta.

---

## 🚀 Fitur Utama

- **Dashboard Admin Terpadu**: Monitoring agenda rapat, status rapat (berlangsung / selesai), dan statistik kehadiran.
- **QR Code & Link Presensi Otomatis**: Generator QR Code instan beresolusi tinggi yang dapat langsung diunduh atau disalin tautannya.
- **Presensi Publik Digital**: Formulir kehadiran mobile-friendly dengan canvas Tanda Tangan Digital langsung di layar gawai.
- **Pencatatan Notulen & Dokumentasi**: Editor notulen rapat lengkap dengan upload foto/berkas dokumentasi kegiatan.
- **Distribusi Email Notulen Otomatis**: Pengiriman rekap notulen dan lampiran ke email seluruh peserta yang hadir.
- **Export Data Presensi**: Unduh data absensi peserta ke format CSV atau cetak dokumen absensi.

Untuk rincian lengkap fitur, lihat [FITUR.md](./FITUR.md).

---

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js**
- **Prisma ORM** (MySQL)
- **JWT** & **Bcrypt** untuk autentikasi admin
- **Nodemailer** untuk distribusi email notulen
- **QRCode** & **UUID** untuk generator kode presensi

### Frontend
- **React.js** (Vite)
- **Tailwind CSS**
- **Lucide Icons**
- **Axios**

---

## ⚙️ Panduan Menjalankan Project

### 1. Prasyarat
- Node.js (v18+)
- MySQL Server (XAMPP / MySQL Service)

### 2. Konfigurasi Backend
```bash
cd backend
npm install
```

Salin file environment:
```bash
cp .env.example .env
```
Sesuaikan konfigurasi database dan port di `backend/.env`.

Jalankan migrasi database & seed data:
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

Jalankan server backend:
```bash
npm run dev
# Backend berjalan di http://localhost:5000
```

### 3. Konfigurasi Frontend
```bash
cd ../frontend
npm install
npm run dev
# Frontend berjalan di http://localhost:5173
```

---

## 👤 Akun Default Admin
- **Username**: `admin`
- **Password**: `admin123`
