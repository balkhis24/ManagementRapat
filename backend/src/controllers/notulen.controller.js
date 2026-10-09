const prisma = require('../lib/prisma');
const { sendMail } = require('../lib/mailer');

const getNotulenByRapat = async (req, res) => {
  try {
    const { rapatId } = req.params;
    const notulen = await prisma.notulen.findFirst({
      where: { rapat_id: parseInt(rapatId) }
    });
    
    if (!notulen) {
      return res.status(404).json({ error: 'Notulen belum dibuat untuk rapat ini' });
    }
    
    res.json(notulen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const upsertNotulen = async (req, res) => {
  try {
    const { rapatId } = req.params;
    const { pimpinan, isiRapat } = req.body;
    
    // Cek apakah notulen sudah ada
    const existingNotulen = await prisma.notulen.findFirst({
      where: { rapat_id: parseInt(rapatId) }
    });
    
    let notulen;
    if (existingNotulen) {
      notulen = await prisma.notulen.update({
        where: { id: existingNotulen.id },
        data: { pimpinan, isi_rapat: isiRapat }
      });
    } else {
      notulen = await prisma.notulen.create({
        data: {
          rapat_id: parseInt(rapatId),
          pimpinan,
          isi_rapat: isiRapat
        }
      });
    }
    
    res.json({ message: 'Notulen berhasil disimpan', notulen });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const formatDate = (date) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('id-ID', options);
};

const kirimEmailNotulen = async (req, res) => {
  try {
    const { rapatId } = req.params;
    
    // Ambil data Notulen & Rapat
    const notulen = await prisma.notulen.findFirst({
      where: { rapat_id: parseInt(rapatId) },
      include: { rapat: true }
    });
    
    if (!notulen) {
      return res.status(404).json({ error: 'Notulen belum dibuat' });
    }
    
    // Ambil data Peserta yang hadir di rapat ini dan punya email
    const pesertas = await prisma.peserta.findMany({
      where: { 
        rapat_id: parseInt(rapatId),
        email: { not: '' }
      }
    });
    
    if (pesertas.length === 0) {
      return res.status(400).json({ error: 'Tidak ada peserta dengan email yang valid' });
    }
    
    const { rapat } = notulen;
    const subject = `Hasil Rapat: ${rapat.namaRapat} - ${formatDate(rapat.hariTanggal)}`;
    
    // Template HTML Email
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Hasil Rapat: ${rapat.namaRapat}</h2>
        
        <table style="width: 100%; margin-bottom: 20px; border-collapse: collapse;">
          <tr><td style="padding: 5px 0; font-weight: bold; width: 150px;">Hari/Tanggal</td><td style="padding: 5px 0;">: ${formatDate(rapat.hariTanggal)}</td></tr>
          <tr><td style="padding: 5px 0; font-weight: bold;">Waktu</td><td style="padding: 5px 0;">: ${rapat.waktu} WIB</td></tr>
          <tr><td style="padding: 5px 0; font-weight: bold;">Tempat</td><td style="padding: 5px 0;">: ${rapat.tempat}</td></tr>
          <tr><td style="padding: 5px 0; font-weight: bold;">Pimpinan Rapat</td><td style="padding: 5px 0;">: ${notulen.pimpinan}</td></tr>
        </table>
        
        <h3 style="background-color: #f3f4f6; padding: 10px; border-radius: 4px;">Isi Rapat / Keputusan:</h3>
        <div style="margin-bottom: 20px; padding: 15px; border-left: 4px solid #2563eb; background-color: #f9fafb;">
          ${notulen.isi_rapat}
        </div>
        
        <p style="margin-top: 30px; font-size: 14px; color: #666; border-top: 1px solid #ddd; padding-top: 15px;">
          Email ini dibuat secara otomatis. Terima kasih atas partisipasi Anda.<br>
          <strong>Admin Sistem Manajemen Rapat</strong>
        </p>
      </div>
    `;

    let terkirim = 0;
    let gagal = 0;
    const detail = [];

    // Looping kirim email
    for (const peserta of pesertas) {
      try {
        await sendMail(peserta.email, subject, htmlBody);
        
        // Simpan log sukses
        await prisma.emailLog.create({
          data: {
            rapat_id: rapat.id,
            peserta_id: peserta.id,
            status: 'TERKIRIM'
          }
        });
        
        terkirim++;
        detail.push({ pesertaId: peserta.id, email: peserta.email, nama: peserta.nama, status: 'TERKIRIM' });
      } catch (error) {
        // Simpan log gagal
        await prisma.emailLog.create({
          data: {
            rapat_id: rapat.id,
            peserta_id: peserta.id,
            status: 'GAGAL',
            errorMsg: error.message
          }
        });
        
        gagal++;
        detail.push({ pesertaId: peserta.id, email: peserta.email, nama: peserta.nama, status: 'GAGAL', error: error.message });
      }
    }

    // Update status Notulen
    if (terkirim > 0) {
      await prisma.notulen.update({
        where: { id: notulen.id },
        data: { sudahDikirim: true }
      });
    }

    res.json({
      message: 'Proses pengiriman email selesai',
      ringkasan: {
        totalPeserta: pesertas.length,
        terkirim,
        gagal,
        detail
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const kirimUlangEmailPeserta = async (req, res) => {
  try {
    const { rapatId, pesertaId } = req.params;
    
    // Ambil data Notulen
    const notulen = await prisma.notulen.findFirst({
      where: { rapat_id: parseInt(rapatId) },
      include: { rapat: true }
    });
    
    if (!notulen) return res.status(404).json({ error: 'Notulen belum dibuat' });
    
    // Ambil data Peserta
    const peserta = await prisma.peserta.findUnique({
      where: { id: parseInt(pesertaId) }
    });
    
    if (!peserta) return res.status(404).json({ error: 'Peserta tidak ditemukan' });
    if (!peserta.email) return res.status(400).json({ error: 'Peserta tidak memiliki alamat email' });

    const { rapat } = notulen;
    const subject = `Hasil Rapat: ${rapat.namaRapat} - ${formatDate(rapat.hariTanggal)}`;
    
    // Template HTML Email (bisa diekstraksi ke fungsi terpisah nanti)
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Hasil Rapat: ${rapat.namaRapat}</h2>
        <table style="width: 100%; margin-bottom: 20px; border-collapse: collapse;">
          <tr><td style="padding: 5px 0; font-weight: bold; width: 150px;">Hari/Tanggal</td><td style="padding: 5px 0;">: ${formatDate(rapat.hariTanggal)}</td></tr>
          <tr><td style="padding: 5px 0; font-weight: bold;">Waktu</td><td style="padding: 5px 0;">: ${rapat.waktu} WIB</td></tr>
          <tr><td style="padding: 5px 0; font-weight: bold;">Tempat</td><td style="padding: 5px 0;">: ${rapat.tempat}</td></tr>
          <tr><td style="padding: 5px 0; font-weight: bold;">Pimpinan Rapat</td><td style="padding: 5px 0;">: ${notulen.pimpinan}</td></tr>
        </table>
        <h3 style="background-color: #f3f4f6; padding: 10px; border-radius: 4px;">Isi Rapat / Keputusan:</h3>
        <div style="margin-bottom: 20px; padding: 15px; border-left: 4px solid #2563eb; background-color: #f9fafb;">
          ${notulen.isi_rapat}
        </div>
        <p style="margin-top: 30px; font-size: 14px; color: #666; border-top: 1px solid #ddd; padding-top: 15px;">
          Email ini dibuat secara otomatis. Terima kasih atas partisipasi Anda.<br>
          <strong>Admin Sistem Manajemen Rapat</strong>
        </p>
      </div>
    `;

    try {
      await sendMail(peserta.email, subject, htmlBody);
      
      // Simpan log sukses
      await prisma.emailLog.create({
        data: {
          rapat_id: rapat.id,
          peserta_id: peserta.id,
          status: 'TERKIRIM'
        }
      });
      
      res.json({ message: 'Email berhasil dikirim ulang' });
    } catch (error) {
      // Simpan log gagal
      await prisma.emailLog.create({
        data: {
          rapat_id: rapat.id,
          peserta_id: peserta.id,
          status: 'GAGAL',
          errorMsg: error.message
        }
      });
      
      res.status(500).json({ error: 'Gagal mengirim email: ' + error.message });
    }
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteNotulen = async (req, res) => {
  try {
    const { rapatId } = req.params;
    const notulen = await prisma.notulen.findFirst({
      where: { rapat_id: parseInt(rapatId) }
    });
    
    if (!notulen) {
      return res.status(404).json({ error: 'Hasil rapat / notulen tidak ditemukan' });
    }
    
    await prisma.notulen.delete({
      where: { id: notulen.id }
    });
    
    res.json({ message: 'Hasil rapat / notulen berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getNotulenByRapat,
  upsertNotulen,
  deleteNotulen,
  kirimEmailNotulen,
  kirimUlangEmailPeserta
};
