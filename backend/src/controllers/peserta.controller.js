const prisma = require('../lib/prisma');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const getAbsensiByToken = async (req, res) => {
  try {
    const { absensiToken } = req.params;
    const rapat = await prisma.rapat.findUnique({
      where: { absensiToken },
      select: {
        id: true,
        namaRapat: true,
        hariTanggal: true,
        waktu: true,
        tempat: true,
        status: true
      }
    });

    if (!rapat) {
      return res.status(404).json({ error: 'Rapat tidak ditemukan atau token tidak valid' });
    }

    if (rapat.status === 'SELESAI') {
      return res.status(400).json({ error: 'Rapat ini sudah selesai, absensi ditutup' });
    }

    res.json(rapat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const submitAbsensi = async (req, res) => {
  try {
    const { absensiToken } = req.params;
    const { nama, jabatan, instansi, noHp, email, ttdDigital } = req.body;

    // Validasi basic
    if (!nama || !email || !ttdDigital) {
      return res.status(400).json({ error: 'Nama, email, dan tanda tangan wajib diisi' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Format email tidak valid' });
    }

    // Cari rapat berdasarkan token
    const rapat = await prisma.rapat.findUnique({
      where: { absensiToken }
    });

    if (!rapat) {
      return res.status(404).json({ error: 'Rapat tidak ditemukan' });
    }

    if (rapat.status === 'SELESAI') {
      return res.status(400).json({ error: 'Rapat ini sudah selesai, absensi ditutup' });
    }

    // Simpan ttdDigital (base64) ke file
    const uploadsDir = path.join(__dirname, '../../uploads/ttd');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    let ttdDigitalUrl = '';
    if (ttdDigital) {
      // Hilangkan header data:image/png;base64,
      const base64Data = ttdDigital.replace(/^data:image\/png;base64,/, "");
      const fileName = `ttd_${uuidv4()}.png`;
      const filePath = path.join(uploadsDir, fileName);
      
      fs.writeFileSync(filePath, base64Data, 'base64');
      ttdDigitalUrl = `/uploads/ttd/${fileName}`;
    }

    // Simpan ke database
    const pesertaBaru = await prisma.peserta.create({
      data: {
        rapat_id: rapat.id,
        nama,
        jabatan: jabatan || '',
        instansi: instansi || '',
        noHp: noHp || '',
        email,
        ttdDigitalUrl
      }
    });

    res.status(201).json({ message: 'Absensi berhasil disimpan', peserta: pesertaBaru });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPesertaByRapat = async (req, res) => {
  try {
    const { id } = req.params; // ini rapatId
    const pesertaList = await prisma.peserta.findMany({
      where: { rapat_id: parseInt(id) },
      orderBy: { created_at: 'asc' }
    });
    res.json(pesertaList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAbsensiByToken,
  submitAbsensi,
  getPesertaByRapat
};
