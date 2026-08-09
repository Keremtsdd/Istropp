import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, AlertCircle, ChevronDown, Camera } from 'lucide-react';

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

const BirdModal = ({ isOpen, onClose, onSave, birdsList, initialData = null }) => {
  const [formData, setFormData] = useState({
    bandNumber: '',
    gender: 0,
    motherId: '',
    fatherId: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    setImageFile(null);
    if (initialData) {
      setFormData({
        bandNumber: initialData.bandNumber || '',
        gender: initialData.gender ?? 0,
        motherId: initialData.motherId || '',
        fatherId: initialData.fatherId || ''
      });
      setImagePreview(initialData.imageUrl ? `http://localhost:5010${initialData.imageUrl}` : null);
    } else {
      setImagePreview(null);
      // Calculate next band number
      let nextBand = '';
      if (birdsList && birdsList.length > 0) {
        let maxNum = -1;
        let prefix = '';
        let paddingLength = 3;

        birdsList.forEach(bird => {
          const band = bird.bandNumber;
          if (band) {
            const match = band.match(/^(.*?)(\d+)$/);
            if (match) {
              const numStr = match[2];
              const num = parseInt(numStr, 10);
              if (num > maxNum) {
                maxNum = num;
                prefix = match[1];
                paddingLength = numStr.length;
              }
            }
          }
        });

        if (maxNum !== -1) {
          nextBand = prefix + String(maxNum + 1).padStart(paddingLength, '0');
        }
      }

      setFormData({ bandNumber: nextBand, gender: 0, motherId: '', fatherId: '' });
    }
  }, [initialData, isOpen, birdsList]);

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
      status: 0, // 0 = Breeder (Damızlık). Yavru (1) sadece otomatik eklendiğinde.
      mutation: 'Bilinmiyor',
      motherId: formData.motherId ? parseInt(formData.motherId) : null,
      fatherId: formData.fatherId ? parseInt(formData.fatherId) : null,
    };

    try {
      if (initialData) {
        await onSave({ ...dataToSubmit, id: initialData.id }, imageFile);
      } else {
        await onSave(dataToSubmit, imageFile);
      }
      onClose();
    } catch (error) {
      console.error("Kaydedilemedi", error);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-visible animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
          <h3 className="text-lg font-bold text-slate-800">{initialData ? 'Kuşu Düzenle' : 'Yeni Kuş Ekle'}</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200/50 text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form id="birdForm" onSubmit={handleSubmit} className="space-y-5">
            
            {/* Fotoğraf Yükleme Alanı */}
            <div className="flex flex-col items-center justify-center">
              <label className="relative cursor-pointer group">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-2 border-dashed ${imagePreview ? 'border-transparent' : 'border-slate-300 hover:border-blue-500'} bg-slate-50 transition-colors`}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-slate-400 flex flex-col items-center mt-2">
                      <Camera size={24} className="mb-1 text-slate-300" />
                      <span className="text-[10px] font-bold">FOTOĞRAF</span>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-semibold">Değiştir</span>
                </div>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }} 
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bilezik No *</label>
                <input 
                  required
                  type="text" 
                  name="bandNumber"
                  value={formData.bandNumber}
                  onChange={handleChange}
                  placeholder="Örn: 2026-001"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cinsiyet *</label>
                <FormDropdown 
                  value={formData.gender}
                  onChange={(val) => handleChange({ target: { name: 'gender', value: val }})}
                  options={[
                    { value: 0, label: 'Erkek' },
                    { value: 1, label: 'Dişi' },
                    { value: 2, label: 'Bilinmiyor' }
                  ]}
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-4 mt-2">
              <div className="flex items-center gap-2 text-blue-800 font-semibold mb-1">
                <AlertCircle size={18} />
                <span>Soy Ağacı (Opsiyonel)</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-blue-900 mb-1.5">Baba Kuş</label>
                  <FormDropdown 
                    value={formData.fatherId}
                    onChange={(val) => handleChange({ target: { name: 'fatherId', value: val }})}
                    placeholder="Seçiniz..."
                    options={[
                      { value: '', label: 'Seçiniz...' },
                      ...(birdsList?.filter(b => b.gender === 'Male' || b.gender === 'Erkek' || b.gender === '0' || b.gender === 0).map(b => ({
                        value: b.id,
                        label: `${b.bandNumber} (${b.mutation || 'Mutasyon Yok'})`
                      })) || [])
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-900 mb-1.5">Anne Kuş</label>
                  <FormDropdown 
                    value={formData.motherId}
                    onChange={(val) => handleChange({ target: { name: 'motherId', value: val }})}
                    placeholder="Seçiniz..."
                    options={[
                      { value: '', label: 'Seçiniz...' },
                      ...(birdsList?.filter(b => b.gender === 'Female' || b.gender === 'Dişi' || b.gender === '1' || b.gender === 1).map(b => ({
                        value: b.id,
                        label: `${b.bandNumber} (${b.mutation || 'Mutasyon Yok'})`
                      })) || [])
                    ]}
                  />
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
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
    </div>,
    document.body
  );
};

export default BirdModal;
