import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

// Fungsi helper untuk ikon
const getIcon = (type) => {
    if (type === "menang") return "🏆";
    return "🎟️"; // Default ikon kupon
};

export default function ActivityPopup({ activity, onHide }) {
    // 'activity' adalah object-nya (misal: { type: 'kupon', ... })
    // TAMBAHKAN STATE UNTUK TEKS WAKTU ---
    const [timeAgo, setTimeAgo] = useState("baru saja");

    // TAMBAHKAN 'useEffect' UNTUK TIMER ---
    useEffect(() => {
        // Jika tidak ada 'activity' (popup disembunyikan), jangan lakukan apa-apa
        if (!activity) return;

        // Fungsi untuk update teks waktu
        const update = () => {
            const now = Date.now();
            // Ambil timestamp dari prop
            const secondsAgo = Math.floor((now - activity.timestamp) / 1000);

            if (secondsAgo < 3) {
                setTimeAgo("baru saja");
            } else if (secondsAgo < 60) {
                setTimeAgo(`${secondsAgo} detik yang lalu`);
            } else {
                // Jika sudah lebih dari 1 menit, tampilkan ini aja
                setTimeAgo("kurang dari semenit lalu");
            }
        };

        update(); // Jalankan sekali pas popup muncul

        // Set interval biar waktunya update (misal tiap 5 detik)
        const intervalId = setInterval(update, 3000);

        // Cleanup: Hentikan interval pas popup-nya hilang/ganti
        return () => clearInterval(intervalId);
    }, [activity]); // 'useEffect' ini akan jalan lagi tiap 'activity'-nya ganti

    return (
        // AnimatePresence penting biar animasi 'exit' (hilang) bisa jalan
        <AnimatePresence>
            {activity && (
                <motion.div
                    // Posisi di pojok kiri bawah
                    className="fixed bottom-5 left-5 z-40 max-w-xs w-full"
                    // Animasi Framer Motion
                    initial={{ opacity: 0, x: -100 }} // Mulai dari kiri & transparan
                    animate={{ opacity: 1, x: 0 }} // Masuk ke posisi
                    exit={{ opacity: 0, x: -100 }} // Keluar ke kiri
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <div className="bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden">
                        <div className="flex-shrink-0 p-4 flex items-center justify-center">
                            <span className="text-2xl">
                                {getIcon(activity.type)}
                            </span>
                        </div>
                        <div className="flex-1 w-0 py-3 pr-4">
                            <p className="text-sm font-medium text-gray-900">
                                {activity.user}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                {activity.action}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                                {timeAgo}
                            </p>
                        </div>
                        <div className="flex p-2">
                            <button
                                onClick={onHide} // Tombol X untuk nutup manual
                                className="text-gray-400 hover:text-gray-500 text-sm"
                            >
                                X
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
