import AuthenticatedLayout from '@/Layouts/AuthenticatedLayoutOld';
import { Head, Link } from '@inertiajs/react';
import { FaWhatsapp, FaCopy, FaCheckCircle } from 'react-icons/fa'; // Pastikan install react-icons atau ganti svg
import Swal from 'sweetalert2';

export default function TransferPage({ auth, total_bayar, order_id }) {
    const noRekening = "39358081804042211";
    const namaBank = " VIRTUAL ACCOUNT OVO";
    const namaPerusahaan = "PT. RAJA TUNA";
    const noHpAdmin = "6281804042211"; // Format internasional tanpa '+'

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
        const pesan = `Halo Admin, saya ingin konfirmasi pembayaran untuk Pesanan #${order_id}. Total Transfer: Rp ${total_bayar.toLocaleString('id-ID')}. Mohon dicek ya, terima kasih!`;
        window.open(`https://wa.me/${noHpAdmin}?text=${encodeURIComponent(pesan)}`, '_blank');
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Instruksi Pembayaran" />

            <div className="py-12 bg-gray-50/50 min-h-screen">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                        
                        {/* Header Branding */}
                        <div className="bg-blue-600 p-10 text-center text-white">
                            <div className="flex justify-center mb-4">
                                <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Hampir Selesai!</h2>
                            <p className="opacity-80 text-sm font-bold uppercase tracking-widest mt-2">Selesaikan pembayaran Anda segera</p>
                        </div>

                        <div className="p-8 sm:p-12 space-y-8">
                            {/* Total Pembayaran */}
                            <div className="text-center space-y-2">
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Total yang harus dibayar</p>
                                <h1 className="text-4xl font-black text-blue-600 italic">
                                    Rp {total_bayar.toLocaleString('id-ID')}
                                </h1>
                            </div>

                            {/* Info Rekening */}
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
                                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">NOMOR VIRTUAL ACCOUNT</p>
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

                            {/* Kata-kata Generate */}
                            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 flex gap-4 items-center">
                                <div className="text-amber-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <p className="text-xs font-bold text-amber-800 leading-relaxed">
                                    PENTING: Pastikan nominal transfer Anda tepat sampai 3 digit terakhir. Harap simpan bukti transfer untuk dikirimkan kepada Admin kami melalui tombol di bawah ini agar pesanan Anda dapat segera diproses.
                                </p>
                            </div>

                            {/* Tombol Aksi */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                <button 
                                    onClick={handleKonfirmasiWA}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-green-200 transition-all flex items-center justify-center gap-3 active:scale-95"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
                                    Konfirmasi WA
                                </button>
                                <Link 
                                    href={route('pesanan.check')}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 py-5 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center active:scale-95"
                                >
                                    Selesai Belanja
                                </Link>
                            </div>
                        </div>
                    </div>

                    <p className="text-center mt-8 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                        Aplikasi ini dikembangkan oleh <span className="text-blue-500">Arya Sadhu</span>
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}