import { useState } from 'react';
import { 
  Building, Fingerprint, Calendar as CalendarIcon, 
  Printer, Bell, Image as ImageIcon, Save, Search,
  ToggleLeft, ToggleRight
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('genel');

  // Bildirim tab toggle states
  const [notifEggCheck, setNotifEggCheck] = useState(true);
  const [notifBanding, setNotifBanding] = useState(true);
  const [notifHatch, setNotifHatch] = useState(true);
  const [notifNestClean, setNotifNestClean] = useState(true);
  const [notifWeaning, setNotifWeaning] = useState(true);
  const [notifCare, setNotifCare] = useState(true);
  const [notifQuarantine, setNotifQuarantine] = useState(false);
  const [notifBreedingPrep, setNotifBreedingPrep] = useState(false);
  const [notifFinance, setNotifFinance] = useState(false);

  const tabs = [
    { id: 'genel', icon: <Building size={18} />, label: 'Genel Bilgiler' },
    { id: 'bilezikler', icon: <Fingerprint size={18} />, label: 'Bilezikler' },
    { id: 'bildirimler', icon: <Bell size={18} />, label: 'Bildirimler' }
  ];

  const ToggleSwitch = ({ active, onChange }) => (
    <button 
      onClick={onChange}
      className={`transition-colors ${active ? 'text-blue-500' : 'text-slate-300'}`}
    >
      {active ? <ToggleRight size={36} weight="fill" /> : <ToggleLeft size={36} />}
    </button>
  );

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Ayarlar</h2>
          <p className="text-slate-500 mt-1">Program ve işletme ayarlarınızı buradan yönetebilirsiniz.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* Left Tabs Menu */}
        <div className="w-full lg:w-64 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 shrink-0 h-fit">
          <div className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className={activeTab === tab.id ? 'text-white' : 'text-slate-400'}>
                  {tab.icon}
                </div>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          
          {/* GENEL BILGILER */}
          {activeTab === 'genel' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">İşletme Bilgileri</h3>
              <div className="flex flex-col xl:flex-row gap-10">
                {/* Logo Section */}
                <div className="flex flex-col items-center">
                  <p className="text-sm font-semibold text-slate-700 mb-4 self-start">Logo</p>
                  <div className="w-40 h-40 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 mb-4 overflow-hidden relative group cursor-pointer">
                     <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ImageIcon size={24} className="text-white mb-2" />
                        <span className="text-white text-xs font-medium">Değiştir</span>
                     </div>
                     <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
                        <BirdIconMock />
                     </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-blue-200 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                    <ImageIcon size={16} /> Logo Değiştir
                  </button>
                </div>
                {/* Form Section */}
                <div className="flex-1 space-y-5 max-w-2xl">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">İşletme Adı</label>
                    <input type="text" defaultValue="ISTROP AVIARY" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors font-medium"/>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Şehir</label>
                      <input type="text" defaultValue="İstanbul" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors font-medium"/>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Telefon</label>
                      <input type="text" defaultValue="+90 532 123 45 67" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors font-medium"/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Web Sitesi</label>
                    <input type="text" defaultValue="www.istropaviary.com" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors font-medium"/>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Açıklama</label>
                    <textarea rows={3} defaultValue="Cennet Papağanı, Sultan Papağanı ve Muhabbet Kuşu üretim ve satış işletmesi." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors font-medium resize-none"></textarea>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
                      <Save size={18} /> Kaydet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BİLEZİKLER */}
          {activeTab === 'bilezikler' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">Bilezik Ayarları</h3>
              <div className="max-w-2xl space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Geçerli Yıl</label>
                    <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors font-medium">
                      <option value="2025">2025</option>
                      <option value="2026" selected>2026</option>
                      <option value="2027">2027</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Başlangıç Seri No</label>
                    <input type="number" defaultValue="001" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors font-medium"/>
                  </div>
                </div>
                <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4">
                   <p className="text-xs text-blue-700 font-medium mb-1">Önizleme:</p>
                   <p className="text-xl font-mono font-bold text-slate-800">2026-001</p>
                </div>
                <div className="flex justify-end pt-2">
                  <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
                    <Save size={18} /> Kaydet
                  </button>
                </div>
              </div>
            </div>
          )}



          {/* BILDIRIMLER */}
          {activeTab === 'bildirimler' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">Sistem ve Hatırlatma Bildirimleri</h3>
              <div className="max-w-2xl space-y-2">
                
                {/* Üretim ve Kuluçka */}
                <div className="pt-2 pb-1">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Üretim & Kuluçka</h4>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                   <div>
                      <p className="text-sm font-bold text-slate-700">Yumurta Döl Kontrolü</p>
                      <p className="text-[12px] text-slate-500 mt-0.5">Kuluçkadaki yumurtaların doluluk/boşluk kontrol zamanı geldiğinde uyarır (genelde 5-7. gün).</p>
                   </div>
                   <ToggleSwitch active={notifEggCheck} onChange={() => setNotifEggCheck(!notifEggCheck)} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                   <div>
                      <p className="text-sm font-bold text-slate-700">Yeni Kuluçka Çıkışı</p>
                      <p className="text-[12px] text-slate-500 mt-0.5">Yavruların yumurtadan tahmini çıkış günleri yaklaştığında bildirim gönderir.</p>
                   </div>
                   <ToggleSwitch active={notifHatch} onChange={() => setNotifHatch(!notifHatch)} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                   <div>
                      <p className="text-sm font-bold text-slate-700">Yavru Bilezikleme Zamanı</p>
                      <p className="text-[12px] text-slate-500 mt-0.5">Yavruların ayaklarına bilezik takılma dönemi (genelde 7-10. gün) geldiğinde hatırlatır.</p>
                   </div>
                   <ToggleSwitch active={notifBanding} onChange={() => setNotifBanding(!notifBanding)} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                   <div>
                      <p className="text-sm font-bold text-slate-700">Yavru Ayırma (Yeme Düşme)</p>
                      <p className="text-[12px] text-slate-500 mt-0.5">Yavruların yeme düşme ve anne-babadan ayrılma vakti geldiğinde uyarır (genelde 30-35. gün).</p>
                   </div>
                   <ToggleSwitch active={notifWeaning} onChange={() => setNotifWeaning(!notifWeaning)} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                   <div>
                      <p className="text-sm font-bold text-slate-700">Eşleştirme Hazırlığı</p>
                      <p className="text-[12px] text-slate-500 mt-0.5">Dinlenmedeki kuşların tekrar eşe atılma ve kuluçka hazırlığı zamanı geldiğinde hatırlatır.</p>
                   </div>
                   <ToggleSwitch active={notifBreedingPrep} onChange={() => setNotifBreedingPrep(!notifBreedingPrep)} />
                </div>

                {/* Bakım ve Sağlık */}
                <div className="pt-6 pb-1">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bakım & Sağlık</h4>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                   <div>
                      <p className="text-sm font-bold text-slate-700">İlaç ve Takviye Programı</p>
                      <p className="text-[12px] text-slate-500 mt-0.5">Kuşlara verilmesi gereken periyodik vitamin veya ilaç günlerinde uyarır.</p>
                   </div>
                   <ToggleSwitch active={notifCare} onChange={() => setNotifCare(!notifCare)} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                   <div>
                      <p className="text-sm font-bold text-slate-700">Yuvalık ve Kafes Temizliği</p>
                      <p className="text-[12px] text-slate-500 mt-0.5">Yavrular büyürken düzenli yapılması gereken alt temizliği günlerinde hatırlatır.</p>
                   </div>
                   <ToggleSwitch active={notifNestClean} onChange={() => setNotifNestClean(!notifNestClean)} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                   <div>
                      <p className="text-sm font-bold text-slate-700">Karantina Bitişi</p>
                      <p className="text-[12px] text-slate-500 mt-0.5">Yeni alınan veya hasta olan kuşların karantina/tedavi süresi dolduğunda haber verir.</p>
                   </div>
                   <ToggleSwitch active={notifQuarantine} onChange={() => setNotifQuarantine(!notifQuarantine)} />
                </div>

                {/* Finans */}
                <div className="pt-6 pb-1">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Finans & Sistem</h4>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                   <div>
                      <p className="text-sm font-bold text-slate-700">Finansal Özet Bildirimi</p>
                      <p className="text-[12px] text-slate-500 mt-0.5">Haftalık veya aylık gelir/gider durumunu özet bildirim olarak gönderir.</p>
                   </div>
                   <ToggleSwitch active={notifFinance} onChange={() => setNotifFinance(!notifFinance)} />
                </div>

              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

// Bird Logo Icon
const BirdIconMock = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
    <path d="M16 7h.01"></path>
    <path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"></path>
    <path d="m20 7 2 .5-2 .5"></path>
    <path d="M10 18v3"></path>
    <path d="M14 17.75V21"></path>
    <path d="M7 18a6 6 0 0 0 3.84-10.61"></path>
  </svg>
);

export default Settings;
