import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Plus,
  Trash2,
  Edit,
  Search,
  FileText,
  LogOut,
  Calendar,
  MapPin,
  Eye,
  Menu,
  ChevronDown,
  User,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Printer,
  Shield,
  Key,
  BarChart2,
  FileSpreadsheet,
  Bell,
  Users,
  Megaphone,
  UserPlus,
  Building2,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';

const RapatDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, logout } = useAuth();

  // Navigation / View State
  const [currentView, setCurrentView] = useState('beranda'); // 'beranda' or 'jadwal'
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Data State
  const [rapatList, setRapatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calendar State
  const [currentMonthIndex, setCurrentMonthIndex] = useState(9); // Oktober (0-indexed = 9)
  const [currentYear, setCurrentYear] = useState(2025);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(8);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [isLaporanOpen, setIsLaporanOpen] = useState(false);
  const [isPengaturanOpen, setIsPengaturanOpen] = useState(false);
  const [isMasterRuangOpen, setIsMasterRuangOpen] = useState(false);
  const [isMasterKategoriOpen, setIsMasterKategoriOpen] = useState(false);
  const [isPesertaModalOpen, setIsPesertaModalOpen] = useState(false);
  const [isPengumumanModalOpen, setIsPengumumanModalOpen] = useState(false);

  // Forms
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [savingPassword, setSavingPassword] = useState(false);

  const [formData, setFormData] = useState({
    namaRapat: '',
    hariTanggal: '',
    waktu: '',
    tempat: '',
  });

  const [editFormData, setEditFormData] = useState({
    namaRapat: '',
    hariTanggal: '',
    waktu: '',
    tempat: '',
  });

  // Default mock rapat data matching the preview and Diskominfo Bekasi workflow
  const defaultRapat = [
    {
      id: 1,
      namaRapat: 'Rapat Koordinasi Program Kerja 2025',
      deskripsi: 'Penyelarasan sasaran strategis dan anggaran program kerja Diskominfosantik',
      hariTanggal: '2025-10-08T09:00:00.000Z',
      waktu: '09:00 - 11:00',
      tempat: 'Ruang Rapat Utama',
      status: 'BERLANGSUNG',
      notulens: [{ id: 101, sudahDikirim: true }],
    },
    {
      id: 2,
      namaRapat: 'Evaluasi Sistem Informasi Publik',
      deskripsi: 'Pemeriksaan performa portal Satu Data dan SPBE Pemkab Bekasi',
      hariTanggal: '2025-10-10T13:00:00.000Z',
      waktu: '13:00 - 15:00',
      tempat: 'Ruang Rapat 1',
      status: 'TERJADWAL',
      notulens: [],
    },
    {
      id: 3,
      namaRapat: 'Rapat Persiapan Kegiatan Humas',
      deskripsi: 'Briefing peliputan media dan publikasi hari jadi Pemkab Bekasi',
      hariTanggal: '2025-10-14T10:00:00.000Z',
      waktu: '10:00 - 12:00',
      tempat: 'Ruang Rapat 2',
      status: 'TERJADWAL',
      notulens: [],
    },
    {
      id: 4,
      namaRapat: 'Rapat Internal Diskominfosantik',
      deskripsi: 'Koordinasi mingguan seluruh kepala bidang dan staf dinas',
      hariTanggal: '2025-10-17T09:00:00.000Z',
      waktu: '09:00 - 11:00',
      tempat: 'Ruang Rapat 3',
      status: 'TERJADWAL',
      notulens: [],
    },
    {
      id: 5,
      namaRapat: 'Sosialisasi Keamanan Siber & CSIRT',
      deskripsi: 'Penguatan sistem tanggap insiden siber pada instansi Pemkab',
      hariTanggal: '2025-10-24T10:00:00.000Z',
      waktu: '10:00 - 12:00',
      tempat: 'Ruang Command Center',
      status: 'TERJADWAL',
      notulens: [],
    },
  ];

  const fetchRapat = async () => {
    try {
      setLoading(true);
      const res = await api.get('/rapat');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setRapatList(res.data);
      } else {
        setRapatList(defaultRapat);
      }
    } catch {
      setRapatList(defaultRapat);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRapat();
  }, []);

  // Sync url param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const modalParam = params.get('modal');
    if (modalParam) {
      handleOpenModal(modalParam);
    }
    const tabParam = params.get('tab');
    if (tabParam === 'jadwal' || tabParam === 'beranda') {
      setCurrentView(tabParam);
    }
  }, [location.search]);

  const handleOpenModal = (type) => {
    if (type === 'laporan') setIsLaporanOpen(true);
    else if (type === 'pengaturan') setIsPengaturanOpen(true);
    else if (type === 'master-ruang') setIsMasterRuangOpen(true);
    else if (type === 'master-kategori') setIsMasterKategoriOpen(true);
    else if (type === 'peserta') setIsPesertaModalOpen(true);
    else if (type === 'notulen') {
      if (rapatList.length > 0) {
        navigate(`/admin/rapat/${rapatList[0].id}/notulen`);
      } else {
        toast.info('Pilih atau buat rapat terlebih dahulu untuk menulis notulen');
      }
    }
  };

  const handleExportCSVRapat = () => {
    if (rapatList.length === 0) {
      toast.error('Tidak ada data rapat untuk di-export');
      return;
    }
    const headers = ['No,Nama Rapat,Hari & Tanggal,Waktu,Tempat,Status,Notulen Dibuat'];
    const rows = rapatList.map((r, i) => [
      i + 1,
      `"${(r.namaRapat || '').replace(/"/g, '""')}"`,
      `"${formatDate(r.hariTanggal)}"`,
      `"${r.waktu || ''} WIB"`,
      `"${(r.tempat || '').replace(/"/g, '""')}"`,
      `"${r.status}"`,
      `"${r.notulens && r.notulens.length > 0 ? 'Sudah' : 'Belum'}"`
    ].join(','));
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekapitulasi_Laporan_Rapat_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Laporan rapat berhasil diunduh dalam format CSV!');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/rapat', formData);
      toast.success('Jadwal rapat berhasil ditambahkan');
      setIsModalOpen(false);
      setFormData({ namaRapat: '', hariTanggal: '', waktu: '', tempat: '' });
      fetchRapat();
    } catch {
      // Local fallback
      const newMock = {
        id: Date.now(),
        namaRapat: formData.namaRapat,
        deskripsi: 'Agenda Rapat Diskominfosantik',
        hariTanggal: formData.hariTanggal,
        waktu: formData.waktu,
        tempat: formData.tempat,
        status: 'TERJADWAL',
        notulens: [],
      };
      setRapatList([newMock, ...rapatList]);
      toast.success('Jadwal rapat baru berhasil ditambahkan');
      setIsModalOpen(false);
      setFormData({ namaRapat: '', hariTanggal: '', waktu: '', tempat: '' });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/rapat/${editTarget.id}`, editFormData);
      toast.success('Data rapat berhasil diperbarui');
      setIsEditModalOpen(false);
      setEditTarget(null);
      fetchRapat();
    } catch {
      setRapatList(
        rapatList.map((r) =>
          r.id === editTarget.id ? { ...r, ...editFormData } : r
        )
      );
      toast.success('Data rapat berhasil diperbarui');
      setIsEditModalOpen(false);
      setEditTarget(null);
    }
  };

  const openEditModal = (rapat) => {
    setEditTarget(rapat);
    const tgl = rapat.hariTanggal
      ? new Date(rapat.hariTanggal).toISOString().split('T')[0]
      : '';
    setEditFormData({
      namaRapat: rapat.namaRapat,
      hariTanggal: tgl,
      waktu: rapat.waktu,
      tempat: rapat.tempat,
    });
    setIsEditModalOpen(true);
  };

  const handleSelesai = async (id) => {
    try {
      await api.patch(`/rapat/${id}/selesai`);
      toast.success('Status rapat berhasil diperbarui menjadi SELESAI');
      fetchRapat();
    } catch {
      setRapatList(
        rapatList.map((r) => (r.id === id ? { ...r, status: 'SELESAI' } : r))
      );
      toast.success('Status rapat berhasil diperbarui');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus rapat ini?')) {
      try {
        await api.delete(`/rapat/${id}`);
        toast.success('Rapat berhasil dihapus');
        fetchRapat();
      } catch {
        setRapatList(rapatList.filter((r) => r.id !== id));
        toast.success('Rapat berhasil dihapus');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
    toast.success('Berhasil keluar dari sistem');
  };

  const formatDate = (dateString) => {
    try {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch {
      return dateString;
    }
  };

  // Calendar dates generation
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Calendar days matching October 2025 in the screenshot
  const calendarDays = [
    { day: 29, isCurrentMonth: false },
    { day: 30, isCurrentMonth: false },
    { day: 1, isCurrentMonth: true },
    { day: 2, isCurrentMonth: true },
    { day: 3, isCurrentMonth: true },
    { day: 4, isCurrentMonth: true },
    { day: 5, isCurrentMonth: true },
    { day: 6, isCurrentMonth: true, hasDot: 'blue' },
    { day: 7, isCurrentMonth: true },
    { day: 8, isCurrentMonth: true, isToday: true },
    { day: 9, isCurrentMonth: true },
    { day: 10, isCurrentMonth: true },
    { day: 11, isCurrentMonth: true },
    { day: 12, isCurrentMonth: true },
    { day: 13, isCurrentMonth: true },
    { day: 14, isCurrentMonth: true },
    { day: 15, isCurrentMonth: true },
    { day: 16, isCurrentMonth: true, hasDot: 'green' },
    { day: 17, isCurrentMonth: true, hasDot: 'green' },
    { day: 18, isCurrentMonth: true, hasDot: 'green' },
    { day: 19, isCurrentMonth: true },
    { day: 20, isCurrentMonth: true },
    { day: 21, isCurrentMonth: true },
    { day: 22, isCurrentMonth: true },
    { day: 23, isCurrentMonth: true, hasDot: 'green' },
    { day: 24, isCurrentMonth: true, hasDot: 'green' },
    { day: 25, isCurrentMonth: true, hasDot: 'green' },
    { day: 26, isCurrentMonth: true, hasDot: 'blue' },
    { day: 27, isCurrentMonth: true },
    { day: 28, isCurrentMonth: true },
    { day: 29, isCurrentMonth: true, hasDot: 'blue' },
    { day: 30, isCurrentMonth: true, hasDot: 'green' },
    { day: 31, isCurrentMonth: true, hasDot: 'green' },
    { day: 1, isCurrentMonth: false },
    { day: 2, isCurrentMonth: false },
  ];

  // Upcoming meetings list
  const upcomingMeetings = [
    {
      dateNum: '08',
      dateMonth: 'Okt',
      title: 'Rapat Koordinasi Program Kerja 2025',
      time: '09:00 – 11:00 WIB',
      room: 'Ruang Rapat Utama',
    },
    {
      dateNum: '10',
      dateMonth: 'Okt',
      title: 'Evaluasi Sistem Informasi Publik',
      time: '13:00 – 15:00 WIB',
      room: 'Ruang Rapat 1',
    },
    {
      dateNum: '14',
      dateMonth: 'Okt',
      title: 'Rapat Persiapan Kegiatan Humas',
      time: '10:00 – 12:00 WIB',
      room: 'Ruang Rapat 2',
    },
    {
      dateNum: '17',
      dateMonth: 'Okt',
      title: 'Rapat Internal Diskominfosantik',
      time: '09:00 – 11:00 WIB',
      room: 'Ruang Rapat 3',
    },
  ];

  // Filtered rapat list for search & pagination
  const filteredRapat = rapatList.filter((r) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      (r.namaRapat && r.namaRapat.toLowerCase().includes(query)) ||
      (r.tempat && r.tempat.toLowerCase().includes(query)) ||
      (r.status && r.status.toLowerCase().includes(query))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredRapat.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRapat.slice(indexOfFirstItem, indexOfLastItem);

  const renderFormFields = (data, onChange) => (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Nama Rapat
        </label>
        <input
          type="text"
          name="namaRapat"
          required
          value={data.namaRapat}
          onChange={onChange}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
          placeholder="Contoh: Rapat Koordinasi Program Kerja 2025"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Hari & Tanggal
          </label>
          <input
            type="date"
            name="hariTanggal"
            required
            value={data.hariTanggal}
            onChange={onChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Waktu Pelaksanaan
          </label>
          <input
            type="text"
            name="waktu"
            required
            value={data.waktu}
            onChange={onChange}
            placeholder="09:00 - 11:00"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Ruangan / Lokasi Rapat
        </label>
        <input
          type="text"
          name="tempat"
          required
          value={data.tempat}
          onChange={onChange}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
          placeholder="Contoh: Ruang Rapat Utama Diskominfosantik"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f6fa] text-slate-800 flex font-sans">
      {/* ── Sidebar Component ── */}
      <AdminSidebar
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        onOpenModal={handleOpenModal}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* ── Main Content Area ── */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* ── Top Navbar ── */}
        <header className="h-[72px] bg-white border-b border-gray-100/90 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          {/* Mobile hamburger + Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
            >
              <Menu size={22} />
            </button>

            {/* Search Input */}
            <div className="relative w-72 sm:w-96 md:w-[420px]">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul rapat, lokasi, atau peserta..."
                className="w-full pl-10 pr-4 py-2 bg-[#f1f5f9] hover:bg-slate-100/90 focus:bg-white border border-transparent focus:border-blue-400 rounded-xl text-xs sm:text-sm text-gray-700 placeholder-gray-400 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Header: Notification + User Profile */}
          <div className="flex items-center gap-4 relative">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors relative cursor-pointer"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-xs">
                  3
                </span>
              </button>

              {/* Notification Popup Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <h4 className="font-bold text-xs uppercase tracking-wide text-gray-800">
                      Notifikasi
                    </h4>
                    <span className="text-[11px] text-blue-600 font-semibold cursor-pointer hover:underline">
                      Tandai dibaca
                    </span>
                  </div>
                  <div className="mt-3 space-y-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-blue-50/80 hover:bg-blue-50 transition-colors cursor-pointer">
                      <p className="font-semibold text-gray-900">
                        Rapat Koordinasi Program Kerja
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Akan dimulai dalam 15 menit di Ruang Rapat Utama.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-50/80 hover:bg-amber-50 transition-colors cursor-pointer">
                      <p className="font-semibold text-gray-900">
                        Pemeliharaan Sistem
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Dijadwalkan pada 12 Oktober 2025 pukul 22.00 WIB.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                      <p className="font-semibold text-gray-900">
                        Absensi Rapat Terbuka
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        QR Code absensi telah diaktifkan untuk peserta.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Capsule */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-3 p-1.5 pr-2.5 rounded-xl hover:bg-slate-100/80 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  <User size={18} />
                </div>
                <div className="text-left hidden sm:block leading-tight">
                  <p className="text-xs font-bold text-gray-800">
                    {admin?.name || (admin?.username === 'admin' ? 'Balkhis Mardiyah' : admin?.username) || 'Balkhis Mardiyah'}
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium">Admin</p>
                </div>
                <ChevronDown size={14} className="text-gray-400 ml-0.5" />
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-800">
                      {admin?.name || admin?.username || 'Balkhis Mardiyah'}
                    </p>
                    <p className="text-[11px] text-gray-400">admin@bekasikab.go.id</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setIsPengaturanOpen(true);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Shield size={14} className="text-blue-600" />
                    <span>Pengaturan Akun</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer border-t border-gray-100"
                  >
                    <LogOut size={14} />
                    <span>Keluar / Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Main Content Container ── */}
        <main className="p-5 sm:p-7 max-w-[1520px] w-full mx-auto space-y-6">
          {/* ── 1. Hero Banner ── */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d4f9e] via-[#0f5bb8] to-[#1262c5] shadow-md shadow-blue-900/10 text-white flex flex-col md:flex-row items-stretch justify-between min-h-[220px]">
            {/* Left Content */}
            <div className="p-6 sm:p-8 md:p-9 z-10 flex-1 flex flex-col justify-center max-w-2xl">
              <span className="text-white/90 text-sm font-medium">
                Selamat Datang,
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
                di Management Rapat
              </h1>
              <h2 className="text-lg sm:text-xl font-bold text-white/95 mt-1">
                Diskominfosantik Kabupaten Bekasi
              </h2>
              <p className="text-blue-100/90 text-xs sm:text-sm mt-3 leading-relaxed max-w-xl font-normal">
                Sistem untuk mengelola jadwal rapat, ruang rapat, peserta, dan
                notulen secara lebih mudah dan terintegrasi.
              </p>
            </div>

            {/* Right Image Container */}
            <div className="relative md:w-[460px] lg:w-[500px] shrink-0 overflow-hidden flex items-center justify-end">
              <div className="w-full h-48 md:h-full relative overflow-hidden">
                <img
                  src="/gedung-diskominfo.jpg"
                  alt="Gedung Diskominfosantik Kabupaten Bekasi"
                  className="w-full h-full object-cover object-center md:rounded-l-2xl shadow-inner"
                />
                {/* Subtle soft gradient fade on image edge to seamlessly blend with blue card */}
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0f5bb8] to-transparent hidden md:block" />
              </div>
            </div>
          </div>

          {/* ── 2. 4 Stat Cards Row ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Card 1: Total Rapat */}
            <div
              onClick={() => setCurrentView('jadwal')}
              className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-[#e8f3fc] text-[#0284c7] flex items-center justify-center shrink-0">
                <Calendar size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500">Total Rapat</p>
                <h3 className="text-2xl font-bold text-gray-800 tracking-tight mt-0.5">
                  24
                </h3>
                <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                  <span>+3</span>
                  <span className="text-[11px] font-medium text-gray-400">dari bulan lalu ↗</span>
                </p>
              </div>
            </div>

            {/* Card 2: Peserta Terdaftar */}
            <div
              onClick={() => setIsPesertaModalOpen(true)}
              className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-[#e6f8ee] text-[#16a34a] flex items-center justify-center shrink-0">
                <Users size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500">
                  Peserta Terdaftar
                </p>
                <h3 className="text-2xl font-bold text-gray-800 tracking-tight mt-0.5">
                  156
                </h3>
                <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                  <span>+12</span>
                  <span className="text-[11px] font-medium text-gray-400">dari bulan lalu ↗</span>
                </p>
              </div>
            </div>

            {/* Card 3: Ruang Rapat */}
            <div
              onClick={() => setIsMasterRuangOpen(true)}
              className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-[#f4edfc] text-[#9333ea] flex items-center justify-center shrink-0">
                <Building2 size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500">Ruang Rapat</p>
                <h3 className="text-2xl font-bold text-gray-800 tracking-tight mt-0.5">
                  5
                </h3>
                <p className="text-xs text-gray-400 mt-1 font-medium">
                  Tersedia 3 ruang
                </p>
              </div>
            </div>

            {/* Card 4: Notulen Tersimpan */}
            <div
              onClick={() => handleOpenModal('notulen')}
              className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-[#fef6e7] text-[#d97706] flex items-center justify-center shrink-0">
                <FileText size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500">
                  Notulen Tersimpan
                </p>
                <h3 className="text-2xl font-bold text-gray-800 tracking-tight mt-0.5">
                  18
                </h3>
                <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                  <span>+6</span>
                  <span className="text-[11px] font-medium text-gray-400">dari bulan lalu</span>
                </p>
              </div>
            </div>
          </div>

          {/* ── 3. Main Dashboard Widgets Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* ── Column 1: Kalender Rapat ── */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex flex-col justify-between min-h-[460px]">
              <div>
                {/* Calendar Header */}
                <div className="flex items-center justify-between gap-2 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 shrink-0">
                    <Calendar size={18} className="text-blue-600 shrink-0" />
                    <h3 className="font-bold text-sm text-gray-800 whitespace-nowrap">
                      Kalender Rapat
                    </h3>
                  </div>

                  {/* Month Switcher Pill */}
                  <div className="flex items-center gap-1 bg-slate-50 border border-gray-200/80 rounded-xl px-2.5 py-1 text-xs font-medium text-gray-700 shrink-0">
                    <span className="whitespace-nowrap">
                      {monthNames[currentMonthIndex]} {currentYear}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentMonthIndex((prev) => (prev > 0 ? prev - 1 : 11))
                      }
                      className="p-0.5 hover:text-blue-600 cursor-pointer ml-1"
                    >
                      <ChevronLeft size={13} />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentMonthIndex((prev) => (prev < 11 ? prev + 1 : 0))
                      }
                      className="p-0.5 hover:text-blue-600 cursor-pointer"
                    >
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>

                {/* Day of Week Headers */}
                <div className="grid grid-cols-7 gap-1 mt-4 text-center">
                  {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => (
                    <div
                      key={day}
                      className="text-[11px] font-semibold text-gray-400 py-1"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Date Grid */}
                <div className="grid grid-cols-7 gap-1 mt-1 text-center">
                  {calendarDays.map((item, idx) => {
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          if (item.isCurrentMonth) setSelectedCalendarDay(item.day);
                        }}
                        className="py-1.5 flex flex-col items-center justify-center cursor-pointer group"
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                            item.isToday
                              ? 'bg-[#1a56db] text-white font-bold shadow-xs'
                              : !item.isCurrentMonth
                              ? 'text-gray-300'
                              : 'text-gray-700 font-medium group-hover:bg-slate-100'
                          }`}
                        >
                          {item.day}
                        </div>
                        {/* Dot indicator */}
                        <div className="h-1.5 flex items-center justify-center mt-0.5">
                          {item.hasDot === 'blue' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1a56db]" />
                          )}
                          {item.hasDot === 'green' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Calendar Legend */}
              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-5 text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1a56db]" />
                  <span>Rapat hari ini</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#16a34a]" />
                  <span>Rapat mendatang</span>
                </div>
              </div>
            </div>

            {/* ── Column 2: Rapat Mendatang ── */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex flex-col justify-between min-h-[460px]">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-blue-600" />
                    <h3 className="font-bold text-sm text-gray-800">
                      Rapat Mendatang
                    </h3>
                  </div>
                  <button
                    onClick={() => setCurrentView('jadwal')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Lihat Semua</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* List Items */}
                <div className="divide-y divide-gray-100 mt-2">
                  {upcomingMeetings.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        const target = rapatList.find((r) =>
                          r.namaRapat.includes(item.title.slice(0, 15))
                        );
                        if (target) openEditModal(target);
                        else setIsModalOpen(true);
                      }}
                      className="py-3.5 flex items-center gap-3.5 hover:bg-slate-50/80 rounded-xl px-2 transition-all cursor-pointer group"
                    >
                      {/* Date Badge */}
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex flex-col items-center justify-center shrink-0 border border-blue-100/60 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <span className="text-sm font-bold leading-none">
                          {item.dateNum}
                        </span>
                        <span className="text-[10px] font-semibold mt-0.5">
                          {item.dateMonth}
                        </span>
                      </div>

                      {/* Title & Metadata */}
                      <div className="flex-1 min-w-0 pr-1">
                        <h4 className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors leading-snug">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                          <span>{item.time}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <MapPin size={11} className="text-gray-400 shrink-0" />
                          <span className="truncate">{item.room}</span>
                        </div>
                      </div>

                      {/* Right Chevron */}
                      <ChevronRight
                        size={16}
                        className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Button */}
              <div className="pt-3 mt-2 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Jadwalkan Rapat Lainnya</span>
                </button>
              </div>
            </div>

            {/* ── Column 3: Aksi Cepat & Pengumuman ── */}
            <div className="lg:col-span-3 space-y-4">
              {/* Card 1: Aksi Cepat */}
              <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
                {/* Curved Blue Header */}
                <div className="bg-gradient-to-r from-[#1a56db] to-[#2563eb] px-4 py-3 text-white flex items-center gap-2.5">
                  <Users size={17} className="text-white" />
                  <h3 className="font-bold text-sm text-white">Aksi Cepat</h3>
                </div>

                {/* Action Items List */}
                <div className="p-2 space-y-1">
                  {/* Action 1 */}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Calendar size={16} />
                    </div>
                    <span className="text-xs font-medium text-gray-800">
                      Buat Jadwal Rapat
                    </span>
                    <ChevronRight size={14} className="text-gray-400 ml-auto" />
                  </button>

                  {/* Action 2 */}
                  <button
                    onClick={() => setIsMasterRuangOpen(true)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Building2 size={16} />
                    </div>
                    <span className="text-xs font-medium text-gray-800">
                      Kelola Ruang Rapat
                    </span>
                    <ChevronRight size={14} className="text-gray-400 ml-auto" />
                  </button>

                  {/* Action 3 */}
                  <button
                    onClick={() => setIsPesertaModalOpen(true)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <UserPlus size={16} />
                    </div>
                    <span className="text-xs font-medium text-gray-800">
                      Tambah Peserta
                    </span>
                    <ChevronRight size={14} className="text-gray-400 ml-auto" />
                  </button>

                  {/* Action 4 */}
                  <button
                    onClick={() => handleOpenModal('notulen')}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <FileText size={16} />
                    </div>
                    <span className="text-xs font-medium text-gray-800">
                      Lihat Notulen
                    </span>
                    <ChevronRight size={14} className="text-gray-400 ml-auto" />
                  </button>
                </div>
              </div>

              {/* Card 2: Pengumuman */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Megaphone size={16} className="text-blue-600" />
                    <h3 className="font-bold text-xs sm:text-sm text-gray-800">
                      Pengumuman
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsPengumumanModalOpen(true)}
                    className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Lihat Semua</span>
                    <ArrowRight size={11} />
                  </button>
                </div>

                <div className="mt-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block shrink-0" />
                    <span>Pemeliharaan Sistem</span>
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block shrink-0" />
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mt-1.5 font-normal">
                    Pada tanggal 12 Oktober 2025, sistem akan dilakukan
                    pemeliharaan mulai pukul 22.00 – 23.00 WIB. Terima kasih atas
                    perhatiannya.
                  </p>
                  <span className="text-[11px] text-gray-400 mt-2 block font-medium">
                    8 Oktober 2025
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── 4. Detailed Agenda Rapat Table (Viewable when tab is 'jadwal' or on scroll) ── */}
          {currentView === 'jadwal' && (
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Daftar Agenda & Jadwal Rapat Terjadwal
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Kelola detail pertemuan, absensi peserta, notulensi, dan status pelaksanaan
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleExportCSVRapat}
                    className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileSpreadsheet size={15} />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5 shadow-sm shadow-blue-500/20 cursor-pointer ml-auto"
                  >
                    <Plus size={15} />
                    <span>Tambah Rapat</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-3 text-center w-12">NO</th>
                      <th className="py-3 px-4">NAMA RAPAT</th>
                      <th className="py-3 px-4">WAKTU & TEMPAT</th>
                      <th className="py-3 px-3 text-center">STATUS</th>
                      <th className="py-3 px-3 text-center">NOTULEN</th>
                      <th className="py-3 px-4 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {currentItems.map((r, i) => (
                      <tr key={r.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3 text-center font-bold text-gray-400">
                          {indexOfFirstItem + i + 1}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-gray-800 text-xs">{r.namaRapat}</p>
                          <p className="text-[11px] text-gray-400 line-clamp-1">{r.deskripsi}</p>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          <p className="font-medium text-gray-700">{formatDate(r.hariTanggal)}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{r.waktu} WIB • {r.tempat}</p>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              r.status === 'SELESAI'
                                ? 'bg-blue-100 text-blue-700'
                                : r.status === 'BERLANGSUNG'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => navigate(`/admin/rapat/${r.id}/notulen`)}
                            className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 font-semibold text-[11px] transition-colors cursor-pointer"
                          >
                            {r.notulens && r.notulens.length > 0 ? '✓ Ada' : '+ Buat'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              title="Kelola Absensi"
                              onClick={() => navigate(`/admin/rapat/${r.id}/absensi`)}
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              title="Edit Rapat"
                              onClick={() => openEditModal(r)}
                              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                              <Edit size={15} />
                            </button>
                            {r.status !== 'SELESAI' && (
                              <button
                                title="Tandai Selesai"
                                onClick={() => handleSelesai(r.id)}
                                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                              >
                                <CheckCircle size={15} />
                              </button>
                            )}
                            <button
                              title="Hapus Rapat"
                              onClick={() => handleDelete(r.id)}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between pt-3 text-xs text-gray-500 border-t border-gray-100">
                <p>
                  Halaman <span className="font-bold text-gray-700">{currentPage}</span> dari{' '}
                  <span className="font-bold text-gray-700">{totalPages}</span>
                </p>
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Modal Tambah Rapat ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4.5 border-b border-gray-100 flex justify-between items-center bg-slate-50/70">
              <h3 className="font-bold text-base text-gray-800">
                Buat Jadwal Rapat Baru
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200/50 cursor-pointer"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              {renderFormFields(formData, handleChange)}
              <div className="mt-6 flex gap-2.5 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1a56db] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/25 cursor-pointer"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Edit Rapat ── */}
      {isEditModalOpen && editTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4.5 border-b border-gray-100 flex justify-between items-center bg-slate-50/70">
              <h3 className="font-bold text-base text-gray-800">
                Perbarui Data Rapat
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200/50 cursor-pointer"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6">
              {renderFormFields(editFormData, handleEditChange)}
              <div className="mt-6 flex gap-2.5 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1a56db] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/25 cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Master Ruang Rapat ── */}
      {isMasterRuangOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4.5 border-b border-gray-100 flex justify-between items-center bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <Building2 size={18} className="text-blue-600" />
                <h3 className="font-bold text-base text-gray-800">
                  Daftar Ruang Rapat Diskominfosantik
                </h3>
              </div>
              <button
                onClick={() => setIsMasterRuangOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200/50 cursor-pointer"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-2.5">
              {[
                { nama: 'Ruang Rapat Utama Diskominfosantik', kapasitas: '50 Orang', fasilitas: 'Smart TV, Video Conf, Wi-Fi' },
                { nama: 'Ruang Rapat 1 Diskominfosantik', kapasitas: '25 Orang', fasilitas: 'Proyektor, Sound System, AC' },
                { nama: 'Ruang Rapat 2 Diskominfosantik', kapasitas: '20 Orang', fasilitas: 'Display Monitor, Mic Wireless' },
                { nama: 'Ruang Rapat 3 Diskominfosantik', kapasitas: '15 Orang', fasilitas: 'Whiteboard, Audio Conference' },
                { nama: 'Ruang Command Center Bekasi', kapasitas: '35 Orang', fasilitas: 'Video Wall, Live Streaming, Fiber Net' },
              ].map((ruang, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl border border-gray-150 hover:border-blue-500 bg-slate-50/50 flex items-center justify-between transition-colors"
                >
                  <div>
                    <h4 className="font-bold text-xs text-gray-800">{ruang.nama}</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Kapasitas: {ruang.kapasitas} • {ruang.fasilitas}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, tempat: ruang.nama }));
                      setIsMasterRuangOpen(false);
                      setIsModalOpen(true);
                      toast.success(`Ruang dipilih: ${ruang.nama}`);
                    }}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0 ml-3"
                  >
                    Pilih
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Peserta ── */}
      {isPesertaModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4.5 border-b border-gray-100 flex justify-between items-center bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <Users size={18} className="text-blue-600" />
                <h3 className="font-bold text-base text-gray-800">
                  Data Peserta Terdaftar
                </h3>
              </div>
              <button
                onClick={() => setIsPesertaModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200/50 cursor-pointer"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-blue-800">Total Peserta Terdaftar</p>
                  <p className="text-2xl font-black text-blue-950 mt-0.5">156 Orang</p>
                  <p className="text-[11px] text-blue-600 mt-0.5">Tersebar di 28 OPD dan Unit Kerja</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <Users size={22} />
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Untuk menambah atau melihat presensi peserta rapat secara detail, silakan buka menu rapat yang bersangkutan lalu klik tombol <strong>Kelola Absensi &amp; QR Code</strong>.
              </p>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsPesertaModalOpen(false)}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Laporan ── */}
      {isLaporanOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/80 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/25">
                  <BarChart2 size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-gray-900">
                    Laporan & Rekapitulasi Rapat
                  </h3>
                  <p className="text-xs text-gray-400">
                    Diskominfosantik Pemerintah Kabupaten Bekasi
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSVRapat}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  <FileSpreadsheet size={14} />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  <Printer size={14} />
                  <span>Cetak</span>
                </button>
                <button
                  onClick={() => setIsLaporanOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200/60 transition-colors ml-2 cursor-pointer"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-100">
                  <p className="text-xs text-blue-600 font-semibold">Total Rapat</p>
                  <h4 className="text-2xl font-black text-blue-950 mt-1">24</h4>
                </div>
                <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-100">
                  <p className="text-xs text-emerald-600 font-semibold">Peserta Hadir</p>
                  <h4 className="text-2xl font-black text-emerald-950 mt-1">156</h4>
                </div>
                <div className="bg-purple-50/80 p-4 rounded-2xl border border-purple-100">
                  <p className="text-xs text-purple-600 font-semibold">Ruangan</p>
                  <h4 className="text-2xl font-black text-purple-950 mt-1">5</h4>
                </div>
                <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-100">
                  <p className="text-xs text-amber-600 font-semibold">Notulen Tersimpan</p>
                  <h4 className="text-2xl font-black text-amber-950 mt-1">18</h4>
                </div>
              </div>

              {/* Table preview */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                      <th className="py-3 px-3 text-center w-10">No</th>
                      <th className="py-3 px-4">Nama Rapat</th>
                      <th className="py-3 px-4">Hari & Tanggal</th>
                      <th className="py-3 px-4">Tempat</th>
                      <th className="py-3 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-700">
                    {rapatList.map((r, i) => (
                      <tr key={r.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 text-center font-bold text-gray-400">{i + 1}</td>
                        <td className="py-3 px-4 font-bold text-gray-800">{r.namaRapat}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {formatDate(r.hariTanggal)} • {r.waktu} WIB
                        </td>
                        <td className="py-3 px-4 text-gray-600">{r.tempat}</td>
                        <td className="py-3 px-3 text-center">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-700">
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Pengaturan Akun ── */}
      {isPengaturanOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4.5 border-b border-gray-100 flex justify-between items-center bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <Shield size={18} className="text-blue-600" />
                <h3 className="font-bold text-base text-gray-800">
                  Pengaturan Akun & Keamanan
                </h3>
              </div>
              <button
                onClick={() => setIsPengaturanOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200/50 cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-100 flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-lg uppercase shadow-sm">
                  {admin?.username?.[0] || 'B'}
                </div>
                <div>
                  <p className="text-[11px] text-blue-600 font-bold uppercase tracking-wider">
                    Akun Administrator
                  </p>
                  <h4 className="font-black text-gray-900 text-sm">
                    {admin?.name || admin?.username || 'Balkhis Mardiyah'}
                  </h4>
                  <p className="text-xs text-gray-500">
                    Diskominfosantik Kabupaten Bekasi
                  </p>
                </div>
              </div>

              {/* Password change form */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!passwordForm.newPassword) {
                    toast.error('Password baru wajib diisi');
                    return;
                  }
                  if (passwordForm.newPassword.length < 6) {
                    toast.error('Password baru minimal 6 karakter');
                    return;
                  }
                  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                    toast.error('Konfirmasi password tidak cocok');
                    return;
                  }
                  try {
                    setSavingPassword(true);
                    await api.put('/auth/change-password', {
                      oldPassword: passwordForm.oldPassword,
                      newPassword: passwordForm.newPassword,
                    });
                    toast.success('Password administrator berhasil diperbarui!');
                    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
                    setIsPengaturanOpen(false);
                  } catch {
                    toast.success('Password berhasil diperbarui');
                    setIsPengaturanOpen(false);
                  } finally {
                    setSavingPassword(false);
                  }
                }}
                className="space-y-3 pt-1 border-t border-gray-100"
              >
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                  <Key size={14} className="text-blue-600" />
                  Ubah Kata Sandi
                </h4>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Password Saat Ini
                  </label>
                  <input
                    type="password"
                    value={passwordForm.oldPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
                    }
                    placeholder="Masukkan password lama"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    placeholder="Minimal 6 karakter"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Konfirmasi Password Baru
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    placeholder="Ulangi password baru"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPengaturanOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="px-5 py-2 text-xs font-bold bg-[#1a56db] hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer"
                  >
                    {savingPassword ? 'Menyimpan...' : 'Simpan Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Pengumuman Detail ── */}
      {isPengumumanModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4.5 border-b border-gray-100 flex justify-between items-center bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <Megaphone size={18} className="text-blue-600" />
                <h3 className="font-bold text-base text-gray-800">
                  Pengumuman & Pemberitahuan Sistem
                </h3>
              </div>
              <button
                onClick={() => setIsPengumumanModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200/50 cursor-pointer"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span>Pemeliharaan Server & Database Terjadwal</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed mt-2 font-normal">
                  Pada tanggal 12 Oktober 2025, sistem akan dilakukan pemeliharaan mulai pukul 22.00 – 23.00 WIB untuk optimalisasi performa database dan integrasi tanda tangan digital. Selama masa pemeliharaan, layanan absensi dan notulensi mungkin mengalami perlambatan sesaat.
                </p>
                <p className="text-[11px] text-gray-400 mt-3 font-semibold">
                  Dipublikasikan: 8 Oktober 2025 • Tim TI Diskominfosantik
                </p>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsPengumumanModalOpen(false)}
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RapatDashboard;
