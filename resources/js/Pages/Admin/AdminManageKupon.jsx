import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import Swal from "sweetalert2";

export default function AdminManageCoupon({ auth, couponFiles }) {
    const [code, setCode] = useState(1);

    // Generate new coupons (download PDF)
    const submitCreateCoupon = (e) => {
        e.preventDefault();

        Swal.fire({
            title: "Membuat kupon...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        axios({
            url: route("admin.generate-coupons", { num: code }),
            method: "GET",
            responseType: "blob",
        })
            .then((response) => {
                Swal.close();

                const disposition = response.headers["content-disposition"];
                let filename = "file.pdf";

                if (disposition && disposition.includes("filename=")) {
                    filename = disposition
                        .split("filename=")[1]
                        .replace(/"/g, "");
                }

                const blobURL = window.URL.createObjectURL(
                    new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = blobURL;
                link.setAttribute("download", filename);
                document.body.appendChild(link);
                link.click();
                link.remove();

                Swal.fire({
                    icon: "success",
                    title: "Berhasil membuat kupon!",
                    text: filename,
                }).then(() => {
                    window.location.reload();
                });
            })
            .catch((error) => {
                Swal.close();

                console.error("[CREATE COUPON ERROR]", error);

                let errorMessage = "Terjadi kesalahan saat membuat kupon.";
                let errorDetail = "";

                // Handle different error scenarios
                if (error.response) {
                    // Server responded with error status
                    const status = error.response.status;
                    
                    // Try to read error message from blob response
                    if (error.response.data instanceof Blob) {
                        error.response.data.text().then((text) => {
                            try {
                                const errorData = JSON.parse(text);
                                const detailText = errorData.message || errorData.data || text;
                                
                                Swal.fire({
                                    icon: "error",
                                    title: "Gagal membuat kupon!",
                                    html: `<p><strong>Status:</strong> ${status}</p><p>${detailText}</p>`,
                                    confirmButtonText: "OK",
                                });
                            } catch (e) {
                                Swal.fire({
                                    icon: "error",
                                    title: "Gagal membuat kupon!",
                                    html: `<p><strong>Status:</strong> ${status}</p><p>${text}</p>`,
                                    confirmButtonText: "OK",
                                });
                            }
                        });
                        return;
                    }
                    
                    errorMessage = `Error ${status}: ${error.response.statusText}`;
                    errorDetail = error.response.data?.message || error.response.data?.data || "";
                } else if (error.request) {
                    // Request made but no response
                    errorMessage = "Tidak ada respons dari server.";
                    errorDetail = "Periksa koneksi internet Anda.";
                } else {
                    // Error in setting up request
                    errorMessage = "Terjadi kesalahan.";
                    errorDetail = error.message;
                }

                Swal.fire({
                    icon: "error",
                    title: "Gagal membuat kupon!",
                    html: errorDetail 
                        ? `<p>${errorMessage}</p><p class="text-sm text-gray-600 mt-2">${errorDetail}</p>`
                        : errorMessage,
                    confirmButtonText: "OK",
                });
            });
    };

    // Download existing coupon file (by ID)
    const downloadExistingFile = (fileId) => {
        Swal.fire({
            title: "Sedang menyiapkan file...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        console.log(
            "[DOWNLOAD] Start request to:",
            `/admin/download-coupons/${fileId}`
        );

        axios({
            url: `/admin/download-coupons/${fileId}`,
            method: "GET",
            responseType: "blob",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            },
        })
            .then((response) => {
                console.log("[DOWNLOAD] RESPONSE OK:", response);
                Swal.close();

                const disposition = response.headers["content-disposition"];
                console.log("[DOWNLOAD] disposition header:", disposition);

                let filename = "file.pdf";

                if (disposition && disposition.includes("filename=")) {
                    filename = disposition
                        .split("filename=")[1]
                        .replace(/"/g, "");
                }

                console.log("[DOWNLOAD] filename:", filename);

                const blob = new Blob([response.data], {
                    type: "application/pdf",
                });
                const blobURL = window.URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = blobURL;
                link.download = filename;

                document.body.appendChild(link);
                link.click();
                link.remove();

                Swal.fire({
                    icon: "success",
                    title: "Download berhasil!",
                    text: filename,
                });
            })
            .catch((error) => {
                Swal.close();

                console.error("[DOWNLOAD ERROR]", error);

                let errorMessage = "Gagal mendownload file!";
                let errorDetail = "";

                // Handle different error scenarios
                if (error.response) {
                    const status = error.response.status;
                    
                    // Try to read error message from blob response
                    if (error.response.data instanceof Blob) {
                        error.response.data.text().then((text) => {
                            try {
                                const errorData = JSON.parse(text);
                                const detailText = errorData.message || errorData.data || text;
                                
                                Swal.fire({
                                    icon: "error",
                                    title: "Gagal mendownload file!",
                                    html: `<p><strong>Status:</strong> ${status}</p><p>${detailText}</p>`,
                                    footer: '<span class="text-sm text-gray-500">Cek console untuk detail lengkap</span>',
                                    confirmButtonText: "OK",
                                });
                            } catch (e) {
                                Swal.fire({
                                    icon: "error",
                                    title: "Gagal mendownload file!",
                                    html: `<p><strong>Status:</strong> ${status}</p><p>${text}</p>`,
                                    footer: '<span class="text-sm text-gray-500">Cek console untuk detail lengkap</span>',
                                    confirmButtonText: "OK",
                                });
                            }
                        });
                        return;
                    }
                    
                    errorMessage = `Error ${status}: ${error.response.statusText}`;
                    errorDetail = error.response.data?.message || error.response.data?.data || "";
                } else if (error.request) {
                    errorMessage = "Tidak ada respons dari server.";
                    errorDetail = "Periksa koneksi internet Anda.";
                } else {
                    errorMessage = "Terjadi kesalahan saat mendownload.";
                    errorDetail = error.message;
                }

                Swal.fire({
                    icon: "error",
                    title: errorMessage,
                    html: errorDetail 
                        ? `<p class="text-sm text-gray-600 mt-2">${errorDetail}</p>`
                        : null,
                    footer: '<span class="text-sm text-gray-500">Cek console untuk detail lengkap</span>',
                    confirmButtonText: "OK",
                });
            });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Manage Kupon" />

            <h2 className="mt-0 text-2xl font-semibold text-gray-800">
                Selamat Datang Admin
            </h2>
            <p className="text-gray-600">Admin akan membuat Kupon</p>

            {/* ======== FORM BUAT KUPON ======== */}
            <div className="p-6 bg-white rounded-lg shadow-md max-w-md mt-6">
                <h3 className="text-2xl font-bold mb-1">Buat Kupon</h3>
                <p className="text-gray-600 mb-4">
                    Masukkan total kupon yang ingin dibuat.
                </p>

                <form
                    onSubmit={submitCreateCoupon}
                    className="flex items-center gap-3"
                >
                    <input
                        type="number"
                        min="1"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-24 rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-center"
                    />

                    <button
                        type="submit"
                        className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300"
                    >
                        Buat
                    </button>
                </form>
            </div>

            {/* ======== TABEL FILE KUPON ======== */}
            <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                    <h3 className="text-xl font-semibold">Daftar File Kupon</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    No
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama File
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tanggal
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {couponFiles.map((file, index) => (
                                <tr key={file.id}>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {index + 1}
                                    </td>

                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {file.title}.pdf
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        {file.created_at.split(" ")[0]}
                                    </td>

                                    <td className="px-6 py-4 text-right text-sm">
                                        <button
                                            onClick={() =>
                                                downloadExistingFile(file.id)
                                            }
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            Download
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {couponFiles.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="px-6 py-4 text-center text-gray-500"
                                    >
                                        Belum ada file kupon.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}