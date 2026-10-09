const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rapatRoutes = require('./routes/rapat.routes');
const pesertaRoutes = require('./routes/peserta.routes');
const authRoutes = require('./routes/auth.routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for base64
app.use('/uploads', express.static('uploads'));

// Root route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Backend API Sistem Manajemen Rapat Terpadu - Pemerintah Kabupaten Bekasi',
    endpoints: {
      auth: '/api/auth/login',
      rapat: '/api/rapat',
      absensi: '/api/absensi'
    }
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/rapat', rapatRoutes);
app.use('/api/absensi', pesertaRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Terjadi kesalahan pada server' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
