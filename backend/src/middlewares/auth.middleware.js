const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Akses ditolak: Token tidak ditemukan' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_sementara');
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Akses ditolak: Token tidak valid atau kedaluwarsa' });
  }
};

const requireRole = (allowedRoles = ['ADMIN']) => {
  return (req, res, next) => {
    if (!req.admin || !allowedRoles.includes(req.admin.role)) {
      return res.status(403).json({
        error: `Akses ditolak: Aksi ini hanya dapat dilakukan oleh peran [${allowedRoles.join(', ')}]`
      });
    }
    next();
  };
};

authMiddleware.requireRole = requireRole;

module.exports = authMiddleware;
