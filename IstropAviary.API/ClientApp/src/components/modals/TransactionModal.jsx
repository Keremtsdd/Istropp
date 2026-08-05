import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save } from 'lucide-react';
import FormDropdown from '../ui/FormDropdown';

const TransactionModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState({
    date: '',
    desc: '',
    type: 'Gelir',
    category: '',
    amount: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date || '',
        desc: initialData.desc || '',
        type: initialData.type || 'Gelir',
        category: initialData.category || '',
        amount: initialData.amount || ''
      });
    } else {
      setFormData({ date: new Date().toISOString().split('T')[0], desc: '', type: 'Gelir', category: '', amount: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">{initialData ? 'İşlemi Düzenle' : 'Yeni İşlem Ekle'}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200/50 text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <form id="txForm" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">İşlem Türü</label>
                <FormDropdown 
                  value={formData.type}
                  onChange={(val) => handleChange({ target: { name: 'type', value: val }})}
                  options={[
                    { value: 'Gelir', label: 'Gelir' },
                    { value: 'Gider', label: 'Gider' }
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tarih *</label>
                <input 
                  required type="date" name="date" value={formData.date} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-[42px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Açıklama *</label>
              <input 
                required type="text" name="desc" value={formData.desc} onChange={handleChange} placeholder="Örn: Yem Alımı"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tutar (₺) *</label>
              <input 
                required type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="0"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
            İptal
          </button>
          <button type="submit" form="txForm" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-200 flex items-center gap-2 transition-colors">
            <Save size={18} /> Kaydet
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
export default TransactionModal;
