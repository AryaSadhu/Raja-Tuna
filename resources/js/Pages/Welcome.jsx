import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// import OrderModal from "@/Components/OrderModal";
import KuponModal from "@/Components/KuponModal";

export default function Welcome({ auth, terakhirInput }) {
    const [showKuponModal, setShowKuponModal] = useState(false);

    // const [quantity, setQuantity] = useState(1);
    // // 2. Tambahkan state baru untuk mengontrol kapan modal muncul
    // const [showOrderModal, setShowOrderModal] = useState(false);

    // // ... (fungsi handleQuantityChange, increment, decrement tidak berubah)
    // const handleQuantityChange = (e) => {
    //     const value = parseInt(e.target.value, 10);
    //     setQuantity(isNaN(value) || value < 1 ? 1 : value);
    // };
    // const incrementQuantity = () => setQuantity((q) => q + 1);
    // const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

    // const handleBeliSekarang = () => {
    //     // 3. DIUBAH: Fungsi ini sekarang hanya membuka modal
    //     setShowOrderModal(true);
    // };

    // // 4. Tambahkan fungsi untuk menutup modal
    // const closeModal = () => {
    //     setShowOrderModal(false);
    //     setQuantity(1);
    // };

    const closeKuponModal = () => {
        setShowKuponModal(false);
    };

    const bannerImages = [
       "/images/productImage1.jpeg",
       "/images/productImage2.jpeg",
    ];

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Raja Tuna 𓆝 𓆟 𓆞 𓆝 𓆟" />
            <div className="relative">
                <Swiper
                    modules={[Navigation, Autoplay, Pagination]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    loop={true}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    className="w-full h-[32rem]"
                >
                    {bannerImages.map((image, index) => (
                        <SwiperSlide
                            key={index}
                            className="relative bg-black overflow-hidden"
                        >
                            <div
                                style={{ backgroundImage: `url(${image})` }}
                                className="absolute inset-0 w-full h-full bg-cover bg-center filter blur-xl scale-110"
                            ></div>
                            <div className="absolute inset-0 bg-black opacity-40"></div>
                            <img
                                src={image}
                                alt={`Banner ${index + 1}`}
                                className="relative w-full h-full object-contain"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* <div className="max-w-4xl mx-auto py-16 px-4">
                <div className="max-w-4xl mx-auto py-16 px-4"> */}
                    {/* <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
                        Kerupuk Tuna Premium
                    </h2> */}
                    {/* <div className="text-gray-700 text-base sm:text-lg leading-relaxed space-y-4 text-center"> */}
                        {/* Teks diganti dengan copy baru */}
                        {/* <p>
                            Rasakan sensasi gurih dan renyah tak tertandingi
                            dari Kerupuk Tuna Premium kami. Dibuat dari 100%
                            daging ikan tuna segar pilihan, setiap gigitan
                            memberikan cita rasa laut yang otentik dan kaya
                            protein. Kami berkomitmen menyajikan camilan
                            berkualitas tinggi, diolah secara higienis tanpa
                            tambahan bahan pengawet buatan.
                        </p> */}
                        {/* <p className="font-medium">
                            Sempurna untuk menjadi teman setia hidangan utama
                            Anda, mulai dari nasi goreng, soto, hingga bakso,
                            atau dinikmati langsung sebagai camilan premium saat
                            santai. Jangan lupa masukkan
                            <strong className="text-gray-900">
                                {" "}
                                kode kupon spesial
                            </strong>{" "}
                            Anda di bawah ini!
                        </p> */}
                    {/* </div>
                </div>
            </div> */}

            {/* <div className="max-w-7xl mx-auto py-16 px-4">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                    Pesan Krupuk Tuna Sekarang!
                </h2>
                <div className="max-w-md mx-auto flex flex-col items-center space-y-4">
                    {/* ... (bagian quantity selector tidak berubah) ... */}
            {/* <div className="flex items-center justify-center space-x-4">
                        <button
                            onClick={decrementQuantity}
                            className="w-10 h-10 bg-gray-200 text-gray-800 font-bold rounded-full text-lg hover:bg-gray-300 transition"
                        >
                            -
                        </button>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={quantity}
                            onChange={handleQuantityChange}
                            className="text-2xl font-bold w-24 text-center border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        />
                        <button
                            onClick={incrementQuantity}
                            className="w-10 h-10 bg-gray-200 text-gray-800 font-bold rounded-full text-lg hover:bg-gray-300 transition"
                        >
                            +
                        </button>
                    </div>

                    <button
                        onClick={handleBeliSekarang} // 5. Tombol ini sekarang memanggil fungsi untuk buka modal
                        className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
                    >
                        Order Sekarang {/* Ganti teks tombol sesuai PDF */}
            {/* </button>
                </div>
            </div> */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                        Punya Kupon Undian?
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                        Sudah punya kode kupon dari pembelian sebelumnya?
                        Masukkan di sini untuk kami data.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={() => setShowKuponModal(true)}
                            className="px-8 py-3 bg-white text-red-600 font-bold rounded-lg shadow-md border-2 border-red-600 hover:bg-red-600 hover:text-white transition duration-300 w-full sm:w-auto"
                        >
                            Input Kode Kupon Anda
                        </button>

                        <Link
                            // 'route('undian')' ini otomatis
                            // akan ngarah ke subdomain
                            href={route("undian")}
                            className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md border-2 border-red-600 hover:bg-white hover:text-red-700 transition duration-300 w-full sm:w-auto"
                        >
                            Lihat Pemenang Undian
                        </Link>
                        {/* --- AKHIR TOMBOL BARU --- */}
                    </div>
                </div>
            </div>
            {/* 6. Panggil komponen modal di sini */}
            {/* Berikan state dan fungsi yang dibutuhkan sebagai props */}
            {/* <OrderModal
                show={showOrderModal}
                onClose={closeModal}
                quantity={quantity}
            /> */}
            <KuponModal
                show={showKuponModal}
                onClose={closeKuponModal}
                terakhirInput={terakhirInput}
            />
        </AuthenticatedLayout>
    );
}
