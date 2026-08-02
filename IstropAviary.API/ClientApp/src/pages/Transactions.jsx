import { useState, useMemo } from 'react';
import { 
  FileText, Printer, Plus, TrendingUp, TrendingDown, 
  Wallet, MoreVertical, List, Info, ChevronDown 
} from 'lucide-react';

const Transactions = () => {
  const [filterType, setFilterType] = useState('Tümü');

  const initialTransactions = [
    { id: 1, date: '31.07.2025', desc: '2026-045 Lutino (Erkek) Satış', type: 'Gelir', category: 'Kuş Satışı', amount: 1000 },
    { id: 2, date: '31.07.2025', desc: 'Mama Alımı - Pro Yem', type: 'Gider', category: 'Yem', amount: 2250 },
    { id: 3, date: '30.07.2025', desc: '2026-046 Mavi (Erkek) Satış', type: 'Gelir', category: 'Kuş Satışı', amount: 800 },
    { id: 4, date: '30.07.2025', desc: 'Vitamin Takviyesi Alımı', type: 'Gider', category: 'İlaç / Vitamin', amount: 450 },
    { id: 5, date: '29.07.2025', desc: 'Kafes Malzemesi Alımı', type: 'Gider', category: 'Malzeme', amount: 1150 },
    { id: 6, date: '28.07.2025', desc: '2026-047 Yeşil (Dişi) Satış', type: 'Gelir', category: 'Kuş Satışı', amount: 700 },
    { id: 7, date: '28.07.2025', desc: 'Elektrik Gideri', type: 'Gider', category: 'Fatura', amount: 320 },
    { id: 8, date: '27.07.2025', desc: 'Kuluçka Kutusu Alımı', type: 'Gider', category: 'Malzeme', amount: 1300 },
  ];

  const filteredTransactions = useMemo(() => {
    if (filterType === 'Tümü') return initialTransactions;
    return initialTransactions.filter(t => t.type === filterType);
  }, [filterType]);

  const totalIncome = 28650;
  const totalExpense = 11230;
  const netIncome = totalIncome - totalExpense;

  const formatMoney = (val) => new Intl.NumberFormat('tr-TR').format(val) + ' ₺';

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto pb-10">
      
      {/* Header (Dönem Seç Kaldırıldı) */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Gelir / Gider</h2>
          <p className="text-slate-500 mt-1">Tüm gelir ve giderlerinizi takip edin.</p>
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium shadow-sm flex-1 sm:flex-none">
            <FileText size={18} /> PDF Rapor
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium shadow-sm flex-1 sm:flex-none">
            <Printer size={18} /> Yazdır
          </button>
        </div>
      </div>

      {/* Summary Cards (Bakiye Kaldırıldı, 3 Sütun Yapıldı) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Toplam Gelir */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-500 shrink-0">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-1">Toplam Gelir</p>
            <h3 className="text-2xl font-bold text-green-600">{formatMoney(totalIncome)}</h3>
            <p className="text-xs text-slate-400 mt-1">Bu Ay</p>
          </div>
        </div>

        {/* Toplam Gider */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
            <TrendingDown size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-1">Toplam Gider</p>
            <h3 className="text-2xl font-bold text-red-500">{formatMoney(totalExpense)}</h3>
            <p className="text-xs text-slate-400 mt-1">Bu Ay</p>
          </div>
        </div>

        {/* Net Kazanç */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
            <Wallet size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-1">Net Kazanç</p>
            <h3 className="text-2xl font-bold text-blue-600">{formatMoney(netIncome)}</h3>
            <p className="text-xs text-slate-400 mt-1">Bu Ay</p>
          </div>
        </div>

      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* Left Column - Transactions List */}
        <div className="flex-[2] bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
          
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-lg">Son İşlemler</h3>
            
            {/* Filtreleme Dropdown (Tümü, Gelir, Gider) */}
            <div className="relative">
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-lg pl-4 pr-10 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="Tümü">Tümü</option>
                <option value="Gelir">Gelir</option>
                <option value="Gider">Gider</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50/50 text-xs text-slate-400 font-semibold border-b border-slate-100">
                  <th className="p-4 pl-6">Tarih</th>
                  <th className="p-4">Açıklama</th>
                  <th className="p-4 text-center">Tür</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4 text-right pr-10">Tutar</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700 divide-y divide-slate-50">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6 text-slate-500">{tx.date}</td>
                    <td className="p-4 font-medium">{tx.desc}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                        tx.type === 'Gelir' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{tx.category}</td>
                    <td className={`p-4 text-right pr-10 font-bold ${
                      tx.type === 'Gelir' ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {formatMoney(tx.amount)}
                    </td>
                    <td className="p-4 text-center text-slate-400 cursor-pointer hover:text-slate-700">
                      <MoreVertical size={18} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-auto p-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-semibold shadow-sm text-sm">
              <List size={18} /> Tüm İşlemleri Görüntüle
            </button>
            <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 border border-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm text-sm">
              <Plus size={18} /> Yeni İşlem Ekle
            </button>
          </div>

        </div>

        {/* Right Column - Category Distribution (Özet Kaldırıldı) */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
          <h3 className="font-bold text-slate-800 text-lg mb-8">Kategori Dağılımı <span className="text-slate-400 font-normal text-sm">(Bu Ay)</span></h3>
          
          {/* Custom SVG Donut Chart */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            <svg viewBox="0 0 42 42" className="w-full h-full drop-shadow-md">
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f1f5f9" strokeWidth="6"></circle>
              {/* Yem - Blue (37.9%) */}
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#3b82f6" strokeWidth="6" strokeDasharray="37.9 62.1" strokeDashoffset="25"></circle>
              {/* İlaç - Green (19.4%) */}
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#22c55e" strokeWidth="6" strokeDasharray="19.4 80.6" strokeDashoffset="-12.9"></circle>
              {/* Malzeme - Yellow (23.2%) */}
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#eab308" strokeWidth="6" strokeDasharray="23.2 76.8" strokeDashoffset="-32.3"></circle>
              {/* Fatura - Purple (12.9%) */}
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#a855f7" strokeWidth="6" strokeDasharray="12.9 87.1" strokeDashoffset="-55.5"></circle>
              {/* Diğer - Gray (6.6%) */}
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#94a3b8" strokeWidth="6" strokeDasharray="6.6 93.4" strokeDashoffset="-68.4"></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-semibold text-slate-400">Toplam Gider</span>
              <span className="text-lg font-bold text-slate-800">{formatMoney(totalExpense)}</span>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div><span className="font-medium text-slate-700">Yem</span></div>
              <div className="flex items-center gap-3"><span className="font-semibold text-slate-800">4.250 ₺</span><span className="text-slate-400 text-xs w-8 text-right">37.9%</span></div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div><span className="font-medium text-slate-700">İlaç / Vitamin</span></div>
              <div className="flex items-center gap-3"><span className="font-semibold text-slate-800">2.180 ₺</span><span className="text-slate-400 text-xs w-8 text-right">19.4%</span></div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div><span className="font-medium text-slate-700">Malzeme</span></div>
              <div className="flex items-center gap-3"><span className="font-semibold text-slate-800">2.600 ₺</span><span className="text-slate-400 text-xs w-8 text-right">23.2%</span></div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div><span className="font-medium text-slate-700">Fatura</span></div>
              <div className="flex items-center gap-3"><span className="font-semibold text-slate-800">1.450 ₺</span><span className="text-slate-400 text-xs w-8 text-right">12.9%</span></div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div><span className="font-medium text-slate-700">Diğer</span></div>
              <div className="flex items-center gap-3"><span className="font-semibold text-slate-800">750 ₺</span><span className="text-slate-400 text-xs w-8 text-right">6.6%</span></div>
            </div>
          </div>

          <div className="mt-auto">
             <button className="w-full py-2.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium text-sm">
               Detaylı Rapor
             </button>
          </div>

        </div>

      </div>

      {/* Footer Info */}
      <div className="flex items-center gap-2 bg-blue-50/50 text-blue-700 px-4 py-3 rounded-xl border border-blue-100 text-sm font-medium">
        <Info size={18} className="text-blue-500" />
        <span>Bu ay 9 gelir, 7 gider işlemi kaydedildi.</span>
      </div>

    </div>
  );
};

export default Transactions;
