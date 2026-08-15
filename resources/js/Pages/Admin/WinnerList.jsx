import React, { useState, useMemo } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";

export default function WinnerList({ auth, winners }) {
    // 1. Ambil semua Event unik
    const allEvents = useMemo(() => {
        const events = winners
            .map((winner) => winner.event || winner.event_title)
            .filter((event) => event);

        return [...new Set(events)];
    }, [winners]);

    const [selectedEvent, setSelectedEvent] = useState(allEvents[0] || "");
    const eventOptions = allEvents;

    // 2. Filter winners berdasarkan event
    const filteredWinners = useMemo(() => {
        return winners.filter(
            (winner) => (winner.event || winner.event_title) === selectedEvent
        );
    }, [winners, selectedEvent]);

    // --- Group winners by prize id (prizes_id) for uniqueness ---
    // Fallback: if prizes_id missing, use hadiah string as key
    const groupedWinners = useMemo(() => {
        const groups = {};

        filteredWinners.forEach((winner) => {
            // prefer prizes_id when available, else fallback to hadiah (string)
            const key =
                winner.prizes_id !== undefined && winner.prizes_id !== null
                    ? `prize_${winner.prizes_id}`
                    : `prize_name_${(winner.hadiah || "Hadiah").toString()}`;

            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(winner);
        });

        return groups;
    }, [filteredWinners]);

    // Format tanggal
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Daftar Pemenang" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                🏆 Daftar Pemenang
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Total {filteredWinners.length} Pemenang (
                                {selectedEvent || "—"})
                            </p>
                        </div>
                        <Link
                            href={route("admin.event")}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold shadow-lg transition-all"
                        >
                            ← Kembali ke Undian
                        </Link>
                    </div>

                    {/* FILTER EVENT */}
                    <div className="mb-6 flex items-center gap-4 p-4 bg-gray-50 rounded-lg shadow-md border border-gray-200">
                        <label
                            htmlFor="event-filter"
                            className="font-semibold text-gray-700"
                        >
                            Filter Event:
                        </label>

                        <select
                            id="event-filter"
                            value={selectedEvent}
                            onChange={(e) => setSelectedEvent(e.target.value)}
                            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-full md:w-1/3"
                        >
                            <option value="">
                                {allEvents.length
                                    ? "-- Pilih Event --"
                                    : "-- Tidak ada event --"}
                            </option>
                            {eventOptions.map((event) => (
                                <option key={event} value={event}>
                                    {event}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* CONTENT */}
                    <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                        {Object.keys(groupedWinners).length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">
                                    Belum ada pemenang untuk event ini
                                </p>
                            </div>
                        ) : (
                            <div className="p-6 space-y-6">
                                {Object.entries(groupedWinners).map(
                                    ([groupKey, winnersInPrize]) => {
                                        const first = winnersInPrize[0] || {};
                                        // prize name comes from backend 'hadiah' column (from prizes table)
                                        const prizeName =
                                            first.hadiah || "Hadiah";
                                        const jenisHadiah =
                                            first.jenis_hadiah || "";

                                        return (
                                            <div
                                                key={groupKey}
                                                className="border-2 border-gray-200 rounded-lg overflow-hidden"
                                            >
                                                {/* HEADER HADIAH */}
                                                <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 border-b-2 border-purple-300">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-3xl">
                                                            🎁
                                                        </span>
                                                        <div>
                                                            <h3 className="font-bold text-gray-800 text-xl">
                                                                {jenisHadiah} -{" "}
                                                                {prizeName}
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                Total:{" "}
                                                                {
                                                                    winnersInPrize.length
                                                                }{" "}
                                                                Pemenang
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* LIST PEMENANG */}
                                                <div className="divide-y divide-gray-200">
                                                    {winnersInPrize.map(
                                                        (winner, idxWinner) => (
                                                            <div
                                                                key={idxWinner}
                                                                className="p-4 hover:bg-gray-50 transition-colors"
                                                            >
                                                                <div className="flex items-start gap-4">
                                                                    {/* NOMOR */}
                                                                    <div className="flex-shrink-0">
                                                                        <div
                                                                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg ${
                                                                                idxWinner ===
                                                                                0
                                                                                    ? "bg-yellow-500"
                                                                                    : idxWinner ===
                                                                                      1
                                                                                    ? "bg-gray-400"
                                                                                    : idxWinner ===
                                                                                      2
                                                                                    ? "bg-orange-600"
                                                                                    : "bg-blue-500"
                                                                            }`}
                                                                        >
                                                                            #
                                                                            {idxWinner +
                                                                                1}
                                                                        </div>
                                                                    </div>

                                                                    {/* INFO */}
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <span className="text-gray-500 text-xl">
                                                                                👤
                                                                            </span>
                                                                            <p className="font-bold text-gray-800 text-xl">
                                                                                {winner.nama ||
                                                                                    "Unknown"}
                                                                            </p>
                                                                        </div>

                                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                                                            <div className="flex items-center gap-2">
                                                                                🎟️
                                                                                <span className="text-gray-600">
                                                                                    Kupon:
                                                                                </span>
                                                                                <span className="font-mono font-semibold text-blue-600">
                                                                                    {
                                                                                        winner.kupon
                                                                                    }
                                                                                </span>
                                                                            </div>

                                                                            <div className="flex items-center gap-2">
                                                                                {winner.mode ===
                                                                                1
                                                                                    ? "✋"
                                                                                    : "🎲"}
                                                                                <span className="text-gray-600">
                                                                                    Mode:
                                                                                </span>
                                                                                <span
                                                                                    className={
                                                                                        winner.mode ===
                                                                                        1
                                                                                            ? "text-purple-600 font-medium"
                                                                                            : "text-green-600 font-medium"
                                                                                    }
                                                                                >
                                                                                    {winner.mode ===
                                                                                    1
                                                                                        ? "Manual"
                                                                                        : "Random"}
                                                                                </span>
                                                                            </div>

                                                                            <div className="flex items-center gap-2">
                                                                                📅
                                                                                <span className="text-gray-600">
                                                                                    Menang:
                                                                                </span>
                                                                                <span className="text-gray-700">
                                                                                    {formatDate(
                                                                                        winner.tanggal
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
