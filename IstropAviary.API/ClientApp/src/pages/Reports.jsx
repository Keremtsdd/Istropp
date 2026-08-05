import { FileText, Printer, Calendar, Info, Bird, Home, DollarSign, Egg, ChevronDown, Download } from 'lucide-react';

const Reports = () => {
  // Chart Data
  const chartData = [
    { month: 'Ocak', yumurta: 105, yavru: 65, rate: '61.9%' },
    { month: 'Şubat', yumurta: 120, yavru: 78, rate: '65.0%' },
    { month: 'Mart', yumurta: 140, yavru: 92, rate: '65.7%' },
    { month: 'Nisan', yumurta: 135, yavru: 85, rate: '62.9%' },
    { month: 'Mayıs', yumurta: 150, yavru: 98, rate: '65.3%' },
    { month: 'Haziran', yumurta: 165, yavru: 110, rate: '66.6%' },
    { month: 'Temmuz', yumurta: 185, yavru: 132, rate: '71.3%' },
    { month: 'Ağustos', yumurta: 170, yavru: 120, rate: '70.5%' },
    { month: 'Eylül', yumurta: 145, yavru: 95, rate: '65.5%' },
    { month: 'Ekim', yumurta: 125, yavru: 82, rate: '65.6%' },
    { month: 'Kasım', yumurta: 110, yavru: 70, rate: '63.6%' },
    { month: 'Aralık', yumurta: 95, yavru: 60, rate: '63.1%' }
  ];

  const maxVal = 200; // Y axis maximum

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Raporlar</h2>
          <p className="text-slate-500 mt-1">İşletmenizle ilgili detaylı raporları görüntüleyin ve analiz edin.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Kuş Raporu */}
        <div className="bg-white rounded-2xl p-6 print:p-3 border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-4 right-4 text-slate-400 cursor-pointer hover:text-slate-600 print:hidden"><Info size={18} /></div>
          <div className="flex items-center gap-4 print:gap-2 mb-6 print:mb-2">
            <div className="w-12 h-12 print:w-8 print:h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <Bird className="w-6 h-6 print:w-4 print:h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-700 print:text-sm">Kuş Raporu</h3>
              <p className="text-xs text-slate-500 font-medium print:text-[10px]">Toplam Kuş</p>
            </div>
          </div>
          <div className="text-4xl print:text-2xl font-bold text-slate-800 mb-6 print:mb-2">30</div>
          <div className="space-y-2 print:space-y-1">
            <div className="flex justify-between items-center text-sm print:text-xs font-medium">
              <div className="flex items-center gap-2 text-slate-600"><div className="w-2.5 h-2.5 print:w-1.5 print:h-1.5 rounded-full bg-green-500"></div>Damızlık</div>
              <span className="text-slate-800">20</span>
            </div>
            <div className="flex justify-between items-center text-sm print:text-xs font-medium">
              <div className="flex items-center gap-2 text-slate-600"><div className="w-2.5 h-2.5 print:w-1.5 print:h-1.5 rounded-full bg-blue-500"></div>Yavru</div>
              <span className="text-slate-800">8</span>
            </div>
            <div className="flex justify-between items-center text-sm print:text-xs font-medium">
              <div className="flex items-center gap-2 text-slate-600"><div className="w-2.5 h-2.5 print:w-1.5 print:h-1.5 rounded-full bg-yellow-500"></div>Satılık</div>
              <span className="text-slate-800">2</span>
            </div>
          </div>
        </div>

        {/* Yuvalık Raporu */}
        <div className="bg-white rounded-2xl p-6 print:p-3 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-4 right-4 text-slate-400 cursor-pointer hover:text-slate-600 print:hidden"><Info size={18} /></div>
          <div className="flex items-center gap-4 print:gap-2 mb-6 print:mb-2">
            <div className="w-12 h-12 print:w-8 print:h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">
              <Home className="w-6 h-6 print:w-4 print:h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-700 print:text-sm">Yuvalık Raporu</h3>
              <p className="text-xs text-slate-500 font-medium print:text-[10px]">Toplam Yuvalık</p>
            </div>
          </div>
          <div className="text-4xl print:text-2xl font-bold text-slate-800 mb-6 print:mb-2">16</div>
          <div className="space-y-2 print:space-y-1">
            <div className="flex justify-between items-center text-sm print:text-xs font-medium">
              <div className="flex items-center gap-2 text-slate-600"><div className="w-2.5 h-2.5 print:w-1.5 print:h-1.5 rounded-full bg-green-500"></div>Aktif Yuvalık</div>
              <span className="text-slate-800">12</span>
            </div>
            <div className="flex justify-between items-center text-sm print:text-xs font-medium">
              <div className="flex items-center gap-2 text-slate-600"><div className="w-2.5 h-2.5 print:w-1.5 print:h-1.5 rounded-full bg-slate-300"></div>Boş Yuvalık</div>
              <span className="text-slate-800">4</span>
            </div>
          </div>
        </div>

        {/* Finans Özeti */}
        <div className="bg-white rounded-2xl p-6 print:p-3 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-4 right-4 text-slate-400 cursor-pointer hover:text-slate-600 print:hidden"><Info size={18} /></div>
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
              <div className="text-xl print:text-base font-bold text-green-600">82.500 ₺</div>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1 print:mb-0 print:text-[10px]">Toplam Gider</p>
              <div className="text-xl print:text-base font-bold text-red-500">21.300 ₺</div>
            </div>
            <div className="pt-3 print:pt-1 border-t border-slate-100">
              <p className="text-xs text-slate-500 font-medium mb-1 print:mb-0 print:text-[10px]">Net Kazanç</p>
              <div className="text-2xl print:text-lg font-bold text-blue-600">61.200 ₺</div>
            </div>
          </div>
        </div>

        {/* Üretim Özeti */}
        <div className="bg-white rounded-2xl p-6 print:p-3 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-4 right-4 text-slate-400 cursor-pointer hover:text-slate-600 print:hidden"><Info size={18} /></div>
          <div className="flex items-center gap-4 print:gap-2 mb-6 print:mb-2">
            <div className="w-12 h-12 print:w-8 print:h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-500">
              <Egg className="w-6 h-6 print:w-4 print:h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-700 print:text-sm">Üretim Özeti</h3>
              <p className="text-xs text-slate-500 font-medium print:text-[10px]">Toplam Yumurta</p>
            </div>
          </div>
          <div className="text-4xl print:text-2xl font-bold text-slate-800 mb-6 print:mb-2">148</div>
          
          <div className="space-y-3 print:space-y-1">
             <div className="flex justify-between items-center text-sm print:text-xs font-medium border-b border-slate-50 pb-2 print:pb-1">
              <div className="text-slate-600">Çıkan Yavru</div>
              <span className="text-green-600 font-bold text-lg print:text-sm">132</span>
            </div>
            <div className="flex justify-between items-center text-sm print:text-xs font-medium pt-1">
              <div className="text-slate-600">Verimlilik Oranı</div>
              <span className="text-yellow-600 font-bold text-lg print:text-sm">%89,2</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Detailed Chart Area */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 print:p-4 flex flex-col print:mt-4">
        
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="font-bold text-slate-800 text-xl">Detaylı Aylık Üretim Grafiği</h3>
            <p className="text-sm text-slate-500 mt-1">Yumurta ve yavru çıkış oranlarının aylık analizi ve gelişim süreci.</p>
          </div>
          <div className="flex items-center gap-6">
            {/* Legend */}
            <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                <span className="text-sm font-medium text-slate-700">Yumurta</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-green-500"></div>
                <span className="text-sm font-medium text-slate-700">Yavru</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Container (Scrollable) */}
        <div className="w-full overflow-x-auto pb-4">
          <div className="relative h-[400px] min-w-[900px] flex">
            
            {/* Y-Axis Labels & Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0 pr-2">
              {[200, 150, 100, 50, 0].map((val, i) => (
                <div key={i} className="flex items-center w-full h-0 relative">
                  <span className="absolute -left-10 w-8 text-right text-xs font-medium text-slate-400 -translate-y-1/2">{val}</span>
                  <div className="w-full border-t border-dashed border-slate-200"></div>
                </div>
              ))}
            </div>

          {/* X-Axis and Bars */}
          <div className="ml-8 flex-1 flex items-end justify-between px-4 pb-[1px] relative z-10 h-full">
            {chartData.map((data, idx) => {
              const yumurtaHeight = (data.yumurta / maxVal) * 100;
              const yavruHeight = (data.yavru / maxVal) * 100;

              return (
                <div key={idx} className="flex flex-col items-center justify-end flex-1 group h-full">
                  {/* Bars Container */}
                  <div className="relative flex justify-center gap-2 w-full h-full items-end">
                    
                    {/* Yumurta Bar */}
                    <div 
                      className="w-5 bg-blue-500 rounded-t-sm transition-all duration-300 relative hover:bg-blue-600 hover:shadow-lg cursor-pointer"
                      style={{ height: `${yumurtaHeight}%` }}
                    >
                      {/* Tooltip for Yumurta */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {data.yumurta} Yumurta
                      </div>
                    </div>

                    {/* Yavru Bar */}
                    <div 
                      className="w-5 bg-green-500 rounded-t-sm transition-all duration-300 relative hover:bg-green-600 hover:shadow-lg cursor-pointer"
                      style={{ height: `${yavruHeight}%` }}
                    >
                      {/* Tooltip for Yavru */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                        {data.yavru} Yavru
                      </div>
                    </div>

                  </div>
                  
                  {/* X-Axis Label */}
                  <div className="mt-4 pt-2 w-full text-center border-t border-slate-200">
                    <span className="text-sm font-semibold text-slate-600">{data.month}</span>
                    <div className="text-[10px] text-yellow-600 font-bold bg-yellow-50 inline-block px-2 py-0.5 rounded-full mt-1">
                      Verim: {data.rate}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      </div>
    </div>
  );
};

export default Reports;
