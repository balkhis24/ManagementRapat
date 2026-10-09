import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import {
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  Briefcase,
  Building2,
  Phone,
  PenTool,
  RotateCcw,
  Send,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AbsensiFormPage = () => {
  const { absensiToken } = useParams();
  const sigCanvas = useRef(null);

  const [rapat, setRapat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    nama: '',
    jabatan: '',
    instansi: '',
    noHp: '',
    email: '',
  });

  useEffect(() => {
    const fetchRapat = async () => {
      try {
        const res = await api.get(`/absensi/${absensiToken}`);
        setRapat(res.data);
      } catch (err) {
        setErrorMsg(err.response?.data?.error || 'Rapat tidak ditemukan atau token tidak valid.');
      } finally {
        setLoading(false);
      }
    };
    fetchRapat();
  }, [absensiToken]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.email) {
      toast.error('Nama dan Email wajib diisi');
      return;
    }
    if (sigCanvas.current.isEmpty()) {
      toast.error('Tanda tangan wajib diisi pada kotak yang disediakan');
      return;
    }

    try {
      setSubmitting(true);
      const ttdDigital = sigCanvas.current.getCanvas().toDataURL('image/png');

      await api.post(`/absensi/${absensiToken}`, {
        ...formData,
        ttdDigital,
      });

      setIsSubmitted(true);
      toast.success('Kehadiran berhasil dicatat!');
    } catch (err) {
      console.error('Submit error:', err);
      toast.error(err.response?.data?.error || err.message || 'Gagal menyimpan data absensi');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f4f9] flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600 font-medium text-sm">Memuat formulir absensi rapat...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-[#f0f4f9] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Formulir Tidak Tersedia</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">{errorMsg}</p>
          <div className="bg-gray-50 text-xs text-gray-500 p-3 rounded-xl">
            Silakan hubungi administrator atau panitia rapat terkait untuk informasi lebih lanjut.
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#f0f4f9] flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl max-w-md w-full text-center border border-white relative overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-blue-600 via-emerald-500 to-teal-500" />
          
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm border border-emerald-100">
            <CheckCircle2 size={42} />
          </div>
          
          <h2 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">Presensi Berhasil!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Kehadiran Anda telah tersimpan secara digital di sistem Pemerintah Kabupaten Bekasi.
          </p>

          <div className="bg-blue-50/80 rounded-2xl p-4 text-left text-xs text-blue-900 space-y-2 mb-6 border border-blue-100">
            <div>
              <span className="text-blue-500 block font-medium">Nama Peserta:</span>
              <strong className="text-sm">{formData.nama}</strong>
            </div>
            <div>
              <span className="text-blue-500 block font-medium">Agenda Rapat:</span>
              <strong>{rapat.namaRapat}</strong>
            </div>
            <div>
              <span className="text-blue-500 block font-medium">Waktu & Tempat:</span>
              <span>{formatDate(rapat.hariTanggal)} • {rapat.waktu} WIB</span>
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Notulen rapat akan dikirimkan ke email <strong>{formData.email}</strong> setelah rapat selesai. Anda dapat menutup jendela ini sekarang.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f9] flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white pb-10">
      {/* Top Background Gradient Header */}
      <div className="relative bg-gradient-to-r from-[#1753db] via-[#1a5ce8] to-[#2563eb] text-white pt-8 pb-20 px-4 sm:px-6 shadow-md">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo-bekasi.svg"
              alt="Logo Bekasi"
              className="w-10 h-10 object-contain drop-shadow"
            />
            <div className="leading-tight">
              <h3 className="text-xs font-black uppercase tracking-wider">
                Pemerintah Kabupaten Bekasi
              </h3>
              <p className="text-[11px] text-blue-100 font-normal">
                Sistem Manajemen Rapat Terpadu
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs bg-white/15 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20">
            <ShieldCheck size={14} />
            <span>Presensi Resmi</span>
          </div>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="max-w-xl w-full mx-auto px-4 -mt-12 relative z-10 flex-1">
        {/* Rapat Summary Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-blue-950/5 border border-white/80 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Konfirmasi Kehadiran Rapat
          </div>
          
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight leading-snug">
            {rapat.namaRapat}
          </h1>

          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-blue-600 shrink-0" />
              <span>{formatDate(rapat.hariTanggal)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-blue-600 shrink-0" />
              <span>{rapat.waktu} WIB</span>
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <MapPin size={15} className="text-blue-600 shrink-0" />
              <span>{rapat.tempat}</span>
            </div>
          </div>
        </div>

        {/* Input Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-950/5 border border-white/80">
          <h2 className="text-base font-bold text-gray-800 pb-3 border-b border-gray-100 flex items-center gap-2">
            <User size={18} className="text-blue-600" />
            Biodata Peserta Hadir
          </h2>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Nama Lengkap & Gelar <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User size={17} className="absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="text"
                  name="nama"
                  required
                  value={formData.nama}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm text-gray-900"
                  placeholder="Contoh: Dr. Ir. Ahmad Sudrajat, M.Si"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Email Aktif <span className="text-red-500">*</span>
                <span className="text-[10px] text-gray-400 font-normal lowercase ml-1">(untuk pengiriman notulen)</span>
              </label>
              <div className="relative">
                <Mail size={17} className="absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm text-gray-900"
                  placeholder="nama.peserta@bekasikab.go.id"
                />
              </div>
            </div>

            {/* Jabatan & Instansi Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Jabatan
                </label>
                <div className="relative">
                  <Briefcase size={17} className="absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="jabatan"
                    value={formData.jabatan}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm text-gray-900"
                    placeholder="Kepala Bidang / Staf"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Instansi / OPD
                </label>
                <div className="relative">
                  <Building2 size={17} className="absolute left-3.5 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="instansi"
                    value={formData.instansi}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm text-gray-900"
                    placeholder="Diskominfo / Bappeda"
                  />
                </div>
              </div>
            </div>

            {/* No HP / WhatsApp */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Nomor WhatsApp / HP
              </label>
              <div className="relative">
                <Phone size={17} className="absolute left-3.5 top-3 text-gray-400" />
                <input
                  type="tel"
                  name="noHp"
                  value={formData.noHp}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm text-gray-900"
                  placeholder="0812-3456-7890"
                />
              </div>
            </div>

            {/* Tanda Tangan Digital */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                  <PenTool size={14} className="text-blue-600" />
                  Tanda Tangan Digital <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleClearSignature}
                  className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw size={12} />
                  Ulangi TTD
                </button>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-slate-50 overflow-hidden touch-none hover:border-blue-400 transition-colors">
                <SignatureCanvas
                  ref={sigCanvas}
                  penColor="#0f172a"
                  canvasProps={{
                    className: 'w-full h-40 cursor-crosshair bg-white',
                  }}
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Goreskan tanda tangan Anda pada area kotak putih di atas menggunakan jari atau stylus.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#1a56db] hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-sm"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Menyimpan Presensi...</span>
                  </>
                ) : (
                  <>
                    <Send size={17} />
                    <span>Kirim Presensi Kehadiran</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-xl mx-auto px-4 mt-6 text-center text-xs text-gray-400">
        <p>© {new Date().getFullYear()} Pemerintah Kabupaten Bekasi. All rights reserved.</p>
        <p className="mt-0.5 font-script text-base text-blue-600">Bekasi Maju, Sejahtera, Berkelanjutan</p>
      </footer>
    </div>
  );
};

export default AbsensiFormPage;
