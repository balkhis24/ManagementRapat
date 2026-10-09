const express = require('express');
const { login, changePassword } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/login', login);
router.put('/change-password', authMiddleware, changePassword);

module.exports = router;
