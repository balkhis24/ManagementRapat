import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import RapatDashboard from './pages/admin/RapatDashboard';
import LoginPage from './pages/admin/LoginPage';
import NotulenPage from './pages/admin/NotulenPage';
import AbsensiAdminPage from './pages/admin/AbsensiAdminPage';
import AbsensiFormPage from './pages/public/AbsensiFormPage';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Redirect root ke dashboard */}
          <Route path="/" element={<Navigate to="/admin/rapat" replace />} />

          {/* Halaman Login */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Halaman Publik Peserta (Absensi) */}
          <Route path="/absensi/:absensiToken" element={<AbsensiFormPage />} />

          {/* Route yang memerlukan autentikasi admin */}
          <Route
            path="/admin/rapat"
            element={
              <PrivateRoute>
                <RapatDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/rapat/:rapatId/notulen"
            element={
              <PrivateRoute>
                <NotulenPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/rapat/:rapatId/absensi"
            element={
              <PrivateRoute>
                <AbsensiAdminPage />
              </PrivateRoute>
            }
          />
          
          {/* Fallback route untuk halaman yang tidak ditemukan */}
          <Route path="*" element={<Navigate to="/admin/rapat" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
