import { useState, useRef, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { 
  Search, Plus, MoreVertical, List, LayoutGrid, 
  ChevronDown, RefreshCcw, ChevronLeft, ChevronRight, Trash2, Edit3, MoreHorizontal, Bird
} from 'lucide-react';
import BirdModal from '../components/modals/BirdModal';
import BirdDetail from '../components/birds/BirdDetail';

const CustomDropdown = ({ icon, label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => String(opt.value) === String(value));

  return (
    <div className="relative flex items-center gap-3 border border-slate-200 rounded-lg px-3 py-2 min-w-[140px] cursor-pointer hover:bg-slate-50 transition-colors"
         ref={dropdownRef}
         onClick={() => setIsOpen(!isOpen)}
    >
      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-[11px] text-slate-500 font-medium leading-none">{label}</p>
        <div className="text-sm text-slate-800 font-semibold mt-0.5">
          {selectedOption ? selectedOption.label : 'Seçiniz'}
        </div>
      </div>
      <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-full min-w-[160px] bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/50 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {options.map((opt) => (
            <div 
              key={opt.value}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors ${String(value) === String(opt.value) ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
              onClick={(e) => {
                e.stopPropagation();
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Birds = () => {
  const { birds, addBird, deleteBird, loading: dataLoading } = useData();
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBird, setSelectedBird] = useState(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tümü');
  const [filterGender, setFilterGender] = useState('Tümü');
  const [filterAviary, setFilterAviary] = useState('Tümü');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterGender, filterAviary]);

  const currentSelectedBird = selectedBird ? birds.find(b => b.id === selectedBird.id) || selectedBird : null;

  if (currentSelectedBird) {
    return <BirdDetail bird={currentSelectedBird} onBack={() => setSelectedBird(null)} />;
  }

  const filteredBirds = birds.filter(bird => {
    const searchMatch = bird.bandNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        bird.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let statusMatch = true;
    if (filterStatus !== 'Tümü') {
      const dbStatus = String(bird.status);
      statusMatch = dbStatus === filterStatus || 
                   (filterStatus === '1' && (dbStatus === 'Available' || dbStatus === 'Breeder' || dbStatus === 'Damızlık')) ||
                   (filterStatus === '2' && (dbStatus === 'Chick' || dbStatus === 'Yavru')) ||
                   (filterStatus === '4' && (dbStatus === 'Sold' || dbStatus === 'Satılık'));
    }

    let genderMatch = true;
    if (filterGender !== 'Tümü') {
      const g = String(bird.gender);
      genderMatch = g === filterGender || 
                   (filterGender === '0' && (g === 'Male' || g === 'Erkek')) ||
                   (filterGender === '1' && (g === 'Female' || g === 'Dişi'));
    }

    let aviaryMatch = true;
    if (filterAviary !== 'Tümü') {
      if (filterAviary === 'Boş') {
        aviaryMatch = !bird.aviaryName || bird.aviaryName === '';
      } else {
        aviaryMatch = bird.aviaryName === filterAviary;
      }
    }

    return searchMatch && statusMatch && genderMatch && aviaryMatch;
  }).sort((a, b) => {
    const bandA = a.bandNumber || '';
    const bandB = b.bandNumber || '';
    return bandA.localeCompare(bandB, undefined, { numeric: true, sensitivity: 'base' });
  });

  const handleAddBird = async (birdData) => {
    try {
      await addBird(birdData);
    } catch (error) {
      console.error("Kuş eklenirken hata oluştu:", error);
      alert(error.message);
      throw error; 
    }
  };

  const totalPages = Math.max(1, Math.ceil(filteredBirds.length / itemsPerPage));
  const displayedBirds = filteredBirds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Available': 
      case 'Breeder':
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
      case 'Resting':
      case 'Dinlenmede':
        return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', label: 'Tedavide/Dinlenmede' };
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-blue-200"
          >
            <Plus size={18} /> Yeni Kuş
          </button>
        </div>
      </div>

      {/* Filters Area */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-2 px-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 w-full pb-2 sm:pb-0">
          
          <CustomDropdown 
            icon={<div className="w-2.5 h-2.5 rounded-full bg-slate-400 pointer-events-none"></div>}
            label="Durum"
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { value: 'Tümü', label: 'Tümü' },
              { value: '1', label: 'Damızlık' },
              { value: '2', label: 'Yavru' },
              { value: '4', label: 'Satılık' }
            ]}
          />

          <CustomDropdown 
            icon={<span className="text-sm font-bold pointer-events-none">♂♀</span>}
            label="Cinsiyet"
            value={filterGender}
            onChange={setFilterGender}
            options={[
              { value: 'Tümü', label: 'Tümü' },
              { value: '0', label: 'Erkek' },
              { value: '1', label: 'Dişi' }
            ]}
          />

          <CustomDropdown 
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
            label="Yuvalık"
            value={filterAviary}
            onChange={setFilterAviary}
            options={[
              { value: 'Tümü', label: 'Tümü' },
              { value: 'Boş', label: 'Yok (Boş)' },
              ...Array.from(new Set(birds.map(b => b.aviaryName).filter(Boolean))).map(av => ({ value: av, label: av }))
            ]}
          />

        </div>

        <button 
          onClick={() => {
            setSearchTerm('');
            setFilterStatus('Tümü');
            setFilterGender('Tümü');
            setFilterAviary('Tümü');
          }}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium min-w-max"
        >
          <RefreshCcw size={16} /> Temizle
        </button>
      </div>

      {/* Content Area */}
      {viewMode === 'list' ? (
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
                {dataLoading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-10 text-center text-slate-500">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Kuşlar Yükleniyor...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredBirds.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-10 text-center text-slate-500">Kriterlere uygun kuş bulunamadı.</td>
                  </tr>
                ) : (
                  displayedBirds.map((bird) => {
                    const statusInfo = getStatusStyle(bird.status);
                    const isMale = bird.gender === 0 || bird.gender === '0' || bird.gender === 'Male' || bird.gender === 'Erkek';
                    const isUnknown = bird.gender === 2 || bird.gender === '2' || bird.gender === 'Unknown' || bird.gender === 'Bilinmiyor';
                    return (
                      <tr key={bird.id} onClick={() => setSelectedBird(bird)} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer group/row">
                        <td className="px-4 py-4 w-12 text-center">
                          <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer" onClick={(e) => e.stopPropagation()} />
                        </td>
                        <td className="px-4 py-4">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                            {bird.imageUrl ? (
                              <img src={`http://localhost:5010${bird.imageUrl}`} alt="Kuş" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Foto</div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 font-semibold text-slate-700">{bird.bandNumber}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold ${
                            isUnknown ? 'text-slate-600 bg-slate-100' : 
                            isMale ? 'text-blue-600 bg-blue-50' : 'text-pink-600 bg-pink-50'
                          }`}>
                            {isUnknown ? <span className="text-[10px]">?</span> : (isMale ? '♂' : '♀')} {isUnknown ? 'Bilinmiyor' : (isMale ? 'Erkek' : 'Dişi')}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold ${statusInfo.bg} ${statusInfo.text}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}></div>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-slate-600 font-medium">
                          {bird.nestCode || (bird.aviaryName || '-')}
                        </td>
                        <td className="px-4 py-4 text-slate-600 text-sm max-w-xs truncate" title={bird.notes}>
                          {bird.notes || '-'}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1 justify-end opacity-0 group-hover/row:opacity-100 transition-opacity">
                            <button onClick={(e) => { e.stopPropagation(); if(window.confirm('Bu kuşu silmek istediğinize emin misiniz?')) deleteBird(bird.id); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        dataLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 animate-pulse">
                <div className="w-full aspect-square bg-slate-100 rounded-xl mb-4"></div>
                <div className="h-5 bg-slate-100 rounded-md w-2/3 mb-2"></div>
                <div className="h-4 bg-slate-100 rounded-md w-1/2 mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-slate-100 rounded-md w-16"></div>
                  <div className="h-6 bg-slate-100 rounded-md w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredBirds.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-slate-500 font-medium w-full bg-white rounded-2xl shadow-sm border border-slate-100">
            Kriterlere uygun kuş bulunamadı.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {displayedBirds.map(bird => {
            const statusInfo = getStatusStyle(bird.status);
            const isMale = bird.gender === 0 || bird.gender === '0' || bird.gender === 'Male' || bird.gender === 'Erkek';
            const isUnknown = bird.gender === 2 || bird.gender === '2' || bird.gender === 'Unknown' || bird.gender === 'Bilinmiyor';
            return (
              <div 
                key={bird.id}
                onClick={() => setSelectedBird(bird)}
                className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-slate-100"
              >
                <div className="w-full aspect-square bg-slate-100 rounded-xl mb-4 overflow-hidden relative group/image">
                  {bird.imageUrl ? (
                    <img src={`http://localhost:5010${bird.imageUrl}`} alt="Kuş" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      Fotoğraf Yok
                    </div>
                  )}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if(window.confirm('Bu kuşu silmek istediğinize emin misiniz?')) {
                        deleteBird(bird.id);
                      }
                    }}
                    title="Kuşu Sil"
                    className="absolute top-2 right-2 bg-white/90 backdrop-blur text-slate-400 hover:text-red-600 transition-colors p-1.5 rounded-md hover:bg-red-50 opacity-0 group-hover/image:opacity-100 shadow-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">{bird.bandNumber}</h3>
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-sm font-semibold ${isUnknown ? 'text-slate-500' : isMale ? 'text-blue-500' : 'text-pink-500'}`}>
                    {isUnknown ? '? Bilinmiyor' : isMale ? '♂ Erkek' : '♀ Dişi'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusInfo.bg} ${statusInfo.text}`}>
                    {statusInfo.label}
                  </span>
                </div>
                <div className="text-xs text-slate-500 border-t border-slate-50 pt-2">
                  <span className="font-semibold text-slate-600">Yuvalık:</span> {bird.aviaryName || '-'}
                </div>
              </div>
            );
          })}
          </div>
        )
      )}
        
        {/* Pagination Footer */}
        {filteredBirds.length > 0 && (
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-slate-500 font-medium">
              {filteredBirds.length} Kuş Gösteriliyor
            </span>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex gap-1">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const page = idx + 1;
                  // Basit sayfalama (Çok sayfa varsa ortayı gizle)
                  if (totalPages > 7) {
                    if (page !== 1 && page !== totalPages && Math.abs(page - currentPage) > 1) {
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="w-8 h-8 flex items-center justify-center text-slate-400">...</span>;
                      }
                      return null;
                    }
                  }
                  
                  return (
                    <button 
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded-md border text-sm font-semibold transition-colors ${
                        currentPage === page 
                          ? 'border-blue-600 bg-blue-50 text-blue-600' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <select 
                value={itemsPerPage} 
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 cursor-pointer hover:bg-slate-50 focus:outline-none focus:ring-2 focus:border-blue-500 transition-colors"
              >
                <option value={10}>10 / sayfa</option>
                <option value={25}>25 / sayfa</option>
                <option value={50}>50 / sayfa</option>
                <option value={100}>100 / sayfa</option>
              </select>
            </div>
          </div>
        )}

      <BirdModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addBird}
        birdsList={birds}
      />
    </div>
  );
};

export default Birds;
