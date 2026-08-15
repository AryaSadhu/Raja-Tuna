import React from 'react';
import SecondaryButton from '@/Components/SecondaryButton';

export default function EventAktifCard({ event, onEdit, onDelete, onFinish }) {
    
    // Format tanggal biar gampang dibaca
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">
                Event Aktif
            </h3>
            <div className="mt-4 space-y-3 text-sm">
                <h4 className="text-xl font-semibold text-blue-600">{event.title}</h4>
                <p>
                    <strong className="text-gray-600">Mulai Undian:</strong><br/>
                    {formatDate(event.start_date)}
                </p>
                <p>
                    <strong className="text-gray-600">Batas Akhir Input:</strong><br/>
                    {formatDate(event.last_buy_date)}
                </p>
                <p>
                    <strong className="text-gray-600">Total Pemenang:</strong><br/>
                    {event.total_winners} orang
                </p>
                <div>
                    <strong className="text-gray-600">Hadiah:</strong>
                    <ul className="list-disc list-inside text-gray-700 mt-1">
                        {event.prizes && event.prizes.map(p => (
                            <li key={p.id}>{p.qty}x {p.prize_name}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mt-6 mb-3">
                <a 
                    href={route('live-draw.index')} // PENTING: Arahkan ke route baru tanpa ID
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full text-center px-4 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 shadow-md transition-all hover:shadow-lg"
                >
                    🖥️ Buka Layar Live Draw
                </a>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-2">
                <button 
                    onClick={onFinish}
                    className="flex-1 px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-md hover:bg-green-700"
                >
                    Selesai
                </button>
                <button 
                    onClick={onEdit}
                    className="flex-1 px-4 py-2 bg-yellow-500 text-white text-xs font-bold rounded-md hover:bg-yellow-600"
                >
                    Edit
                </button>
                <button 
                    onClick={onDelete}
                    className="flex-1 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-md hover:bg-red-700"
                >
                    Hapus
                </button>
            </div>
        </div>
    );
}