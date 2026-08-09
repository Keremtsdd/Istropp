import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, ChevronDown } from 'lucide-react';

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
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all"
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
              className={`px-4 py-2 text-sm cursor-pointer transition-colors ${String(value) === String(opt.value) ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
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

const FormMultiDropdown = ({ options, value = [], onChange, placeholder = "Seçiniz..." }) => {
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

  const selectedOptions = options.filter(opt => value.includes(opt.value));
  
  const handleToggle = (optValue) => {
    if (value.includes(optValue)) {
      onChange(value.filter(v => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all min-h-[46px]"
      >
        <span className={selectedOptions.length > 0 ? "text-slate-800 line-clamp-1" : "text-slate-400"}>
          {selectedOptions.length > 0 ? selectedOptions.map(o => o.label).join(', ') : placeholder}
        </span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/50 py-1.5 z-[110] animate-in fade-in slide-in-from-top-2 duration-150 max-h-48 overflow-y-auto">
          {options.map((opt) => {
            if (!opt.value) return null; // Skip empty option if any
            const isSelected = value.includes(opt.value);
            return (
              <div 
                key={opt.value}
                className={`px-4 py-2 text-sm cursor-pointer transition-colors flex items-center gap-3 ${isSelected ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle(opt.value);
                }}
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                  {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const SaleModal = ({ isOpen, onClose, onSave, birds, initialData = null }) => {
  const [formData, setFormData] = useState({
    birdIds: [],
    buyerName: '',
    buyerPhone: '',
    buyerAddress: '',
    price: '',
    date: '',
    status: 'Beklemede',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        birdIds: initialData.saleDetails ? initialData.saleDetails.map(d => d.birdId) : [],
        buyerName: initialData.customerName || '',
        buyerPhone: initialData.customerPhone || '',
        buyerAddress: initialData.customerCity || '',
        price: initialData.totalAmount || '',
        date: initialData.date ? initialData.date.split('T')[0] : '',
        status: initialData.paymentType || 'Tamamlandı',
        notes: initialData.notes || '',
        saleNumber: initialData.saleNumber || ''
      });
    } else {
      setFormData({ birdIds: [], buyerName: '', buyerPhone: '', buyerAddress: '', price: '', date: '', status: 'Tamamlandı', notes: '', saleNumber: '' });
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
    if (formData.birdIds.length === 0) {
      alert("Lütfen en az bir kuş seçin.");
      return;
    }
    onSave(formData);
    setFormData({ birdIds: [], buyerName: '', buyerPhone: '', buyerAddress: '', price: '', date: '', status: 'Beklemede', notes: '' });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">{initialData ? 'Satışı Düzenle' : 'Yeni Satış Ekle'}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200/50 text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <form id="saleForm" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kuş Seç *</label>
              <FormMultiDropdown 
                value={formData.birdIds}
                onChange={(val) => handleChange({ target: { name: 'birdIds', value: val }})}
                placeholder="Seçiniz..."
                options={birds
                  ?.filter(b => b.status !== 'Sold' || formData.birdIds.includes(b.id))
                  .map(b => ({ value: b.id, label: `${b.bandNumber} - ${b.mutation || 'Mutasyon Yok'}` })) || []}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Alıcı Adı *</label>
                <input 
                  required type="text" name="buyerName" value={formData.buyerName} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Telefon Numarası</label>
                <input 
                  type="tel" name="buyerPhone" value={formData.buyerPhone} onChange={handleChange}
                  placeholder="05XX XXX XX XX"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Adres</label>
                <textarea 
                  name="buyerAddress" value={formData.buyerAddress} onChange={handleChange} rows="2"
                  placeholder="Gönderim yapılacak adres..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Not</label>
                <textarea 
                  name="notes" value={formData.notes} onChange={handleChange} rows="2"
                  placeholder="Satışla ilgili özel bir not ekleyin..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Fiyat (₺) *</label>
                <input 
                  required type="number" name="price" value={formData.price} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tarih *</label>
                <input 
                  required type="date" name="date" value={formData.date} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Durum</label>
              <FormDropdown 
                value={formData.status}
                onChange={(val) => handleChange({ target: { name: 'status', value: val }})}
                options={[
                  { value: 'Tamamlandı', label: 'Tamamlandı' },
                  { value: 'Beklemede', label: 'Beklemede (Kapora Alındı)' }
                ]}
              />
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
            İptal
          </button>
          <button type="submit" form="saleForm" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-emerald-200 flex items-center gap-2 transition-colors">
            <Save size={18} /> Kaydet
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SaleModal;
