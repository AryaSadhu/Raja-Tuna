import React from 'react';
import dayjs from 'dayjs'; // Pastikan install: npm install dayjs
import 'dayjs/locale/id'; // Biar format tanggal bahasa Indonesia

export default function EventInfoModal({ show, onClose, event }) {
    if (!show) return null;

    // Format Tanggal Cantik (Contoh: Minggu, 20 Desember 2025)
    const formattedDate = event?.start_date
        ? dayjs(event.start_date).locale('id').format('dddd, D MMMM YYYY') 
        : 'Jadwal belum ditentukan';

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden relative animate-bounce-in">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                >
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="p-8 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="bg-indigo-100 p-4 rounded-full">
                            <span className="text-6xl">📅</span>
                        </div>
                    </div>
                    
                    {/* JUDUL EVENT DINAMIS */}
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">
                        {event?.title || 'Informasi Event'}
                    </h3>

                    {/* DESKRIPSI & TANGGAL DINAMIS */}
                    <p className="text-slate-600 mb-6">
                        {event?.description || 'Jangan lewatkan pengundian hadiah utama!'}
                        <br/>
                        <span className="block mt-3 text-lg font-bold text-indigo-600 bg-indigo-50 py-2 px-4 rounded-lg inline-block">
                            {formattedDate}
                        </span>
                    </p>

                    <button 
                        onClick={onClose} 
                        className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-500/30"
                    >
                        Siap, Mengerti!
                    </button>
                </div>
            </div>
        </div>
    );
}