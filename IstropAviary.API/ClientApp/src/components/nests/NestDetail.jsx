import { useState, useRef, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { ArrowLeft, Egg, Plus, Check, ChevronDown, Heart, CalendarDays, Trash2 } from 'lucide-react';

const FormDropdown = ({ options, value, onChange, placeholder = "Seçiniz..." }) => {
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
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all"
      >
        <span className={selectedOption ? "text-slate-800" : "text-slate-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/50 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-48 overflow-y-auto">
          {options.map((opt) => (
            <div 
              key={opt.value}
              className={`px-4 py-2 text-sm cursor-pointer transition-colors ${String(value) === String(opt.value) ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
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

const NestDetail = ({ nest, onBack }) => {
  const { birds, clutches, eggs, deleteEgg, pairBirds, registerEgg, registerHatch } = useData();
  const [selectedMale, setSelectedMale] = useState('');
  const [selectedFemale, setSelectedFemale] = useState('');

  // Find active clutch for this nest
  const activeClutch = clutches.find(c => c.nestId === nest.id && c.status === 'Aktif');
  
  // Find eggs for active clutch
  const clutchEggs = activeClutch ? eggs.filter(e => e.clutchId === activeClutch.id) : [];

  const handlePair = () => {
    if (!selectedMale || !selectedFemale) return alert('Erkek ve Dişi seçiniz');
    pairBirds(Number(selectedMale), Number(selectedFemale), nest.id);
  };

  const handleAddEgg = () => {
    if(!activeClutch) return;
    const today = new Date().toISOString().split('T')[0];
    registerEgg(activeClutch.id, today);
  };

  const handleHatch = (eggId) => {
    const today = new Date().toISOString().split('T')[0];
    registerHatch(eggId, today);
  };

  const handleDeleteEgg = (eggId) => {
    if(window.confirm('Bu yumurtayı silmek istediğinize emin misiniz?')) {
      deleteEgg(eggId);
    }
  };

  // Sadece satılık olmayan (status !== 4) kuşlar eşleştirilebilir
  const availableMales = birds.filter(b => (b.gender === 0 || b.gender === '0' || b.gender === 'Erkek') && parseInt(b.status) !== 4);
  const availableFemales = birds.filter(b => (b.gender === 1 || b.gender === '1' || b.gender === 'Dişi') && parseInt(b.status) !== 4);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Yuvalık Detayı</h2>
          <p className="text-sm text-slate-500">{nest.nestCode} numaralı yuvalık</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">

        {!activeClutch ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Heart size={20} className="text-pink-500" />
              <h3 className="text-lg font-bold text-slate-800">Yeni Çift Oluştur</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <span className="text-blue-500 text-lg leading-none">♂</span> Erkek Kuş Seç
                </label>
                <FormDropdown 
                  value={selectedMale}
                  onChange={setSelectedMale}
                  options={[
                    { value: '', label: 'Seçiniz...' },
                    ...availableMales.map(m => ({ value: m.id, label: m.bandNumber }))
                  ]}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <span className="text-pink-500 text-lg leading-none">♀</span> Dişi Kuş Seç
                </label>
                <FormDropdown 
                  value={selectedFemale}
                  onChange={setSelectedFemale}
                  options={[
                    { value: '', label: 'Seçiniz...' },
                    ...availableFemales.map(f => ({ value: f.id, label: f.bandNumber }))
                  ]}
                />
              </div>
            </div>
            
            <button 
              onClick={handlePair}
              className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3.5 rounded-xl font-bold transition-all w-full flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
            >
              <Heart size={18} /> Eşleştir ve Üretimi Başlat
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Ebeveynler Kartı */}
            <div className="relative bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden flex items-center justify-center">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm border border-slate-100 z-10">
                <Heart size={18} className="text-rose-400 fill-rose-100" />
              </div>
              
              <div className="flex w-full">
                <div className="flex-1 flex flex-col items-center justify-center pr-6">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mb-3 shadow-inner">
                    <span className="text-3xl leading-none">♂</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Baba (Erkek)</p>
                  <p className="font-bold text-lg text-slate-800">{birds.find(b => b.id === activeClutch.maleId)?.bandNumber || 'Bilinmiyor'}</p>
                </div>
                
                <div className="w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent"></div>
                
                <div className="flex-1 flex flex-col items-center justify-center pl-6">
                  <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 mb-3 shadow-inner">
                    <span className="text-3xl leading-none">♀</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Anne (Dişi)</p>
                  <p className="font-bold text-lg text-slate-800">{birds.find(b => b.id === activeClutch.femaleId)?.bandNumber || 'Bilinmiyor'}</p>
                </div>
              </div>
            </div>

            {/* Yumurtalar Bölümü */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Egg size={22} className="text-amber-500" />
                  <h3 className="text-lg font-bold text-slate-800">Yumurtalar</h3>
                </div>
                <button 
                  onClick={handleAddEgg}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-amber-500/20"
                >
                  <Plus size={18} /> Yeni Yumurta Ekle
                </button>
              </div>

              {clutchEggs.length === 0 ? (
                <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <Egg size={32} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 font-medium">Bu kuluçkada henüz yumurta kaydı yok.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {clutchEggs.map((egg, index) => (
                    <div 
                      key={egg.id} 
                      className="group flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-5 border border-slate-200 rounded-2xl bg-white hover:border-amber-200 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                          <Egg size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-base mb-1">{index + 1}. Yumurta</p>
                          <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                            <span className="flex items-center gap-1"><CalendarDays size={14}/> {egg.layDate}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span>Tahmini Çıkış: <span className="text-slate-700">{egg.estimatedHatchDate}</span></span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        {egg.status === 'Dolu' ? (
                          <button 
                            onClick={() => handleHatch(egg.id)}
                            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-md shadow-emerald-500/20"
                          >
                            <Check size={16} /> Yavru Çıktı
                          </button>
                        ) : (
                          <span className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold border border-slate-200">
                            {egg.status}
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteEgg(egg.id)}
                          className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors border border-transparent hover:border-red-100"
                          title="Yumurtayı Sil"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NestDetail;
