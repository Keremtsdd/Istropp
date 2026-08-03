import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const CarePlanModal = ({ isOpen, onClose, onSave, editingItem, selectedDay }) => {
  const [formData, setFormData] = useState({
    dayNumber: selectedDay || 1,
    name: '',
    purpose: '',
    waterDosage: '',
    foodDosage: ''
  });

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    } else {
      setFormData({
        dayNumber: selectedDay || 1,
        name: '',
        purpose: '',
        waterDosage: '',
        foodDosage: ''
      });
    }
  }, [editingItem, selectedDay, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">
            {editingItem ? 'Takviye Düzenle' : 'Yeni Takviye Ekle'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200/50 text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <form id="careForm" onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ürün Adı *</label>
              <input 
                required type="text" name="name" value={formData.name} onChange={handleChange}
                placeholder="Örn: Calci-Lux, Gervit-W"
                autoComplete="off"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kullanım Amacı / Görevi *</label>
              <textarea 
                required name="purpose" value={formData.purpose} onChange={handleChange}
                placeholder="Örn: Kemik ve yumurta gelişimi için kalsiyum desteği."
                rows="2"
                autoComplete="off"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Suya Dozaj (Opsiyonel)</label>
                <input 
                  type="text" name="waterDosage" value={formData.waterDosage} onChange={handleChange}
                  placeholder="Örn: 1 Litreye 2.5ml"
                  autoComplete="off"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mamaya Dozaj (Ops.)</label>
                <input 
                  type="text" name="foodDosage" value={formData.foodDosage} onChange={handleChange}
                  placeholder="Örn: 100gr'a 4gr"
                  autoComplete="off"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
            İptal
          </button>
          <button type="submit" form="careForm" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-200 flex items-center gap-2 transition-colors">
            <Save size={18} /> {editingItem ? 'Güncelle' : 'Ekle'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarePlanModal;
