import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Loader2, Calendar, Users, ShieldCheck, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast.error('Username dan password wajib diisi');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/login', form);
      login(res.data.token, res.data.admin);
      toast.success(`Selamat datang, ${res.data.admin.username}!`);
      navigate('/admin/rapat', { replace: true });
    } catch (error) {
      const msg = error.response?.data?.error || 'Login gagal. Periksa username dan password.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      {/* Background Building Image */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat bg-[center_right_15%] sm:bg-[center_right_20%] lg:bg-[center_right_12%]"
        style={{ backgroundImage: 'url("/gedung-bekasi.jpg")' }}
      />

      {/* Atmospheric Blue Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#175bb8]/95 via-[#1d6bd4]/80 to-[#1e6cd6]/30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#124d9c]/40 via-transparent to-[#104b99]/50 pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full px-6 sm:px-10 lg:px-16 pt-5 pb-3 flex items-center justify-between">
        {/* Left: Government Logo & Text */}
        <div className="flex items-center gap-3 sm:gap-4">
          <img
            src="/logo-bekasi.svg"
            alt="Lambang Kabupaten Bekasi"
            className="w-10 sm:w-11 h-12 sm:h-13 object-contain drop-shadow-md"
          />
          <div>
            <h1 className="text-white font-extrabold text-sm sm:text-base tracking-wider uppercase drop-shadow-sm leading-tight">
              PEMERINTAH KABUPATEN BEKASI
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm font-normal tracking-wide drop-shadow-sm leading-tight mt-0.5">
              Sistem Manajemen Rapat Terpadu
            </p>
          </div>
        </div>

        {/* Right: Slogan & Cursive Bekasi */}
        <div className="text-right flex flex-col items-end pr-2 sm:pr-4">
          <div className="relative inline-block leading-none">
            <span className="font-script text-3xl sm:text-4xl lg:text-[42px] text-white font-bold tracking-wide select-none drop-shadow">
              Bekasi
            </span>
            <svg
              className="w-20 sm:w-24 h-2.5 text-white/90 -mt-1 ml-auto"
              viewBox="0 0 100 12"
              fill="none"
            >
              <path
                d="M2 6 Q 50 12, 98 4"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-[11px] sm:text-xs text-white/95 font-medium tracking-wide italic mt-0.5 drop-shadow-sm">
            Maju, Sejahtera, Berkelanjutan
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-16 py-6 lg:py-10">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* Left Column: Greeting & Feature Highlights */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center text-left py-2">
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-white leading-[1.2] drop-shadow-md tracking-tight">
              Selamat Datang<br />
              di Sistem Manajemen<br />
              Rapat Terpadu
            </h2>

            <p className="mt-4 text-blue-100/95 text-sm sm:text-base max-w-md leading-relaxed drop-shadow-sm">
              Kelola agenda rapat, koordinasi, dan administrasi dengan lebih mudah, cepat, dan terintegrasi.
            </p>

            {/* 3 Quick Badges */}
            <div className="mt-8 sm:mt-10 flex items-start gap-6 sm:gap-8">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center w-24">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/35 flex items-center justify-center text-white shadow-sm mb-2.5">
                  <Calendar size={22} className="stroke-[1.8]" />
                </div>
                <span className="text-xs font-semibold text-white leading-tight drop-shadow-sm">
                  Manajemen<br />Rapat
                </span>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center w-24">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/35 flex items-center justify-center text-white shadow-sm mb-2.5">
                  <Users size={22} className="stroke-[1.8]" />
                </div>
                <span className="text-xs font-semibold text-white leading-tight drop-shadow-sm">
                  Koordinasi<br />Terpadu
                </span>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center w-24">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/35 flex items-center justify-center text-white shadow-sm mb-2.5">
                  <ShieldCheck size={22} className="stroke-[1.8]" />
                </div>
                <span className="text-xs font-semibold text-white leading-tight drop-shadow-sm">
                  Pelayanan<br />Lebih Baik
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Admin Login Card */}
          <div className="lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-start">
            <div className="w-full max-w-[420px] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(8,28,70,0.35)] p-8 sm:p-9 border border-white/90 relative">
              {/* Card Header with Bekasi Logo */}
              <div className="flex justify-center mb-3">
                <img
                  src="/logo-bekasi.svg"
                  alt="Lambang Kabupaten Bekasi"
                  className="w-12 h-14 object-contain"
                />
              </div>

              <h3 className="text-2xl sm:text-[26px] font-bold text-[#1a3a6b] text-center tracking-tight">
                Admin Login
              </h3>

              <p className="text-xs text-slate-500 text-center mt-1.5 mb-7 leading-relaxed max-w-[270px] mx-auto">
                Silakan masuk dengan akun Anda untuk mengelola jadwal dan data rapat.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username Field */}
                <div>
                  <label
                    htmlFor="login-username"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Username
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                      <User size={18} />
                    </span>
                    <input
                      id="login-username"
                      type="text"
                      name="username"
                      autoComplete="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="Masukkan username"
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-800 placeholder-slate-400"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                      <Lock size={18} />
                    </span>
                    <input
                      id="login-password"
                      type={showPass ? 'text' : 'password'}
                      name="password"
                      autoComplete="current-password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Masukkan password"
                      className="w-full pl-10 pr-11 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-800 placeholder-slate-400"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors p-1"
                      tabIndex={-1}
                    >
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  id="btn-login-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:scale-[0.99] text-white font-bold text-xs sm:text-sm tracking-wider uppercase rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>MEMERIKSA KREDENSIAL...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={18} className="stroke-[2.2]" />
                      <span>MASUK SEKARANG</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>

      {/* Decorative Bottom Wave Elements */}
      <div className="relative z-0 pointer-events-none w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-24 sm:h-32 lg:h-40 block"
          preserveAspectRatio="none"
        >
          {/* Subtle light blue wave */}
          <path
            d="M-50 180 C 180 80, 420 190, 720 120 C 1020 50, 1260 140, 1500 90 L 1500 180 L -50 180 Z"
            fill="#60a5fa"
            fillOpacity="0.4"
          />
          {/* Middle blue curve */}
          <path
            d="M-50 180 C 120 40, 360 160, 680 90 C 980 20, 1240 120, 1500 60 L 1500 180 L -50 180 Z"
            fill="#3b82f6"
            fillOpacity="0.65"
          />
          {/* Bottom left sweeping wave */}
          <path
            d="M-50 60 C 100 80, 240 150, 480 180 L -50 180 Z"
            fill="#2563eb"
            fillOpacity="0.85"
          />
          {/* Bottom right sweeping wave */}
          <path
            d="M1000 180 C 1150 130, 1320 80, 1500 50 L 1500 180 Z"
            fill="#3b82f6"
            fillOpacity="0.75"
          />
        </svg>
      </div>
    </div>
  );
};

export default LoginPage;
