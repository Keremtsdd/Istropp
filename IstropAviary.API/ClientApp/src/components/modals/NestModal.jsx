import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save } from 'lucide-react';

const NestModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState({
    nestCode: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ nestCode: initialData.nestCode });
    } else {
      setFormData({ nestCode: '' });
    }
  }, [initialData, isOpen]);

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
    const success = onSave(formData, initialData?.id);
    if (success !== false) {
      setFormData({ nestCode: '' });
      onClose();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">{initialData ? 'Yuvalığı Düzenle' : 'Yeni Yuvalık Ekle'}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200/50 text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <form id="nestForm" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Yuvalık Kodu *</label>
              <input 
                required type="text" name="nestCode" value={formData.nestCode} onChange={handleChange}
                placeholder="Örn: Y-01, Kafes-3"
                autoComplete="off"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
            İptal
          </button>
          <button type="submit" form="nestForm" className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl shadow-sm shadow-orange-200 flex items-center gap-2 transition-colors">
            <Save size={18} /> Kaydet
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default NestModal;
