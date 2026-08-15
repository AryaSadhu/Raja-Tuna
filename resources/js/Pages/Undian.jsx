import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import ReactConfetti from "react-confetti";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import PemenangModal from "@/Components/PemenangModal";

// --- Config animasi untuk Framer Motion ---
// 1. Config 'container' (bungkusnya)
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            // Ini bagian 'staggered'-nya
            staggerChildren: 0.8, // Jeda 0.3 detik antar pemenang
        },
    },
};
// 2. Config 'item' (satu pemenang)
const itemVariants = {
    hidden: { y: 20, opacity: 0 }, // Mulai dari bawah & transparan
    visible: { y: 0, opacity: 1 }, // Muncul ke posisi normal
};

export default function Undian({
    auth,
    pemenang = [],
    tanggalUndian,
    hadiahBerikutnya = [],
}) {
    const [selectedPemenang, setSelectedPemenang] = useState(null);
    useEffect(() => {
        // Pas komponen mount, paksa body sembunyikan scrollbar horizontal
        document.body.style.overflowX = "hidden";

        // Pas komponen unmount (pindah halaman),
        // kembalikan body ke setting normal
        return () => {
            document.body.style.overflowX = "auto";
            // 'auto' atau 'null' atau 'unset'
        };
    }, []); // [] = Hanya jalan sekali pas mount

    return (
        <AuthenticatedLayout auth={auth} layoutVariant="undian">
            <Head title="Hasil Undian" />
            {/* Tembakkan Konfeti! (hanya jika ada pemenang) */}
            {pemenang.length > 0 && (
                <ReactConfetti
                    recycle={false} // Cuma nembak sekali
                    numberOfPieces={800} // Jumlah konfeti
                    tweenDuration={5000} // Durasi 5 detik
                />
            )}

            <div className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Pemenang Undian Minggu Ini
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Selamat kepada para pemenang!
                    </p>

                    {/* 3. Terapkan Framer Motion di sini */}
                    <motion.div
                        className="mt-10 space-y-6"
                        variants={containerVariants} // Terapkan config container
                        initial="hidden"
                        animate="visible"
                    >
                        {pemenang.length > 0 ? (
                            pemenang.map((p, index) => (
                                // 4. Bungkus tiap item pemenang
                                <motion.div
                                    key={index}
                                    variants={itemVariants} // Terapkan config item
                                    className="bg-white shadow-xl rounded-lg p-6 border-l-4 border-red-600 cursor-pointer"
                                    onClick={() => setSelectedPemenang(p)}
                                    whileHover={{
                                        scale: 1.03, // Zoom dikit pas di-hover
                                        backgroundColor: "rgb(249 250 251)",
                                        transition: { duration: 0.2 },
                                    }}
                                    whileTap={{
                                        scale: 0.98, // Mengecil dikit pas diklik/ditekan
                                        transition: { duration: 0.1 },
                                    }}
                                >
                                    <div className="text-sm text-gray-500 uppercase tracking-wider">
                                        Nomor Kupon
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 my-1">
                                        {p.coupon_code}
                                    </div>
                                    <div className="text-3xl font-semibold text-red-700">
                                        {p.full_name}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <p className="text-gray-500">
                                Data pemenang minggu ini akan segera diumumkan.
                            </p>
                        )}
                    </motion.div>

                    {tanggalUndian && (
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Kapan Undian Selanjutnya?
                            </h3>
                            <p className="mt-2 text-lg text-gray-600">
                                Undian berikutnya akan diadakan pada:
                            </p>
                            <p className="text-2xl font-bold text-red-600 mt-1">
                                {tanggalUndian}
                            </p>
                        </div>
                    )}

                    {hadiahBerikutnya.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <h3 className="text-2xl font-semibold text-gray-800">
                                Nantikan Hadiah Undian Berikutnya!
                            </h3>
                            <ul className="mt-4 space-y-3 max-w-md mx-auto">
                                {hadiahBerikutnya.map((hadiah) => (
                                    <li
                                        key={hadiah.id}
                                        className="p-4 bg-white rounded-lg shadow text-left"
                                    >
                                        <span className="block font-bold text-lg text-red-600">
                                            {hadiah.qty}x{" "}{hadiah.prize_name.replace(/\b\w/g, char => char.toUpperCase())}
                                        </span>
                                        <span className="text-gray-700">
                                            {hadiah.prize_type}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* 2. SECTION CALL TO ACTION (CTA) */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <h3 className="text-2xl font-semibold text-gray-800">
                            Siap Menang?
                        </h3>
                        <p className="mt-2 text-lg text-gray-600">
                            Klik tombol dibawah ini untuk memasukkan kode kupon
                            yang kamu punya!
                        </p>
                        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                            {/* Tombol ke Welcome (Input Kupon) */}
                            <Link
                                href={route("home")} //
                                className="px-8 py-3 bg-white text-red-600 font-bold rounded-lg shadow-md border-2 border-red-600 hover:bg-red-600 hover:text-white transition duration-300"
                            >
                                Input Kupon Anda
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <PemenangModal
                show={selectedPemenang !== null}
                pemenang={selectedPemenang}
                onClose={() => setSelectedPemenang(null)}
            />
        </AuthenticatedLayout>
    );
}
