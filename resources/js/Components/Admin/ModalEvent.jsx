import React, { useEffect, useState } from "react";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import Swal from "sweetalert2";

// ---------------------------
//  Prize Row Component
// ---------------------------
function PrizeRow({ index, prize, prizeTypes, onChange, onRemove }) {
    return (
        <div className="flex items-center gap-3 mt-3">
            {/* Prize Name */}
            <div className="flex-1">
                <TextInput
                    className="w-full"
                    placeholder="Nama hadiah"
                    value={prize.prize_name}
                    onChange={(e) =>
                        onChange(index, "prize_name", e.target.value)
                    }
                    required
                />
            </div>

            {/* Prize Type Dropdown */}
            <div className="w-56">
                <select
                    className="border rounded px-2 py-2 w-full"
                    value={prize.prize_type}
                    onChange={(e) =>
                        onChange(index, "prize_type", parseInt(e.target.value))
                    }
                >
                    {prizeTypes.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Quantity */}
            <div className="w-24">
                <TextInput
                    type="number"
                    min="1"
                    className="w-full"
                    value={prize.qty}
                    onChange={(e) => onChange(index, "qty", e.target.value)}
                    required
                />
            </div>

            {/* Remove Button */}
            {onRemove && (
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 transition"
                >
                    X
                </button>
            )}
        </div>
    );
}

// ---------------------------
//  MAIN MODAL COMPONENT
// ---------------------------
export default function ModalEvent({
    show,
    onClose,
    eventData,
    prizeTypes = [],
    undianTitle
}) {
    const isEditMode = eventData !== null;

    // MAIN form data
    const { data, setData, errors, reset } = useForm({
        id: eventData?.id || null,
        title: eventData?.title || undianTitle,
        start_date: eventData?.start_date
            ? eventData.start_date.substring(0, 16)
            : "",
        last_buy_date: eventData?.last_buy_date
            ? eventData.last_buy_date.substring(0, 16)
            : "",
    });

    // ---------------------------
    // PRIZES STATE
    // ---------------------------
    const [prizes, setPrizes] = useState([
        { prize_name: "", prize_type: prizeTypes[0]?.id || 1, qty: 1 },
    ]);

    useEffect(() => {
        if (isEditMode) {
            setData({
                id: eventData.id,
                title: eventData.title,
                start_date: eventData.start_date.substring(0, 16),
                last_buy_date: eventData.last_buy_date.substring(0, 16),
            });

            const formatted = eventData.prizes.map((p) => ({
                prize_name: p.prize_name,
                prize_type: p.prize_types_id,
                qty: p.qty,
            }));

            setPrizes(formatted);
        }
    }, [eventData, show]);

    // ---------------------------
    // DYNAMIC PRIZE HANDLERS
    // ---------------------------
    const handlePrizeChange = (index, field, value) => {
        const updated = [...prizes];
        updated[index][field] = value;
        setPrizes(updated);
    };

    const addPrize = () => {
        setPrizes([
            ...prizes,
            { prize_name: "", prize_type: prizeTypes[0]?.id || 1, qty: 1 },
        ]);
    };

    const removePrize = (index) => {
        if (prizes.length > 1) {
            setPrizes(prizes.filter((_, i) => i !== index));
        }
    };

    // Auto calc total_winners
    const totalWinners = prizes.reduce(
        (sum, p) => sum + parseInt(p.qty || 0),
        0
    );

    // ---------------------------
    // SUBMIT HANDLER
    // ---------------------------
    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            id: isEditMode ? data.id : undefined,
            title: data.title,
            start_date: data.start_date.replace("T", " ") + ":00",
            last_buy_date: data.last_buy_date.replace("T", " ") + ":00",
            total_winners: totalWinners,
            prizes: prizes,
        };

        const url = isEditMode
            ? route("admin.update-event")
            : route("admin.create-event");

        axios
            .post(url, payload)
            .then(() => {
                Swal.fire("Sukses!", "Event berhasil disimpan.", "success");
                onClose();
                window.location.reload();
            })
            .catch((err) => {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err?.response?.data?.message || "Terjadi kesalahan",
                });
            });
    };

    // ---------------------------
    // RENDER
    // ---------------------------
    return (
        <Modal show={show} onClose={onClose} maxWidth="4xl">
            <form onSubmit={handleSubmit} className="p-8">
                <h2 className="text-2xl font-bold mb-6">
                    {isEditMode ? "Edit Event" : "Buat Event Baru"}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* LEFT SIDE */}
                    <div className="space-y-6">
                        <div>
                            <InputLabel value="Judul Event" />
                            <TextInput
                                className="w-full mt-1"
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                            />
                            <InputError message={errors.title} />
                        </div>

                        <div>
                            <InputLabel value="Mulai Undian" />
                            <TextInput
                                type="datetime-local"
                                className="w-full mt-1"
                                value={data.start_date}
                                onChange={(e) =>
                                    setData("start_date", e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <InputLabel value="Batas Akhir Input Kupon" />
                            <TextInput
                                type="datetime-local"
                                className="w-full mt-1"
                                value={data.last_buy_date}
                                onChange={(e) =>
                                    setData("last_buy_date", e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <InputLabel value="Total Pemenang" />
                            <TextInput
                                readOnly
                                className="w-full bg-gray-100 mt-1"
                                value={totalWinners}
                            />
                        </div>
                    </div>

                    {/* RIGHT SIDE — PRIZES */}
                    <div>
                        <InputLabel value="Hadiah:" className="font-bold" />

                        {prizes.map((prize, i) => (
                            <PrizeRow
                                key={i}
                                index={i}
                                prize={prize}
                                prizeTypes={prizeTypes}
                                onChange={handlePrizeChange}
                                onRemove={i === 0 ? null : removePrize}
                            />
                        ))}

                        <div className="flex justify-center mt-4">
                            <button
                                type="button"
                                onClick={addPrize}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                            >
                                + Tambah Hadiah
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-6 gap-4">
                    <SecondaryButton onClick={onClose} type="button">
                        Batal
                    </SecondaryButton>
                    <PrimaryButton type="submit">Simpan</PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
