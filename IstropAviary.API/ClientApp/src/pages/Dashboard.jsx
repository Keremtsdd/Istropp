import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { 
  Droplet, Egg, Bird, ShoppingCart, 
  ChevronRight, Users, CheckCircle, Home, 
  Calendar, ClipboardList, DollarSign, 
  BarChart2, Settings as SettingsIcon,
  TrendingUp, AlertCircle, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({
    totalBirds: 0,
    activeNests: 0,
    monthlySales: 0,
    netProfit: 0,
    upcomingCarePlans: [],
    todayTasks: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosClient.get('/dashboard');
        setData(response.data);
      } catch (error) {
        console.error("Dashboard data fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Yükleniyor...</div>;

  const today = new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Navigation Hub Items
  const navItems = [
    { title: 'Kuşlar', desc: 'Kuş envanterini ve soyağacını yönet', icon: <Bird size={28} />, path: '/birds', color: 'bg-blue-50 text-blue-600', hover: 'hover:border-blue-200 hover:shadow-blue-100' },
    { title: 'Yuvalıklar', desc: 'Kuluçka ve yumurta takibi yap', icon: <Home size={28} />, path: '/nests', color: 'bg-orange-50 text-orange-600', hover: 'hover:border-orange-200 hover:shadow-orange-100' },
    { title: 'Bakım Planı', desc: 'İlaç ve beslenme takvimini düzenle', icon: <ClipboardList size={28} />, path: '/care-plans', color: 'bg-teal-50 text-teal-600', hover: 'hover:border-teal-200 hover:shadow-teal-100' },
    { title: 'Satış', desc: 'Satışları ve rezervasyonları izle', icon: <ShoppingCart size={28} />, path: '/sales', color: 'bg-purple-50 text-purple-600', hover: 'hover:border-purple-200 hover:shadow-purple-100' },
    { title: 'Gelir / Gider', desc: 'Finansal işlemleri kontrol et', icon: <DollarSign size={28} />, path: '/transactions', color: 'bg-green-50 text-green-600', hover: 'hover:border-green-200 hover:shadow-green-100' },
    { title: 'Raporlar', desc: 'İşletme istatistiklerini analiz et', icon: <BarChart2 size={28} />, path: '/reports', color: 'bg-indigo-50 text-indigo-600', hover: 'hover:border-indigo-200 hover:shadow-indigo-100' },
    { title: 'Ayarlar', desc: 'Sistem ve işletme ayarlarını yapılandır', icon: <SettingsIcon size={28} />, path: '/settings', color: 'bg-slate-100 text-slate-600', hover: 'hover:border-slate-300 hover:shadow-slate-200' },
  ];

  return (
    <div className="max-w-[1500px] mx-auto space-y-8 pb-12">
      
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
           <Bird size={200} />
        </div>
        <div className="relative z-10">
          <p className="text-slate-400 font-medium mb-2">{today}</p>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Hoş geldin, <span className="text-blue-400 capitalize">Emirhan</span>
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl">
            İşletmende bugün işler nasıl gidiyor? Tüm süreçlerini tek bir merkezden kolayca yönetebilirsin.
          </p>
        </div>
      </div>

      {/* Top Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <Users size={26} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Toplam Kuş</p>
            <p className="text-2xl font-bold text-slate-800">{data.totalBirds}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
            <Home size={26} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Aktif Yuvalık</p>
            <p className="text-2xl font-bold text-slate-800">{data.activeNests}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0">
            <TrendingUp size={26} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Aylık Satış</p>
            <p className="text-2xl font-bold text-slate-800">{data.monthlySales || '0'} ₺</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-teal-50 text-teal-500 flex items-center justify-center shrink-0">
            <Activity size={26} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Aktif Planlar</p>
            <p className="text-2xl font-bold text-slate-800">{data.upcomingCarePlans?.length || '0'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Navigation Hub */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-800">Modüller</h3>
            <span className="text-sm text-slate-400 font-medium">Hızlı Erişim</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {navItems.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => navigate(item.path)}
                className={`bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex items-start gap-4 ${item.hover} hover:shadow-lg`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300 ${item.color}`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                     <h4 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{item.title}</h4>
                     <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <p className="text-sm text-slate-500 leading-snug">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Alerts Sidebar */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-800">Bugün</h3>
              <span className="text-sm text-slate-400 font-medium">Görevler</span>
            </div>
            {data.todayTasks?.length > 0 && (
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">
                {data.todayTasks.length} Uyarı
              </span>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-2">
            {(!data.todayTasks || data.todayTasks.length === 0) ? (
              <div className="p-10 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                  <CheckCircle size={32} />
                </div>
                <h4 className="text-lg font-bold text-slate-700 mb-1">Her şey yolunda!</h4>
                <p className="text-sm text-slate-500">Bugün için planlanan acil bir işlem veya uyarı bulunmuyor.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {data.todayTasks.map((task, i) => (
                  <div key={i} className={`p-4 rounded-2xl border flex items-start gap-4 transition-colors cursor-pointer ${
                      task.severity === 'Critical' ? 'bg-red-50/50 border-red-100 hover:bg-red-50' :
                      task.severity === 'Warning' ? 'bg-orange-50/50 border-orange-100 hover:bg-orange-50' :
                      'bg-blue-50/50 border-blue-100 hover:bg-blue-50'
                  }`}>
                    <div className={`mt-1 shrink-0 ${
                        task.severity === 'Critical' ? 'text-red-500' :
                        task.severity === 'Warning' ? 'text-orange-500' :
                        'text-blue-500'
                    }`}>
                      {task.type === 'Hatch' ? <Egg size={20} /> : task.type === 'Care' ? <Droplet size={20} /> : <AlertCircle size={20} />}
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm mb-0.5 ${
                        task.severity === 'Critical' ? 'text-red-800' :
                        task.severity === 'Warning' ? 'text-orange-800' :
                        'text-blue-800'
                      }`}>{task.message}</h4>
                      <p className={`text-xs ${
                        task.severity === 'Critical' ? 'text-red-600/80' :
                        task.severity === 'Warning' ? 'text-orange-600/80' :
                        'text-blue-600/80'
                      }`}>{new Date(task.date).toLocaleDateString('tr-TR')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Sürüm Bilgisi */}
          <div className="text-center pt-4">
             <p className="text-xs text-slate-400 font-medium">Istrop Aviary v1.0.0</p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
