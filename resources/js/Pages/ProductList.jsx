import AuthenticatedLayout from '@/Layouts/AuthenticatedLayoutOld';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { router } from '@inertiajs/react';

export default function ProductList({ auth, products }) {
    // State untuk manajemen keranjang
    const [cart, setCart] = useState([]);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);

    // Fungsi Tambah/Kurang Keranjang
    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [...prevCart, { ...product, qty: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item.id === productId);
            if (existingItem.qty === 1) {
                return prevCart.filter(item => item.id !== productId);
            }
            return prevCart.map(item =>
                item.id === productId ? { ...item, qty: item.qty - 1 } : item
            );
        });
    };

    const getItemQty = (productId) => {
        const item = cart.find(i => i.id === productId);
        return item ? item.qty : 0;
    };

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Daftar Produk" />

            <div className="py-12 bg-gray-50/50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    
                    {/* Header Section & Tombol Keranjang (IKUT DI-SCROLL) */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">
                                Katalog Produk
                            </h2>
                            <div className="h-1 w-20 bg-blue-600 rounded-full mt-2 mx-auto md:mx-0"></div>
                            <p className="text-gray-500 text-sm mt-3 font-medium opacity-70">
                                Pilihan produk berkualitas tinggi hanya untuk Anda.
                            </p>
                        </div>

                        {/* TOMBOL KERANJANG (DIAM DI POSISI INI, IKUT SCROLL KE ATAS) */}
                        <div className="flex justify-center md:justify-end">
                            <button 
                                onClick={() => setIsCartModalOpen(true)}
                                className="group bg-blue-600 hover:bg-blue-700 text-white p-3.5 sm:p-4 rounded-2xl shadow-xl flex items-center gap-3 transition-all active:scale-95 border-2 border-white"
                            >
                                <div className="relative">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {totalItems > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-white animate-bounce shadow-sm">
                                            {totalItems}
                                        </span>
                                    )}
                                </div>
                                <span className="font-black text-xs sm:text-sm tracking-widest uppercase">KERANJANG SAYA</span>
                            </button>
                        </div>
                    </div>

                    {/* Grid Section */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                        {products && products.length > 0 ? (
                            products.map((product) => {
                                const qty = getItemQty(product.id);
                                return (
                                    <div 
                                        key={product.id} 
                                        className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full overflow-hidden"
                                    >
                                        <div className="p-3">
                                            <div className="aspect-square overflow-hidden bg-gray-50 rounded-xl relative border border-gray-50/50">
                                                <img 
                                                    src={product.foto === 'logo1.png' ? '/images/logo1.png' : `/uploads/barang/${product.foto}`} 
                                                    alt={product.nama_barang}
                                                    className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => { e.target.src = "/images/logo1.png"; }}
                                                />
                                                {product.stok <= 0 && (
                                                    <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center">
                                                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Habis</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="px-4 pb-4 flex flex-col flex-grow">
                                            <div className="flex-grow">
                                                <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1 opacity-60">
                                                    {product.kode_barang}
                                                </div>
                                                <h3 className="font-bold text-gray-800 text-sm sm:text-base leading-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                    {product.nama_barang}
                                                </h3>
                                                <p className="text-gray-400 text-[11px] leading-relaxed line-clamp-2 mt-1 min-h-[32px]">
                                                    {product.deskripsi || "Kualitas premium untuk kepuasan pelanggan setia kami."}
                                                </p>
                                            </div>
                                            
                                            <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Harga</span>
                                                    <span className="text-sm sm:text-base font-black text-gray-900">
                                                        Rp {parseFloat(product.harga).toLocaleString('id-ID')}
                                                    </span>
                                                </div>

                                                <div className="flex items-center">
                                                    {qty === 0 ? (
                                                        <button 
                                                            onClick={() => addToCart(product)}
                                                            disabled={product.stok <= 0}
                                                            className="bg-blue-600 hover:bg-blue-700 active:scale-90 disabled:bg-gray-200 disabled:scale-100 text-white p-2.5 rounded-lg transition-all shadow-md shadow-blue-100 group-hover:shadow-blue-300"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                            </svg>
                                                        </button>
                                                    ) : (
                                                        <div className="flex items-center bg-blue-50 rounded-lg p-1 border border-blue-100 shadow-inner">
                                                            <button onClick={() => removeFromCart(product.id)} className="w-7 h-7 flex items-center justify-center bg-white text-blue-600 rounded-md font-black hover:bg-blue-600 hover:text-white transition-colors shadow-sm">-</button>
                                                            <span className="px-3 font-black text-blue-700 text-sm">{qty}</span>
                                                            <button onClick={() => addToCart(product)} className="w-7 h-7 flex items-center justify-center bg-white text-blue-600 rounded-md font-black hover:bg-blue-600 hover:text-white transition-colors shadow-sm">+</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
                                <div className="text-5xl mb-4 grayscale opacity-30">📦</div>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Belum ada produk tersedia</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL KERANJANG (TETAP FIXED) */}
            {isCartModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Ringkasan Pesanan</h3>
                                <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">Total {totalItems} item dalam keranjang</p>
                            </div>
                            <button onClick={() => setIsCartModalOpen(false)} className="text-gray-300 hover:text-red-500 transition-colors text-3xl leading-none">&times;</button>
                        </div>

                        <div className="max-h-[45vh] overflow-y-auto p-6 space-y-4 bg-white">
                            {cart.length > 0 ? (
                                cart.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-3xl border border-gray-100">
                                        <img src={item.foto === 'logo1.png' ? '/images/logo1.png' : `/uploads/barang/${item.foto}`} className="w-16 h-16 object-contain bg-white rounded-2xl border p-1 shadow-sm" alt="" />
                                        <div className="flex-grow">
                                            <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.nama_barang}</h4>
                                            <p className="text-blue-600 font-black text-xs mt-1">Rp {parseFloat(item.harga).toLocaleString('id-ID')}</p>
                                        </div>
                                        <div className="flex items-center bg-white rounded-xl p-1 border shadow-sm">
                                            <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 font-black text-gray-400">-</button>
                                            <span className="px-3 font-black text-sm text-gray-700">{item.qty}</span>
                                            <button onClick={() => addToCart(item)} className="w-7 h-7 font-black text-blue-600">+</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Keranjang kosong</p>
                                </div>
                            )}
                        </div>

                        <div className="p-8 bg-gray-50 border-t border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Total</span>
                                <span className="text-2xl font-black text-gray-900">Rp {totalPrice.toLocaleString('id-ID')}</span>
                            </div>
<button 
    onClick={() => {
        if(cart.length === 0) return;
        // Menggunakan router.post sesuai saran Cara 1 [cite: 11, 73]
        router.post(route('buyer.info'), { cart: JSON.stringify(cart) });
    }}
    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
>
    <span>Checkout Sekarang</span>
    {/* Icon Panah Kecil agar lebih interaktif */}
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5 group-hover:translate-x-1 transition-transform" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
</button>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
                .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
            ` }} />
        </AuthenticatedLayout>
    );
}