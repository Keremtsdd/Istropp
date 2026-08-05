import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

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
        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg flex items-center justify-between cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all text-sm font-medium h-[38px]"
      >
        <span className={selectedOption ? "text-slate-700" : "text-slate-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-1.5 w-32 bg-white border border-slate-200 rounded-lg shadow-lg shadow-slate-200/50 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {options.map((opt) => (
            <div 
              key={opt.value}
              className={`px-4 py-2 text-sm cursor-pointer transition-colors ${String(value) === String(opt.value) ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
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

export default FormDropdown;
