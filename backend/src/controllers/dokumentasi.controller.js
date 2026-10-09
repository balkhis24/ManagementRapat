const prisma = require('../lib/prisma');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const getDokumentasiByRapat = async (req, res) => {
  try {
    const { rapatId } = req.params;
    const dokumentasis = await prisma.dokumentasi.findMany({
      where: { rapat_id: parseInt(rapatId) },
      orderBy: { created_at: 'desc' }
    });
    res.json(dokumentasis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createDokumentasi = async (req, res) => {
  try {
    const { rapatId } = req.params;
    const { fileBase64, tipe = 'FOTO', urlFile } = req.body;

    const rapat = await prisma.rapat.findUnique({
      where: { id: parseInt(rapatId) }
    });

    if (!rapat) {
      return res.status(404).json({ error: 'Rapat tidak ditemukan' });
    }

    let savedUrl = urlFile || '';

    if (fileBase64) {
      const uploadsDir = path.join(__dirname, '../../uploads/dokumentasi');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Check mime type extension
      let extension = 'png';
      if (fileBase64.startsWith('data:image/jpeg') || fileBase64.startsWith('data:image/jpg')) {
        extension = 'jpg';
      } else if (fileBase64.startsWith('data:image/webp')) {
        extension = 'webp';
      }

      const base64Data = fileBase64.replace(/^data:image\/\w+;base64,/, '');
      const fileName = `doc_${uuidv4()}.${extension}`;
      const filePath = path.join(uploadsDir, fileName);

      fs.writeFileSync(filePath, base64Data, 'base64');
      savedUrl = `/uploads/dokumentasi/${fileName}`;
    }

    if (!savedUrl) {
      return res.status(400).json({ error: 'File gambar atau URL dokumentasi wajib disediakan' });
    }

    const doc = await prisma.dokumentasi.create({
      data: {
        rapat_id: parseInt(rapatId),
        tipe,
        url_file: savedUrl
      }
    });

    res.status(201).json({ message: 'Dokumentasi berhasil ditambahkan', dokumentasi: doc });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteDokumentasi = async (req, res) => {
  try {
    const { docId } = req.params;
    const doc = await prisma.dokumentasi.findUnique({
      where: { id: parseInt(docId) }
    });

    if (!doc) {
      return res.status(404).json({ error: 'Dokumentasi tidak ditemukan' });
    }

    // Try delete local file if exists
    if (doc.url_file && doc.url_file.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '../..', doc.url_file);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.warn('Gagal menghapus file dokumentasi dari disk:', e.message);
        }
      }
    }

    await prisma.dokumentasi.delete({
      where: { id: parseInt(docId) }
    });

    res.json({ message: 'Dokumentasi berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDokumentasiByRapat,
  createDokumentasi,
  deleteDokumentasi
};
