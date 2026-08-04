import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ArrowLeft, Egg, Plus, Check } from 'lucide-react';

const NestDetail = ({ nest, onBack }) => {
  const { birds, clutches, eggs, pairBirds, registerEgg, registerHatch } = useData();
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

  // Müsait kuşları filtrele
  const availableMales = birds.filter(b => (b.gender === 0 || b.gender === '0' || b.gender === 'Erkek') && b.status !== 1 && b.status !== 4);
  const availableFemales = birds.filter(b => (b.gender === 1 || b.gender === '1' || b.gender === 'Dişi') && b.status !== 1 && b.status !== 4);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium mb-4"
      >
        <ArrowLeft size={18} /> Yuvalıklara Dön
      </button>

      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Yuvalık: {nest.nestCode}</h2>

        {!activeClutch ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700">Yeni Çift Oluştur (Pairing Event)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-600 mb-2">Erkek Seç</label>
                <select 
                  className="w-full p-3 border border-slate-200 rounded-xl"
                  value={selectedMale} onChange={e => setSelectedMale(e.target.value)}
                >
                  <option value="">Seçiniz...</option>
                  {availableMales.map(m => (
                    <option key={m.id} value={m.id}>{m.bandNumber}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-2">Dişi Seç</label>
                <select 
                  className="w-full p-3 border border-slate-200 rounded-xl"
                  value={selectedFemale} onChange={e => setSelectedFemale(e.target.value)}
                >
                  <option value="">Seçiniz...</option>
                  {availableFemales.map(f => (
                    <option key={f.id} value={f.id}>{f.bandNumber}</option>
                  ))}
                </select>
              </div>
            </div>
            <button 
              onClick={handlePair}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors w-full"
            >
              Eşleştir ve Üretimi Başlat
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex-1 text-center border-r border-slate-200">
                <p className="text-sm text-slate-500 mb-1">Erkek (Baba)</p>
                <p className="font-bold text-blue-600">{birds.find(b => b.id === activeClutch.maleId)?.bandNumber || 'Bilinmiyor'}</p>
              </div>
              <div className="flex-1 text-center">
                <p className="text-sm text-slate-500 mb-1">Dişi (Anne)</p>
                <p className="font-bold text-pink-600">{birds.find(b => b.id === activeClutch.femaleId)?.bandNumber || 'Bilinmiyor'}</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-700">Yumurtalar (Egg Event)</h3>
              <button 
                onClick={handleAddEgg}
                className="flex items-center gap-2 bg-amber-100 text-amber-700 hover:bg-amber-200 px-4 py-2 rounded-lg font-bold text-sm transition-colors"
              >
                <Plus size={16} /> Yumurta Geldi
              </button>
            </div>

            {clutchEggs.length === 0 ? (
              <p className="text-slate-500 text-center py-4">Henüz yumurta yok.</p>
            ) : (
              <div className="space-y-3">
                {clutchEggs.map((egg, index) => (
                  <div key={egg.id} className="flex justify-between items-center p-4 border border-slate-200 rounded-xl bg-white">
                    <div className="flex items-center gap-3">
                      <Egg size={20} className="text-amber-500" />
                      <div>
                        <p className="font-bold text-slate-800">{index + 1}. Yumurta</p>
                        <p className="text-xs text-slate-500">Yumurtlama: {egg.layDate} • Tahmini Çıkış: {egg.estimatedHatchDate}</p>
                      </div>
                    </div>
                    <div>
                      {egg.status === 'Dolu' ? (
                        <button 
                          onClick={() => handleHatch(egg.id)}
                          className="flex items-center gap-2 bg-green-50 text-green-700 hover:bg-green-100 px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                        >
                          <Check size={16} /> Çıktı (Yavruya Dönüştür)
                        </button>
                      ) : (
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold border border-slate-200">
                          {egg.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NestDetail;
