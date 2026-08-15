import { useState, useEffect } from "react";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import Swal from "sweetalert2";

export default function KuponModal({ show, onClose, terakhirInput }) {
    const purchaseTypeOptions = ["Offline", "Online"];

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        kupons: [""],
        email: "",
        full_name: "",
        phone: "",
        address: "",
        purchase_type: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleKuponChange = (index, value) => {
        const updatedKupons = [...data.kupons];
        updatedKupons[index] = value;
        setData("kupons", updatedKupons);
    };

    const addKuponField = () => {
        setData("kupons", [...data.kupons, ""]);
    };

    const removeKuponField = (index) => {
        if (data.kupons.length > 1) {
            const updatedKupons = data.kupons.filter((_, i) => i !== index);
            setData("kupons", updatedKupons);
        }
    };

    const checkKupon = async (index) => {
        const kuponCode = data.kupons[index];

        // Validasi jika kupon kosong
        if (!kuponCode || kuponCode.trim() === "") {
            Swal.fire({
                title: "Oops!",
                text: "Harap isi nomor kupon terlebih dahulu.",
                icon: "warning",
                confirmButtonColor: "#dc2626",
            });
            return;
        }

        try {
            // Tampilkan loading
            Swal.fire({
                title: "Mengecek kupon...",
                text: "Mohon tunggu sebentar",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const response = await axios.get(route("check.coupon", kuponCode));

            // Tutup loading
            Swal.close();

            // Tampilkan hasil
            if (response.data.status) {
                Swal.fire({
                    title: "Kupon Valid!",
                    text:
                        response.data.data.message ||
                        "Kupon ditemukan dan dapat digunakan.",
                    icon: "success",
                    confirmButtonColor: "#10b981",
                });
            } else {
                Swal.fire({
                    title: "Kupon Tidak Valid",
                    text:
                        response.data.data.message || "Kupon tidak ditemukan.",
                    icon: "error",
                    confirmButtonColor: "#dc2626",
                });
            }
        } catch (error) {
            Swal.close();

            // Handle error response
            const errorMessage =
                error.response?.data?.data?.message ||
                error.response?.data?.message ||
                "Terjadi kesalahan saat mengecek kupon.";

            Swal.fire({
                title: "Error",
                text: errorMessage,
                icon: "error",
                confirmButtonColor: "#dc2626",
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Filter out empty coupons
        const kuponsToSubmit = data.kupons.filter(
            (kupon) => kupon.trim() !== ""
        );

        if (kuponsToSubmit.length === 0) {
            Swal.fire({
                title: "Oops!",
                text: "Harap isi setidaknya satu nomor kupon.",
                icon: "warning",
                confirmButtonColor: "#dc2626",
            });
            document.getElementById("kupon-0")?.focus();
            return;
        }

        const submitData = {
            coupon_code: kuponsToSubmit,
            full_name: data.full_name,
            email: data.email,
            address: data.address,
            phone: data.phone,
            buy_platform: data.purchase_type.toLowerCase(),
        };

        axios
            .post(route("coupon.confirm"), submitData)
            .then((response) => {
                const res = response.data;

                // If coupon invalid or already redeemed
                if (res.status === false || res.code === 400) {
                    const msg =
                        res.data?.message ||
                        res.message ||
                        "Kupon tidak valid.";
                    const codeList = Array.isArray(res.data?.data)
                        ? res.data.data.join(", ")
                        : kuponsToSubmit.join(", ");

                    Swal.fire({
                        title: "Kupon Tidak Valid!",
                        html: `
                        <p><strong>Kode Kupon:</strong> ${codeList}</p>
                        <p>${msg}</p>
                    `,
                        icon: "error",
                        confirmButtonColor: "#dc2626",
                    });
                    return;
                }

                // Success popup
                Swal.fire({
                    title: "Sukses!",
                    html: `
                    <p>Kupon Anda telah dicatat.</p>
                    <p><strong>Kode Kupon:</strong> ${kuponsToSubmit.join(
                        ", "
                    )}</p>
                `,
                    icon: "success",
                    confirmButtonText: "Selesai",
                    confirmButtonColor: "#10b981",
                }).then((result) => {
                    if (result.isConfirmed) {
                        handleClose();
                    }
                });
            })
            .catch((error) => {
                Swal.close();
                const errors =
                    error.response?.data?.data || error.response?.data || {};
                handleFormError(errors);
            });
    };

    const handleFormError = (errors) => {
        const errorMessages = Object.values(errors);
        const htmlMessage = `
            <ul style="text-align: left; padding-left: 1.5rem; margin: 0;">
                ${errorMessages.map((msg) => `<li>${msg}</li>`).join("")}
            </ul>
        `;
        Swal.fire({
            title: "Oops! Ada yang Salah",
            html: htmlMessage,
            icon: "error",
            confirmButtonText: "Saya Mengerti",
            confirmButtonColor: "#dc2626",
        });

        const fieldIdMap = {
            kupon: "kupon-0",
            kupons: "kupon-0",
            coupon_code: "kupon-0",
            address: "address_kupon",
            full_name: "full_name_kupon",
            email: "email_kupon",
            phone: "phone_kupon",
            purchase_type: "purchase_type_kupon",
            buy_platform: "purchase_type_kupon",
        };

        const firstErrorKey = Object.keys(errors)[0];
        const elementIdToFocus = fieldIdMap[firstErrorKey];
        document.getElementById(elementIdToFocus)?.focus();
    };

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            reset();
        }, 300);
    };

    return (
        <Modal show={show} onClose={handleClose} maxWidth="md">
            <form
                onSubmit={handleSubmit}
                className="p-6 max-h-[80vh] overflow-y-scroll"
            >
                <h2 className="text-lg font-medium text-gray-900 mb-4 text-center border-b pb-2">
                    Input Kupon Undian
                </h2>
                <div className="space-y-4 pr-2">
                    {data.kupons.map((kuponValue, index) => (
                        <div key={index} className="flex items-end space-x-2">
                            <div className="flex-grow">
                                {index === 0 && (
                                    <InputLabel
                                        htmlFor={`kupon-${index}`}
                                        value="Nomor Kupon Undian"
                                    />
                                )}
                                <TextInput
                                    id={`kupon-${index}`}
                                    value={kuponValue}
                                    onChange={(e) =>
                                        handleKuponChange(index, e.target.value)
                                    }
                                    className={`mt-1 block w-full ${
                                        index > 0 ? "mt-1" : ""
                                    }`}
                                    required
                                    isFocused={index === 0}
                                    placeholder={`Contoh: AWRS2901`}
                                />
                                <InputError
                                    message={errors[`kupons.${index}`]}
                                    className="mt-2"
                                />
                            </div>

                            {/* Tombol Check Kupon */}
                            <SecondaryButton
                                type="button"
                                onClick={() => checkKupon(index)}
                                className="mb-1 h-10 flex-shrink-0"
                                title="Cek validitas kupon"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </SecondaryButton>

                            {/* Tombol Hapus - hanya muncul jika ada > 1 field */}
                            {data.kupons.length > 1 && index > -1 && (
                                <SecondaryButton
                                    type="button"
                                    onClick={() => removeKuponField(index)}
                                    className="mb-1 h-10 flex-shrink-0"
                                    title="Hapus kupon"
                                >
                                    X
                                </SecondaryButton>
                            )}
                        </div>
                    ))}

                    <InputError message={errors.kupons} className="mt-2" />

                    <div className="flex justify-start mt-2">
                        <button
                            type="button"
                            onClick={addKuponField}
                            className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
                        >
                            + Tambah Kupon Lain
                        </button>
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="purchase_type_kupon"
                            value="Jenis Pembelian"
                        />
                        <select
                            id="purchase_type_kupon"
                            value={data.purchase_type}
                            onChange={(e) =>
                                setData("purchase_type", e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            required
                        >
                            <option value="">Pilih Jenis Pembelian</option>
                            {purchaseTypeOptions.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        <InputError
                            message={
                                errors.purchase_type || errors.buy_platform
                            }
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="address_kupon"
                            value="Alamat Lengkap"
                        />
                        <TextInput
                            id="address_kupon"
                            value={data.address}
                            onChange={(e) => setData("address", e.target.value)}
                            className="mt-1 block w-full"
                            required
                            placeholder="Contoh: Jl. Gunung Agung No. 10, Bali"
                        />
                        <InputError message={errors.address} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="full_name_kupon"
                            value="Nama Sesuai KTP"
                        />
                        <TextInput
                            id="full_name_kupon"
                            value={data.full_name}
                            onChange={(e) =>
                                setData("full_name", e.target.value)
                            }
                            className="mt-1 block w-full"
                            required
                            placeholder="Contoh: John Doe"
                        />
                        <InputError
                            message={errors.full_name}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="email_kupon" value="Email" />
                        <TextInput
                            id="email_kupon"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className="mt-1 block w-full"
                            required
                            placeholder="Contoh: Og8M7@example.com"
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="phone_kupon" value="No Whatsapp" />
                        <TextInput
                            id="phone_kupon"
                            type="tel"
                            value={data.phone}
                            onChange={(e) => setData("phone", e.target.value)}
                            className="mt-1 block w-full"
                            required
                            placeholder="Contoh: 08123456789"
                        />
                        <InputError message={errors.phone} className="mt-2" />
                    </div>
                </div>
                <div className="mt-6 text-xs text-center text-gray-500 bg-gray-50 p-3 rounded-lg border">
                    <p>
                        <strong>Catatan:</strong> Kupon yang di-submit setelah
                        hari{" "}
                        <strong className="text-gray-700">
                            {terakhirInput} WITA
                        </strong>
                        , akan diikutkan pada undian minggu berikutnya.
                    </p>
                </div>
                <div className="mt-6 flex justify-end">
                    <PrimaryButton disabled={processing}>
                        Simpan Kupon
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
