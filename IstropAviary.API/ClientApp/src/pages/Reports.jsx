import React, { useMemo } from 'react';
import { FileText, Printer, Calendar, Info, Bird, Home, DollarSign, Egg, ChevronDown, Download } from 'lucide-react';
import { useData } from '../context/DataContext';

const Reports = () => {
  const { birds, nests, pairs, eggs, transactions } = useData();

  // 1. Kuş Raporu Hesaplamaları
  const birdStats = useMemo(() => {
    const total = birds.length;
    // Damızlık (1, 'Breeder', 'Available', 'Damızlık')
    const damizlik = birds.filter(b => b.status === 1 || String(b.status) === 'Available' || String(b.status) === 'Breeder' || String(b.status) === 'Damızlık').length;
    // Yavru (2, 'Chick', 'Yavru')
    const yavru = birds.filter(b => b.status === 2 || String(b.status) === 'Chick' || String(b.status) === 'Yavru').length;
    // Satılık (4, 'Sold', 'Satılık')
    const satilik = birds.filter(b => b.status === 4 || String(b.status) === 'Sold' || String(b.status) === 'Satılık').length;
    return { total, damizlik, yavru, satilik };
  }, [birds]);

  // 2. Yuvalık Raporu Hesaplamaları
  const nestStats = useMemo(() => {
    const total = nests.length;
    let active = 0;
    
    nests.forEach(nest => {
      const activePair = pairs.find(p => p.nestId === nest.id && p.isActive);
      const pairEggs = eggs.filter(e => e.pairId === activePair?.id);
      const hatchCount = pairEggs.filter(e => String(e.status) === 'Hatched' || e.status === 1).length;
      const eggCount = pairEggs.length;
      
      let isBoş = true;
      if (hatchCount > 0) isBoş = false;
      else if (eggCount > 0) isBoş = false;
      else if (activePair) isBoş = false;
      
      if (!isBoş) {
        active++;
      }
    });

    const bos = total - active;
    return { total, active, bos };
  }, [nests, pairs, eggs]);

  // 3. Finans Özeti Hesaplamaları
  const financeStats = useMemo(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach(t => {
      const amount = Number(t.amount) || 0;
      if (t.type === 'Income' || String(t.type) === 'Gelir' || t.type === 0) {
        income += amount;
      } else if (t.type === 'Expense' || String(t.type) === 'Gider' || t.type === 1) {
        expense += amount;
      }
    });

    return {
      income,
      expense,
      net: income - expense
    };
  }, [transactions]);

  // 4. Üretim Özeti Hesaplamaları
  const productionStats = useMemo(() => {
    const total = eggs.length;
    const hatched = eggs.filter(e => String(e.status) === 'Hatched' || e.status === 1).length;
    const efficiency = total > 0 ? ((hatched / total) * 100).toFixed(1) : 0;
    return { total, hatched, efficiency };
  }, [eggs]);

  const formatMoney = (val) => new Intl.NumberFormat('tr-TR').format(val || 0) + ' ₺';

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Raporlar</h2>
          <p className="text-slate-500 mt-1">İşletmenizle ilgili temel istatistikleri görüntüleyin ve analiz edin.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Kuş Raporu */}
        <div className="bg-white rounded-2xl p-6 print:p-3 border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="flex items-center gap-4 print:gap-2 mb-6 print:mb-2">
            <div className="w-12 h-12 print:w-8 print:h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <Bird className="w-6 h-6 print:w-4 print:h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-700 print:text-sm">Kuş Raporu</h3>
              <p className="text-xs text-slate-500 font-medium print:text-[10px]">Toplam Kuş</p>
            </div>
          </div>
          <div className="text-4xl print:text-2xl font-bold text-slate-800 mb-6 print:mb-2">{birdStats.total}</div>
          <div className="space-y-2 print:space-y-1">
            <div className="flex justify-between items-center text-sm print:text-xs font-medium">
              <div className="flex items-center gap-2 text-slate-600"><div className="w-2.5 h-2.5 print:w-1.5 print:h-1.5 rounded-full bg-green-500"></div>Damızlık</div>
              <span className="text-slate-800">{birdStats.damizlik}</span>
            </div>
            <div className="flex justify-between items-center text-sm print:text-xs font-medium">
              <div className="flex items-center gap-2 text-slate-600"><div className="w-2.5 h-2.5 print:w-1.5 print:h-1.5 rounded-full bg-blue-500"></div>Yavru</div>
              <span className="text-slate-800">{birdStats.yavru}</span>
            </div>
            <div className="flex justify-between items-center text-sm print:text-xs font-medium">
              <div className="flex items-center gap-2 text-slate-600"><div className="w-2.5 h-2.5 print:w-1.5 print:h-1.5 rounded-full bg-yellow-500"></div>Satılık</div>
              <span className="text-slate-800">{birdStats.satilik}</span>
            </div>
          </div>
        </div>

        {/* Yuvalık Raporu */}
        <div className="bg-white rounded-2xl p-6 print:p-3 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-4 print:gap-2 mb-6 print:mb-2">
            <div className="w-12 h-12 print:w-8 print:h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">
              <Home className="w-6 h-6 print:w-4 print:h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-700 print:text-sm">Yuvalık Raporu</h3>
              <p className="text-xs text-slate-500 font-medium print:text-[10px]">Toplam Yuvalık</p>
            </div>
          </div>
          <div className="text-4xl print:text-2xl font-bold text-slate-800 mb-6 print:mb-2">{nestStats.total}</div>
          <div className="space-y-3 print:space-y-1">
            <div className="flex justify-between items-center text-sm print:text-xs font-medium border-b border-slate-50 pb-2 print:pb-1">
              <div className="flex items-center gap-2 text-slate-600"><div className="w-2 h-2 rounded-full bg-green-500"></div>Aktif Yuvalık</div>
              <span className="text-slate-800">{nestStats.active}</span>
            </div>
            <div className="flex justify-between items-center text-sm print:text-xs font-medium pt-1">
              <div className="flex items-center gap-2 text-slate-600"><div className="w-2 h-2 rounded-full bg-slate-300"></div>Boş Yuvalık</div>
              <span className="text-slate-800">{nestStats.bos}</span>
            </div>
          </div>
        </div>

        {/* Finans Özeti */}
        <div className="bg-white rounded-2xl p-6 print:p-3 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-4 print:gap-2 mb-6 print:mb-2">
            <div className="w-12 h-12 print:w-8 print:h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
              <DollarSign className="w-6 h-6 print:w-4 print:h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-700 print:text-sm">Finans Özeti</h3>
            </div>
          </div>
          
          <div className="space-y-4 print:space-y-1">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1 print:mb-0 print:text-[10px]">Toplam Gelir</p>
              <div className="text-xl print:text-base font-bold text-green-600">{formatMoney(financeStats.income)}</div>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1 print:mb-0 print:text-[10px]">Toplam Gider</p>
              <div className="text-xl print:text-base font-bold text-red-500">{formatMoney(financeStats.expense)}</div>
            </div>
            <div className="pt-3 print:pt-1 border-t border-slate-100">
              <p className="text-xs text-slate-500 font-medium mb-1 print:mb-0 print:text-[10px]">Net Kazanç</p>
              <div className="text-2xl print:text-lg font-bold text-blue-600">{formatMoney(financeStats.net)}</div>
            </div>
          </div>
        </div>

        {/* Üretim Özeti */}
        <div className="bg-white rounded-2xl p-6 print:p-3 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-4 print:gap-2 mb-6 print:mb-2">
            <div className="w-12 h-12 print:w-8 print:h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-500">
              <Egg className="w-6 h-6 print:w-4 print:h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-700 print:text-sm">Üretim Özeti</h3>
              <p className="text-xs text-slate-500 font-medium print:text-[10px]">Toplam Yumurta</p>
            </div>
          </div>
          <div className="text-4xl print:text-2xl font-bold text-slate-800 mb-6 print:mb-2">{productionStats.total}</div>
          
          <div className="space-y-3 print:space-y-1">
             <div className="flex justify-between items-center text-sm print:text-xs font-medium border-b border-slate-50 pb-2 print:pb-1">
              <div className="text-slate-600">Çıkan Yavru</div>
              <span className="text-green-600 font-bold text-lg print:text-sm">{productionStats.hatched}</span>
            </div>
            <div className="flex justify-between items-center text-sm print:text-xs font-medium pt-1">
              <div className="text-slate-600">Verimlilik Oranı</div>
              <span className="text-yellow-600 font-bold text-lg print:text-sm">%{productionStats.efficiency}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Reports;
