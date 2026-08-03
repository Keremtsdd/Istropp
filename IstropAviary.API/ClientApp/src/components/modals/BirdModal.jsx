import { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const BirdModal = ({ isOpen, onClose, onSave, birdsList }) => {
  const [formData, setFormData] = useState({
    bandNumber: '',
    gender: 0, // 0 = Erkek, 1 = Dişi, 2 = Unknown
    mutation: '',
    birthDate: '',
    status: 1, // Default: Breeder
    motherId: '',
    fatherId: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Formatting data for backend
    const dataToSubmit = {
      ...formData,
      gender: parseInt(formData.gender),
      status: parseInt(formData.status),
      motherId: formData.motherId ? parseInt(formData.motherId) : null,
      fatherId: formData.fatherId ? parseInt(formData.fatherId) : null,
      birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : null
    };

    try {
      await onSave(dataToSubmit);
      // Reset form
      setFormData({
        bandNumber: '', gender: 0, mutation: '', birthDate: '', status: 1, motherId: '', fatherId: ''
      });
      onClose();
    } catch (error) {
      console.error("Kaydedilemedi", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">Yeni Kuş Ekle</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200/50 text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <form id="birdForm" onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bilezik No *</label>
                <input 
                  required
                  type="text" 
                  name="bandNumber"
                  value={formData.bandNumber}
                  onChange={handleChange}
                  placeholder="Örn: TR-23-1234"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cinsiyet *</label>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value={0}>Erkek</option>
                  <option value={1}>Dişi</option>
                  <option value={2}>Bilinmiyor</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mutasyon / Renk</label>
                <input 
                  type="text" 
                  name="mutation"
                  value={formData.mutation}
                  onChange={handleChange}
                  placeholder="Örn: Lutino, Albino..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Durum *</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value={1}>Damızlık</option>
                  <option value={2}>Yavru</option>
                  <option value={3}>Dinlenmede</option>
                  <option value={4}>Satılık</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Doğum Tarihi</label>
              <input 
                type="date" 
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-4 mt-2">
              <div className="flex items-center gap-2 text-blue-800 font-semibold mb-1">
                <AlertCircle size={18} />
                <span>Soy Ağacı (Opsiyonel)</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-blue-900 mb-1.5">Baba Kuş</label>
                  <select 
                    name="fatherId"
                    value={formData.fatherId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                  >
                    <option value="">Seçiniz...</option>
                    {birdsList?.filter(b => b.gender === 'Male' || b.gender === 'Erkek' || b.gender === '0').map(b => (
                      <option key={b.id} value={b.id}>{b.bandNumber} ({b.mutation || 'Mutasyon Yok'})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-900 mb-1.5">Anne Kuş</label>
                  <select 
                    name="motherId"
                    value={formData.motherId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none text-sm"
                  >
                    <option value="">Seçiniz...</option>
                    {birdsList?.filter(b => b.gender === 'Female' || b.gender === 'Dişi' || b.gender === '1').map(b => (
                      <option key={b.id} value={b.id}>{b.bandNumber} ({b.mutation || 'Mutasyon Yok'})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            İptal
          </button>
          <button 
            type="submit"
            form="birdForm"
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-200 flex items-center gap-2 transition-colors disabled:opacity-70"
          >
            {loading ? 'Kaydediliyor...' : (
              <>
                <Save size={18} /> Kaydet
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default BirdModal;
