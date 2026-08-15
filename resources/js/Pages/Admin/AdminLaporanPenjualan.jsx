import React, { useState, useEffect, useMemo } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import axios from "axios";

const ITEMS_PER_PAGE = 10;

export default function AdminLaporanPenjualan({ laporan }) {
    const { errors } = usePage().props;
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    const [emailData, setEmailData] = useState({
        judul: "", nomor: "", pesan: "Terima kasih telah berbelanja di toko kami!"
    });

    useEffect(() => {
        if (errors?.error) {
            Swal.fire({
                title: 'Gagal!',
                html: `<p style="font-size:14px; color:#555;">${errors.error}</p>`,
                icon: 'error', confirmButtonColor: '#2563eb',
            });
        }
    }, [errors]);

    // =============================================
    // GROUPING: Grup berdasarkan nomor_whatsapp + tanggal
    // =============================================
    const groupedLaporan = useMemo(() => {
        const groups = {};
        (laporan ?? []).forEach(item => {
            const tanggal = new Date(item.created_at).toLocaleDateString('id-ID', {
                day: '2-digit', month: '2-digit', year: 'numeric'
            });
            const key = `${item.nomor_whatsapp}__${tanggal}`;
            if (!groups[key]) {
                groups[key] = {
                    key,
                    tanggal,
                    tanggal_raw: item.created_at,
                    nama_lengkap: item.nama_lengkap,
                    email: item.email,
                    nomor_whatsapp: item.nomor_whatsapp,
                    alamat_lengkap: item.alamat_lengkap,
                    catatan: item.catatan,
                    provinsi_nama: item.provinsi_nama,
                    kabupaten_nama: item.kabupaten_nama,
                    kecamatan_nama: item.kecamatan_nama,
                    kurir: item.kurir,
                    total_ongkir: item.total_ongkir,
                    total_bayar: item.total_bayar,
                    // Ambil nomor_pesanan dari salah satu item yang sudah ada
                    nomor_pesanan: item.nomor_pesanan ?? null,
                    // Status grup = status item pertama (bisa dikustomisasi)
                    status: item.status,
                    items: [],
                };
            }
            groups[key].items.push(item);
            // Update total jika ada perbedaan (pakai total_bayar dari item pertama saja)
            // Nomor pesanan: kalau ada yang sudah punya, pakai itu
            if (item.nomor_pesanan) groups[key].nomor_pesanan = item.nomor_pesanan;
        });
        // Konversi ke array, urutkan terbaru dulu
        return Object.values(groups).sort((a, b) =>
            new Date(b.tanggal_raw) - new Date(a.tanggal_raw)
        );
    }, [laporan]);

    // Pagination berbasis grup
    const totalPages = Math.ceil(groupedLaporan.length / ITEMS_PER_PAGE);
    const paginatedGroups = groupedLaporan.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const toggleExpand = (key) => {
        setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // =============================================
    // EMAIL MODAL
    // =============================================
    const openEmailModal = async (group) => {
        setSelectedGroup(group);
        let defaultJudul = "";
        let finalNomor = group.nomor_pesanan ?? "";

        if (group.status === 'sudah bayar') {
            defaultJudul = "Nomor Pesanan Anda";
            if (!finalNomor) {
                Swal.fire({ title: 'Menyiapkan Nomor...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                try {
                    const res = await axios.get(route('admin.laporan.generate-nomor'));
                    finalNomor = res.data.nomor;
                    Swal.close();
                } catch {
                    Swal.fire('Gagal!', 'Tidak bisa mendapatkan nomor dari server.', 'error');
                    return;
                }
            }
        } else if (group.status === 'di kirim') {
            defaultJudul = "Nomor Resi Anda";
        }

        setEmailData({ judul: defaultJudul, nomor: finalNomor, pesan: "Terima kasih telah berbelanja di toko kami!" });
        setIsEmailModalOpen(true);
    };

    const handleSendEmail = () => {
        if (selectedGroup.status === 'di kirim' && !emailData.nomor) {
            Swal.fire('Perhatian!', 'Mohon isi nomor resi terlebih dahulu.', 'warning');
            return;
        }
        setIsEmailModalOpen(false);
        Swal.fire({ title: 'Sedang Mengirim...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

        // Kirim tanggal raw untuk identifikasi grup di backend
        const tanggalRaw = new Date(selectedGroup.tanggal_raw).toISOString().split('T')[0];

        router.post(route('admin.laporan.kirim-email'), {
            email_tujuan:   selectedGroup.email,
            judul:          emailData.judul,
            nomor:          emailData.nomor,
            pesan:          emailData.pesan,
            nomor_whatsapp: selectedGroup.nomor_whatsapp,
            tanggal:        tanggalRaw,
        }, {
            onSuccess: () => Swal.fire({ title: 'Berhasil!', text: 'Email terkirim & nomor pesanan tersimpan.', icon: 'success', confirmButtonColor: '#2563eb' }),
            onError: (err) => Swal.fire({ title: 'Gagal!', html: `<p style="font-size:14px">${err?.error ?? 'Gagal mengirim email.'}</p>`, icon: 'error', confirmButtonColor: '#2563eb' }),
        });
    };

    // =============================================
    // STATUS CHANGE — update semua item dalam grup
    // =============================================
    const handleStatusChange = (group, newStatus) => {
        // Update semua item dalam grup sekaligus
        group.items.forEach(item => {
            router.patch(route('admin.laporan.update-status', item.id), { status: newStatus }, { preserveScroll: true });
        });
    };

    const openDetail = (group) => {
        setSelectedGroup(group);
        setIsModalOpen(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'belum dibayar': return 'bg-gray-100 text-gray-600';
            case 'sudah bayar':   return 'bg-blue-100 text-blue-600';
            case 'di kemas':      return 'bg-amber-100 text-amber-600';
            case 'di kirim':      return 'bg-purple-100 text-purple-600';
            case 'sampai':        return 'bg-green-100 text-green-600';
            case 'di tolak':      return 'bg-red-100 text-red-600';
            default:              return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusBadge = (status) => {
        return `inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(status)}`;
    };

    return (
        <AdminLayout>
            <Head title="Penjualan Transaksi" />
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Laporan Penjualan</h2>
                    <p className="text-xs text-gray-400 font-bold mt-1">
                        {groupedLaporan.length} grup pesanan &mdash; {laporan?.length ?? 0} total item
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-bold text-gray-600 uppercase text-xs">Tanggal</th>
                            <th className="p-4 font-bold text-gray-600 uppercase text-xs">Pelanggan</th>
                            <th className="p-4 font-bold text-gray-600 uppercase text-xs">Produk</th>
                            <th className="p-4 font-bold text-gray-600 uppercase text-xs">No. Pesanan</th>
                            <th className="p-4 font-bold text-gray-600 uppercase text-xs">Total Bayar</th>
                            <th className="p-4 font-bold text-gray-600 uppercase text-xs">Status</th>
                            <th className="p-4 font-bold text-gray-600 uppercase text-xs text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedGroups.length > 0 ? paginatedGroups.map((group) => {
                            const isExpanded = expandedGroups[group.key];
                            const canSendEmail = group.status === 'sudah bayar' || group.status === 'di kirim';
                            const isMulti = group.items.length > 1;

                            return (
                                <React.Fragment key={group.key}>
                                    {/* BARIS GRUP UTAMA */}
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-xs text-gray-500 font-medium whitespace-nowrap">
                                            {new Date(group.tanggal_raw).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-gray-800 text-sm">{group.nama_lengkap}</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{group.nomor_whatsapp}</div>
                                        </td>
                                        <td className="p-4">
                                            {/* Tombol expand kalau lebih dari 1 produk */}
                                            {isMulti ? (
                                                <button
                                                    onClick={() => toggleExpand(group.key)}
                                                    className="flex items-center gap-2 group"
                                                >
                                                    <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-full">
                                                        {group.items.length} produk
                                                    </span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                    <span className="text-xs text-gray-500 font-medium group-hover:text-blue-600 transition-colors">
                                                        {isExpanded ? 'Sembunyikan' : 'Lihat semua'}
                                                    </span>
                                                </button>
                                            ) : (
                                                <div>
                                                    <div className="font-medium text-sm text-gray-700">{group.items[0]?.product?.nama_barang ?? 'Produk dihapus'}</div>
                                                    <div className="text-[10px] text-blue-500 font-black">
                                                        {group.items[0]?.qty} x Rp {parseFloat(group.items[0]?.harga_satuan ?? 0).toLocaleString('id-ID')}
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {group.nomor_pesanan ? (
                                                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                                                    {group.nomor_pesanan}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] text-gray-300 font-bold italic">Belum ada</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-black text-gray-900">
                                                Rp {parseFloat(group.total_bayar ?? 0).toLocaleString('id-ID')}
                                            </div>
                                            {group.total_ongkir > 0 && (
                                                <div className="text-[10px] text-purple-500 font-bold">
                                                    Ongkir: Rp {parseFloat(group.total_ongkir).toLocaleString('id-ID')}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <select
                                                value={group.status ?? 'belum dibayar'}
                                                onChange={(e) => handleStatusChange(group, e.target.value)}
                                                className={`text-[10px] font-black uppercase tracking-wider rounded-lg border-none focus:ring-2 focus:ring-blue-500 py-1.5 pl-3 pr-8 cursor-pointer shadow-sm transition-all ${getStatusColor(group.status)}`}
                                            >
                                                <option value="belum dibayar">Belum Dibayar</option>
                                                <option value="sudah bayar">Sudah Bayar</option>
                                                <option value="di kemas">Di Kemas</option>
                                                <option value="di kirim">Di Kirim</option>
                                                <option value="sampai">Sampai</option>
                                                <option value="di tolak">Di Tolak</option>
                                            </select>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => openDetail(group)}
                                                    className="p-2 bg-white border border-gray-100 rounded-xl shadow-sm text-gray-400 hover:text-blue-600 transition-all"
                                                    title="Lihat Detail"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    disabled={!canSendEmail}
                                                    onClick={() => openEmailModal(group)}
                                                    className={`p-2 rounded-xl shadow-sm transition-all ${canSendEmail ? "bg-white border border-gray-100 text-amber-500 hover:text-amber-600" : "bg-gray-50 text-gray-300 cursor-not-allowed opacity-50"}`}
                                                    title="Kirim Email"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* BARIS EXPAND — daftar produk dalam grup */}
                                    {isMulti && isExpanded && (
                                        <tr>
                                            <td colSpan="7" className="px-6 pb-4 bg-blue-50/40">
                                                <div className="rounded-2xl border border-blue-100 overflow-hidden mt-1">
                                                    <table className="w-full text-left">
                                                        <thead className="bg-blue-100/60">
                                                            <tr>
                                                                <th className="px-4 py-2 text-[10px] font-black text-blue-500 uppercase">Produk</th>
                                                                <th className="px-4 py-2 text-[10px] font-black text-blue-500 uppercase text-center">Qty</th>
                                                                <th className="px-4 py-2 text-[10px] font-black text-blue-500 uppercase">Harga Satuan</th>
                                                                <th className="px-4 py-2 text-[10px] font-black text-blue-500 uppercase">Subtotal</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-blue-100">
                                                            {group.items.map((item) => (
                                                                <tr key={item.id} className="bg-white">
                                                                    <td className="px-4 py-3 text-sm font-medium text-gray-700">
                                                                        {item.product?.nama_barang ?? 'Produk dihapus'}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-sm font-black text-gray-900 text-center">{item.qty}</td>
                                                                    <td className="px-4 py-3 text-sm text-gray-600 font-bold">
                                                                        Rp {parseFloat(item.harga_satuan).toLocaleString('id-ID')}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-sm font-black text-gray-900">
                                                                        Rp {parseFloat(item.total_harga).toLocaleString('id-ID')}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        }) : (
                            <tr>
                                <td colSpan="7" className="p-10 text-center text-gray-400 italic">Belum ada transaksi.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                        <p className="text-xs text-gray-400 font-bold">
                            Halaman {currentPage} dari {totalPages} &mdash; {groupedLaporan.length} grup pesanan
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-2 rounded-xl text-xs font-black bg-white border border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >← Prev</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${page === currentPage ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white border border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-blue-600'}`}
                                >{page}</button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 rounded-xl text-xs font-black bg-white border border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >Next →</button>
                        </div>
                    </div>
                )}
            </div>

            {/* =================== MODAL DETAIL =================== */}
            {isModalOpen && selectedGroup && (
                <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden">
                        <div className="p-8 border-b bg-gray-50 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black text-gray-800 uppercase">Detail Transaksi</h3>
                                <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1">
                                    {selectedGroup.items.length} produk &mdash; <span className={getStatusBadge(selectedGroup.status)}>{selectedGroup.status}</span>
                                </p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-300 hover:text-red-500 text-3xl leading-none">&times;</button>
                        </div>

                        <div className="p-8 space-y-6 max-h-[65vh] overflow-y-auto">

                            {/* Info Pelanggan */}
                            <div>
                                <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] mb-3 border-b pb-2">Informasi Pelanggan</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] text-gray-400 font-black uppercase">Nama</label>
                                        <p className="font-bold text-gray-800 text-sm mt-0.5">{selectedGroup.nama_lengkap}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-400 font-black uppercase">WhatsApp</label>
                                        <a href={`https://wa.me/${selectedGroup.nomor_whatsapp}`} target="_blank" rel="noreferrer" className="font-bold text-green-600 underline text-sm mt-0.5 block">
                                            {selectedGroup.nomor_whatsapp}
                                        </a>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-[10px] text-gray-400 font-black uppercase">Email</label>
                                        <p className="font-bold text-gray-800 text-sm mt-0.5">{selectedGroup.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Alamat */}
                            <div>
                                <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] mb-3 border-b pb-2">Alamat Pengiriman</p>
                                <div className="space-y-3">
                                    {(selectedGroup.kecamatan_nama || selectedGroup.kabupaten_nama || selectedGroup.provinsi_nama) && (
                                        <div className="bg-blue-50 rounded-2xl p-4 flex flex-col gap-1">
                                            {selectedGroup.kecamatan_nama && <div className="flex justify-between text-sm"><span className="text-gray-400 font-black text-[10px] uppercase">Kecamatan</span><span className="font-bold text-gray-700">{selectedGroup.kecamatan_nama}</span></div>}
                                            {selectedGroup.kabupaten_nama && <div className="flex justify-between text-sm"><span className="text-gray-400 font-black text-[10px] uppercase">Kota/Kab</span><span className="font-bold text-gray-700">{selectedGroup.kabupaten_nama}</span></div>}
                                            {selectedGroup.provinsi_nama && <div className="flex justify-between text-sm"><span className="text-gray-400 font-black text-[10px] uppercase">Provinsi</span><span className="font-bold text-gray-700">{selectedGroup.provinsi_nama}</span></div>}
                                        </div>
                                    )}
                                    <div>
                                        <label className="text-[10px] text-gray-400 font-black uppercase">Alamat Lengkap</label>
                                        <p className="text-sm font-medium text-gray-700 mt-0.5">{selectedGroup.alamat_lengkap}</p>
                                    </div>
                                    {selectedGroup.catatan && (
                                        <p className="text-sm font-medium text-gray-500 italic">"{selectedGroup.catatan}"</p>
                                    )}
                                </div>
                            </div>

                            {/* Daftar Barang */}
                            <div>
                                <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] mb-3 border-b pb-2">
                                    Detail Barang ({selectedGroup.items.length} item)
                                </p>
                                <div className="space-y-2">
                                    {selectedGroup.items.map((item) => (
                                        <div key={item.id} className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">{item.product?.nama_barang ?? 'Produk dihapus'}</p>
                                                <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                                                    {item.qty} x Rp {parseFloat(item.harga_satuan).toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                            <p className="font-black text-gray-900 text-sm">
                                                Rp {parseFloat(item.total_harga).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pengiriman & Pembayaran */}
                            <div>
                                <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] mb-3 border-b pb-2">Pengiriman & Pembayaran</p>
                                <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                                    {selectedGroup.kurir && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400 font-black text-[10px] uppercase">Kurir</span>
                                            <span className="font-bold text-purple-600">{selectedGroup.kurir}</span>
                                        </div>
                                    )}
                                    {selectedGroup.total_ongkir > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400 font-black text-[10px] uppercase">Ongkir</span>
                                            <span className="font-bold text-gray-700">Rp {parseFloat(selectedGroup.total_ongkir).toLocaleString('id-ID')}</span>
                                        </div>
                                    )}
                                    {selectedGroup.nomor_pesanan && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400 font-black text-[10px] uppercase">No. Pesanan</span>
                                            <span className="font-black text-blue-600">{selectedGroup.nomor_pesanan}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
                                        <span className="text-gray-400 font-black text-[10px] uppercase">Total Bayar</span>
                                        <span className="text-lg font-black text-blue-600">
                                            Rp {parseFloat(selectedGroup.total_bayar ?? 0).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 border-t flex gap-3">
                            <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-white border py-4 rounded-2xl font-black uppercase text-xs shadow-sm hover:bg-gray-100 transition-all">Tutup</button>
                            {(selectedGroup.status === 'sudah bayar' || selectedGroup.status === 'di kirim') && (
                                <button onClick={() => { setIsModalOpen(false); openEmailModal(selectedGroup); }} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-2xl font-black uppercase text-xs shadow-lg transition-all">Kirim Email</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* =================== MODAL EMAIL =================== */}
            {isEmailModalOpen && selectedGroup && (
                <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden text-left">
                        <div className="p-8 border-b bg-gray-50 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black text-gray-800 uppercase">Draft Email</h3>
                                <p className="text-[10px] text-amber-500 font-black uppercase">Kirim Ke: {selectedGroup.email}</p>
                            </div>
                            <button onClick={() => setIsEmailModalOpen(false)} className="text-gray-300 hover:text-red-500 text-3xl leading-none">&times;</button>
                        </div>
                        <div className="p-8 space-y-4">
                            <div>
                                <label className="text-[10px] text-gray-400 font-black uppercase">Judul Email</label>
                                <input type="text" value={emailData.judul} onChange={(e) => setEmailData({ ...emailData, judul: e.target.value })} className="w-full bg-gray-50 border-none rounded-xl font-bold mt-1" />
                            </div>
                            <hr />
                            <div>
                                <label className="text-[10px] text-gray-400 font-black uppercase">
                                    {selectedGroup.status === 'sudah bayar' ? 'Nomor Pesanan (Otomatis)' : 'Nomor Resi (Input Manual)'}
                                </label>
                                <input
                                    type="text"
                                    value={emailData.nomor}
                                    onChange={(e) => setEmailData({ ...emailData, nomor: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-xl font-black text-blue-600 mt-1"
                                    placeholder={selectedGroup.status === 'di kirim' ? 'Masukkan nomor resi di sini...' : ''}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-400 font-black uppercase">Pesan Penutup</label>
                                <textarea rows="3" value={emailData.pesan} onChange={(e) => setEmailData({ ...emailData, pesan: e.target.value })} className="w-full bg-gray-50 border-none rounded-xl text-sm font-medium mt-1" />
                            </div>
                        </div>
                        <div className="p-8 bg-gray-50 border-t flex gap-3">
                            <button onClick={() => setIsEmailModalOpen(false)} className="flex-1 bg-white border py-4 rounded-2xl font-black uppercase text-xs">Batal</button>
                            <button onClick={handleSendEmail} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs shadow-lg shadow-blue-200 transition-all active:scale-95">Kirim Sekarang</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}