-- CreateTable
CREATE TABLE "Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Rapat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "namaRapat" TEXT NOT NULL,
    "hariTanggal" DATETIME NOT NULL,
    "waktu" TEXT NOT NULL,
    "tempat" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'BERLANGSUNG',
    "qrCodeUrl" TEXT,
    "absensiToken" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Notulen" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rapat_id" INTEGER NOT NULL,
    "pimpinan" TEXT NOT NULL,
    "isi_rapat" TEXT NOT NULL,
    "sudahDikirim" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notulen_rapat_id_fkey" FOREIGN KEY ("rapat_id") REFERENCES "Rapat" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Dokumentasi" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rapat_id" INTEGER NOT NULL,
    "tipe" TEXT NOT NULL,
    "url_file" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Dokumentasi_rapat_id_fkey" FOREIGN KEY ("rapat_id") REFERENCES "Rapat" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Peserta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rapat_id" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "instansi" TEXT NOT NULL,
    "noHp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ttdDigitalUrl" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Peserta_rapat_id_fkey" FOREIGN KEY ("rapat_id") REFERENCES "Rapat" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rapat_id" INTEGER NOT NULL,
    "peserta_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "errorMsg" TEXT,
    "waktu_kirim" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EmailLog_rapat_id_fkey" FOREIGN KEY ("rapat_id") REFERENCES "Rapat" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EmailLog_peserta_id_fkey" FOREIGN KEY ("peserta_id") REFERENCES "Peserta" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Rapat_absensiToken_key" ON "Rapat"("absensiToken");
