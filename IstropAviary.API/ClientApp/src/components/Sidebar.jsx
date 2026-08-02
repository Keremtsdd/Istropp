import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Bird, Home, DollarSign, List, Calendar, FileText, Settings } from 'lucide-react';

const Sidebar = () => {
  const menus = [
    { name: 'Ana Sayfa', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Kuşlar', path: '/birds', icon: <Bird size={20} /> },
    { name: 'Yuvalıklar', path: '/nests', icon: <Home size={20} /> },
    { name: 'Bakım Planı', path: '/careplans', icon: <Calendar size={20} /> },
    { name: 'Satış', path: '/sales', icon: <DollarSign size={20} /> },
    { name: 'Gelir / Gider', path: '/transactions', icon: <List size={20} /> },
    { name: 'Raporlar', path: '/reports', icon: <FileText size={20} /> },
    { name: 'Ayarlar', path: '/settings', icon: <Settings size={20} /> },
  ];

  const today = new Date();
  const dateStr = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }).format(today);
  const dayName = new Intl.DateTimeFormat('tr-TR', { weekday: 'long' }).format(today);

  return (
    <div className="w-64 bg-white border-r border-slate-100 flex flex-col h-full shadow-sm z-20">
      <div className="h-16 flex items-center px-6 pt-4">
        <img src="/logo.png" alt="Istrop Aviary Logo" className="w-8 h-8 mr-2 object-contain drop-shadow-sm" />
        <h1 className="text-sm font-bold text-slate-800 tracking-wider uppercase mt-1">Istrop Aviary</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
        {menus.map((menu) => (
          <NavLink
            key={menu.name}
            to={menu.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-50 text-blue-600 font-semibold shadow-[0_0_0_1px_rgba(37,99,235,0.1)]' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium'
              }`
            }
          >
            {menu.icon}
            <span className="text-sm">{menu.name}</span>
          </NavLink>
        ))}
      </div>
      
      <div className="p-6">
        <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
          <Calendar className="text-slate-400 shrink-0" size={24} />
          <div>
            <p className="text-sm font-bold text-slate-700">{dateStr}</p>
            <p className="text-xs text-slate-500 capitalize">{dayName}</p>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-4 ml-2">v1.0.0</p>
      </div>
    </div>
  );
};

export default Sidebar;
