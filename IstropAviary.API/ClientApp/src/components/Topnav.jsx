import { useState, useRef, useEffect } from 'react';
import { Settings, ChevronDown, LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Topnav = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = 'Emirhan Manavoğlu';
  const initials = 'EM';

  return (
    <div className="h-16 bg-white/70 backdrop-blur-md border-b border-slate-100 flex items-center justify-between md:justify-end px-4 md:px-8 z-10 sticky top-0">
      
      {/* Mobile Menu Toggle */}
      <button 
        className="md:hidden p-2 -ml-2 text-slate-500 hover:text-brand-600 focus:outline-none"
        onClick={onMenuClick}
      >
        <Menu size={24} />
      </button>

      <div className="flex items-center gap-4 md:gap-6">
        <Link to="/settings" className="text-slate-500 hover:text-slate-800 transition-colors hidden md:block">
          <Settings size={20} />
        </Link>
        
        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold uppercase text-sm border border-brand-200">
              {initials}
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-slate-700 capitalize group-hover:text-brand-600 transition-colors">
              {displayName}
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {isOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 overflow-hidden transform origin-top-right transition-all">
              <div className="px-4 py-3 border-b border-slate-50">
                <p className="text-sm font-semibold text-slate-700 capitalize">{displayName}</p>
                <p className="text-xs text-slate-500">Yönetici</p>
              </div>
              
              <Link 
                to="/settings" 
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-600 transition-colors cursor-pointer w-full"
                onClick={() => setIsOpen(false)}
              >
                <Settings size={16} />
                <span>Ayarlar</span>
              </Link>
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer w-full text-left"
              >
                <LogOut size={16} />
                <span>Çıkış Yap</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topnav;
