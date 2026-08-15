import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import ModalEvent from "@/Components/Admin/ModalEvent"; // (Akan kita buat)
import PanelUndi from "@/Components/Admin/PanelUndi"; // (Akan kita buat)
import EventAktifCard from "@/Components/Admin/EventAktifCard"; // (Akan kita buat)
import PrimaryButton from "@/Components/PrimaryButton";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import axios from "axios";

// Halaman ini akan menerima props dari 'AdminEventPageController'
export default function Event({ admin, activeEvent = null, prizeTypes, undianTitle, sisaPemenang }) {
    // State untuk mengontrol modal (Buat/Edit)
    const [isModalOpen, setIsModalOpen] = useState(false);
    // State untuk menyimpan data event yg mau di-edit
    const [editingEvent, setEditingEvent] = useState(null);

    // Fungsi untuk membuka modal (mode 'Buat Baru')
    const handleBuatEvent = () => {
        if (activeEvent) {
            // Sesuai Req #2: Error jika ada event aktif
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Masih ada event yang sedang aktif! Selesaikan dulu event tersebut.",
            });
        } else {
            setEditingEvent(null); // Pastikan mode-nya 'buat baru'
            setIsModalOpen(true);
        }
    };

    // Fungsi untuk membuka modal (mode 'Edit')
    const handleEditEvent = () => {
        setEditingEvent(activeEvent); // Set data event aktif untuk di-edit
        setIsModalOpen(true);
    };

    // Fungsi untuk Hapus Event
    const handleHapusEvent = () => {
        Swal.fire({
            title: "Yakin ingin menghapus event?",
            text: `"${activeEvent.title}" akan dihapus permanen.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonText: "Batal",
            confirmButtonText: "Ya, hapus!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .get(
                        route("admin.delete-event", {
                            event_id: activeEvent.id,
                        })
                    )
                    .then((res) => {
                        Swal.fire(
                            "Terhapus!",
                            "Event telah dihapus.",
                            "success"
                        );
                        window.location.reload(); // Refresh halaman
                    })
                    .catch((err) => {
                        Swal.fire("Error", "Gagal menghapus event.", "error");
                    });
            }
        });
    };

    // Fungsi untuk Selesai Event
    const handleSelesaiEvent = () => {
        Swal.fire({
            title: "Selesaikan Event Ini?",
            text: 'Status event akan diubah menjadi "Selesai" dan kupon pemenang akan ditandai.',
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Ya, Selesaikan",
        }).then((result) => {
            if (!result.isConfirmed) return;

            axios
                .get(route("admin.end-event", { event_id: activeEvent.id }))
                .then((res) => {
                    const { code, message, data } = res.data;
                    console.log(res.data)

                    if (code !== 200) {
                        return Swal.fire({
                            icon: "error",
                            title: "Gagal",
                            text: message ?? "Terjadi kesalahan.",
                        });
                    }

                    // SUCCESS – backend said OK
                    Swal.fire({
                        icon: "success",
                        title: "Selesai!",
                        text: "Event telah ditandai selesai.",
                    }).then(() => {
                        window.location.reload();
                    });
                })
                .catch((err) => {
                    Swal.fire({
                        icon: "error",
                        title: "Oops... Error",
                        text:
                            err?.response?.data?.message ??
                            "Gagal menyelesaikan event.",
                    });
                });
        });
    };

    return (
        // Asumsi kamu pakai layout admin, ganti jika perlu
        <AdminLayout user={admin}>
            <Head title="Undi Pemenang" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Manajemen Event Undian
                        </h1>
                        <PrimaryButton onClick={handleBuatEvent}>
                            Buat Event Baru
                        </PrimaryButton>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Kolom Kiri: Panel Gacha */}
                        <div className="lg:col-span-2">
                            {activeEvent ? (
                                <PanelUndi
                                    activeEvent={activeEvent}
                                    totalWinnersNeeded={
                                        activeEvent.total_winners
                                    }
                                    sisaPemenang={sisaPemenang}
                                />
                            ) : (
                                <div className="p-6 bg-white shadow-lg rounded-lg text-center">
                                    <h3 className="text-lg font-medium text-gray-700">
                                        Tidak Ada Event Aktif
                                    </h3>
                                    <p className="mt-2 text-gray-500">
                                        Silakan "Buat Event Baru" untuk memulai
                                        undian.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Kolom Kanan: Info Event Aktif */}
                        <div className="lg:col-span-1">
                            {activeEvent ? (
                                <EventAktifCard
                                    event={activeEvent}
                                    onEdit={handleEditEvent}
                                    onDelete={handleHapusEvent}
                                    onFinish={handleSelesaiEvent}
                                />
                            ) : (
                                <div className="p-6 bg-white shadow-lg rounded-lg text-center opacity-50">
                                    <h3 className="text-lg font-medium text-gray-700">
                                        Event Aktif
                                    </h3>
                                    <p className="mt-2 text-gray-500">
                                        Belum ada event yang berjalan.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal untuk Buat / Edit Event */}
            <ModalEvent
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                eventData={editingEvent} // Kirim data event jika mode 'edit'
                prizeTypes={prizeTypes}
                undianTitle={undianTitle}
            />
        </AdminLayout>
    );
}
