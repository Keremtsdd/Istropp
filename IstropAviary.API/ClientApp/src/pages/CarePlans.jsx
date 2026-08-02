import { useState } from 'react';
import { 
  FileText, Printer, Plus, ChevronRight, 
  Droplet, Calendar as CalendarIcon, Info, Settings,
  Pill, PlusSquare, FlaskConical, Droplets
} from 'lucide-react';

const CarePlans = () => {
  const [selectedDay, setSelectedDay] = useState(31);

  // Sahte (Mock) Veri - İleride veritabanından gelecek
  const weeklyPlan = [
    { date: 28, dayName: 'Pazartesi', type: 'Takviye Günü', isRest: false, fullDate: '28 Temmuz 2025 Pazartesi', supplements: [] },
    { date: 29, dayName: 'Salı', type: 'Takviye Günü', isRest: false, fullDate: '29 Temmuz 2025 Salı', supplements: [] },
    { date: 30, dayName: 'Çarşamba', type: 'Dinlenme Günü', isRest: true, fullDate: '30 Temmuz 2025 Çarşamba', supplements: [] },
    { date: 31, dayName: 'Perşembe', type: 'Takviye Günü', isRest: false, fullDate: '31 Temmuz 2025 Perşembe', 
      supplements: [
        { 
          id: 1, name: 'Calci-Lux', subtitle: 'Kalsiyum Desteği', color: 'bg-green-600',
          water: { ml: '500 ml', gram: '8 g' }, food: { gram: '100 g', add: '8 g' },
          desc: 'Haftalık kalsiyum desteği. Yumurta kabuğu kalitesini artırır ve kemik gelişimini destekler.'
        },
        { 
          id: 2, name: 'K+K Protein 5000', subtitle: 'Protein Desteği', color: 'bg-amber-600',
          food: { gram: '100 g', add: '4 g' },
          desc: 'Yavru gelişimini destekler. Tüy yapısını güçlendirir. Haftalık protein takviyesi.'
        }
      ] 
    },
    { date: 1, dayName: 'Cuma', type: 'Takviye Günü', isRest: false, fullDate: '01 Ağustos 2025 Cuma', supplements: [] },
    { date: 2, dayName: 'Cumartesi', type: 'Dinlenme Günü', isRest: true, fullDate: '02 Ağustos 2025 Cumartesi', supplements: [] },
    { date: 3, dayName: 'Pazar', type: 'Takviye Günü', isRest: false, fullDate: '03 Ağustos 2025 Pazar', supplements: [] },
  ];

  const activeDayData = weeklyPlan.find(d => d.date === selectedDay) || weeklyPlan[3];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Bakım Planı</h2>
          <p className="text-slate-500 mt-1">Günlük bakım ve takviye planınız</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium shadow-sm flex-1 sm:flex-none">
            <FileText size={18} /> PDF Yazdır
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium shadow-sm flex-1 sm:flex-none">
            <Printer size={18} /> Yazdır
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 border border-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm flex-1 sm:flex-none whitespace-nowrap">
            <Plus size={18} /> Plan Ekle
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* Left Column - Weekly Calendar */}
        <div className="w-full lg:w-80 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden shrink-0">
          <div className="p-5 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-lg">Haftalık Plan</h3>
            <ChevronRight size={20} className="text-slate-400" />
          </div>

          <div className="flex-1 p-2 space-y-1">
            {weeklyPlan.map((day) => (
              <div 
                key={day.date}
                onClick={() => setSelectedDay(day.date)}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                  selectedDay === day.date 
                    ? 'bg-blue-50 border border-blue-100' 
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`text-2xl font-bold w-8 text-center ${selectedDay === day.date ? 'text-blue-600' : 'text-slate-700'}`}>
                    {day.date.toString().padStart(2, '0')}
                  </span>
                  <div>
                    <h4 className={`font-semibold ${selectedDay === day.date ? 'text-blue-700' : 'text-slate-700'}`}>{day.dayName}</h4>
                    <p className={`text-xs mt-0.5 ${selectedDay === day.date ? 'text-blue-500' : 'text-slate-500'}`}>{day.type}</p>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  day.isRest ? 'bg-green-50 text-green-500' : 'bg-blue-50 text-blue-500'
                }`}>
                  {day.isRest ? <Droplet size={16} /> : <Pill size={16} />}
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 bg-slate-50/50 mt-auto border-t border-slate-100">
            <div className="flex items-start gap-3 text-slate-500">
              <Info size={18} className="shrink-0 mt-0.5 text-blue-500" />
              <p className="text-xs leading-relaxed">
                Takviye günlerinde belirtilen ürünleri veriniz. Dinlenme günlerinde sadece temiz su sununuz.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Selected Day Details */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col">
          
          {/* Day Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                <CalendarIcon size={24} />
              </div>
              <div>
                <p className="text-slate-500 font-medium">Bugün</p>
                <h2 className="text-2xl font-bold text-slate-800">{activeDayData.fullDate.split(' ').slice(0, 3).join(' ')}</h2>
                <p className="text-slate-500">{activeDayData.fullDate.split(' ')[3]}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-50">
            <h3 className="text-lg font-bold text-slate-800">
              {activeDayData.isRest ? 'Dinlenme Günü' : 'Bugünkü Takviyeler'}
            </h3>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
              activeDayData.isRest ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
            }`}>
              <span className={`w-2 h-2 rounded-full ${activeDayData.isRest ? 'bg-green-500' : 'bg-blue-500'}`}></span>
              {activeDayData.type}
            </div>
          </div>

          {/* Supplements / Rest Info */}
          <div className="flex-1 space-y-4">
            
            {activeDayData.isRest ? (
               <div className="bg-green-50/50 border border-green-100 rounded-2xl p-6 relative overflow-hidden flex items-center">
                 <div className="absolute right-0 bottom-0 opacity-10">
                   <Droplets size={120} className="text-green-600 translate-x-4 translate-y-4" />
                 </div>
                 <div className="flex items-center gap-6 relative z-10">
                   <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                     <Droplet size={32} />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-green-800 mb-1">Dinlenme Günü</h3>
                     <p className="font-semibold text-green-700 mb-2">Bugün sadece temiz su verilecek.</p>
                     <p className="text-green-600/80 text-sm max-w-md">Kuşlarınız için dinlenme ve sindirim günü. Herhangi bir vitamin veya ilaç takviyesi yapmayınız, sadece taze içme suyu sağlayınız.</p>
                   </div>
                 </div>
               </div>
            ) : (
              activeDayData.supplements.length > 0 ? (
                activeDayData.supplements.map(sup => (
                  <div key={sup.id} className="border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 md:items-center relative bg-white group">
                    
                    {/* Icon & Name */}
                    <div className="flex items-center gap-5 md:w-1/3 shrink-0">
                      <div className={`w-16 h-20 rounded-lg flex items-center justify-center text-white ${sup.color} shadow-inner relative overflow-hidden`}>
                        <div className="w-full h-4 bg-white/20 absolute top-0"></div>
                        <PlusSquare size={32} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-800">{sup.name}</h4>
                        <p className="text-slate-500 text-sm mt-0.5">{sup.subtitle}</p>
                      </div>
                    </div>

                    {/* Dosages */}
                    <div className="flex gap-8 md:w-1/3 border-y md:border-y-0 md:border-x border-slate-100 py-4 md:py-0 md:px-6">
                      {sup.water && (
                        <div>
                          <p className="text-xs font-bold text-slate-400 tracking-wider mb-2">SU</p>
                          <div className="flex items-center gap-2 text-blue-500 font-semibold mb-1">
                            <Droplet size={16} /> {sup.water.ml}
                          </div>
                          <p className="text-lg font-bold text-blue-600">{sup.water.gram}</p>
                        </div>
                      )}
                      
                      {sup.food && (
                        <div>
                          <p className="text-xs font-bold text-slate-400 tracking-wider mb-2">MAMA</p>
                          <div className="flex items-center gap-2 text-amber-600 font-semibold mb-1">
                            <FlaskConical size={16} /> {sup.food.gram}
                          </div>
                          <p className="text-lg font-bold text-amber-700">{sup.food.add}</p>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="md:w-1/3">
                      <p className="text-xs font-bold text-slate-800 tracking-wider mb-2">AÇIKLAMA</p>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {sup.desc}
                      </p>
                    </div>

                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-slate-50 mx-auto flex items-center justify-center text-slate-300 mb-4">
                    <Pill size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-700 mb-2">Bugün İçin İlaç Eklenmedi</h4>
                  <p className="text-slate-500 mb-6">Bu tarihe herhangi bir takviye tanımlamadınız.</p>
                  <button className="px-6 py-2 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors">
                    Hemen Ekle
                  </button>
                </div>
              )
            )}
          </div>
          
        </div>
      </div>

      {/* Footer Settings */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-slate-500 text-sm mt-4 px-2 gap-4">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-100 shadow-sm">
          <Info size={16} className="text-blue-500" />
          <span>Takviyeleri hazırlarken her zaman temiz ölçü kaşığı kullanınız ve ürünleri taze olarak hazırlayınız.</span>
        </div>
        <button className="flex items-center gap-2 text-slate-400 hover:text-slate-700 transition-colors font-medium">
          <Settings size={16} /> Bakım Planı Ayarları
        </button>
      </div>

    </div>
  );
};

export default CarePlans;
