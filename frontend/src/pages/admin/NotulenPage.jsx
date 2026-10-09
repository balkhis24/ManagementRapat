import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Save,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertTriangle,
  Users,
  Calendar,
  Clock,
  MapPin,
  User,
  X,
  Trash2,
  Printer,
  Menu,
  Camera,
  Upload,
  Eye,
  Image,
} from 'lucide-react';
import api, { getFileUrl } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';

/* ─── Toolbar button helper ─────────────────────────────────────────── */
const ToolbarBtn = ({ onClick, active, disabled, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`px-2.5 py-1.5 rounded text-sm font-medium transition-colors ${
      active
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    } disabled:opacity-40 disabled:cursor-not-allowed`}
  >
    {children}
  </button>
);

/* ─── Rich Text Toolbar ─────────────────────────────────────────────── */
const EditorToolbar = ({ editor }) => {
  if (!editor) return null;
  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-xl">
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive('heading', { level: 1 })}
        title="Heading 1"
      >
        H1
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        H2
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
        title="Heading 3"
      >
        H3
      </ToolbarBtn>
      <div className="w-px h-5 bg-gray-300 mx-1 self-center" />
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        title="Tebal (Ctrl+B)"
      >
        <strong>B</strong>
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        title="Miring (Ctrl+I)"
      >
        <em>I</em>
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive('strike')}
        title="Coret"
      >
        <span className="line-through">S</span>
      </ToolbarBtn>
      <div className="w-px h-5 bg-gray-300 mx-1 self-center" />
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        title="Daftar Poin"
      >
        • List
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        title="Daftar Angka"
      >
        1. List
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
        title="Kutipan"
      >
        “ ”
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Garis Pemisah"
      >
        ―
      </ToolbarBtn>
      <div className="w-px h-5 bg-gray-300 mx-1 self-center" />
      <ToolbarBtn
        onClick={() => editor.chain().focus().setParagraph().run()}
        active={editor.isActive('paragraph')}
        title="Paragraf"
      >
        ¶
      </ToolbarBtn>
      <div className="w-px h-5 bg-gray-300 mx-1 self-center" />
      <ToolbarBtn
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo (Ctrl+Z)"
      >
        ↶
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo (Ctrl+Y)"
      >
        ↷
      </ToolbarBtn>
    </div>
  );
};

/* ─── Helper Format Date ────────────────────────────────────────────── */
const formatDate = (d) =>
  new Date(d).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

/* ─── Info Rapat (read-only header) ─────────────────────────────────── */
const InfoRapat = ({ rapat }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
      <h2 className="text-xl font-bold mb-4 truncate">{rapat.namaRapat}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2">
          <Calendar size={16} className="shrink-0 opacity-80" />
          <span className="truncate">{formatDate(rapat.hariTanggal)}</span>
        </div>
        <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2">
          <Clock size={16} className="shrink-0 opacity-80" />
          <span>{rapat.waktu} WIB</span>
        </div>
        <div className="flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2">
          <MapPin size={16} className="shrink-0 opacity-80" />
          <span className="truncate">{rapat.tempat}</span>
        </div>
      </div>
    </div>
  );
};

/* ─── Loading Overlay ────────────────────────────────────────────────── */
const LoadingOverlay = ({ step }) => {
  const steps = [
    { key: 0, label: 'Menyimpan notulen...' },
    { key: 1, label: 'Mengirim email ke peserta...' },
    { key: 2, label: 'Menyelesaikan rapat...' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4 text-center">
        <div className="flex justify-center mb-4">
          <Loader2 size={48} className="text-blue-600 animate-spin" />
        </div>
        <h3 className="font-semibold text-gray-900 text-lg mb-4">Memproses...</h3>
        <div className="space-y-2">
          {steps.map((s) => (
            <div
              key={s.key}
              className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-all ${
                s.key === step
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : s.key < step
                  ? 'text-green-600'
                  : 'text-gray-400'
              }`}
            >
              {s.key < step ? (
                <CheckCircle2 size={16} className="shrink-0" />
              ) : s.key === step ? (
                <Loader2 size={16} className="animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
              )}
              {s.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Confirm Dialog ─────────────────────────────────────────────────── */
const ConfirmDialog = ({ pesertaCount, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-[fadeIn_0.15s_ease]">
      <div className="bg-amber-50 border-b border-amber-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
            <Send size={18} className="text-amber-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Konfirmasi Pengiriman</h3>
        </div>
      </div>
      <div className="px-6 py-5">
        <p className="text-gray-700 text-sm leading-relaxed">
          Notulen akan dikirim ke semua peserta yang terdaftar. Lanjutkan?
        </p>
        <div className="mt-3 flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-3 py-2 rounded-xl">
          <Users size={15} className="shrink-0" />
          <span>
            <strong>{pesertaCount}</strong> peserta akan menerima email notulen
          </span>
        </div>
      </div>
      <div className="px-6 pb-5 flex gap-3 justify-end">
        <button
          id="btn-konfirmasi-batal"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors text-sm"
        >
          Batal
        </button>
        <button
          id="btn-konfirmasi-kirim"
          onClick={onConfirm}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors flex items-center gap-2 shadow-sm"
        >
          <Send size={15} />
          Ya, Kirim Sekarang
        </button>
      </div>
    </div>
  </div>
);

/* ─── Hasil Pengiriman Modal ─────────────────────────────────────────── */
const HasilModal = ({ ringkasan, rapatId, onClose }) => {
  const [retryingId, setRetryingId] = useState(null);
  const [sentIds, setSentIds] = useState([]);

  const handleKirimUlang = async (peserta) => {
    setRetryingId(peserta.id || peserta.email);
    try {
      await api.post(`/rapat/${rapatId}/notulen/kirim-ulang/${peserta.pesertaId}`);
      setSentIds((prev) => [...prev, peserta.pesertaId]);
      toast.success(`Email berhasil dikirim ulang ke ${peserta.nama}`);
    } catch (err) {
      const msg = err.response?.data?.error || 'Gagal mengirim ulang';
      toast.error(msg);
    } finally {
      setRetryingId(null);
    }
  };

  const totalPeserta = ringkasan.totalPeserta;
  const terkirim = ringkasan.terkirim;
  const gagal = ringkasan.gagal;
  const semuaBerhasil = gagal === 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div
          className={`px-6 py-4 border-b ${
            semuaBerhasil ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  semuaBerhasil ? 'bg-green-100' : 'bg-orange-100'
                }`}
              >
                {semuaBerhasil ? (
                  <CheckCircle2 size={20} className="text-green-600" />
                ) : (
                  <AlertTriangle size={20} className="text-orange-600" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Hasil Pengiriman Email</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {terkirim} dari {totalPeserta} email berhasil terkirim
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 py-4 grid grid-cols-3 gap-3 border-b border-gray-100">
          <div className="text-center bg-gray-50 rounded-xl py-3">
            <div className="text-2xl font-bold text-gray-900">{totalPeserta}</div>
            <div className="text-xs text-gray-500 mt-0.5">Total</div>
          </div>
          <div className="text-center bg-green-50 rounded-xl py-3">
            <div className="text-2xl font-bold text-green-600">{terkirim}</div>
            <div className="text-xs text-gray-500 mt-0.5">Terkirim</div>
          </div>
          <div className="text-center bg-red-50 rounded-xl py-3">
            <div className="text-2xl font-bold text-red-500">{gagal}</div>
            <div className="text-xs text-gray-500 mt-0.5">Gagal</div>
          </div>
        </div>

        {/* Detail list */}
        {ringkasan.detail && ringkasan.detail.length > 0 && (
          <div className="overflow-y-auto flex-1 px-6 py-4 space-y-2">
            {ringkasan.detail.map((item, idx) => {
              const isGagal = item.status === 'GAGAL';
              const sudahDikirimUlang = sentIds.includes(item.pesertaId);
              const isRetrying = retryingId === item.pesertaId;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${
                    isGagal && !sudahDikirimUlang
                      ? 'bg-red-50 border-red-100'
                      : 'bg-gray-50 border-gray-100'
                  }`}
                >
                  {isGagal && !sudahDikirimUlang ? (
                    <XCircle size={18} className="text-red-500 shrink-0" />
                  ) : (
                    <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.nama}</p>
                    <p className="text-xs text-gray-500 truncate">{item.email}</p>
                    {isGagal && item.error && (
                      <p className="text-xs text-red-500 mt-0.5 truncate" title={item.error}>
                        {item.error}
                      </p>
                    )}
                  </div>
                  {isGagal && !sudahDikirimUlang && item.pesertaId && (
                    <button
                      onClick={() => handleKirimUlang(item)}
                      disabled={isRetrying}
                      className="shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-60"
                    >
                      {isRetrying ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <RefreshCw size={12} />
                      )}
                      Kirim Ulang
                    </button>
                  )}
                  {sudahDikirimUlang && (
                    <span className="shrink-0 text-xs text-green-600 font-medium">✓ Terkirim</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100">
          <button
            id="btn-hasil-tutup"
            onClick={onClose}
            className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold transition-colors text-sm"
          >
            Selesai & Kembali ke Daftar Rapat
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT: NotulenPage
   ═══════════════════════════════════════════════════════════════════════ */
const NotulenPage = () => {
  const { rapatId } = useParams();
  const navigate = useNavigate();

  // Data state
  const [rapat, setRapat] = useState(null);
  const [pesertaList, setPesertaList] = useState([]);
  const [pimpinan, setPimpinan] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Action states
  const [hasNotulen, setHasNotulen] = useState(false);
  const [deletingNotulen, setDeletingNotulen] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [sendingStep, setSendingStep] = useState(-1); // -1 = idle, 0/1/2 = steps
  const [showConfirm, setShowConfirm] = useState(false);
  const [hasilRingkasan, setHasilRingkasan] = useState(null);
  const [smtpError, setSmtpError] = useState(null);

  // Dokumentasi Rapat state
  const [dokumentasiList, setDokumentasiList] = useState([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [previewDocUrl, setPreviewDocUrl] = useState(null);

  const isBusy = savingDraft || deletingNotulen || sendingStep >= 0;

  /* ── Tiptap Editor ── */
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none min-h-[240px] p-4 focus:outline-none text-gray-800 leading-relaxed',
      },
    },
  });

  /* ── Check apakah isi editor kosong ── */
  const isEditorEmpty = useCallback(() => {
    if (!editor) return true;
    const text = editor.getText().trim();
    return text.length === 0;
  }, [editor]);

  /* ── Fetch data awal ── */
  useEffect(() => {
    const fetchAll = async () => {
      setPageLoading(true);
      try {
        // Fetch rapat info + peserta + notulen draft + dokumentasi secara paralel
        const [rapatRes, pesertaRes, docRes] = await Promise.all([
          api.get(`/rapat/${rapatId}`),
          api.get(`/rapat/${rapatId}/peserta`),
          api.get(`/rapat/${rapatId}/dokumentasi`).catch(() => ({ data: [] })),
        ]);
        setRapat(rapatRes.data);
        setPesertaList(pesertaRes.data);
        setDokumentasiList(docRes.data || []);

        // Load draft notulen kalau ada
        try {
          const notulenRes = await api.get(`/rapat/${rapatId}/notulen`);
          if (notulenRes.data) {
            setPimpinan(notulenRes.data.pimpinan || '');
            if (editor && notulenRes.data.isi_rapat) {
              editor.commands.setContent(notulenRes.data.isi_rapat);
            }
            setHasNotulen(true);
          }
        } catch (notulenErr) {
          // 404 = belum ada notulen → oke, mulai dari kosong
          setHasNotulen(false);
          if (notulenErr.response?.status !== 404) {
            toast.error('Gagal memuat draft notulen');
          }
        }
      } catch (err) {
        toast.error('Gagal memuat data rapat');
        navigate('/admin/rapat');
      } finally {
        setPageLoading(false);
      }
    };

    if (editor !== null) {
      // editor dimulai null saat useEditor init, tunggu sampai instance tersedia
      fetchAll();
    }
  }, [rapatId, editor, navigate]);

  /* ── Handler Upload Dokumentasi Foto ── */
  const handleUploadDokumentasi = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar (PNG, JPG, JPEG)');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 8MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      setUploadingDoc(true);
      try {
        const res = await api.post(`/rapat/${rapatId}/dokumentasi`, {
          fileBase64: reader.result,
          tipe: 'FOTO',
        });
        setDokumentasiList((prev) => [res.data.dokumentasi, ...prev]);
        toast.success('Foto dokumentasi kegiatan berhasil diunggah!');
      } catch (err) {
        toast.error(err.response?.data?.error || 'Gagal mengunggah dokumentasi');
      } finally {
        setUploadingDoc(false);
        e.target.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  /* ── Handler Hapus Dokumentasi ── */
  const handleDeleteDokumentasi = async (docId) => {
    if (!window.confirm('Hapus foto dokumentasi ini?')) return;
    try {
      await api.delete(`/rapat/${rapatId}/dokumentasi/${docId}`);
      setDokumentasiList((prev) => prev.filter((d) => d.id !== docId));
      toast.success('Dokumentasi berhasil dihapus');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Gagal menghapus dokumentasi');
    }
  };

  /* ── Simpan Draft ── */
  const handleSimpanDraft = async () => {
    if (!pimpinan.trim()) {
      toast.error('Pimpinan Rapat wajib diisi');
      return;
    }
    setSavingDraft(true);
    try {
      const isiRapat = editor.getHTML();
      await api.post(`/rapat/${rapatId}/notulen`, {
        pimpinan: pimpinan.trim(),
        isiRapat,
      });
      setHasNotulen(true);
      toast.success('Draft notulen berhasil disimpan');
    } catch (err) {
      const msg = err.response?.data?.error || 'Gagal menyimpan draft';
      toast.error(msg);
    } finally {
      setSavingDraft(false);
    }
  };

  /* ── Hapus Hasil Rapat / Notulen ── */
  const handleHapusNotulen = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus hasil rapat / notulen ini? Tindakan ini tidak dapat dibatalkan.')) {
      setDeletingNotulen(true);
      try {
        await api.delete(`/rapat/${rapatId}/notulen`);
        setPimpinan('');
        if (editor) {
          editor.commands.clearContent();
        }
        setHasNotulen(false);
        toast.success('Hasil rapat / notulen berhasil dihapus');
        navigate('/admin/rapat');
      } catch (err) {
        const msg = err.response?.data?.error || 'Gagal menghapus hasil rapat';
        toast.error(msg);
      } finally {
        setDeletingNotulen(false);
      }
    }
  };

  /* ── Buka dialog konfirmasi ── */
  const handleSelesaiClick = () => {
    if (!pimpinan.trim()) {
      toast.error('Pimpinan Rapat wajib diisi');
      return;
    }
    setSmtpError(null);
    setShowConfirm(true);
  };

  /* ── Eksekusi: Simpan → Kirim Email → Selesai Rapat ── */
  const handleKonfirmasiKirim = async () => {
    setShowConfirm(false);
    setSmtpError(null);

    try {
      // Step 0: Simpan notulen
      setSendingStep(0);
      const isiRapat = editor.getHTML();
      await api.post(`/rapat/${rapatId}/notulen`, {
        pimpinan: pimpinan.trim(),
        isiRapat,
      });

      // Step 1: Kirim email
      setSendingStep(1);
      let kirimRes;
      try {
        kirimRes = await api.post(`/rapat/${rapatId}/notulen/kirim`);
      } catch (kirimErr) {
        // SMTP total error → simpan notulen sudah aman, tapi jangan ubah status
        setSendingStep(-1);
        const msg =
          kirimErr.response?.data?.error ||
          'Gagal menghubungi server email. Notulen sudah tersimpan — silakan coba kirim ulang.';
        setSmtpError(msg);
        toast.error(msg);
        return;
      }

      // Step 2: Tandai rapat selesai
      setSendingStep(2);
      await api.patch(`/rapat/${rapatId}/selesai`);

      setSendingStep(-1);

      // Tampilkan ringkasan hasil
      const ringkasan = kirimRes.data.ringkasan;
      // Tambahkan pesertaId ke detail agar tombol kirim ulang bisa pakai
      const pesertaMap = Object.fromEntries(
        pesertaList.map((p) => [p.email, p.id])
      );
      const detailDenganId = (ringkasan.detail || []).map((d) => ({
        ...d,
        pesertaId: pesertaMap[d.email],
      }));
      setHasilRingkasan({ ...ringkasan, detail: detailDenganId });
    } catch (err) {
      setSendingStep(-1);
      const msg = err.response?.data?.error || 'Terjadi kesalahan';
      toast.error(msg);
    }
  };

  /* ── Tutup modal hasil → redirect ── */
  const handleTutupHasil = () => {
    setHasilRingkasan(null);
    navigate('/admin/rapat');
  };

  /* ─── Derived values ─── */
  const pesertaCount = pesertaList.length;
  const tidakAdaPeserta = pesertaCount === 0;
  const isiKosong = isEditorEmpty();
  const kirimDisabled = isBusy || isiKosong || tidakAdaPeserta;

  /* ─── Render ─── */
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-500">Memuat halaman notulen...</p>
        </div>
      </div>
    );
  }

  if (!rapat) return null;

  return (
    <div className="min-h-screen bg-[#f0f4f9] flex font-sans antialiased text-slate-800">
      {/* Sidebar Navigation */}
      <div className="print:hidden">
        <AdminSidebar
          isMobileOpen={isMobileSidebarOpen}
          setIsMobileOpen={setIsMobileSidebarOpen}
        />
      </div>

      <div className="flex-1 lg:ml-72 min-h-screen flex flex-col print:ml-0 print:bg-white">
        {/* Printable Official Government Kop Surat */}
        <div className="hidden print:block mb-6 text-center border-b-2 border-black pb-4 pt-2">
          <div className="flex items-center justify-center gap-4">
            <img src="/logo-bekasi.svg" alt="Logo Bekasi" className="w-16 h-16 object-contain" />
            <div>
              <h2 className="text-lg font-black uppercase tracking-wider text-black">
                Pemerintah Kabupaten Bekasi
              </h2>
              <h3 className="text-sm font-bold uppercase tracking-wide text-black">
                Notulen &amp; Berita Acara Rapat Resmi
              </h3>
              <p className="text-xs text-gray-700 mt-0.5">
                Komplek Perkantoran Pemerintah Kabupaten Bekasi, Desa Sukamahi, Cikarang Pusat
              </p>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-gray-400 text-left">
            <h4 className="text-base font-extrabold uppercase text-black text-center mb-2">
              {rapat.namaRapat}
            </h4>
            <div className="text-xs text-gray-800 space-y-1">
              <p><strong>Hari / Tanggal :</strong> {formatDate(rapat.hariTanggal)}</p>
              <p><strong>Waktu :</strong> {rapat.waktu} WIB</p>
              <p><strong>Tempat :</strong> {rapat.tempat}</p>
              <p><strong>Pimpinan Rapat :</strong> {pimpinan || '-'}</p>
            </div>
          </div>
        </div>

        {/* Loading overlay saat proses kirim */}
        {sendingStep >= 0 && <LoadingOverlay step={sendingStep} />}

        {/* Dialog konfirmasi */}
        {showConfirm && (
          <ConfirmDialog
            pesertaCount={pesertaCount}
            onConfirm={handleKonfirmasiKirim}
            onCancel={() => setShowConfirm(false)}
          />
        )}

        {/* Modal hasil pengiriman */}
        {hasilRingkasan && (
          <HasilModal
            ringkasan={hasilRingkasan}
            rapatId={rapatId}
            onClose={handleTutupHasil}
          />
        )}

        {/* ── Page Content ── */}
        <div className="max-w-5xl w-full mx-auto px-4 sm:px-8 py-6 print:hidden">
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between gap-4 mb-6">
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

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-sm border border-slate-200/80 transition-all cursor-pointer"
              >
                <Printer size={15} />
                <span>Cetak / PDF Notulen</span>
              </button>
            </div>
          </div>

          {/* Info rapat (read-only) */}
          <InfoRapat rapat={rapat} />

        {/* Peserta count badge */}
        <div className="mt-4 flex items-center gap-2">
          <div
            className={`flex items-center gap-2 text-sm px-3 py-2 rounded-xl ${
              tidakAdaPeserta
                ? 'bg-red-50 text-red-600 border border-red-100'
                : 'bg-blue-50 text-blue-700 border border-blue-100'
            }`}
          >
            <Users size={15} />
            {tidakAdaPeserta ? (
              <span>
                <strong>Belum ada peserta</strong> yang absen di rapat ini — tidak bisa kirim email
              </span>
            ) : (
              <span>
                <strong>{pesertaCount} peserta</strong> terdaftar akan menerima notulen via email
              </span>
            )}
          </div>
        </div>

        {/* SMTP Error banner */}
        {smtpError && (
          <div className="mt-4 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Gagal mengirim email</p>
              <p className="mt-0.5 opacity-80">{smtpError}</p>
              <p className="mt-1 text-xs opacity-70">
                Notulen sudah tersimpan. Anda bisa coba klik "Selesai &amp; Kirim ke Peserta" lagi.
              </p>
            </div>
          </div>
        )}

        {/* Form card */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Isi Notulen</h2>
          </div>

          <div className="p-6 space-y-5">
            {/* Pimpinan Rapat */}
            <div>
              <label
                htmlFor="notulen-pimpinan"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                <span className="flex items-center gap-1.5">
                  <User size={14} />
                  Pimpinan Rapat
                  <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                id="notulen-pimpinan"
                type="text"
                value={pimpinan}
                onChange={(e) => setPimpinan(e.target.value)}
                placeholder="Nama pimpinan / ketua rapat"
                disabled={isBusy}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder-gray-400 disabled:bg-gray-50 disabled:opacity-60"
              />
            </div>

            {/* Rich Text Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Isi Rapat
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div
                className={`border rounded-xl overflow-hidden transition-all ${
                  isBusy
                    ? 'opacity-60 pointer-events-none border-gray-200'
                    : 'border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500'
                }`}
              >
                <EditorToolbar editor={editor} />
                <EditorContent
                  editor={editor}
                  className="bg-white"
                  placeholder="Tulis pembahasan, keputusan, dan tindak lanjut rapat di sini..."
                />
              </div>
              {isiKosong && !isBusy && (
                <p className="text-xs text-gray-400 mt-1.5 ml-1">
                  Isi rapat wajib diisi sebelum bisa dikirim ke peserta
                </p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="px-6 py-5 bg-gray-50/70 border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <div>
              {hasNotulen ? (
                <button
                  id="btn-hapus-notulen"
                  type="button"
                  onClick={handleHapusNotulen}
                  disabled={isBusy || deletingNotulen}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {deletingNotulen ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  Hapus Hasil Rapat
                </button>
              ) : (
                <p className="text-xs text-gray-400">
                  * Kolom wajib diisi
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Simpan Draft */}
              <button
                id="btn-simpan-draft"
                onClick={handleSimpanDraft}
                disabled={isBusy || !pimpinan.trim()}
                className="flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-100 rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingDraft ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Simpan Draft
              </button>

              {/* Selesai & Kirim */}
              <button
                id="btn-selesai-kirim"
                onClick={handleSelesaiClick}
                disabled={kirimDisabled}
                title={
                  tidakAdaPeserta
                    ? 'Tidak ada peserta — tidak bisa kirim email'
                    : isiKosong
                    ? 'Isi rapat tidak boleh kosong'
                    : ''
                }
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg disabled:shadow-none"
              >
                {sendingStep >= 0 ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                Selesai &amp; Kirim ke Peserta
              </button>
            </div>
          </div>

          {/* Warning jika tidak ada peserta */}
          {tidakAdaPeserta && (
            <div className="px-6 pb-4">
              <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <AlertTriangle size={16} className="shrink-0" />
                Belum ada peserta yang absen di rapat ini. Minta peserta mengisi absensi via QR
                Code terlebih dahulu.
              </div>
            </div>
          )}
        </div>

        {/* ── Dokumentasi Kegiatan Rapat Card ── */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Camera size={18} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">Dokumentasi Kegiatan Rapat</h3>
                <p className="text-xs text-gray-400">Lampiran foto pelaksanaan rapat dinas resmi</p>
              </div>
            </div>

            <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs shrink-0 self-start sm:self-auto">
              {uploadingDoc ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Mengunggah...</span>
                </>
              ) : (
                <>
                  <Upload size={14} />
                  <span>Unggah Foto Dokumentasi</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadDokumentasi}
                disabled={uploadingDoc}
                className="hidden"
              />
            </label>
          </div>

          <div className="p-6">
            {dokumentasiList.length === 0 ? (
              <div className="text-center py-10 bg-slate-50/60 rounded-xl border border-dashed border-gray-200">
                <Image size={36} className="mx-auto text-gray-300 mb-2" />
                <p className="text-xs font-semibold text-gray-500">Belum ada foto dokumentasi untuk rapat ini</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Unggah foto kegiatan untuk melengkapi notulen dan berita acara rapat</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {dokumentasiList.map((doc) => (
                  <div
                    key={doc.id}
                    className="group relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-video flex items-center justify-center shadow-xs hover:shadow-md transition-all"
                  >
                    <img
                      src={getFileUrl(doc.url_file)}
                      alt="Dokumentasi"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewDocUrl(getFileUrl(doc.url_file))}
                        className="p-1.5 bg-white/90 text-gray-800 rounded-lg hover:bg-white transition-colors"
                        title="Perbesar"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDokumentasi(doc.id)}
                        className="p-1.5 bg-red-600/90 text-white rounded-lg hover:bg-red-700 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Printable Official Notulen Content & Signatures ── */}
      <div className="hidden print:block px-8 py-4">
        <div className="border border-black p-4 text-xs mb-6">
          <h5 className="font-bold uppercase mb-3 pb-1 border-b border-gray-300">Hasil Rapat / Keputusan:</h5>
          <div className="prose text-xs" dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '<p>-</p>' }} />
        </div>

        {/* Printable Dokumentasi Section */}
        {dokumentasiList.length > 0 && (
          <div className="border border-black p-4 text-xs mb-8">
            <h5 className="font-bold uppercase mb-3 pb-1 border-b border-gray-300">
              Dokumentasi Foto Kegiatan Rapat:
            </h5>
            <div className="grid grid-cols-2 gap-4">
              {dokumentasiList.map((doc) => (
                <div key={doc.id} className="border border-gray-300 p-1 text-center">
                  <img
                    src={getFileUrl(doc.url_file)}
                    alt="Dokumentasi"
                    className="max-h-48 w-full object-contain mx-auto"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between text-xs text-black pt-8">
          <div>
            <p>Pimpinan Rapat,</p>
            <p className="font-bold mt-20">{pimpinan || '( ...................................................... )'}</p>
          </div>
          <div className="text-right">
            <p>Cikarang Pusat, {formatDate(new Date())}</p>
            <p>Notulis / Pembuat Berita Acara,</p>
            <p className="font-bold mt-20">( ...................................................... )</p>
          </div>
        </div>
      </div>

      {/* Modal Preview Dokumentasi */}
      {previewDocUrl && (
        <div
          onClick={() => setPreviewDocUrl(null)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-4 max-w-2xl w-full text-center shadow-2xl animate-in fade-in zoom-in duration-200"
          >
            <div className="flex justify-between items-center mb-3 px-2">
              <h4 className="font-bold text-sm text-gray-800">Pratinjau Dokumentasi Kegiatan</h4>
              <button
                onClick={() => setPreviewDocUrl(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1 leading-none"
              >
                ×
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden bg-slate-900 max-h-[70vh] flex items-center justify-center">
              <img src={previewDocUrl} alt="Dokumentasi" className="max-h-[70vh] max-w-full object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* Tiptap minimal styles */}
      <style>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror {
          min-height: 240px;
        }
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror h2 { font-size: 1.25rem; font-weight: 700; margin: 1rem 0 0.5rem; }
        .ProseMirror h3 { font-size: 1.1rem; font-weight: 600; margin: 0.8rem 0 0.4rem; }
        .ProseMirror p { margin: 0.5rem 0; line-height: 1.7; }
        .ProseMirror ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
        .ProseMirror ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
        .ProseMirror li { margin: 0.25rem 0; }
        .ProseMirror strong { font-weight: 700; }
        .ProseMirror em { font-style: italic; }
      `}</style>
      </div>
    </div>
  );
};

export default NotulenPage;
