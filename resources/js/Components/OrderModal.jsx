import { useState, useEffect } from "react";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { useForm } from "@inertiajs/react";
import axios from "axios";

export default function OrderModal({ show, onClose, quantity }) {
    // State untuk data provinsi, kota, kecamatan, dan kurir
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [couriers, setCouriers] = useState([]);

    const [selectedOngkir, setSelectedOngkir] = useState(0);
    const [step, setStep] = useState("form");

    // Kalkulasi Harga & Kupon
    const hargaPerPaket = 50000;
    const totalHargaProduk = hargaPerPaket * quantity;
    const totalTermasukOngkir = totalHargaProduk + selectedOngkir;
    const kuponUndian = Math.floor(quantity / 2);

    // Form dengan useForm Inertia
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        full_name: "",
        phone: "",
        email: "",
        province_id: "",
        province: "",
        district_id: "",
        district: "",
        city_id: "",
        city: "",
        address: "",
        quantity: quantity,
        total_harga: 0,
        kurir: "",
        courier_code: "",
        courier_service: "",
    });

    // Update quantity di form jika prop quantity berubah
    useEffect(() => {
        setData("quantity", quantity);
    }, [quantity]);

    // Update total_harga di form saat ongkir berubah
    useEffect(() => {
        setData("total_harga", totalTermasukOngkir);
    }, [totalTermasukOngkir]);

    // Fungsi saat form disubmit
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Kita pakai axios karena backend return JSON
        try {
            // GANTI 'form' JADI 'data'
            const res = await axios.post(route("order.store.popup"), data);

            // res.data sekarang berisi: { status: 200, message: 'success', data: { grand_total: ... } }
            console.log("Respon dari Backend:", res.data);

            // Opsional: Kamu bisa ambil grand_total dari sini jika perlu
            // const backendTotal = res.data.data.grand_total;

            setStep("paymentInfo"); // Pindah ke tampilan pembayaran
            reset();
        } catch (err) {
            // Ini akan nangkep error validasi dari backend (yang status 400)
            if (err.response && err.response.status === 400) {
                console.error("Error Validasi:", err.response.data.data[0]);
                // Di sini kamu bisa nampilin error validasinya ke user
                // Misalnya: alert(err.response.data.data[0].full_name[0]);
            } else {
                console.error("Error Submit Form:", err);
            }
        }
    };

    // Fungsi untuk menutup modal dan mereset state
    const handleClose = () => {
        onClose();
        setTimeout(() => {
            reset();
            setStep("form");
            setCities([]);
            setDistricts([]);
            setCouriers([]);
            setSelectedOngkir(0);
        }, 300);
    };

    // Fungsi format Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    // Fetch provinces saat component mount
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await axios.get(route("province.get"));
                console.log("Province response:", res);
                setProvinces(res.data.data.data);
            } catch (err) {
                console.error("Failed to load provinces:", err);
            }
        };

        fetchProvinces();
    }, []);

    // Handle province change - simpan ID dan nama
    const handleProvinceChange = async (e) => {
        const provinceId = e.target.value;

        // Simpan ID ke province_id
        setData("province_id", provinceId);

        // Cari dan simpan NAMA ke province
        const selectedProvince = provinces.find((p) => p.id == provinceId);
        setData("province", selectedProvince ? selectedProvince.name : "");

        // Reset semua field di bawahnya
        setCities([]);
        setDistricts([]);
        setCouriers([]);
        setData("district_id", "");
        setData("district", "");
        setData("city_id", "");
        setData("city", "");
        setData("kurir", "");
        setData("courier_code", "");
        setData("courier_service", "");
        setSelectedOngkir(0);

        console.log(
            "FRONTEND: Meminta data kota untuk Province ID:",
            provinceId
        );

        // Jika province dipilih, fetch cities
        if (provinceId) {
            try {
                const res = await axios.get(
                    route("city.get", { province_id: provinceId })
                );
                console.log("City response:", res.data);
                if (
                    res.data &&
                    res.data.data &&
                    Array.isArray(res.data.data.data)
                ) {
                    setCities(res.data.data.data);
                } else {
                    console.error("Unexpected city data format:", res.data);
                    setCities([]);
                }
            } catch (err) {
                console.error("Failed to load cities:", err);
                setCities([]);
            }
        }
    };

    // Handle city change - simpan ID dan nama
    const handleCityChange = async (e) => {
        const cityId = e.target.value;
        console.log("Selected City ID:", cityId);

        // Simpan ID ke district_id
        setData("district_id", cityId);

        // Cari dan simpan NAMA ke district
        const selectedCity = cities.find((c) => c.id == cityId);
        setData("district", selectedCity ? selectedCity.name : "");

        // Reset kecamatan & kurir
        setData("city_id", "");
        setData("city", "");
        setDistricts([]);
        setCouriers([]);
        setData("kurir", "");
        setSelectedOngkir(0);

        if (cityId) {
            // Fetch data kecamatan berdasarkan cityId
            try {
                const res = await axios.get(
                    route("district.get", { city_id: cityId })
                );
                console.log("District response:", res.data);
                if (
                    res.data &&
                    res.data.data &&
                    Array.isArray(res.data.data.data)
                ) {
                    setDistricts(res.data.data.data);
                } else {
                    console.error("Unexpected district data format:", res.data);
                    setDistricts([]);
                }
            } catch (err) {
                console.error("Failed to load districts:", err);
                setDistricts([]);
            }
        }
    };

    // Handle district change - simpan ID dan nama
    const handleDistrictChange = async (e) => {
        const districtId = e.target.value;
        console.log("Selected District ID:", districtId);

        // Simpan ID ke city_id
        setData("city_id", districtId);

        // Cari dan simpan NAMA ke city
        const selectedDistrict = districts.find((d) => d.id == districtId);
        setData("city", selectedDistrict ? selectedDistrict.name : "");

        // Reset kurir
        setData("kurir", "");
        setSelectedOngkir(0);
        setCouriers([]);

        if (districtId) {
            // Fetch data kurir/ongkir berdasarkan districtId
            try {
                const res = await axios.get(
                    route("cost.get", { district_id: districtId })
                );
                console.log("Courier/Cost response:", res.data);
                if (
                    res.data &&
                    res.data.data &&
                    Array.isArray(res.data.data.data)
                ) {
                    setCouriers(res.data.data.data);
                } else {
                    console.error("Unexpected courier data format:", res.data);
                    setCouriers([]);
                }
            } catch (err) {
                console.error("Failed to load couriers:", err);
                setCouriers([]);
            }
        }
    };

    const handleCourierChange = (e) => {
        const uniqueValue = e.target.value;
        setData("kurir", uniqueValue);

        if (!uniqueValue) {
            setSelectedOngkir(0);
            setData("courier_code", "");
            setData("courier_service", "");
            return;
        }

        const selected = couriers.find(
            (c) => `${c.code}-${c.service}` == uniqueValue
        );

        if (selected && typeof selected.cost === "number") {
            setSelectedOngkir(selected.cost);
            setData("courier_code", selected.code);
            setData("courier_service", selected.service);
        } else {
            console.error("Courier cost not found or invalid:", selected);
            setSelectedOngkir(0);
            setData("courier_code", "");
            setData("courier_service", "");
        }
    };

    return (
        <Modal show={show} onClose={handleClose} maxWidth="md">
            {step === "form" ? (
                // --- Tampilan 1: Form Order ---
                <form
                    onSubmit={handleFormSubmit}
                    className="p-6 max-h-[80vh] overflow-y-scroll"
                >
                    <h2 className="text-lg font-medium text-gray-900 mb-4 text-center border-b pb-2">
                        Form Order
                    </h2>

                    {/* Info Produk */}
                    <div className="mb-4 p-3 bg-gray-50 rounded border text-sm">
                        <p className="font-semibold">
                            Paket Kerupuk Kulit Tuna
                        </p>
                        <p>Harga @paket: {formatRupiah(hargaPerPaket)}</p>
                        <div className="flex justify-between mt-1">
                            <span>
                                Qty: <strong>{quantity}</strong>
                            </span>
                            <span>
                                Total Produk:{" "}
                                <strong>
                                    {formatRupiah(totalHargaProduk)}
                                </strong>
                            </span>
                        </div>
                    </div>

                    {/* Input Fields */}
                    <div className="space-y-3 pr-2">
                        <div>
                            <InputLabel htmlFor="province" value="Province" />
                            <select
                                id="province"
                                value={data.province_id}
                                onChange={handleProvinceChange}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                required
                            >
                                <option value="">Pilih Province</option>
                                {provinces.map((prov) => (
                                    <option key={prov.id} value={prov.id}>
                                        {prov.name}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.province_id}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="district"
                                value="District/City"
                            />
                            <select
                                id="district"
                                key={data.province_id}
                                value={data.district_id}
                                onChange={handleCityChange}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                required
                                disabled={cities.length === 0}
                            >
                                <option value="">
                                    {provinces.length === 0
                                        ? "Loading..."
                                        : cities.length === 0
                                        ? "Pilih Province Dulu"
                                        : "Pilih District/City"}
                                </option>
                                {cities.map((city) => (
                                    <option key={city.id} value={city.id}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.district_id}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="city" value="Kecamatan" />
                            <select
                                id="city"
                                key={data.district_id}
                                value={data.city_id}
                                onChange={handleDistrictChange}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                required
                                disabled={districts.length === 0}
                            >
                                <option value="">
                                    {districts.length === 0
                                        ? "Pilih District Dulu"
                                        : "Pilih Kecamatan"}
                                </option>
                                {districts.map((district) => (
                                    <option
                                        key={district.id}
                                        value={district.id}
                                    >
                                        {district.name}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.city_id}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="address"
                                value="Alamat Lengkap"
                            />
                            <TextInput
                                id="address"
                                value={data.address}
                                onChange={(e) =>
                                    setData("address", e.target.value)
                                }
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError
                                message={errors.address}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="kurir" value="Pilih Kurir" />
                            <select
                                id="kurir"
                                value={data.kurir}
                                onChange={handleCourierChange}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                required
                                disabled={couriers.length === 0}
                            >
                                <option value="">
                                    {couriers.length === 0
                                        ? "Pilih Kecamatan Dulu"
                                        : "Pilih Kurir"}
                                </option>
                                {couriers.map((courier) => {
                                    const uniqueKey = `${courier.code}-${courier.service}`;
                                    return (
                                        <option
                                            key={uniqueKey}
                                            value={uniqueKey}
                                        >
                                            {courier.name} ({courier.service}) -{" "}
                                            {formatRupiah(courier.cost)}
                                        </option>
                                    );
                                })}
                            </select>
                            <InputError
                                message={errors.kurir}
                                className="mt-2"
                            />
                        </div>

                        <hr className="my-4" />

                        <div>
                            <InputLabel
                                htmlFor="full_name"
                                value="Nama Sesuai KTP"
                            />
                            <TextInput
                                id="full_name"
                                value={data.full_name}
                                onChange={(e) =>
                                    setData("full_name", e.target.value)
                                }
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError
                                message={errors.full_name}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="phone" value="No Whatsapp" />
                            <TextInput
                                id="phone"
                                type="tel"
                                value={data.phone}
                                onChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                                className="mt-1 block w-full"
                                required
                                placeholder="Contoh: 08123456789"
                            />
                            <InputError
                                message={errors.phone}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="email"
                                value="Email Aktif (Untuk Kupon)"
                            />
                            <TextInput
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    {/* Info Total Akhir & Kupon */}
                    <div className="mt-6 pt-4 border-t text-sm">
                        <p className="flex justify-between">
                            <span>Ongkos Kirim (Estimasi):</span>{" "}
                            <span>{formatRupiah(selectedOngkir)}</span>
                        </p>
                        <p className="flex justify-between font-bold text-lg mt-2">
                            <span>Total Termasuk Ongkir:</span>{" "}
                            <span>{formatRupiah(totalTermasukOngkir)}</span>
                        </p>
                        <p className="flex justify-between text-green-600 mt-1">
                            <span>Free Kupon Undian:</span>{" "}
                            <span>{kuponUndian} Kupon</span>
                        </p>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <PrimaryButton disabled={processing}>
                            Proses
                        </PrimaryButton>
                    </div>
                </form>
            ) : (
                // --- Tampilan 2: Info Pembayaran ---
                <div className="p-6 text-center">
                    <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">
                        Pembayaran
                    </h2>
                    <p className="mb-2">
                        Silahkan Melakukan pembayaran Sejumlah:
                    </p>
                    <p className="text-3xl font-bold text-red-600 mb-4">
                        {formatRupiah(totalTermasukOngkir)}
                    </p>

                    <div className="bg-gray-50 rounded-lg p-4 my-4 border text-left max-w-xs mx-auto text-sm">
                        <p className="mb-1 font-semibold">Rekening Tujuan:</p>
                        <p className="">Bank BCA</p>
                        <p className="font-mono tracking-wider">1234 5678 99</p>
                        <p className="">A/N: PT Apa Saja Bisa</p>
                    </div>

                    <p className="text-xs text-gray-500 mt-4 px-4">
                        Lakukan pengecekan email apabila telah melakukan
                        pembayaran. Informasi **nomor Kupon** akan dikirim
                        melalui email yang terdaftar. Status pesanan dapat dicek
                        di halaman **Lacak**.
                    </p>

                    <div className="mt-6 flex justify-center">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
}
