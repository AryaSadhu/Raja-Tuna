import React from "react";

export default function AboutProductModal({ show, onClose }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-scale-up">
                {/* Tombol Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-slate-100 rounded-full p-2 hover:bg-red-100 hover:text-red-600 transition"
                >
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {/* Konten */}
                <div className="p-8">
                    <h2 className="text-3xl font-black text-slate-800 mb-4 border-b pb-4">
                        Tentang Kerupuk Tuna Premium
                    </h2>
                    <div className="prose prose-slate max-w-none text-slate-600">
                        <p className="mb-4">
                            Rasakan sensasi gurih dan renyah tak tertandingi
                            dari Kerupuk Tuna Premium kami. Dibuat dari 100%
                            daging ikan tuna segar pilihan, setiap gigitan
                            memberikan cita rasa laut yang otentik dan kaya
                            protein. Kami berkomitmen menyajikan camilan
                            berkualitas tinggi, diolah secara higienis tanpa
                            tambahan bahan pengawet buatan.
                        </p>

                        <p className="font-medium">
                            Sempurna untuk menjadi teman setia hidangan utama
                            Anda, mulai dari nasi goreng, soto, hingga bakso,
                            atau dinikmati langsung sebagai camilan premium saat
                            santai.
                        </p>

                        {/* Sertifikasi */}
                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mt-6 text-center">
                            <h4 className="font-bold text-slate-800 mb-4">
                                Sertifikasi & Keamanan
                            </h4>
                            <div className="flex flex-wrap gap-4 items-center justify-center">
                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-green-200 shadow-sm">
                                    <span className="text-2xl">✅</span>
                                    <div className="text-xs">
                                        <div className="font-bold text-green-700">
                                            HALAL
                                        </div>
                                        <div className="text-slate-400">
                                            On Process
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-blue-200 shadow-sm">
                                    <span className="text-2xl">🛡️</span>
                                    <div className="text-xs">
                                        <div className="font-bold text-blue-700">
                                            P-IRT
                                        </div>
                                        <div className="text-slate-400">
                                            On Process
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
