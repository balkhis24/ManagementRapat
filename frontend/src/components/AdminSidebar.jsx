import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Calendar,
  Building2,
  Users,
  FileText,
  BarChart3,
  Settings,
  X,
} from 'lucide-react';

const AdminSidebar = ({
  isMobileOpen,
  setIsMobileOpen,
  onOpenModal,
  currentView = 'beranda',
  setCurrentView,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isRapatPath = location.pathname.startsWith('/admin/rapat');

  const handleNav = (viewKey) => {
    if (setCurrentView) {
      setCurrentView(viewKey);
    }
    if (location.pathname !== '/admin/rapat') {
      navigate('/admin/rapat');
    }
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const handleMenuClick = (modalType) => {
    if (onOpenModal) {
      onOpenModal(modalType);
    } else {
      navigate(`/admin/rapat?modal=${modalType}`);
    }
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0f1e36] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out shadow-2xl lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Navigation */}
        <div className="p-5 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Logo & Regency Brand */}
          <div className="flex items-center gap-3 mb-8 pt-1">
            <img
              src="/logo-bekasi.svg"
              alt="Logo Kabupaten Bekasi"
              className="w-10 h-10 object-contain drop-shadow shrink-0"
            />
            <div className="leading-tight">
              <h2 className="text-[15px] font-bold text-white tracking-tight">
                Diskominfosantik
              </h2>
              <p className="text-[12px] text-slate-300 font-normal">
                Kabupaten Bekasi
              </p>
            </div>
            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="ml-auto text-slate-400 hover:text-white lg:hidden p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {/* Beranda */}
            <button
              onClick={() => handleNav('beranda')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                isRapatPath && currentView === 'beranda'
                  ? 'bg-[#1c3254] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Home size={19} className={currentView === 'beranda' ? 'text-white' : 'text-slate-300'} />
              <span>Beranda</span>
            </button>

            {/* Jadwal Rapat */}
            <button
              onClick={() => handleNav('jadwal')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                isRapatPath && currentView === 'jadwal'
                  ? 'bg-[#1c3254] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar size={19} className={currentView === 'jadwal' ? 'text-white' : 'text-slate-300'} />
              <span>Jadwal Rapat</span>
            </button>

            {/* Ruang Rapat */}
            <button
              onClick={() => handleMenuClick('master-ruang')}
              className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
            >
              <Building2 size={19} className="text-slate-300" />
              <span>Ruang Rapat</span>
            </button>

            {/* Peserta */}
            <button
              onClick={() => handleMenuClick('peserta')}
              className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
            >
              <Users size={19} className="text-slate-300" />
              <span>Peserta</span>
            </button>

            {/* Notulen */}
            <button
              onClick={() => handleMenuClick('notulen')}
              className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
            >
              <FileText size={19} className="text-slate-300" />
              <span>Notulen</span>
            </button>

            {/* Laporan */}
            <button
              onClick={() => handleMenuClick('laporan')}
              className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
            >
              <BarChart3 size={19} className="text-slate-300" />
              <span>Laporan</span>
            </button>

            {/* Pengaturan */}
            <button
              onClick={() => handleMenuClick('pengaturan')}
              className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
            >
              <Settings size={19} className="text-slate-300" />
              <span>Pengaturan</span>
            </button>
          </nav>
        </div>

        {/* Bottom Slogan & Architectural Landmark Illustration */}
        <div className="pt-4 pb-6 px-5 relative shrink-0">
          {/* Blueprint Landmark Outline Art */}
          <div className="mb-3 text-sky-400/35 overflow-hidden">
            <svg
              viewBox="0 0 240 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              className="w-full h-auto opacity-75"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Ground line */}
              <line x1="0" y1="92" x2="240" y2="92" />
              
              {/* Radio tower / Monumen antena */}
              <line x1="42" y1="92" x2="42" y2="20" strokeWidth="1.5" />
              <line x1="32" y1="92" x2="42" y2="28" />
              <line x1="52" y1="92" x2="42" y2="28" />
              <line x1="35" y1="65" x2="49" y2="65" />
              <line x1="38" y1="45" x2="46" y2="45" />
              <circle cx="42" cy="18" r="2.5" />
              <path d="M36 14 A 8 8 0 0 1 48 14" strokeDasharray="1.5 1.5" />
              <path d="M32 10 A 13 13 0 0 1 52 10" strokeDasharray="2 2" />

              {/* Small bridge / dome / hill curve */}
              <path d="M0 92 Q 22 75 42 92" />
              
              {/* Complex office building facade */}
              <rect x="58" y="48" width="55" height="44" />
              <line x1="58" y1="62" x2="113" y2="62" />
              <line x1="58" y1="76" x2="113" y2="76" />
              <line x1="72" y1="48" x2="72" y2="92" />
              <line x1="86" y1="48" x2="86" y2="92" />
              <line x1="100" y1="48" x2="100" y2="92" />
              {/* Roof antenna */}
              <line x1="86" y1="48" x2="86" y2="38" />

              {/* Central high tower building */}
              <rect x="113" y="30" width="46" height="62" />
              <line x1="113" y1="46" x2="159" y2="46" />
              <line x1="113" y1="62" x2="159" y2="62" />
              <line x1="113" y1="78" x2="159" y2="78" />
              <line x1="128" y1="30" x2="128" y2="92" />
              <line x1="144" y1="30" x2="144" y2="92" />
              {/* Architectural roof cap */}
              <polygon points="113,30 136,18 159,30" />

              {/* Right block building */}
              <rect x="159" y="55" width="65" height="37" />
              <line x1="159" y1="68" x2="224" y2="68" />
              <line x1="159" y1="80" x2="224" y2="80" />
              <line x1="175" y1="55" x2="175" y2="92" />
              <line x1="191" y1="55" x2="191" y2="92" />
              <line x1="207" y1="55" x2="207" y2="92" />

              {/* Wireframe tree / bushes */}
              <circle cx="16" cy="85" r="7" />
              <circle cx="26" cy="86" r="5" />
              <circle cx="230" cy="86" r="6" />
            </svg>
          </div>

          {/* Slogan */}
          <div className="leading-tight">
            <h4 className="text-[13px] font-semibold text-slate-200">Bekasi Maju</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Berlandaskan Teknologi dan Informasi
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
