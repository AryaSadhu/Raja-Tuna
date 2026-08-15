import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white mt-auto border-t border-gray-800">
            {/* Bagian Atas: Logo (Opsional, kalau mau dihapus total juga boleh) */}
            <div className="max-w-7xl mx-auto pt-10 pb-2 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center">
                    <Link href="/">
                        <ApplicationLogo className="h-20 w-auto object-contain mb-4 opacity-80 hover:opacity-100 transition-opacity" />
                    </Link>
                </div>
            </div>

            {/* Bagian Bawah: Copyright & Sertifikasi (CENTERED) */}
            <div className="bg-gray-900 border-t border-gray-800/50">
                {/* PERUBAHAN DI SINI:
                    1. 'justify-center' -> Supaya konten kumpul di tengah.
                    2. 'gap-8' -> Memberi jarak yang pas antara Teks Copyright dan Logo.
                    3. 'text-center' -> Memastikan teks rata tengah.
                */}
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-center items-center gap-8 text-center">
                    {/* Copyright & Organizer */}
                    <div className="text-sm text-gray-400">
                        <p className="font-bold text-white tracking-wide">
                            Rajatunacom &copy; 2025
                        </p>
                        <p className="text-xs mt-1">
                            Organized by{" "}
                            <span className="text-yellow-500 font-bold">
                                Arya Sadhu
                            </span>
                        </p>
                    </div>

                    {/* Garis Pemisah Kecil (Hanya muncul di Desktop biar manis) */}
                    <div className="hidden md:block w-px h-8 bg-gray-700"></div>

                    {/* Logo Sertifikasi (Placeholder) */}
                    <div className="flex items-center gap-6 opacity-80 hover:opacity-100 transition-opacity">
                        {/* Halal */}
                        <div className="flex flex-col items-center gap-1 group">
                            <div className="bg-white/10 p-1.5 rounded-full group-hover:bg-white/20 transition-colors">
                                <span
                                    className="text-xl leading-none"
                                    role="img"
                                    aria-label="halal"
                                >
                                    ✅
                                </span>
                            </div>
                            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold group-hover:text-gray-300">
                                Halal
                            </span>
                        </div>

                        {/* P-IRT */}
                        <div className="flex flex-col items-center gap-1 group">
                            <div className="bg-white/10 p-1.5 rounded-full group-hover:bg-white/20 transition-colors">
                                <span
                                    className="text-xl leading-none"
                                    role="img"
                                    aria-label="p-irt"
                                >
                                    🛡️
                                </span>
                            </div>
                            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold group-hover:text-gray-300">
                                P-IRT
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
