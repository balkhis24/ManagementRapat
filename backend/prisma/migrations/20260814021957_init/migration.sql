-- CreateTable
CREATE TABLE `Rapat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaRapat` VARCHAR(191) NOT NULL,
    `hariTanggal` DATETIME(3) NOT NULL,
    `waktu` VARCHAR(191) NOT NULL,
    `tempat` VARCHAR(191) NOT NULL,
    `status` ENUM('BERLANGSUNG', 'SELESAI') NOT NULL DEFAULT 'BERLANGSUNG',
    `qrCodeUrl` TEXT NULL,
    `absensiToken` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Rapat_absensiToken_key`(`absensiToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notulen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rapat_id` INTEGER NOT NULL,
    `pimpinan` VARCHAR(191) NOT NULL,
    `isi_rapat` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dokumentasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rapat_id` INTEGER NOT NULL,
    `tipe` ENUM('FOTO', 'VIDEO') NOT NULL,
    `url_file` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Peserta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rapat_id` INTEGER NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NOT NULL,
    `instansi` VARCHAR(191) NOT NULL,
    `noHp` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `ttdDigitalUrl` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmailLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rapat_id` INTEGER NOT NULL,
    `peserta_id` INTEGER NOT NULL,
    `status` ENUM('TERKIRIM', 'GAGAL', 'PENDING') NOT NULL DEFAULT 'PENDING',
    `waktu_kirim` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notulen` ADD CONSTRAINT `Notulen_rapat_id_fkey` FOREIGN KEY (`rapat_id`) REFERENCES `Rapat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dokumentasi` ADD CONSTRAINT `Dokumentasi_rapat_id_fkey` FOREIGN KEY (`rapat_id`) REFERENCES `Rapat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Peserta` ADD CONSTRAINT `Peserta_rapat_id_fkey` FOREIGN KEY (`rapat_id`) REFERENCES `Rapat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmailLog` ADD CONSTRAINT `EmailLog_rapat_id_fkey` FOREIGN KEY (`rapat_id`) REFERENCES `Rapat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmailLog` ADD CONSTRAINT `EmailLog_peserta_id_fkey` FOREIGN KEY (`peserta_id`) REFERENCES `Peserta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
