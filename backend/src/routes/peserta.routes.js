const express = require('express');
const { getAbsensiByToken, submitAbsensi } = require('../controllers/peserta.controller');

const router = express.Router();

router.get('/:absensiToken', getAbsensiByToken);
router.post('/:absensiToken', submitAbsensi);

module.exports = router;
