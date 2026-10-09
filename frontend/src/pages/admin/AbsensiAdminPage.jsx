import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import {
  ArrowLeft,
  Copy,
  Download,
  Printer,
  Users,
  User,
  Calendar,
  Clock,
  MapPin,
  Loader2,
  CheckCircle2,
  QrCode,
  Search,
  ExternalLink,
  FileSpreadsheet,
  Building2,
  Phone,
  Mail,
  Menu,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api, { getFileUrl } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';

const AbsensiAdminPage = () => {
  const { rapatId } = useParams();
  const navigate = useNavigate();

  const [rapat, setRapat] = useState(null);
  const [pesertaList, setPesertaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [previewSig, setPreviewSig] = useState(null);
  const qrRef = useRef(null);

  const frontendUrl = window.location.origin;

  // Initial fetch
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [rapatRes, pesertaRes] = await Promise.all([
          api.get(`/rapat/${rapatId}`),
          api.get(`/rapat/${rapatId}/peserta`),
        ]);
        setRapat(rapatRes.data);
        setPesertaList(pesertaRes.data);
      } catch (err) {
        toast.error('Gagal memuat data rapat');
        navigate('/admin/rapat');
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, [rapatId, navigate]);

  // Auto-refresh peserta every 8 seconds
  useEffect(() => {
    if (!rapat || rapat.status === 'SELESAI') return;

    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/rapat/${rapatId}/peserta`);
        setPesertaList((prev) => {
          if (prev.length !== res.data.length) {
            toast.success(`Ada kehadiran baru! Total: ${res.data.length}`, {
              icon: '📋',
            });
            return res.data;
          }
          return res.data;
        });
      } catch (err) {
        // silent catch on background polling
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [rapatId, rapat]);

  const absensiUrl = rapat ? `${frontendUrl}/absensi/${rapat.absensiToken}` : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(absensiUrl);
    setCopied(true);
    toast.success('Tautan absensi berhasil disalin!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `QR_Absensi_${rapat.namaRapat.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (pesertaList.length === 0) {
      toast.error('Belum ada data peserta untuk diunduh');
      return;
    }
    const headers = ['No,Nama,Jabatan,Instansi,Email,No HP,Waktu Hadir'];
    const rows = pesertaList.map((p, i) =>
      [
        i + 1,
        `"${p.nama}"`,
        `"${p.jabatan || '-'}"`,
        `"${p.instansi || '-'}"`,
        `"${p.email}"`,
        `"${p.noHp || '-'}"`,
        `"${new Date(p.created_at).toLocaleString('id-ID')}"`,
      ].join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Daftar_Hadir_${rapat.namaRapat.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Daftar hadir berhasil di-export ke CSV');
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const filteredPeserta = pesertaList.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.nama.toLowerCase().includes(q) ||
      (p.instansi && p.instansi.toLowerCase().includes(q)) ||
      (p.jabatan && p.jabatan.toLowerCase().includes(q)) ||
      p.email.toLowerCase().includes(q)
    );
  });

  if (loading || !rapat) {
    return (
      <div className="min-h-screen bg-[#f0f4f9] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={44} className="animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-500 font-medium text-sm">Memuat data presensi rapat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f9] flex font-sans antialiased text-slate-800">
      {/* Sidebar Navigation */}
      <div className="print:hidden">
        <AdminSidebar
          isMobileOpen={isMobileSidebarOpen}
          setIsMobileOpen={setIsMobileSidebarOpen}
        />
      </div>

      {/* Main Container */}
      <div className="flex-1 lg:ml-72 min-h-screen flex flex-col print:ml-0 print:bg-white">
        {/* Printable Official Government Header (Only visible on Print) */}
        <div className="hidden print:block mb-6 text-center border-b-2 border-black pb-4 pt-2">
          <div className="flex items-center justify-center gap-4">
            <img src="/logo-bekasi.svg" alt="Logo Bekasi" className="w-16 h-16 object-contain" />
            <div>
              <h2 className="text-lg font-black uppercase tracking-wider text-black">
                Pemerintah Kabupaten Bekasi
              </h2>
              <h3 className="text-sm font-bold uppercase tracking-wide text-black">
                Sistem Manajemen Rapat Terpadu
              </h3>
              <p className="text-xs text-gray-700 mt-0.5">
                Komplek Perkantoran Pemerintah Kabupaten Bekasi, Desa Sukamahi, Cikarang Pusat
              </p>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-gray-400">
            <h4 className="text-base font-extrabold uppercase text-black">
              Daftar Hadir Peserta Rapat
            </h4>
            <p className="text-sm font-semibold text-black mt-0.5">
              {rapat.namaRapat}
            </p>
            <p className="text-xs text-gray-700">
              Hari/Tanggal: {formatDate(rapat.hariTanggal)} • Pukul {rapat.waktu} WIB • Tempat: {rapat.tempat}
            </p>
          </div>
        </div>

        {/* Normal Web Header */}
        <div className="print:hidden p-5 sm:p-8 max-w-[1400px] w-full mx-auto flex-1 flex flex-col">
          {/* Breadcrumb & Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-white text-blue-900 shadow-sm"
              >
                <Menu size={20} />
              </button>
              <button
                onClick={() => navigate('/admin/rapat')}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-sm border border-slate-200/80 transition-all cursor-pointer group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                <span>Kembali ke Dashboard</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <FileSpreadsheet size={15} />
                <span>Export CSV</span>
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <Printer size={15} />
                <span>Cetak / PDF</span>
              </button>
            </div>
          </div>

          {/* Meeting Banner */}
          <div className="bg-gradient-to-r from-[#1753db] via-[#1a5ce8] to-[#2563eb] text-white rounded-3xl p-6 sm:p-7 shadow-lg shadow-blue-950/10 mb-6 relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md uppercase tracking-wider text-white mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {rapat.status === 'SELESAI' ? 'Rapat Telah Selesai' : 'Monitoring Presensi Real-Time'}
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">{rapat.namaRapat}</h1>
              
              <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap gap-4 sm:gap-6 text-xs text-white/90">
                <div className="flex items-center gap-2">
                  <Calendar size={15} className="text-blue-200" />
                  <span>{formatDate(rapat.hariTanggal)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={15} className="text-blue-200" />
                  <span>{rapat.waktu} WIB</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-blue-200" />
                  <span>{rapat.tempat}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Layout: Left QR Code & Right Attendance Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
            {/* Left Card: QR Code & Presensi Tools */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-xl shadow-blue-950/5 border border-white flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-3">
                  <QrCode size={26} />
                </div>
                <h3 className="font-extrabold text-base text-gray-900">QR Code Presensi</h3>
                <p className="text-xs text-gray-400 mt-0.5 mb-5">
                  Scan menggunakan kamera ponsel untuk mengisi absensi
                </p>

                {/* QR Canvas */}
                <div
                  ref={qrRef}
                  className="p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-md inline-block mb-4"
                >
                  <QRCodeCanvas
                    value={absensiUrl}
                    size={210}
                    level="H"
                    includeMargin={false}
                    fgColor="#1753db"
                  />
                </div>

                {/* Direct Action Buttons */}
                <div className="grid grid-cols-3 gap-2 w-full mt-2">
                  <button
                    onClick={handleCopyLink}
                    className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors cursor-pointer text-xs font-semibold"
                  >
                    {copied ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Copy size={18} />}
                    <span>{copied ? 'Tersalin' : 'Salin Link'}</span>
                  </button>
                  <button
                    onClick={handleDownloadQR}
                    className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors cursor-pointer text-xs font-semibold"
                  >
                    <Download size={18} />
                    <span>Unduh QR</span>
                  </button>
                  <a
                    href={absensiUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors cursor-pointer text-xs font-semibold"
                  >
                    <ExternalLink size={18} />
                    <span>Buka Form</span>
                  </a>
                </div>
              </div>

              {/* Attendance Quick Stats */}
              <div className="bg-white rounded-3xl p-6 shadow-xl shadow-blue-950/5 border border-white">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Total Kehadiran
                  </span>
                  <span className="text-2xl font-black text-blue-600">
                    {pesertaList.length} <span className="text-xs font-medium text-gray-400">Orang</span>
                  </span>
                </div>
                <div className="mt-3 text-xs text-gray-500 flex items-center justify-between">
                  <span>Status Form:</span>
                  <span className={`font-semibold ${rapat.status === 'SELESAI' ? 'text-gray-500' : 'text-emerald-600'}`}>
                    {rapat.status === 'SELESAI' ? 'Ditutup' : 'Aktif (Auto Refresh)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Card: Participants Table */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-blue-950/5 border border-white flex flex-col">
              {/* Header inside Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">Daftar Kehadiran Peserta</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {pesertaList.length} orang telah mengisi presensi kehadiran
                    </p>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search size={16} className="absolute left-3.5 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama, OPD..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto mt-4 flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-500 font-bold text-xs uppercase tracking-wider">
                      <th className="py-3 px-3 text-center w-12">NO</th>
                      <th className="py-3 px-4">PESERTA</th>
                      <th className="py-3 px-4">INSTANSI / OPD</th>
                      <th className="py-3 px-4">KONTAK</th>
                      <th className="py-3 px-4 text-center">WAKTU</th>
                      <th className="py-3 px-4 text-center">TTD DIGITAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
                    {filteredPeserta.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-12 text-gray-400">
                          <Users size={36} className="mx-auto mb-2 text-gray-300" />
                          <p className="font-medium">
                            {searchQuery ? 'Tidak ada peserta yang cocok dengan pencarian' : 'Belum ada peserta yang mengisi kehadiran'}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredPeserta.map((peserta, idx) => (
                        <tr key={peserta.id} className="hover:bg-blue-50/40 transition-colors">
                          <td className="py-3.5 px-3 text-center font-bold text-gray-500">
                            {idx + 1}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-gray-900">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-xs uppercase">
                                {peserta.nama?.[0]}
                              </div>
                              <div>
                                <p className="font-bold text-gray-800">{peserta.nama}</p>
                                {peserta.jabatan && (
                                  <p className="text-[11px] text-gray-500 font-normal">{peserta.jabatan}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-gray-600">
                            <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg text-[11px] font-medium text-slate-700">
                              <Building2 size={12} className="text-slate-500" />
                              {peserta.instansi || '-'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-gray-600 space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <Mail size={12} className="text-blue-500" />
                              <span>{peserta.email}</span>
                            </div>
                            {peserta.noHp && (
                              <div className="flex items-center gap-1.5 text-gray-400">
                                <Phone size={12} />
                                <span>{peserta.noHp}</span>
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center text-gray-500 font-mono text-[11px]">
                            {formatTime(peserta.created_at)} WIB
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {peserta.ttdDigitalUrl ? (
                              <button
                                onClick={() => setPreviewSig(getFileUrl(peserta.ttdDigitalUrl))}
                                className="inline-block p-1 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors shadow-xs cursor-pointer"
                                title="Klik untuk memperbesar tanda tangan"
                              >
                                <img
                                  src={getFileUrl(peserta.ttdDigitalUrl)}
                                  alt="TTD"
                                  className="h-7 w-16 object-contain"
                                />
                              </button>
                            ) : (
                              <span className="text-gray-300">-</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Printable Simple Table (Visible when printing only) */}
        <div className="hidden print:block px-8">
          <table className="w-full text-left border-collapse border border-black text-xs">
            <thead>
              <tr className="bg-gray-100 border-b border-black text-black">
                <th className="border border-black p-2 text-center w-10">NO</th>
                <th className="border border-black p-2">NAMA LENGKAP</th>
                <th className="border border-black p-2">JABATAN</th>
                <th className="border border-black p-2">INSTANSI / OPD</th>
                <th className="border border-black p-2">EMAIL &amp; NO HP</th>
                <th className="border border-black p-2 text-center w-28">TANDA TANGAN</th>
              </tr>
            </thead>
            <tbody>
              {pesertaList.map((p, i) => (
                <tr key={p.id} className="border-b border-black">
                  <td className="border border-black p-2 text-center">{i + 1}</td>
                  <td className="border border-black p-2 font-bold">{p.nama}</td>
                  <td className="border border-black p-2">{p.jabatan || '-'}</td>
                  <td className="border border-black p-2">{p.instansi || '-'}</td>
                  <td className="border border-black p-2">{p.email} {p.noHp ? `(${p.noHp})` : ''}</td>
                  <td className="border border-black p-1 text-center">
                    {p.ttdDigitalUrl && (
                      <img src={getFileUrl(p.ttdDigitalUrl)} alt="TTD" className="h-8 max-w-full mx-auto object-contain" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="mt-8 flex justify-between text-xs text-black">
            <div>
              <p>Mengetahui,</p>
              <p className="font-bold mt-16">( ...................................................... )</p>
            </div>
            <div className="text-right">
              <p>Cikarang Pusat, {formatDate(new Date())}</p>
              <p>Petugas Notulis / Admin,</p>
              <p className="font-bold mt-16">( ...................................................... )</p>
            </div>
          </div>
        </div>

        {/* Modal Preview TTD */}
        {previewSig && (
          <div
            onClick={() => setPreviewSig(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in duration-200"
            >
              <h3 className="font-bold text-gray-800 text-sm mb-3">Tanda Tangan Digital Peserta</h3>
              <div className="bg-slate-50 border border-gray-200 rounded-2xl p-6 mb-4">
                <img src={previewSig} alt="TTD Besar" className="max-h-56 mx-auto object-contain" />
              </div>
              <button
                onClick={() => setPreviewSig(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AbsensiAdminPage;
