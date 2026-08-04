import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { 
  Home, Plus, Search, Filter, LayoutGrid, 
  MoreHorizontal, Calendar, Info, Egg
} from 'lucide-react';
import { useData } from '../context/DataContext';
import NestModal from '../components/modals/NestModal';
import NestDetail from '../components/nests/NestDetail';

const Nests = () => {
  const { nests, setNests, clutches, eggs, birds } = useData();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNest, setSelectedNest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tümü');

  if (selectedNest) {
    return <NestDetail nest={selectedNest} onBack={() => setSelectedNest(null)} />;
  }

  // Dinamik Yuvalık Listesi
  const dynamicNests = nests.map(nest => {
    const activeClutch = clutches.find(c => c.nestId === nest.id && c.status === 'Aktif');
    const clutchEggs = activeClutch ? eggs.filter(e => e.clutchId === activeClutch.id) : [];
    
    const maleBird = activeClutch ? birds.find(b => b.id === activeClutch.maleId) : null;
    const femaleBird = activeClutch ? birds.find(b => b.id === activeClutch.femaleId) : null;

    const eggCount = clutchEggs.length;
    const chickCount = clutchEggs.filter(e => e.status === 'Çıktı').length;
    
    let status = 'Boş';
    if (activeClutch) {
      if (chickCount > 0) status = 'Yavrulu';
      else if (eggCount > 0) status = 'Aktif';
      else status = 'Hazırlık';
    }

    return {
      ...nest,
      status,
      maleBand: maleBird ? maleBird.bandNumber : '-',
      femaleBand: femaleBird ? femaleBird.bandNumber : '-',
      eggs: eggCount,
      chicks: chickCount,
      progress: chickCount > 0 ? 21 : (eggCount > 0 ? 10 : 0),
      totalDays: activeClutch ? 21 : 0,
      nextAction: status === 'Boş' ? 'Çift bekleniyor' : (status === 'Hazırlık' ? 'Yumurta bekleniyor' : (status === 'Aktif' ? 'Yavru çıkışı bekleniyor' : 'Yavru büyümesi')),
      nextActionTime: status === 'Boş' ? '-' : 'Yakında'
    };
  });

  // Arama ve Filtreleme
  const filteredNests = dynamicNests.filter(nest => {
    const matchesSearch = nest.nestCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          nest.maleBand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          nest.femaleBand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Tümü' || nest.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // İstatistikler
  const stats = {
    total: dynamicNests.length,
    aktif: dynamicNests.filter(n => n.status === 'Aktif').length,
    yavrulu: dynamicNests.filter(n => n.status === 'Yavrulu').length,
    hazirlik: dynamicNests.filter(n => n.status === 'Hazırlık').length,
    bos: dynamicNests.filter(n => n.status === 'Boş').length,
  };

  const handleAddNest = (nestData) => {
    const newNest = {
      ...nestData,
      id: Date.now(),
      maleBand: '-',
      femaleBand: '-',
      eggs: 0,
      chicks: 0,
      progress: 0,
      totalDays: 0
    };
    setNests(prev => [...prev, newNest]);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Aktif': return { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500', bar: 'bg-green-500' };
      case 'Yavrulu': return { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500', bar: 'bg-blue-500' };
      case 'Hazırlık': return { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500', bar: 'bg-amber-500' };
      case 'Boş': return { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400', bar: 'bg-slate-200' };
      default: return { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400', bar: 'bg-slate-200' };
    }
  };

  return (
    <div className="space-y-6 max-w-full pb-10">
      
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="min-w-max">
          <h2 className="text-2xl font-bold text-slate-800">Yuvalıklar</h2>
          <p className="text-slate-500 text-sm mt-0.5">Tüm yuvalıkların genel görünümü</p>
        </div>

        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Yuvalık ara... (N01, N02, bilezik no vb.)" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-sm transition-all"
          />
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-blue-200 min-w-max"
        >
          <Plus size={18} /> Yeni Yuvalık
        </button>
      </div>

      {/* Status Bar & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-2 px-6 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex flex-wrap items-center gap-8 py-2 w-full">
          
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
              <Home size={14} /> Toplam Yuvalık
            </div>
            <span className="text-lg font-bold text-slate-800">{stats.total}</span>
          </div>

          <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>

          <div className="flex flex-col items-center cursor-pointer hover:opacity-80" onClick={() => setFilterStatus(filterStatus === 'Aktif' ? 'Tümü' : 'Aktif')}>
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> Aktif
            </div>
            <span className={`text-lg font-bold ${filterStatus === 'Aktif' ? 'text-green-600' : 'text-slate-800'}`}>{stats.aktif}</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer hover:opacity-80" onClick={() => setFilterStatus(filterStatus === 'Yavrulu' ? 'Tümü' : 'Yavrulu')}>
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Yavrulu
            </div>
            <span className={`text-lg font-bold ${filterStatus === 'Yavrulu' ? 'text-blue-600' : 'text-slate-800'}`}>{stats.yavrulu}</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer hover:opacity-80" onClick={() => setFilterStatus(filterStatus === 'Hazırlık' ? 'Tümü' : 'Hazırlık')}>
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Hazırlık
            </div>
            <span className={`text-lg font-bold ${filterStatus === 'Hazırlık' ? 'text-amber-600' : 'text-slate-800'}`}>{stats.hazirlik}</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer hover:opacity-80" onClick={() => setFilterStatus(filterStatus === 'Boş' ? 'Tümü' : 'Boş')}>
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span> Boş
            </div>
            <span className={`text-lg font-bold ${filterStatus === 'Boş' ? 'text-slate-600' : 'text-slate-800'}`}>{stats.bos}</span>
          </div>

        </div>

        <div className="flex items-center gap-3 min-w-max pb-2 lg:pb-0">
          <button 
            onClick={() => { setSearchTerm(''); setFilterStatus('Tümü'); }}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium"
          >
            <Filter size={16} /> Temizle
          </button>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="p-10 text-center text-slate-500">Yükleniyor...</div>
      ) : filteredNests.length === 0 ? (
        <div className="p-10 text-center text-slate-500 bg-white rounded-xl border border-slate-100">Kayıt bulunamadı.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredNests.map((nest) => {
            const statusStyle = getStatusColor(nest.status);
            const progressPercent = nest.totalDays > 0 ? (nest.progress / nest.totalDays) * 100 : 0;

              return (
                <div 
                  key={nest.id} 
                  onClick={() => setSelectedNest(nest)}
                  className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col group"
                >
                  
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <Home className="text-slate-400" size={20} />
                      <h3 className="text-lg font-bold text-slate-800">{nest.nestCode}</h3>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${statusStyle.bg} ${statusStyle.text}`}>
                      {nest.status}
                    </span>
                  </div>

                  {/* Body (Parents & Stats) */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        <span className="text-blue-500 text-lg leading-none">♂</span> {nest.maleBand || '-'}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        <span className="text-pink-500 text-lg leading-none">♀</span> {nest.femaleBand || '-'}
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <div className="flex items-center justify-end gap-1.5 text-sm font-semibold text-slate-700">
                        <span>{nest.eggs || 0} Yumurta</span>
                        <Egg size={14} className="text-amber-500" />
                      </div>
                      <div className="flex items-center justify-end gap-1.5 text-sm font-semibold text-slate-700">
                        <span>{nest.chicks || 0} Yavru</span>
                        <div className="w-3.5 h-3.5 rounded-full bg-blue-100 flex items-center justify-center text-[8px] text-blue-600">🐥</div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1.5">
                      <div className={`h-full ${statusStyle.bar} rounded-full`} style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <div className="text-right text-[11px] font-bold text-slate-400">
                      {nest.totalDays > 0 ? `${nest.progress} / ${nest.totalDays} Gün` : '-'}
                    </div>
                  </div>

                  <div className="mt-auto border-t border-slate-50 pt-3">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Sonraki İşlem
                      </div>
                      <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                        <Calendar size={12} /> {nest.nextActionTime}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-slate-700 truncate pr-4">{nest.nextAction}</p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); /* modal etc */ }}
                        className="text-slate-300 hover:text-slate-500 transition-colors p-1"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </div>

                </div>
              );
          })}
        </div>
      )}

      {/* Footer Legend */}
      <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-slate-100 text-xs font-medium text-slate-500 gap-4">
        <div className="flex items-center gap-1.5 text-blue-500">
          <Info size={14} /> <span>İpucu: Yuvalık kartına çift tıklayarak detay sayfasını açabilirsiniz.</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> Aktif</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Yavrulu</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Hazırlık</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400"></span> Boş</div>
        </div>
      </div>

      <NestModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddNest}
      />
    </div>
  );
};

export default Nests;
