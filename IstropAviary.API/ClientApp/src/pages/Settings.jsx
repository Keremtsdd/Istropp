import { useState } from 'react';
import { 
  Building, Fingerprint, Calendar as CalendarIcon, 
  Printer, Bell, Image as ImageIcon, Save, Search,
  ToggleLeft, ToggleRight
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('genel');

  // Bildirim tab toggle states
  const [notifHatch, setNotifHatch] = useState(true);
  const [notifCare, setNotifCare] = useState(true);
  const [notifSale, setNotifSale] = useState(false);
  const [notifStock, setNotifStock] = useState(true);

  const tabs = [
    { id: 'genel', icon: <Building size={18} />, label: 'Genel Bilgiler' },
    { id: 'bilezikler', icon: <Fingerprint size={18} />, label: 'Bilezikler' },
    { id: 'yazdir', icon: <Printer size={18} />, label: 'Yazdırma' },
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
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Ayar ara..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
          />
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
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bilezik Kodu (Önek)</label>
                    <input type="text" defaultValue="TR-34 IST" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors font-medium uppercase"/>
                    <p className="text-[11px] text-slate-400 mt-1.5">Kuşlara takılacak bileziklerde numara ve yıldan önce görünecek sabit kod.</p>
                  </div>
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
                   <p className="text-xl font-mono font-bold text-slate-800">TR-34 IST 26 - 001</p>
                </div>
                <div className="flex justify-end pt-2">
                  <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
                    <Save size={18} /> Kaydet
                  </button>
                </div>
              </div>
            </div>
          )}



          {/* YAZDIRMA */}
          {activeTab === 'yazdir' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">Yazdırma ve Fatura Ayarları</h3>
              <div className="max-w-2xl space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kağıt Boyutu</label>
                  <select className="w-full md:w-1/2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors font-medium">
                    <option value="a4" selected>A4 (Standart)</option>
                    <option value="a5">A5</option>
                    <option value="thermal">Termal Yazıcı Rulosu (80mm)</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                   <div>
                      <p className="text-sm font-semibold text-slate-700">Faturada Logoyu Göster</p>
                      <p className="text-[11px] text-slate-400">Çıktılarda işletme logonuz sol üstte yer alır.</p>
                   </div>
                   <ToggleSwitch active={true} onChange={() => {}} />
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                   <div>
                      <p className="text-sm font-semibold text-slate-700">Alt Bilgi Ekle</p>
                      <p className="text-[11px] text-slate-400">Fatura altına teşekkür yazısı veya notlar eklenir.</p>
                   </div>
                   <ToggleSwitch active={true} onChange={() => {}} />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Alt Bilgi (Footer) Metni</label>
                  <textarea rows={2} defaultValue="Bizi tercih ettiğiniz için teşekkür ederiz." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors font-medium resize-none"></textarea>
                </div>
                
                <div className="flex justify-end pt-4">
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
              <h3 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">Sistem Bildirimleri</h3>
              <div className="max-w-2xl space-y-2">
                
                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors">
                   <div>
                      <p className="text-sm font-bold text-slate-700">Yeni Kuluçka Çıkışı</p>
                      <p className="text-[12px] text-slate-500 mt-0.5">Yavruların tahmini çıkış günlerinde uyarı alırsınız.</p>
                   </div>
                   <ToggleSwitch active={notifHatch} onChange={() => setNotifHatch(!notifHatch)} />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors">
                   <div>
                      <p className="text-sm font-bold text-slate-700">İlaç ve Takviye Zamanı</p>
                      <p className="text-[12px] text-slate-500 mt-0.5">Bakım planına eklenen ilaçların günü geldiğinde bildirim alırsınız.</p>
                   </div>
                   <ToggleSwitch active={notifCare} onChange={() => setNotifCare(!notifCare)} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors">
                   <div>
                      <p className="text-sm font-bold text-slate-700">Satış Onayları</p>
                      <p className="text-[12px] text-slate-500 mt-0.5">Bir kuş satışı gerçekleştirildiğinde bilgilendirilirsiniz.</p>
                   </div>
                   <ToggleSwitch active={notifSale} onChange={() => setNotifSale(!notifSale)} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors">
                   <div>
                      <p className="text-sm font-bold text-slate-700">Düşük Stok Uyarısı</p>
                      <p className="text-[12px] text-slate-500 mt-0.5">Yem ve ilaç stokları kritik seviyeye düştüğünde uyarı verir.</p>
                   </div>
                   <ToggleSwitch active={notifStock} onChange={() => setNotifStock(!notifStock)} />
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
