import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { 
  Search, Plus, MoreVertical, List, LayoutGrid, 
  ChevronDown, RefreshCcw, ChevronLeft, ChevronRight
} from 'lucide-react';

const Birds = () => {
  const [birds, setBirds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  useEffect(() => {
    fetchBirds();
  }, []);

  const fetchBirds = async () => {
    try {
      const response = await axiosClient.get('/birds');
      // For mock purposes if the API is empty we could set some fake data, but let's stick to API data.
      setBirds(response.data);
    } catch (error) {
      console.error('Kuşlar getirilemedi', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Available': 
      case 'Damızlık':
        return { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500', label: 'Damızlık' };
      case 'Chick':
      case 'Yavru':
        return { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Yavru' };
      case 'Sold':
      case 'Satılık':
        return { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500', label: 'Satılık' };
      case 'Deceased':
      case 'Tedavide':
        return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', label: 'Tedavide' };
      default: 
        return { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500', label: status || 'Bilinmiyor' };
    }
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* Header Area */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        
        {/* Title & Badge */}
        <div className="flex items-center gap-3 min-w-max">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-800">Kuşlar</h2>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{birds.length}</span>
            </div>
            <p className="text-slate-500 text-sm">Tüm kuşların listesi</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Kuş ara... (bilezik, renk vb.)" 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-sm transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 min-w-max">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <List size={16} /> Liste
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <LayoutGrid size={16} /> Kart
            </button>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-blue-200">
            <Plus size={18} /> Yeni Kuş
          </button>
        </div>
      </div>

      {/* Filters Area */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-2 px-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 overflow-x-auto w-full pb-2 sm:pb-0">
          
          {/* Filter: Durum */}
          <div className="flex items-center gap-3 border border-slate-200 rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-50 transition-colors min-w-max">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
              <span className="w-2.5 h-2.5 bg-slate-400 rounded-full border border-slate-100"></span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium leading-none">Durum</p>
              <p className="text-sm text-slate-800 font-semibold mt-0.5">Tümü</p>
            </div>
            <ChevronDown size={16} className="text-slate-400 ml-2" />
          </div>

          {/* Filter: Cinsiyet */}
          <div className="flex items-center gap-3 border border-slate-200 rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-50 transition-colors min-w-max">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <span className="text-sm font-bold">♂♀</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium leading-none">Cinsiyet</p>
              <p className="text-sm text-slate-800 font-semibold mt-0.5">Tümü</p>
            </div>
            <ChevronDown size={16} className="text-slate-400 ml-2" />
          </div>

          {/* Filter: Yuvalık */}
          <div className="flex items-center gap-3 border border-slate-200 rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-50 transition-colors min-w-max">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium leading-none">Yuvalık</p>
              <p className="text-sm text-slate-800 font-semibold mt-0.5">Tümü</p>
            </div>
            <ChevronDown size={16} className="text-slate-400 ml-2" />
          </div>

        </div>

        <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium min-w-max">
          <RefreshCcw size={16} /> Temizle
        </button>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                <th className="px-6 py-4 w-12">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                </th>
                <th className="px-4 py-4 text-xs font-bold text-slate-600">Fotoğraf</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-600">Bilezik <ChevronDown className="inline w-3 h-3 text-slate-400" /></th>
                <th className="px-4 py-4 text-xs font-bold text-slate-600">Cinsiyet <ChevronDown className="inline w-3 h-3 text-slate-400" /></th>
                <th className="px-4 py-4 text-xs font-bold text-slate-600">Durum <ChevronDown className="inline w-3 h-3 text-slate-400" /></th>
                <th className="px-4 py-4 text-xs font-bold text-slate-600">Yuvalık <ChevronDown className="inline w-3 h-3 text-slate-400" /></th>
                <th className="px-4 py-4 text-xs font-bold text-slate-600">Not</th>
                <th className="px-4 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-10 text-center text-slate-500">Yükleniyor...</td>
                </tr>
              ) : birds.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-10 text-center text-slate-500">Hiç kuş bulunamadı. Hemen yeni bir tane ekleyin!</td>
                </tr>
              ) : (
                birds.map((bird) => {
                  const statusInfo = getStatusStyle(bird.status);
                  const isMale = bird.gender === 0;

                  return (
                    <tr key={bird.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                          {bird.imageUrl ? (
                            <img src={bird.imageUrl} alt="Kuş" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Foto</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-slate-700">
                        {bird.bandNumber}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className={`flex items-center gap-1.5 text-sm font-medium ${isMale ? 'text-blue-600' : 'text-pink-600'}`}>
                          {isMale ? (
                            <span className="text-lg leading-none">♂</span>
                          ) : (
                            <span className="text-lg leading-none">♀</span>
                          )}
                          {isMale ? 'Erkek' : 'Dişi'}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${statusInfo.bg} ${statusInfo.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}></span>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                        {bird.aviaryName || '-'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500 max-w-[200px] truncate">
                        {bird.notes || '-'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <button className="text-slate-400 hover:text-blue-600 transition-colors p-1.5 rounded-md hover:bg-blue-50 opacity-0 group-hover:opacity-100">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        {birds.length > 0 && (
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-slate-500 font-medium">
              12 / {birds.length} Kuş Gösteriliyor
            </span>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50" disabled>
                  <ChevronLeft size={16} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md border border-blue-600 bg-blue-50 text-blue-600 font-semibold text-sm">
                  1
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-sm">
                  2
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-sm">
                  3
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50">
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 cursor-pointer hover:bg-slate-50">
                25 / sayfa
                <ChevronDown size={14} className="text-slate-400" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Birds;
