# Dokumentasi Fitur Aplikasi Manajemen Rapat & Daftar Hadir Digital

Dokumen ini berisi daftar lengkap fitur yang tersedia pada aplikasi **Sistem Manajemen Rapat & Daftar Hadir Digital**.

---

## 📌 Ringkasan Aplikasi
Aplikasi ini dirancang untuk mempermudah instansi/perusahaan dalam mengelola seluruh siklus rapat, mulai dari penjadwalan rapat, pembuatan barcode/QR Code kehadiran mandiri bagi peserta, verifikasi tanda tangan digital, penyusunan notulen berbasis Rich Text Editor, hingga distribusi hasil rapat otomatis ke email seluruh peserta yang hadir.

---

## 👥 Peran Pengguna (User Roles)

1. **Administrator (Admin)**
   - Mengelola agenda rapat (buat, ubah, selesaikan, hapus).
   - Menampilkan dan mengunduh QR Code absensi rapat.
   - Memantau peserta hadir secara real-time dan melihat tanda tangan digital peserta.
   - Melakukan export data kehadiran ke file CSV / Cetak dokumen.
   - Menulis, mengedit, dan mengarsipkan notulen/hasil rapat.
   - Mendistribusikan notulen secara otomatis via email ke peserta.
   - Mengirim ulang email jika ada peserta yang belum menerima notulen.

2. **Peserta Rapat (Publik / Tamu)**
   - Mengakses formulir absensi tanpa perlu login (cukup melalui scan QR Code atau tautan unik rapat).
   - Mengisi identitas diri dan membubuhkan tanda tangan digital langsung dari layar smartphone / tablet / laptop.
   - Menerima notulen rapat secara otomatis di email yang didaftarkan setelah rapat ditutup dan didistribusikan oleh admin.

---

## 🚀 Rincian Fitur Aplikasi

### 1. 🔐 Autentikasi & Keamanan (Admin Panel)
- **Login Admin**: Autentikasi menggunakan Username dan Password yang dienkripsi menggunakan `bcrypt`.
- **JWT (JSON Web Token)**: Pengamanan API backend menggunakan token JWT dengan validasi middleware pada endpoint administratif.
- **Route Guarding (`PrivateRoute`)**: Proteksi halaman dashboard admin dari akses publik yang belum terautentikasi.
- **Persistent Auth State**: Status sesi admin disimpan dengan aman dan tersinkronisasi di `AuthContext`.
- **Fitur Logout**: Menghapus sesi dan kredensial token dari penyimpanan lokal.

---

### 2. 📅 Modul Manajemen Rapat (Dashboard Admin)
- **Statistik Cepat (Metric Cards)**:
  - Total seluruh rapat yang terdaftar.
  - Jumlah rapat yang sedang berlangsung (*Active*).
  - Jumlah rapat yang telah selesai (*Closed*).
- **Penjadwalan Rapat Baru (Create Rapat)**:
  - Input nama agenda rapat.
  - Pemilihan hari & tanggal pelaksanaan.
  - Jam pelaksanaan rapat (WIB).
  - Lokasi / tempat / ruangan rapat.
- **Otomatisasi Token & QR Code**:
  - Sistem otomatis membuat token unik berbasis `UUID v4` untuk setiap rapat yang dibuat.
  - Sistem otomatis meng-generate gambar **QR Code** absensi beresolusi tinggi (Data URI).
- **Modal Pop-Up QR Code Interaktif**:
  - Pratinjau visual QR Code ukuran besar yang siap ditampilkan di proyektor/layar presentasi.
  - Tombol **Unduh QR Code (Download PNG)** untuk dicetak di meja registrasi.
  - Tombol **Salin Tautan (Copy Link)** langsung ke clipboard untuk disebarkan via WhatsApp/Telegram.
- **Pembaruan & Pengelolaan Rapat**:
  - Edit detail agenda, jadwal, waktu, dan tempat rapat.
  - Fitur **Tandai Selesai**: Menutup rapat secara resmi dan otomatis mengunci akses absensi peserta.
  - Fitur **Hapus Rapat**: Menghapus data rapat beserta seluruh relasi data (peserta, tanda tangan, notulen, log email) secara *cascade*.
- **Pencarian & Filter Rapat**:
  - Filter cepat berdasarkan status (*Semua*, *Berlangsung*, *Selesai*).
  - Kotak pencarian (*Search Bar*) berdasarkan judul / nama rapat.

---

### 3. ✍️ Modul Presensi / Absensi Peserta (Mobile-Friendly Web)
- **Akses Tanpa Akun**: Peserta dapat langsung membuka halaman presensi hanya dengan memindai QR Code atau mengklik link rapat.
- **Pemeriksaan Status Rapat Real-Time**:
  - Jika rapat berstatus **SELESAI**, formulir otomatis ditutup dan menampilkan pesan bahwa presensi sudah tidak dapat dilakukan.
  - Validasi token presensi untuk memastikan keabsahan tautan.
- **Formulir Isian Peserta**:
  - Nama Lengkap (Wajib)
  - Instansi / Lembaga / Perusahaan (Opsional)
  - Jabatan (Opsional)
  - Nomor Handphone / WhatsApp (Opsional)
  - Alamat Email Aktif (Wajib, dengan validasi format email)
- **Digital Signature Canvas (Tanda Tangan Digital)**:
  - Kanvas sentuh interaktif yang responsif untuk layar smartphone maupun mouse komputer.
  - Tombol **Hapus / Bersihkan Kanvas** untuk mengulang tanda tangan jika salah.
  - Gambar tanda tangan disimpan dalam format PNG di direktori penyimpanan server (`uploads/ttd/`).
- **Pencegahan Double-Submit**: Proteksi tombol submit agar tidak terjadi duplikasi entri kehadiran saat proses pengiriman.

---

### 4. 📋 Modul Rekapitulasi Kehadiran & Dokumen (Admin)
- **Tabel Rekap Kehadiran Real-Time**:
  - Menampilkan daftar seluruh peserta yang telah mengisi formulir presensi.
  - Informasi waktu presensi (*timestamp* kehadiran).
  - Kolom Nama, Instansi, Jabatan, No. HP, dan Email peserta.
- **Pratinjau Tanda Tangan Digital**:
  - Modal pop-up untuk melihat hasil tanda tangan digital asli setiap peserta secara detail.
- **Export Data ke CSV**:
  - Tombol satu klik untuk mengekspor seluruh data kehadiran ke format CSV yang kompatibel dibuka di Microsoft Excel, Google Sheets, atau aplikasi spreadsheet lainnya.
- **Fitur Cetak Dokumen (Print Ready)**:
  - Tampilan khusus yang diformat ramah cetak untuk mencetak berita acara daftar hadir fisik langsung dari browser.
- **Akses Cepat QR Code**:
  - Menampilkan tombol cepat untuk membuka QR Code rapat langsung dari halaman presensi admin.

---

### 5. 📝 Modul Notulen & Hasil Rapat (Admin)
- **Informasi Pimpinan Rapat & Notulis**:
  - Pencatatan nama pimpinan sidang/rapat.
- **Modern Rich Text Editor (Tiptap Engine)**:
  - Format Teks: **Bold**, *Italic*, ~~Strikethrough~~.
  - Struktur Dokumen: Heading 1, Heading 2, Heading 3, Paragraf.
  - Penomoran & Daftar: *Bullet List* (daftar poin), *Numbered List* (urutan angka).
  - Format Kutipan: *Blockquote*.
  - Pemisah Bagian: *Horizontal Rule / Divider*.
  - Riwayat Penulisan: Fitur *Undo* dan *Redo*.
- **Penyimpanan Fleksibel (Upsert Mechanism)**:
  - Mendukung penyimpanan draft notulen berkala serta pembaruan (*update*) notulen kapan saja.
- **Hapus Notulen**: Fitur untuk mereset atau menghapus notulen yang sudah disimpan bila diperlukan.
- **Fitur Cetak & PDF Notulen**: Menampilkan dokumen notulen resmi siap cetak lengkap dengan Kop Surat Pemkab Bekasi, hasil keputusan, dokumentasi foto, dan kolom tanda tangan pimpinan serta notulis.

---

### 6. 📸 Modul Dokumentasi Kegiatan Rapat (Admin)
- **Unggah Foto Dokumentasi**:
  - Dukungan upload foto kegiatan rapat langsung dari perangkat (format PNG, JPG, JPEG hingga 8MB).
  - Penyimpanan file foto terorganisir di server (`uploads/dokumentasi/`).
- **Galeri & Pratinjau Interaktif**:
  - Tampilan grid responsif untuk seluruh foto dokumentasi kegiatan rapat.
  - Modal pratinjau foto resolusi penuh saat diklik.
- **Manajemen Lampiran**:
  - Tombol hapus foto dokumentasi dengan konfirmasi keamanan.
- **Integrasi Cetak Berita Acara**:
  - Foto dokumentasi kegiatan otomatis disertakan pada lembar cetak Berita Acara & Notulen resmi.

---

### 7. 📧 Modul Distribusi Notulen via Email Otomatis (Email Blast)
- **Pengiriman Massal (Bulk Email Distribution)**:
  - Mengirimkan hasil rapat secara otomatis ke seluruh alamat email peserta yang tercatat pada daftar kehadiran dengan 1 klik tombol.
- **Template Email HTML Formal & Informatif**:
  - Header judul agenda rapat.
  - Tabel ringkasan detail rapat (Hari/Tanggal, Waktu, Tempat, Pimpinan Rapat).
  - Kotak khusus hasil keputusan notulen rapat sesuai format teks yang ditulis.
  - Footer otomatis sistem manajemen rapat.
- **Log Riwayat Pengiriman Email (`EmailLog`)**:
  - Pelacakan status pengiriman untuk setiap peserta (**TERKIRIM** atau **GAGAL**).
  - Pencatatan pesan kesalahan (*error message*) jika pengiriman ke alamat email tertentu gagal.
  - Ringkasan hasil pengiriman (Jumlah email sukses terkirim vs gagal).
- **Fitur Kirim Ulang Email Perorangan (*Resend Email*)**:
  - Tombol kirim ulang email secara individu khusus untuk peserta yang gagal menerima notulen tanpa perlu mengirim ulang ke seluruh peserta lainnya.

---

### 8. 📊 Modul Laporan & Data Master
- **Laporan & Rekapitulasi Rapat**:
  - Ringkasan statistik (Total Rapat, Berlangsung, Selesai, Notulen Dibuat).
  - Ekspor seluruh data rekapitulasi rapat ke format CSV.
  - Cetak laporan ringkas pelaksanaan rapat.
- **Master Ruang Rapat & Kategori Agenda**:
  - Pemilihan ruang rapat dan kategori agenda siap pakai.
  - Navigasi lintas halaman yang sinkron langsung dari Admin Sidebar.
- **Pengaturan Akun & Ubah Password**:
  - Form ubah kata sandi administrator dengan validasi password lama dan enkripsi `bcrypt` real-time ke database.
  - Tombol Keluar (Logout) yang terintegrasi di sidebar dengan konfirmasi.

---

## 🛠️ Ringkasan Tech Stack

| Lapisan | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + Vite | SPA modern dengan performa tinggi & hot-module replacement |
| **Styling** | Tailwind CSS v4 | Utility-first CSS dengan desain modern dan responsif |
| **Iconography** | Lucide React | Ikon modern dan konsisten di seluruh antarmuka |
| **Routing** | React Router DOM v7 | Manajemen navigasi halaman dan route guard |
| **Rich Text Editor** | Tiptap (Headless Editor) | Editor WYSIWYG untuk penulisan notulen rapat |
| **Signature Pad** | React Signature Canvas | Input tanda tangan digital berbasis HTML5 canvas |
| **HTTP Client** | Axios | Komunikasi data dengan REST API Backend |
| **Notifikasi UI** | React Hot Toast | Toast alert interaktif untuk umpan balik aksi pengguna |
| **Backend Runtime** | Node.js + Express.js | REST API server |
| **Database ORM** | Prisma ORM | Pemodelan data type-safe & query generator |
| **Database Engine** | MySQL | Basis data relasional untuk penyimpanan data rapat & absensi |
| **Autentikasi** | JSON Web Token (JWT) + Bcrypt | Enkripsi kata sandi dan pengamanan rute API |
| **QR Code Engine** | node-qrcode | Generator QR Code URL presensi otomatis |
| **Email Service** | Nodemailer | Layanan SMTP untuk pengiriman notulen ke email peserta |
| **File Storage** | Local File System (Node `fs`) | Penyimpanan aset gambar tanda tangan digital |
