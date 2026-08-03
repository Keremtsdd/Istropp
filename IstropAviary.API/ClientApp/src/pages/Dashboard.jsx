import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import { 
  Droplet, Egg, Bird, ShoppingCart, 
  ChevronRight, Users, CheckCircle, Home, 
  Plus, Calendar
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

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-10">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          Hoş geldin, <span className="capitalize">{user?.username || 'Yetkili'}</span> 👋
        </h2>
        <p className="text-slate-500 mt-2">Bugün seni bekleyen işlemler</p>
      </div>

      {/* Hızlı İşlemler (En Üst) */}
      <div>
        <div className="flex items-center gap-2 text-slate-800 font-bold mb-4 text-lg">
          <div className="text-slate-400 font-normal">⚡</div>
          <h3>Hızlı İşlemler</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div onClick={() => navigate('/birds')} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between hover:border-blue-200 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <Plus size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Kuş</h4>
                <p className="text-slate-500 text-xs mt-0.5">Yeni kuş ekle</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500" />
          </div>

          <div onClick={() => navigate('/nests')} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between hover:border-orange-200 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                <Egg size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Yumurta</h4>
                <p className="text-slate-500 text-xs mt-0.5">Yeni yumurta kaydı</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:text-orange-500" />
          </div>

          <div onClick={() => navigate('/nests')} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between hover:border-green-200 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                <Bird size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Yavru</h4>
                <p className="text-slate-500 text-xs mt-0.5">Yeni yavru ekle</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:text-green-500" />
          </div>

          <div onClick={() => navigate('/sales')} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between hover:border-purple-200 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                <ShoppingCart size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Satış</h4>
                <p className="text-slate-500 text-xs mt-0.5">Yeni satış kaydı</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:text-purple-500" />
          </div>

        </div>
      </div>

      {/* Kritik Uyarılar / Bugün Yapılacaklar */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold mb-4 text-lg">
          <Calendar size={22} />
          <h3>Kritik Uyarılar & Bugün</h3>
        </div>

        {(!data.todayTasks || data.todayTasks.length === 0) ? (
          <div className="bg-white rounded-2xl p-6 border border-slate-100 text-center text-slate-500 shadow-sm">
            Bugün için planlanan işlem veya uyarı yok. Harika!
          </div>
        ) : (
          data.todayTasks.map((task, i) => (
            <div key={i} className={`rounded-2xl p-5 border shadow-sm flex items-center justify-between cursor-pointer group transition-colors ${
                task.severity === 'Critical' ? 'bg-red-50 border-red-200 hover:border-red-400' :
                task.severity === 'Warning' ? 'bg-orange-50 border-orange-200 hover:border-orange-400' :
                'bg-blue-50 border-blue-200 hover:border-blue-400'
            }`}>
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-white shadow-sm ${
                    task.severity === 'Critical' ? 'text-red-500' :
                    task.severity === 'Warning' ? 'text-orange-500' :
                    'text-blue-500'
                }`}>
                  {task.type === 'Hatch' ? <Egg size={26} /> : task.type === 'Care' ? <Droplet size={26} /> : <CheckCircle size={26} />}
                </div>
                <div>
                  <h4 className={`font-bold text-lg ${
                    task.severity === 'Critical' ? 'text-red-800' :
                    task.severity === 'Warning' ? 'text-orange-800' :
                    'text-blue-800'
                  }`}>{task.message}</h4>
                  <p className={`text-sm ${
                    task.severity === 'Critical' ? 'text-red-600' :
                    task.severity === 'Warning' ? 'text-orange-600' :
                    'text-blue-600'
                  }`}>{new Date(task.date).toLocaleDateString('tr-TR')}</p>
                </div>
              </div>
              <ChevronRight className="text-slate-400 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
          ))
        )}
      </div>

      {/* Kısayollar */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2 text-slate-500 font-semibold mb-6 text-sm">
          ⭐ Kısayollar
        </div>
        
        <div className="flex flex-wrap items-center gap-16 ml-4">
          <div className="flex items-center gap-3">
            <Users className="text-blue-500" size={24} />
            <div>
              <p className="text-xs text-slate-500 font-medium">Toplam Kuş</p>
              <p className="text-xl font-bold text-slate-800">{data.totalBirds}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Bird className="text-green-500" size={24} />
            <div>
              <p className="text-xs text-slate-500 font-medium">Yeni Kayıt (Ay)</p>
              <p className="text-xl font-bold text-slate-800">15</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Home className="text-orange-500" size={24} />
            <div>
              <p className="text-xs text-slate-500 font-medium">Aktif Yuvalık</p>
              <p className="text-xl font-bold text-slate-800">{data.activeNests}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CheckCircle className="text-purple-500" size={24} />
            <div>
              <p className="text-xs text-slate-500 font-medium">Planlanan İşlem</p>
              <p className="text-xl font-bold text-slate-800">{data.upcomingCarePlans.length}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
