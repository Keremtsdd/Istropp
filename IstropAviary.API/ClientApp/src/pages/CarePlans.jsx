import { useState, useEffect } from 'react';
import { 
  FileText, Printer, Plus, ChevronRight, 
  Droplet, Calendar as CalendarIcon, Info, Settings,
  Pill, PlusSquare, FlaskConical, Droplets, Edit, Trash2
} from 'lucide-react';
import { useData } from '../context/DataContext';
import CarePlanModal from '../components/modals/CarePlanModal';
import api from '../api/axiosClient';

const CarePlans = () => {
  const { carePlans, addCarePlan, updateCarePlan, deleteCarePlan } = useData();
  const [selectedDay, setSelectedDay] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [cycleLength, setCycleLength] = useState(14); // default 14

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        if (response.data && response.data.CarePlanCycleDays) {
          setCycleLength(parseInt(response.data.CarePlanCycleDays, 10));
        }
      } catch (error) {
        console.error('Ayarlar yüklenemedi:', error);
      }
    };
    fetchSettings();
  }, []);

  const dayNames = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

  // Generate dynamic cycle template
  const cycleDays = Array.from({ length: cycleLength }, (_, i) => {
    const dayNum = i + 1;
    const weekNum = Math.ceil(dayNum / 7);
    const dayName = dayNames[(dayNum - 1) % 7];
    
    // Find supplements for this day in context
    const supplements = carePlans.filter(p => p.dayNumber === dayNum);
    return {
      dayNumber: dayNum,
      weekNum,
      dayName,
      title: `${weekNum}. Hafta ${dayName}`,
      supplements,
      isRest: supplements.length === 0
    };
  });

  const totalWeeks = Math.ceil(cycleLength / 7);
  const weekNumbers = Array.from({ length: totalWeeks }, (_, i) => i + 1);

  const activeDayData = cycleDays.find(d => d.dayNumber === selectedDay) || cycleDays[0];

  const handleAddOrUpdatePlan = async (planData) => {
    try {
      if (planData.id) {
        await updateCarePlan(planData.id, planData);
      } else {
        await addCarePlan(planData);
      }
      setEditingItem(null);
    } catch (error) {
      alert("Takviye kaydedilirken hata oluştu!");
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Bu takviyeyi silmek istediğinize emin misiniz?')) {
      try {
        await deleteCarePlan(id);
      } catch (error) {
        alert("Takviye silinirken hata oluştu!");
      }
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSettingsClick = async () => {
    const newDaysStr = window.prompt("Programın kaç günde bir başa sarmasını istersiniz? (Örn: 7, 14, 21)", cycleLength);
    if (newDaysStr) {
      const parsed = parseInt(newDaysStr, 10);
      if (!isNaN(parsed) && parsed > 0 && parsed <= 365) {
        try {
          await api.post('/settings', { CarePlanCycleDays: parsed.toString() });
          setCycleLength(parsed);
          alert("Döngü süresi başarıyla güncellendi!");
        } catch (e) {
          alert("Ayar kaydedilemedi.");
        }
      } else {
        alert("Lütfen geçerli bir gün sayısı girin.");
      }
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{cycleLength} Günlük Bakım Programı</h2>
          <p className="text-slate-500 mt-1">Döngüsel bakım ve takviye şablonunuzu yönetin.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button onClick={() => window.print()} className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium shadow-sm flex-1 sm:flex-none">
            <FileText size={18} /> PDF Yazdır
          </button>
          <button 
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 border border-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm flex-1 sm:flex-none whitespace-nowrap"
          >
            <Plus size={18} /> {activeDayData?.title}'ne Ekle
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* Left Column - Days List */}
        <div className="w-full lg:w-auto bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col shrink-0 print:hidden overflow-x-auto">
          <div className="p-5 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-lg">Program Döngüsü</h3>
            <ChevronRight size={20} className="text-slate-400" />
          </div>

          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-6 overflow-y-auto max-h-[750px] custom-scrollbar">
            
            {weekNumbers.map(week => (
              <div key={week} className="space-y-1 min-w-[240px] xl:min-w-[260px]">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">{week}. Hafta</h4>
                {cycleDays.filter(d => d.weekNum === week).map((day) => (
                  <div 
                    key={day.dayNumber}
                    onClick={() => setSelectedDay(day.dayNumber)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                      selectedDay === day.dayNumber 
                        ? 'bg-blue-50 border border-blue-100' 
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                        selectedDay === day.dayNumber ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {day.dayName.substring(0,3)}
                      </div>
                      <div>
                        <h4 className={`font-bold text-sm ${selectedDay === day.dayNumber ? 'text-blue-700' : 'text-slate-700'}`}>
                          {day.dayName}
                        </h4>
                        <p className={`text-[11px] mt-0.5 font-medium ${selectedDay === day.dayNumber ? 'text-blue-500' : 'text-slate-500'}`}>
                          {day.isRest ? 'Dinlenme' : `${day.supplements.length} Takviye`}
                        </p>
                      </div>
                    </div>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      day.isRest ? 'bg-green-50 text-green-500' : 'bg-blue-50 text-blue-500'
                    }`}>
                      {day.isRest ? <Droplet size={14} /> : <Pill size={14} />}
                    </div>
                  </div>
                ))}
              </div>
            ))}

          </div>
        </div>

        {/* Right Column - Selected Day Details */}
        {activeDayData && (
          <div className="flex-1 bg-white rounded-2xl border border-slate-100 print:border-none shadow-sm print:shadow-none p-6 sm:p-8 print:p-0 flex flex-col print:block w-full">
            
            {/* Day Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <CalendarIcon size={28} />
                </div>
                <div>
                  <p className="text-slate-500 font-medium">{activeDayData.weekNum}. Hafta</p>
                  <h2 className="text-3xl font-bold text-slate-800">{activeDayData.dayName} Planı</h2>
                </div>
              </div>
              
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                activeDayData.isRest ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
              }`}>
                <span className={`w-2.5 h-2.5 rounded-full ${activeDayData.isRest ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                {activeDayData.isRest ? 'Dinlenme Günü' : 'Takviye Günü'}
              </div>
            </div>

            {/* Supplements / Rest Info */}
            <div className="flex-1 space-y-4">
              
              {activeDayData.isRest ? (
                 <div className="bg-green-50/50 border border-green-100 rounded-2xl p-8 relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
                   <div className="absolute right-0 bottom-0 opacity-10">
                     <Droplets size={160} className="text-green-600 translate-x-10 translate-y-10" />
                   </div>
                   <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0 relative z-10 mx-auto sm:mx-0">
                     <Droplet size={40} />
                   </div>
                   <div className="relative z-10 flex-1">
                     <h3 className="text-2xl font-bold text-green-800 mb-2">Temiz İçme Suyu (Dinlenme)</h3>
                     <p className="font-semibold text-green-700 mb-3 text-lg">Bugün herhangi bir katkı maddesi verilmeyecek.</p>
                     <p className="text-green-600/90 text-base max-w-xl">
                       Kuşlarınız için dinlenme ve sindirim günü. Herhangi bir vitamin veya ilaç takviyesi yapmayınız. Sulukları iyice yıkayıp sadece taze, dinlenmiş içme suyu sağlayınız.
                     </p>
                     
                     <button 
                      onClick={openAddModal}
                      className="mt-6 px-6 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-sm"
                     >
                       Bu Güne Takviye Ekle
                     </button>
                   </div>
                 </div>
              ) : (
                <div className="space-y-4">
                  {activeDayData.supplements.map(sup => (
                    <div key={sup.id} className="border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 md:items-center relative bg-white group">
                      
                      {/* Icon & Name */}
                      <div className="flex items-center gap-5 md:w-1/3 shrink-0">
                        <div className={`w-16 h-20 rounded-lg flex items-center justify-center text-white bg-blue-600 shadow-inner relative overflow-hidden`}>
                          <div className="w-full h-4 bg-white/20 absolute top-0"></div>
                          <PlusSquare size={32} />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-slate-800">{sup.name}</h4>
                        </div>
                      </div>

                      {/* Dosages */}
                      <div className="flex gap-8 md:w-1/3 border-y md:border-y-0 md:border-x border-slate-100 py-4 md:py-0 md:px-6">
                        {sup.waterDosage && (
                          <div>
                            <p className="text-xs font-bold text-slate-400 tracking-wider mb-2">SUYA KARIŞIM</p>
                            <div className="flex items-center gap-2 text-blue-500 font-semibold mb-1">
                              <Droplet size={18} />
                              <span className="text-lg font-bold text-blue-700">{sup.waterDosage}</span>
                            </div>
                          </div>
                        )}
                        
                        {sup.foodDosage && (
                          <div>
                            <p className="text-xs font-bold text-slate-400 tracking-wider mb-2">MAMAYA KARIŞIM</p>
                            <div className="flex items-center gap-2 text-amber-600 font-semibold mb-1">
                              <FlaskConical size={18} />
                              <span className="text-lg font-bold text-amber-700">{sup.foodDosage}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Purpose and Actions */}
                      <div className="md:w-1/3 flex flex-col justify-between h-full">
                        <div>
                          <p className="text-xs font-bold text-slate-400 tracking-wider mb-2">KULLANIM AMACI</p>
                          <p className="text-sm text-slate-600 font-medium leading-relaxed">
                            {sup.purpose}
                          </p>
                        </div>
                        
                        {/* Action buttons (Edit/Delete) */}
                        <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                          <button 
                            onClick={() => openEditModal(sup)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Düzenle"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(sup.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Sil"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                  
                  <button 
                    onClick={openAddModal}
                    className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-semibold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 print:hidden"
                  >
                    <Plus size={20} /> Bu Güne Başka Bir Takviye Ekle
                  </button>
                </div>
              )}
            </div>
            
          </div>
        )}
      </div>

      {/* Footer Settings */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-slate-500 text-sm mt-4 px-2 gap-4 print:hidden">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-100 shadow-sm">
          <Info size={16} className="text-blue-500" />
          <span>Bu program {cycleLength} günde bir başa saracak şekilde uygulanır. İstediğiniz gün sayısını ayarlardan değiştirebilirsiniz.</span>
        </div>
        <button onClick={handleSettingsClick} className="flex items-center gap-2 text-slate-400 hover:text-slate-700 transition-colors font-medium">
          <Settings size={16} /> Program Ayarları
        </button>
      </div>

      <CarePlanModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddOrUpdatePlan}
        editingItem={editingItem}
        selectedDay={selectedDay}
      />
    </div>
  );
};

export default CarePlans;
