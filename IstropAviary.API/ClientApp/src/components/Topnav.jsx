import { Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Topnav = () => {
  const { user } = useAuth();

  return (
    <div className="h-16 bg-white/70 backdrop-blur-md border-b border-slate-100 flex items-center justify-end px-8 z-10 sticky top-0">
      
      <div className="flex items-center gap-6">
        <button className="text-slate-500 hover:text-slate-800 transition-colors">
          <Settings size={20} />
        </button>
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold uppercase text-sm border border-brand-200">
            EM
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold text-slate-700 capitalize group-hover:text-brand-600 transition-colors">
            Emirhan Manavoğlu
            <ChevronDown size={14} className="text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topnav;
