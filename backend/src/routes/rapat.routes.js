const express = require('express');
const { 
  getAllRapat, 
  getRapatById, 
  createRapat, 
  updateRapat, 
  tandaiSelesai, 
  deleteRapat 
} = require('../controllers/rapat.controller');

const { getPesertaByRapat } = require('../controllers/peserta.controller');
const { 
  getNotulenByRapat, 
  upsertNotulen, 
  deleteNotulen,
  kirimEmailNotulen, 
  kirimUlangEmailPeserta 
} = require('../controllers/notulen.controller');

const {
  getDokumentasiByRapat,
  createDokumentasi,
  deleteDokumentasi
} = require('../controllers/dokumentasi.controller');

const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Terapkan middleware auth ke semua rute di file ini
router.use(authMiddleware);

router.get('/', getAllRapat);
router.get('/:id', getRapatById);
router.post('/', authMiddleware.requireRole(['ADMIN']), createRapat);
router.put('/:id', authMiddleware.requireRole(['ADMIN']), updateRapat);
router.patch('/:id/selesai', authMiddleware.requireRole(['ADMIN']), tandaiSelesai);
router.delete('/:id', authMiddleware.requireRole(['ADMIN']), deleteRapat);

// Endpoint Peserta per Rapat
router.get('/:id/peserta', getPesertaByRapat);

// Endpoint Notulen per Rapat
router.get('/:rapatId/notulen', getNotulenByRapat);
router.post('/:rapatId/notulen', upsertNotulen);
router.put('/:rapatId/notulen', upsertNotulen);
router.delete('/:rapatId/notulen', deleteNotulen);

// Endpoint Dokumentasi per Rapat
router.get('/:rapatId/dokumentasi', getDokumentasiByRapat);
router.post('/:rapatId/dokumentasi', createDokumentasi);
router.delete('/:rapatId/dokumentasi/:docId', deleteDokumentasi);

// Endpoint Kirim Email Notulen
router.post('/:rapatId/notulen/kirim', kirimEmailNotulen);
router.post('/:rapatId/notulen/kirim-ulang/:pesertaId', kirimUlangEmailPeserta);

module.exports = router;
