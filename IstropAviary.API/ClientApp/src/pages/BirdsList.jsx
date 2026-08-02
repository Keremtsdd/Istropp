import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BirdsList() {
  const [birds, setBirds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API bağlantısı hazır olduğunda açılacak
    // axios.get('/api/birds').then(res => setBirds(res.data)).finally(() => setLoading(false));
    
    // Geçici mock data
    setTimeout(() => {
      setBirds([
        { id: 1, bandNumber: 'TR-2023-001', mutation: 'Lutino', status: 'Breeder' },
        { id: 2, bandNumber: 'TR-2023-002', mutation: 'Albino', status: 'ForSale' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Kuşlar</h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
          + Yeni Kuş Ekle
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="p-4 font-medium">Bilezik No</th>
              <th className="p-4 font-medium">Mutasyon</th>
              <th className="p-4 font-medium">Durum</th>
              <th className="p-4 font-medium">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="4" className="p-4 text-center text-gray-500">Yükleniyor...</td></tr>
            ) : birds.map(bird => (
              <tr key={bird.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900">{bird.bandNumber}</td>
                <td className="p-4 text-gray-600">{bird.mutation}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                    {bird.status}
                  </span>
                </td>
                <td className="p-4">
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Detay</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BirdsList;
