import { useState } from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayoutOld';
import { Head, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function CheckPesanan({ auth, pesanan, not_found, pesanan_belum_bayar = [], pelanggan_login }) {
    const [orderId, setOrderId] = useState("");
    const [loading, setLoading] = useState(false);

    // Data Perusahaan
    const noRekening = "0402334124";
    const namaBank = "BANK CENTRAL ASIA (BCA)";
    const namaPerusahaan = "PT. RAJA TUNA";
    const noHpAdmin = "6281804042211";

    const handleSearch = (e) => {
        e.preventDefault();
        if (!orderId) return Swal.fire("Info", "Masukkan ID Pesanan Anda", "info");
        
        setLoading(true);
        router.get(route('pesanan.check'), { id: orderId }, {
            preserveState: true,
            onFinish: () => setLoading(false),
            onError: () => Swal.fire("Gagal", "Pesanan tidak ditemukan", "error")
        });
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        Swal.fire({
            title: 'Berhasil Salin!',
            text: 'Nomor rekening telah disalin.',
            icon: 'success',
            timer: 1000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
    };

    const handleKonfirmasiWA = () => {
        const pesan = `Halo Admin, saya ingin konfirmasi pembayaran untuk Pesanan #${pesanan.id}. Total Transfer: Rp ${parseFloat(pesanan.total_bayar ?? pesanan.total_harga).toLocaleString('id-ID')}. Mohon dicek ya, terima kasih!`;
        window.open(`https://wa.me/${noHpAdmin}?text=${encodeURIComponent(pesan)}`, '_blank');
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Check Pesanan" />

            <div className="py-12 bg-gray-50/50 min-h-screen">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    
                    {/* INPUT FORM CARI */}
                    {!pesanan && (
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-10 text-center">
                            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-2">Check Status Pesanan</h2>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">Masukkan ID Pesanan Anda yang tertera pada email atau saat checkout</p>
                            
                            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                                <input 
                                    type="text" 
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    placeholder="Contoh: 123"
                                    className="flex-grow bg-gray-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500 font-bold text-gray-700"
                                />
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 disabled:bg-gray-400"
                                >
                                    {loading ? 'Mencari...' : 'Cari Pesanan'}
                                </button>
                            </form>
                        </div>
                    )} 

                    {not_found && (
                        <div className="bg-red-50 border border-red-100 rounded-2xl px-6 py-4 flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-xs font-bold text-red-500 uppercase tracking-widest">
                                Pesanan tidak ditemukan. Cek kembali nomor pesanan Anda.
                            </p>
                        </div>
                    )}

                    {/* HASIL PENCARIAN DETAIL PESANAN */}
                    {pesanan && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                                
                                <div className="bg-blue-600 p-10 text-center text-white">
                                    <div className="flex justify-center mb-4">
                                        <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-black uppercase tracking-tighter">Status: {pesanan.status}</h2>
                                    <p className="opacity-80 text-sm font-bold uppercase tracking-widest mt-2">Pesanan #{pesanan.id} - {pesanan.nama_lengkap}</p>
                                </div>

                                <div className="p-8 sm:p-12 space-y-8">
                                    <div className="text-center space-y-2">
                                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Total yang harus dibayar</p>
                                        <h1 className="text-4xl font-black text-blue-600 italic">
                                            Rp {parseFloat(pesanan.total_bayar ?? pesanan.total_harga).toLocaleString('id-ID')}
                                        </h1>
                                    </div>

                                    <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 space-y-6">
                                        <div className="flex justify-between items-start border-b border-gray-200 pb-4">
                                            <div>
                                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Metode Pembayaran</p>
                                                <p className="font-bold text-gray-800">{namaBank}</p>
                                            </div>
                                            <span className="bg-white px-3 py-1 rounded-lg border text-[10px] font-black text-blue-600">OFFICIAL</span>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Nomor Rekening</p>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl font-black text-gray-800 tracking-wider">{noRekening}</span>
                                                    <button onClick={() => copyToClipboard(noRekening)} className="text-blue-500 hover:text-blue-700 transition-all p-2 bg-blue-50 rounded-xl">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Nama Penerima</p>
                                                <p className="font-black text-gray-700 uppercase">{namaPerusahaan}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 flex gap-4 items-center">
                                        <div className="text-amber-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <p className="text-xs font-bold text-amber-800 leading-relaxed">
                                            PENTING: Pastikan nominal transfer Anda tepat sampai 3 digit terakhir. Harap simpan bukti transfer untuk dikirimkan kepada Admin kami melalui tombol di bawah ini agar pesanan Anda dapat segera diproses.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                        <button 
                                            onClick={handleKonfirmasiWA}
                                            className="w-full bg-green-500 hover:bg-green-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-green-200 transition-all flex items-center justify-center gap-3 active:scale-95"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
                                            Konfirmasi WA
                                        </button>
                                        <button 
                                            onClick={() => router.get(route('pesanan.check'))}
                                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 py-5 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center active:scale-95"
                                        >
                                            Cek ID Lain
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TABEL DAFTAR PESANAN BELUM DIBAYAR */}
                    {Boolean(pelanggan_login) && (
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">Pesanan Anda Menunggu Pembayaran</h3>
                                    <p className="text-xs text-gray-400 font-bold mt-1">Daftar transaksi Anda yang belum diselesaikan pembayarannya</p>
                                </div>
                                <span className="bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-amber-200">
                                    {pesanan_belum_bayar?.length ?? 0} Menunggu
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="p-4 font-bold text-gray-600 uppercase text-xs">ID Pesanan</th>
                                            <th className="p-4 font-bold text-gray-600 uppercase text-xs">Tanggal</th>
                                            <th className="p-4 font-bold text-gray-600 uppercase text-xs">Pelanggan</th>
                                            <th className="p-4 font-bold text-gray-600 uppercase text-xs">Produk</th>
                                            <th className="p-4 font-bold text-gray-600 uppercase text-xs text-center">Qty</th>
                                            <th className="p-4 font-bold text-gray-600 uppercase text-xs">Total Bayar</th>
                                            <th className="p-4 font-bold text-gray-600 uppercase text-xs text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {pesanan_belum_bayar && pesanan_belum_bayar.length > 0 ? (
                                            pesanan_belum_bayar.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="p-4 text-xs font-black text-blue-600">
                                                        #{item.id}
                                                    </td>
                                                    <td className="p-4 text-xs text-gray-500 font-medium">
                                                        {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="font-bold text-gray-800 text-xs">{item.nama_lengkap}</div>
                                                        <div className="text-[10px] text-gray-400 font-bold">{item.nomor_whatsapp}</div>
                                                    </td>
                                                    <td className="p-4 text-sm text-gray-700">
                                                        <div className="font-bold text-gray-800 text-xs">
                                                            {item.product?.nama_barang ?? item.nama_barang ?? "Kerupuk Kulit Ikan Tuna"}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-xs text-center font-black text-gray-900">
                                                        {item.qty} pcs
                                                    </td>
                                                    <td className="p-4 text-xs font-black text-gray-900">
                                                        Rp {parseFloat(item.total_bayar ?? item.total_harga).toLocaleString('id-ID')}
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <button
                                                            onClick={() => {
                                                                setOrderId(item.id.toString());
                                                                router.get(route('pesanan.check'), { id: item.id }, { preserveState: true });
                                                            }}
                                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-md shadow-blue-100 transition-all active:scale-95"
                                                        >
                                                            Bayar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="p-8 text-center text-gray-400 text-xs italic font-medium">
                                                    Tidak ada pesanan Anda yang menunggu pembayaran.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <p className="text-center mt-8 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                        Aplikasi ini dikembangkan oleh <span className="text-blue-500">Arya Sadhu</span>
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}