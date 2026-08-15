import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";

export default function PemenangModal({ show, onClose, pemenang }) {
    // Jika 'pemenang' masih null, jangan render apa-apa
    if (!pemenang) {
        return null;
    }

    const maskNomorTelepon = (nomor) => {
        // Cek dulu kalau datanya ada atau tidak
        if (!nomor || typeof nomor !== "string" || nomor.length <= 3) {
            return "XXX"; // Tampilkan 'XXX' jika nomor tidak valid
        }
        // Ambil 3 digit terakhir
        const lastThreeDigits = nomor.slice(-3);
        // Ganti semua digit sebelumnya jadi 'x'
        //    (Total panjang string asli, diisi 'x' dari depan)
        return lastThreeDigits.padStart(nomor.length, "x");
    };

    return (
        // Kita pakai maxWidth="md" biar konsisten
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6 text-center">
                {/* Bagian Atas: Hadiah */}
                <div className="mb-4">
                    <p className="text-sm text-gray-500 uppercase">
                        Memenangkan:
                    </p>
                    {/* Tampilkan hadiah dari data dummy */}
                    <p className="text-2xl font-bold text-red-600">
                        {pemenang.hadiah}
                    </p>
                </div>

                {/* Bagian Bawah: Info Pemenang */}
                <div className="bg-gray-50 rounded-lg p-4 my-4 border text-left max-w-sm mx-auto">
                    <p className="text-sm text-gray-500">Nama Pemenang:</p>
                    <p className="text-lg font-semibold text-gray-900 mb-3">
                        {pemenang.nama}
                    </p>

                    <p className="text-sm text-gray-500">Nomor Kupon:</p>
                    <p className="text-lg font-mono font-semibold text-gray-900 mb-3">
                        {pemenang.nomor_kupon}
                    </p>

                    <p className="text-sm text-gray-500">Nomor Telepon:</p>
                    <p className="text-lg font-mono font-semibold text-gray-900">
                        {maskNomorTelepon(pemenang.nomor_telepon)}
                    </p>
                </div>

                {/* Tombol Tutup */}
                <div className="mt-6 flex justify-center">
                    <SecondaryButton onClick={onClose}>Tutup</SecondaryButton>
                </div>
            </div>
        </Modal>
    );
}
