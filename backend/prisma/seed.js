const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const qrcode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Memulai Seeding Database management_rapat ---');

  // 1. Seed Admin
  const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: { password: hashedPasswordAdmin, role: 'ADMIN', nama: 'Administrator Utama' },
    create: {
      username: 'admin',
      password: hashedPasswordAdmin,
      role: 'ADMIN',
      nama: 'Administrator Utama',
    },
  });
  console.log(`[+] Admin: ${admin.username} (role: ${admin.role}, password: admin123)`);

  // 1b. Seed Notulis
  const hashedPasswordNotulis = await bcrypt.hash('notulis123', 10);
  const notulis = await prisma.admin.upsert({
    where: { username: 'notulis' },
    update: { password: hashedPasswordNotulis, role: 'NOTULIS', nama: 'Notulis Sidang/Rapat' },
    create: {
      username: 'notulis',
      password: hashedPasswordNotulis,
      role: 'NOTULIS',
      nama: 'Notulis Sidang/Rapat',
    },
  });
  console.log(`[+] Notulis: ${notulis.username} (role: ${notulis.role}, password: notulis123)`);

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  // 2. Rapat 1: SPBE
  const token1 = uuidv4();
  const qr1 = await qrcode.toDataURL(`${frontendUrl}/absensi/${token1}`);
  const rapat1 = await prisma.rapat.create({
    data: {
      namaRapat: 'Rapat Koordinasi Penerapan SPBE & Transformasi Digital Kabupaten Bekasi',
      hariTanggal: new Date('2026-09-22T09:00:00.000Z'),
      waktu: '09:00 - 12:00 WIB',
      tempat: 'Ruang Rapat Utama Diskominfo Santik Lt. 2, Cikarang Pusat',
      status: 'BERLANGSUNG',
      absensiToken: token1,
      qrCodeUrl: qr1,
      notulens: {
        create: {
          pimpinan: 'Drs. H. Dedy Supriyadi, M.Si (Sekretaris Daerah)',
          isi_rapat: `<h3>Hasil Koordinasi SPBE 2026</h3>
<p>Berikut ringkasan agenda pembahasan rapat koordinasi Sistem Pemerintahan Berbasis Elektronik (SPBE):</p>
<ul>
  <li><strong>Indeks SPBE:</strong> Target capaian indeks SPBE Kabupaten Bekasi tahun 2026 adalah minimal 3.85 (kategori Sangat Baik).</li>
  <li><strong>Integrasi Layanan Publik:</strong> Seluruh aplikasi layanan publik OPD harus terintegrasi dengan Portal Bekasi Terpadu.</li>
  <li><strong>Keamanan Siber:</strong> CSIRT Diskominfo wajib melakukan vulnerability assessment berkala terhadap seluruh subdomain pemerintah.</li>
  <li><strong>Tindak Lanjut:</strong> Seluruh Kepala OPD wajib menyampaikan laporan mandiri arsitektur data paling lambat 30 September 2026.</li>
</ul>`,
          sudahDikirim: false
        }
      },
      pesertas: {
        create: [
          {
            nama: 'Ir. Ahmad Fauzi, M.T.',
            jabatan: 'Kepala Bidang TIK',
            instansi: 'Diskominfo Kabupaten Bekasi',
            noHp: '081234567890',
            email: 'ahmad.fauzi@bekasikab.go.id',
            ttdDigitalUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
          },
          {
            nama: 'Siti Rahmawati, S.Kom., M.Si.',
            jabatan: 'Analis Kebijakan Ahli Muda',
            instansi: 'Bappeda Kabupaten Bekasi',
            noHp: '081298765432',
            email: 'siti.rahma@bekasikab.go.id',
            ttdDigitalUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
          },
          {
            nama: 'Budi Santoso, S.E.',
            jabatan: 'Kepala Sub Bagian Umum & Kepegawaian',
            instansi: 'BPKAD Kabupaten Bekasi',
            noHp: '081311223344',
            email: 'budi.santoso@bekasikab.go.id',
            ttdDigitalUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
          }
        ]
      }
    }
  });
  console.log(`[+] Rapat 1: "${rapat1.namaRapat}" dibuat.`);

  // 3. Rapat 2: RKPD
  const token2 = uuidv4();
  const qr2 = await qrcode.toDataURL(`${frontendUrl}/absensi/${token2}`);
  const rapat2 = await prisma.rapat.create({
    data: {
      namaRapat: 'Rapat Pleno Penyusunan Rencana Kerja Pemerintah Daerah (RKPD) TA 2027',
      hariTanggal: new Date('2026-09-25T13:30:00.000Z'),
      waktu: '13:30 - 16:30 WIB',
      tempat: 'Aula KH Noer Ali, Gedung Bupati Lt. 4',
      status: 'BERLANGSUNG',
      absensiToken: token2,
      qrCodeUrl: qr2,
      notulens: {
        create: {
          pimpinan: 'Kepala Bappeda Kabupaten Bekasi',
          isi_rapat: `<p>Fokus prioritas pembangunan daerah tahun 2027:</p>
<ol>
  <li>Peningkatan kualitas infrastruktur konektivitas wilayah dan pengendalian banjir.</li>
  <li>Penguatan ekonomi lokal berbasis UMKM dan ketahanan pangan.</li>
  <li>Optimalisasi layanan pendidikan dan kesehatan inklusif.</li>
</ol>`,
          sudahDikirim: false
        }
      },
      pesertas: {
        create: [
          {
            nama: 'Dr. Hendra Gunawan, M.Kes.',
            jabatan: 'Sekretaris Dinas',
            instansi: 'Dinas Kesehatan Kab. Bekasi',
            noHp: '081566778899',
            email: 'hendra.gunawan@bekasikab.go.id',
            ttdDigitalUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
          },
          {
            nama: 'Dra. Hj. Nurjanah, M.Pd.',
            jabatan: 'Kepala Bidang Pembinaan SMP',
            instansi: 'Dinas Pendidikan Kab. Bekasi',
            noHp: '081677889900',
            email: 'nurjanah@bekasikab.go.id',
            ttdDigitalUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
          }
        ]
      }
    }
  });
  console.log(`[+] Rapat 2: "${rapat2.namaRapat}" dibuat.`);

  // 4. Rapat 3: TTE (SELESAI)
  const token3 = uuidv4();
  const qr3 = await qrcode.toDataURL(`${frontendUrl}/absensi/${token3}`);
  const rapat3 = await prisma.rapat.create({
    data: {
      namaRapat: 'Bimbingan Teknis Penerapan Tanda Tangan Elektronik (TTE) Tersertifikasi BSrE',
      hariTanggal: new Date('2026-09-18T08:30:00.000Z'),
      waktu: '08:30 - 15:00 WIB',
      tempat: 'Gedung Swatantra Wibawa Mukti, Komplek Perkantoran Pemkab Bekasi',
      status: 'SELESAI',
      absensiToken: token3,
      qrCodeUrl: qr3,
      notulens: {
        create: {
          pimpinan: 'Kepala Dinas Komunikasi, Informatika, Persandian dan Statistik',
          isi_rapat: `<p>Seluruh kepala unit kerja dan pejabat penandatangan dokumen wajib melakukan aktivasi sertifikat elektronik BSrE BSSN melalui aplikasi SIM-ASN.</p>`,
          sudahDikirim: true
        }
      },
      pesertas: {
        create: [
          {
            nama: 'Rizky Kurniawan, S.STP.',
            jabatan: 'Kasubag Kepegawaian',
            instansi: 'Kecamatan Cikarang Pusat',
            noHp: '081788990011',
            email: 'rizky.k@bekasikab.go.id',
            ttdDigitalUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
          },
          {
            nama: 'Maya Indahsari, S.IP.',
            jabatan: 'Pranata Komputer Pertama',
            instansi: 'Diskominfo Santik',
            noHp: '081899001122',
            email: 'maya.indah@bekasikab.go.id',
            ttdDigitalUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
          }
        ]
      }
    }
  });
  console.log(`[+] Rapat 3: "${rapat3.namaRapat}" dibuat.`);

  console.log('--- Seeding Selesai dengan Sukses! ---');
}

main()
  .catch((e) => {
    console.error('Terjadi error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
