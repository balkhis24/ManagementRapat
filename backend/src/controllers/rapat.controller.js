const prisma = require('../lib/prisma');
const qrcode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const getAllRapat = async (req, res) => {
  try {
    const rapatList = await prisma.rapat.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        notulens: {
          select: { id: true, sudahDikirim: true }
        }
      }
    });
    res.json(rapatList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRapatById = async (req, res) => {
  try {
    const { id } = req.params;
    const rapat = await prisma.rapat.findUnique({
      where: { id: parseInt(id) },
      include: {
        pesertas: true,
        dokumentasis: true,
        notulens: true
      }
    });
    if (!rapat) return res.status(404).json({ error: 'Rapat tidak ditemukan' });
    res.json(rapat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createRapat = async (req, res) => {
  try {
    const { namaRapat, hariTanggal, waktu, tempat } = req.body;
    
    // Generate unique token
    const absensiToken = uuidv4();
    
    // Generate QR Code URL (Data URI Base64)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const absensiUrl = `${frontendUrl}/absensi/${absensiToken}`;
    const qrCodeUrl = await qrcode.toDataURL(absensiUrl);

    const newRapat = await prisma.rapat.create({
      data: {
        namaRapat,
        hariTanggal: new Date(hariTanggal),
        waktu,
        tempat,
        absensiToken,
        qrCodeUrl
      }
    });
    res.status(201).json(newRapat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateRapat = async (req, res) => {
  try {
    const { id } = req.params;
    const { namaRapat, hariTanggal, waktu, tempat } = req.body;
    
    const updatedRapat = await prisma.rapat.update({
      where: { id: parseInt(id) },
      data: {
        namaRapat,
        ...(hariTanggal && { hariTanggal: new Date(hariTanggal) }),
        waktu,
        tempat
      }
    });
    res.json(updatedRapat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const tandaiSelesai = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRapat = await prisma.rapat.update({
      where: { id: parseInt(id) },
      data: { status: 'SELESAI' }
    });
    res.json({ message: 'Status rapat diperbarui menjadi SELESAI', rapat: updatedRapat });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteRapat = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.rapat.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Rapat berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllRapat,
  getRapatById,
  createRapat,
  updateRapat,
  tandaiSelesai,
  deleteRapat
};
