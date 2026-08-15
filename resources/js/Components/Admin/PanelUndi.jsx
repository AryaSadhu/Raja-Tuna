import React, { useState, useEffect } from "react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import InputError from "@/Components/InputError";
import axios from "axios";
import Swal from "sweetalert2";
import Checkbox from "@/Components/Checkbox";

export default function PanelUndi({
    activeEvent,
    totalWinnersNeeded,
    sisaPemenang,
}) {
    const [winners, setWinners] = useState([]);
    const [isManual, setIsManual] = useState(true);
    const [couponCode, setCouponCode] = useState("");
    const [couponInfo, setCouponInfo] = useState(null);
    const [couponError, setCouponError] = useState("");
    const [randomAmount, setRandomAmount] = useState(0);
    const [selectedPrizeId, setSelectedPrizeId] = useState("");

    // Helper function to calculate remaining quantity for specific prize
    // FIX: Use strict comparison (===) to avoid type coercion issues
    const calculatePrizeRemaining = (prizeId) => {
        const prize = activeEvent.prizes.find((p) => p.id === Number(prizeId));
        if (!prize) return 0;

        // Count how many winners in current session selected this specific prize
        const countInSession = winners.filter(
            (w) => Number(w.selected_prize_id) === Number(prizeId)
        ).length;

        // Remaining = (Original remaining from DB) - (Count in current session)
        return Math.max(0, prize.remaining_qty - countInSession);
    };

    // Calculate real-time remaining slots
    const currentWinnersCount = winners.length;
    const realTimeRemaining = Math.max(0, sisaPemenang - currentWinnersCount);

    // Update default input random setiap kali sisa berubah atau prize dipilih
    useEffect(() => {
        if (selectedPrizeId) {
            const prizeRemaining = calculatePrizeRemaining(selectedPrizeId);
            setRandomAmount(prizeRemaining);
        } else {
            setRandomAmount(realTimeRemaining);
        }
    }, [realTimeRemaining, selectedPrizeId, winners]);

    const handleModeChange = (mode) => {
        if (mode === "manual") setIsManual(true);
        else setIsManual(false);

        setCouponCode("");
        setCouponInfo(null);
    };

    const handleCheckCoupon = (e) => {
        e.preventDefault();
        setCouponError("");
        setCouponInfo(null);

        if (!couponCode) return;

        // Validasi: Cek duplikasi di list lokal
        if (winners.some((w) => w.coupon_code === couponCode)) {
            Swal.fire("Gagal", "Kupon ini barusan Anda masukkan.", "warning");
            return;
        }

        Swal.fire({
            title: "Memeriksa Kupon...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        axios
            .get(route("admin.coupon.check", { coupon: couponCode }))
            .then((res) => {
                Swal.close();
                if (res.data.code === 200) {
                    setCouponInfo(res.data.data[0]);
                    Swal.fire({
                        icon: "success",
                        title: "Ditemukan!",
                        text: `Pemilik: ${res.data.data[0].full_name}`,
                        timer: 1000,
                        showConfirmButton: false,
                    });
                } else {
                    setCouponError(res.data.message);
                    Swal.fire("Gagal", res.data.message, "error");
                }
            })
            .catch((err) => {
                Swal.close();
                const msg =
                    err.response?.data?.message || "Kupon tidak ditemukan";
                setCouponError(msg);
                Swal.fire("Error", msg, "error");
            });
    };

    const addManualWinner = () => {
        if (!selectedPrizeId) {
            Swal.fire("Oops!", "Pilih hadiahnya dulu.", "warning");
            return;
        }
        // Validasi Slot Penuh (Berdasarkan sisa real-time)
        if (realTimeRemaining <= 0) {
            Swal.fire(
                "Penuh!",
                "Kuota pemenang sudah habis untuk saat ini. Simpan dulu jika ingin melanjutkan.",
                "warning"
            );
            return;
        }

        // Check if specific prize still has quota
        const prizeRemaining = calculatePrizeRemaining(selectedPrizeId);
        if (prizeRemaining <= 0) {
            Swal.fire("Habis!", "Hadiah ini sudah habis kuotanya.", "warning");
            return;
        }

        // FIX: Use strict comparison to find the correct prize
        const selectedPrize = activeEvent.prizes.find(
            (p) => p.id === Number(selectedPrizeId)
        );

        const newWinner = {
            full_name: couponInfo.full_name,
            coupon_code: couponCode,
            prize_type: selectedPrize.prize_types_id,
            prize_name: selectedPrize.prize_name,
            selected_prize_id: Number(selectedPrizeId), // FIX: Store as number
            mode_type: 1, // Manual = 1
        };
        setWinners([...winners, newWinner]);
        setCouponCode("");
        setCouponInfo(null);
    };

    const handleGenerateRandom = () => {
        if (!selectedPrizeId) {
            Swal.fire("Oops!", "Pilih hadiahnya dulu.", "warning");
            return;
        }
        if (randomAmount <= 0) {
            Swal.fire("Eits!", "Jumlah harus lebih dari 0.", "warning");
            return;
        }
        // Validasi tidak boleh melebihi sisa kuota real-time
        if (randomAmount > realTimeRemaining) {
            Swal.fire(
                "Kelebihan!",
                `Sisa kuota tinggal ${realTimeRemaining}.`,
                "warning"
            );
            return;
        }

        // Check if specific prize has enough quota
        const prizeRemaining = calculatePrizeRemaining(selectedPrizeId);
        if (randomAmount > prizeRemaining) {
            Swal.fire(
                "Kelebihan!",
                `Hadiah ini hanya tersisa ${prizeRemaining}.`,
                "warning"
            );
            return;
        }

        Swal.fire({ title: "Mengundi...", didOpen: () => Swal.showLoading() });

        // FIX: Use strict comparison to find the correct prize
        const selectedPrize = activeEvent.prizes.find(
            (p) => p.id === Number(selectedPrizeId)
        );

        axios
            .get(
                route("admin.draw", {
                    event_id: activeEvent.id,
                    num: randomAmount,
                })
            )
            .then((res) => {
                Swal.close();
                const randomWinners = res.data.data;

                // Create winners with explicit mode_type = 0 for random
                const formattedWinners = randomWinners.map((w) => ({
                    full_name: w.full_name,
                    coupon_code: w.coupon_code,
                    prize_type: selectedPrize.prize_types_id,
                    prize_name: selectedPrize.prize_name,
                    selected_prize_id: Number(selectedPrizeId), // FIX: Store as number
                    mode_type: 0, // Random = 0
                }));

                setWinners((prev) => [...prev, ...formattedWinners]);
                Swal.fire(
                    "Sukses",
                    `${randomWinners.length} pemenang ditambahkan.`,
                    "success"
                );
            })
            .catch((err) => {
                Swal.close();
                const errorMessage =
                    err.response?.data?.message ||
                    err.message ||
                    "Gagal mengundi random.";
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: errorMessage,
                });
            });
    };

    const removeWinner = (index) => {
        setWinners(winners.filter((_, i) => i !== index));
    };

    const handleStoreWinners = () => {
        if (winners.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Belum ada pemenang baru yang dipilih",
            });
            return;
        }

        const payload = {
            events_id: activeEvent.id,
            winners: winners.map((w) => ({
                coupon_code: w.coupon_code,
                prize_types_id: w.prize_type,
                prizes_id: Number(w.selected_prize_id), // FIX: Ensure it's a number
                mode_type: w.mode_type,
            })),
        };

        console.log("Sending payload:", payload); // For debugging

        Swal.fire({
            title: `Simpan ${winners.length} Pemenang?`,
            text: "Data akan disimpan ke database dan tidak bisa diubah lagi.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, Simpan",
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return axios
                    .post(route("admin.winners.store"), payload)
                    .then((res) => {
                        if (res.data.code === 200) {
                            return res.data;
                        } else {
                            throw new Error(
                                res.data.message || "Gagal menyimpan pemenang"
                            );
                        }
                    })
                    .catch((error) => {
                        let errorMessage = "Terjadi kesalahan";

                        if (error.response) {
                            if (
                                error.response.data &&
                                error.response.data.message
                            ) {
                                errorMessage = error.response.data.message;
                            } else if (
                                error.response.data &&
                                error.response.data.data
                            ) {
                                const errors = error.response.data.data;
                                if (typeof errors === "object") {
                                    errorMessage = Object.values(errors)
                                        .flat()
                                        .join(", ");
                                } else {
                                    errorMessage = errors;
                                }
                            }
                        } else if (error.request) {
                            errorMessage = "Tidak ada respon dari server";
                        } else {
                            errorMessage = error.message;
                        }

                        Swal.showValidationMessage(errorMessage);
                        return false;
                    });
            },
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: `${winners.length} pemenang berhasil disimpan.`,
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => {
                    setWinners([]);
                    setCouponCode("");
                    setCouponInfo(null);
                    setRandomAmount(realTimeRemaining);
                    window.location.reload();
                });
            }
        });
    };

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                    Panel Undi Pemenang
                </h3>
                <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                        realTimeRemaining === 0
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                    }`}
                >
                    Sisa Slot: {realTimeRemaining} / {totalWinnersNeeded}
                </span>
            </div>

            {/* Pilih Hadiah */}
            <div className="mb-6">
                <InputLabel value="1. Pilih Hadiah" />
                <select
                    className="w-full mt-1 rounded-md border-gray-300"
                    value={selectedPrizeId}
                    onChange={(e) => setSelectedPrizeId(e.target.value)}
                >
                    <option value="">-- Pilih Hadiah --</option>
                    {activeEvent.prizes.map((p) => {
                        const realTimePrizeRemaining = calculatePrizeRemaining(
                            p.id
                        );
                        return (
                            <option
                                key={p.id}
                                value={p.id}
                                disabled={realTimePrizeRemaining <= 0}
                            >
                                {p.prize_name} (Sisa: {realTimePrizeRemaining})
                            </option>
                        );
                    })}
                </select>
            </div>

            {/* Mode Checkbox */}
            <div className="flex gap-6 mb-4">
                <label className="flex items-center cursor-pointer select-none">
                    <Checkbox
                        checked={isManual}
                        onChange={() => handleModeChange("manual")}
                    />
                    <span className="ml-2 text-gray-700 font-semibold">
                        Mode Manual
                    </span>
                </label>
                <label className="flex items-center cursor-pointer select-none">
                    <Checkbox
                        checked={!isManual}
                        onChange={() => handleModeChange("random")}
                    />
                    <span className="ml-2 text-gray-700 font-semibold">
                        Mode Random
                    </span>
                </label>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                {/* UI MANUAL */}
                {isManual && (
                    <div className="space-y-4">
                        <div>
                            <InputLabel value="Cari Kupon" />
                            <div className="flex mt-1">
                                <TextInput
                                    value={couponCode}
                                    onChange={(e) =>
                                        setCouponCode(e.target.value)
                                    }
                                    className="flex-grow rounded-l-md"
                                    placeholder="Masukkan kode kupon..."
                                />
                                <SecondaryButton
                                    onClick={handleCheckCoupon}
                                    className="rounded-l-none"
                                >
                                    Cek
                                </SecondaryButton>
                            </div>
                            {couponError && (
                                <InputError
                                    message={couponError}
                                    className="mt-1"
                                />
                            )}
                        </div>
                        {couponInfo && (
                            <div className="mt-2 p-3 bg-white border border-green-300 rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-gray-800">
                                        {couponInfo.full_name}
                                    </p>
                                    <p className="text-xs text-gray-500 font-mono">
                                        {couponCode}
                                    </p>
                                </div>
                                <PrimaryButton
                                    onClick={addManualWinner}
                                    className="text-xs"
                                    disabled={
                                        realTimeRemaining <= 0 ||
                                        (selectedPrizeId &&
                                            calculatePrizeRemaining(
                                                selectedPrizeId
                                            ) <= 0)
                                    }
                                >
                                    + Tambah
                                </PrimaryButton>
                            </div>
                        )}
                    </div>
                )}

                {/* UI RANDOM */}
                {!isManual && (
                    <div className="space-y-4">
                        <div className="flex items-end gap-2">
                            <div className="flex-grow">
                                <InputLabel
                                    value={`Jumlah (Max: ${
                                        selectedPrizeId
                                            ? calculatePrizeRemaining(
                                                  selectedPrizeId
                                              )
                                            : realTimeRemaining
                                    })`}
                                />
                                <TextInput
                                    type="number"
                                    value={randomAmount}
                                    onChange={(e) =>
                                        setRandomAmount(e.target.value)
                                    }
                                    className="w-full mt-1"
                                    min="1"
                                    max={
                                        selectedPrizeId
                                            ? calculatePrizeRemaining(
                                                  selectedPrizeId
                                              )
                                            : realTimeRemaining
                                    }
                                />
                            </div>
                            <PrimaryButton
                                onClick={handleGenerateRandom}
                                disabled={
                                    !selectedPrizeId ||
                                    realTimeRemaining <= 0 ||
                                    (selectedPrizeId &&
                                        calculatePrizeRemaining(
                                            selectedPrizeId
                                        ) <= 0)
                                }
                            >
                                Generate
                            </PrimaryButton>
                        </div>
                    </div>
                )}
            </div>

            {/* Preview Pemenang Baru */}
            {winners.length > 0 && (
                <div className="mt-6">
                    <h4 className="text-sm font-bold text-gray-700 mb-2">
                        Pemenang Baru (Belum Disimpan):
                    </h4>
                    <ul className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-yellow-50">
                        {winners.map((w, i) => (
                            <li
                                key={i}
                                className="flex justify-between items-center p-2 bg-white border rounded shadow-sm text-sm"
                            >
                                <div>
                                    <span className="font-bold block text-gray-800">
                                        {w.full_name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {w.coupon_code} • {w.prize_name} •{" "}
                                        {w.mode_type === 1
                                            ? "Manual"
                                            : "Random"}
                                    </span>
                                </div>
                                <button
                                    onClick={() => removeWinner(i)}
                                    className="text-red-500 font-bold px-2"
                                >
                                    &times;
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Footer */}
            <div className="mt-6 border-t pt-4">
                <PrimaryButton
                    onClick={handleStoreWinners}
                    className="w-full justify-center bg-green-600 hover:bg-green-700"
                    disabled={winners.length === 0}
                >
                    Simpan {winners.length} Pemenang ke Database
                </PrimaryButton>
                {realTimeRemaining === 0 && winners.length === 0 && (
                    <p className="text-center text-green-600 font-bold mt-2">
                        Semua kuota pemenang sudah terisi!
                    </p>
                )}
            </div>
        </div>
    );
}