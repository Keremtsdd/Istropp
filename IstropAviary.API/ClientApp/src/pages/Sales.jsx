import { useState } from 'react';
import { 
  FileText, Printer, Plus, Search, Filter, ChevronLeft, ChevronRight,
  Calendar as CalendarIcon, Banknote, ShoppingBag, User, Phone, MapPin, Edit3
} from 'lucide-react';
import { useData } from '../context/DataContext';
import SaleModal from '../components/modals/SaleModal';

const Sales = () => {
  const { sales, setSales, birds } = useData();
  const [selectedSaleId, setSelectedSaleId] = useState('S-2025-015');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sahte (Mock) Veri Listesi
  const salesList = [
    { id: 'S-2025-015', customer: 'Ahmet Yılmaz', date: '31 Temmuz 2025', fullDate: '31 Temmuz 2025 Perşembe - 11:20', total: '2.500 ₺', status: 'Tamamlandı', paymentType: 'Nakit', phone: '0532 123 45 67', address: 'İstanbul / Kadıköy', note: '2 erkek, 1 dişi. Sağlıklı ve aktif.' },
    { id: 'S-2025-014', customer: 'Mehmet Kaya', date: '28 Temmuz 2025', fullDate: '28 Temmuz 2025 Pazartesi - 14:30', total: '1.800 ₺', status: 'Tamamlandı', paymentType: 'Kredi Kartı', phone: '0544 987 65 43', address: 'Ankara / Çankaya', note: 'Kafes ile birlikte verildi.' },
    { id: 'S-2025-013', customer: 'Caner Demir', date: '27 Temmuz 2025', fullDate: '27 Temmuz 2025 Pazar - 10:15', total: '4.000 ₺', status: 'Tamamlandı', paymentType: 'Havale', phone: '0533 456 78 90', address: 'İzmir / Karşıyaka', note: 'Otobüs ile gönderim yapıldı.' },
    { id: 'S-2025-012', customer: 'Burak Şahin', date: '25 Temmuz 2025', fullDate: '25 Temmuz 2025 Cuma - 16:45', total: '2.200 ₺', status: 'Tamamlandı', paymentType: 'Nakit', phone: '0555 111 22 33', address: 'Bursa / Nilüfer', note: 'Yavru yemi hediye edildi.' },
    { id: 'S-2025-011', customer: 'Fatih Arslan', date: '22 Temmuz 2025', fullDate: '22 Temmuz 2025 Salı - 09:30', total: '1.500 ₺', status: 'Tamamlandı', paymentType: 'Havale', phone: '0532 999 88 77', address: 'Antalya / Muratpaşa', note: 'Tüyleri çok düzgün.' },
    { id: 'S-2025-010', customer: 'Serkan Duman', date: '20 Temmuz 2025', fullDate: '20 Temmuz 2025 Pazar - 13:00', total: '3.000 ₺', status: 'Tamamlandı', paymentType: 'Nakit', phone: '0542 333 44 55', address: 'Adana / Seyhan', note: '-' },
    { id: 'S-2025-009', customer: 'Halil Güneş', date: '18 Temmuz 2025', fullDate: '18 Temmuz 2025 Cuma - 15:20', total: '1.200 ₺', status: 'Tamamlandı', paymentType: 'Kredi Kartı', phone: '0535 666 77 88', address: 'Gaziantep / Şahinbey', note: '-' },
    { id: 'S-2025-008', customer: 'Oğuzhan Polat', date: '15 Temmuz 2025', fullDate: '15 Temmuz 2025 Salı - 10:00', total: '2.000 ₺', status: 'Tamamlandı', paymentType: 'Havale', phone: '0543 222 11 00', address: 'Trabzon / Ortahisar', note: 'Damızlık erkek verildi.' },
  ];

  const allSales = [...sales, ...salesList];
  const activeSale = allSales.find(s => s.id === selectedSaleId) || allSales[0];

  const mockBirds = [
    { id: '2026-045', gender: 'male', mutation: 'Lutino', age: '6 Ay', price: '1.000 ₺' },
    { id: '2026-046', gender: 'male', mutation: 'Mavi', age: '6 Ay', price: '800 ₺' },
    { id: '2026-047', gender: 'female', mutation: 'Yeşil', age: '6 Ay', price: '700 ₺' },
  ];

  const handleAddSale = (saleData) => {
    const newSale = {
      ...saleData,
      id: `S-2026-0${allSales.length + 10}`,
      customer: saleData.buyerName,
      fullDate: saleData.date,
      total: `${saleData.price} ₺`,
      paymentType: 'Bilinmiyor',
      phone: '-',
      address: '-',
      note: 'Yeni Satış'
    };
    setSales(prev => [newSale, ...prev]);
    setSelectedSaleId(newSale.id);
  };

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Satış Kayıtları</h2>
          <p className="text-slate-500 mt-1">Gerçekleştirilen satışları görüntüleyin ve yeni satış ekleyin.</p>
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 border border-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm flex-1 sm:flex-none whitespace-nowrap"
          >
            <Plus size={18} /> Yeni Satış
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium shadow-sm flex-1 sm:flex-none">
            <FileText size={18} /> PDF Yazdır
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium shadow-sm flex-1 sm:flex-none">
            <Printer size={18} /> Yazdır
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* Left Column - Sales List */}
        <div className="w-full lg:w-[380px] bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col shrink-0 overflow-hidden">
          
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Satış Listesi</h3>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Ara... (kuş no, müşteri, not)" 
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <button className="px-3 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 text-sm">
                <Filter size={16} /> Filtrele
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[600px]">
            {allSales.map((sale) => (
              <div 
                key={sale.id}
                onClick={() => setSelectedSaleId(sale.id)}
                className={`p-4 border-b border-slate-50 cursor-pointer transition-all flex justify-between items-center ${
                  selectedSaleId === sale.id 
                    ? 'bg-blue-50/50 border-l-4 border-l-blue-500 pl-3' 
                    : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                }`}
              >
                <div>
                  <div className={`font-bold mb-1 ${selectedSaleId === sale.id ? 'text-blue-700' : 'text-blue-600'}`}>{sale.id}</div>
                  <div className="text-xs text-slate-500">{sale.date}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-slate-700 mb-1">{sale.customer}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-800 mb-1 text-sm">{sale.total}</div>
                  <div className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{sale.status}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
            <span>Toplam 15 kayıt gösteriliyor.</span>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 flex items-center justify-center rounded bg-blue-600 text-white font-medium">1</button>
              <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 text-slate-600 font-medium transition-colors">2</button>
              <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 text-slate-400 transition-colors"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>

        {/* Right Column - Sale Detail */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col p-6">
          
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Satış Detayı</h3>
            <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">{activeSale.status}</span>
          </div>

          {/* Info Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 border border-slate-100 rounded-xl flex items-center gap-3">
              <div className="text-slate-400"><FileText size={24} /></div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5 font-medium">Satış No</p>
                <p className="font-bold text-slate-800">{activeSale.id}</p>
              </div>
            </div>
            <div className="p-4 border border-slate-100 rounded-xl flex items-center gap-3">
              <div className="text-slate-400"><CalendarIcon size={24} /></div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5 font-medium">Satış Tarihi</p>
                <p className="font-bold text-slate-800 text-xs leading-tight whitespace-pre-line">{activeSale.fullDate.replace(' - ', '\n')}</p>
              </div>
            </div>
            <div className="p-4 border border-slate-100 rounded-xl flex items-center gap-3">
              <div className="text-slate-400"><Banknote size={24} /></div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5 font-medium">Ödeme Türü</p>
                <p className="font-bold text-slate-800">{activeSale.paymentType}</p>
              </div>
            </div>
            <div className="p-4 border border-slate-100 rounded-xl flex items-center gap-3">
              <div className="text-slate-400"><ShoppingBag size={24} /></div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5 font-medium">Toplam Tutar</p>
                <p className="font-bold text-green-600 text-lg">{activeSale.total}</p>
              </div>
            </div>
          </div>

          {/* Customer & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h4 className="text-blue-600 font-bold mb-4 text-sm">Müşteri Bilgileri</h4>
              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex items-center gap-3">
                  <User size={18} className="text-slate-400" />
                  <span className="font-bold text-slate-800 text-base">{activeSale.customer}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-slate-400" />
                  <span>{activeSale.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-slate-400" />
                  <span>{activeSale.address}</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 relative">
              <h4 className="text-slate-700 font-bold mb-2 text-sm">Not</h4>
              <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <Edit3 size={16} />
              </button>
              <p className="text-sm text-slate-600 leading-relaxed">{activeSale.note}</p>
            </div>
          </div>

          {/* Sold Birds Table */}
          <div className="mb-8 flex-1">
            <h4 className="text-blue-600 font-bold mb-4 text-sm">Satılan Kuşlar</h4>
            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-xs text-slate-500 border-b border-slate-100">
                    <th className="font-medium p-3">Kuş No</th>
                    <th className="font-medium p-3 text-center">Cinsiyet</th>
                    <th className="font-medium p-3">Renk / Mutasyon</th>
                    <th className="font-medium p-3 text-center">Yaş</th>
                    <th className="font-medium p-3 text-right">Fiyat</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-700 divide-y divide-slate-50">
                  {mockBirds.map(bird => (
                    <tr key={bird.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-50 border border-blue-100 flex items-center justify-center text-lg">
                          🦜
                        </div>
                        <span className="font-medium">{bird.id}</span>
                      </td>
                      <td className="p-3 text-center">
                        {bird.gender === 'male' 
                          ? <span className="text-blue-500 font-bold text-lg">♂</span> 
                          : <span className="text-pink-500 font-bold text-lg">♀</span>
                        }
                      </td>
                      <td className="p-3">{bird.mutation}</td>
                      <td className="p-3 text-center">{bird.age}</td>
                      <td className="p-3 text-right font-medium">{bird.price}</td>
                    </tr>
                  ))}
                  
                  {/* Totals Row */}
                  <tr>
                    <td colSpan="3"></td>
                    <td className="p-3 text-right font-medium text-slate-600">Ara Toplam</td>
                    <td className="p-3 text-right font-bold text-slate-800">{activeSale.total}</td>
                  </tr>
                  <tr className="bg-green-50/30">
                    <td colSpan="3"></td>
                    <td className="p-3 text-right font-bold text-green-700 text-base">Toplam</td>
                    <td className="p-3 text-right font-bold text-green-700 text-lg">{activeSale.total}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto pt-4 border-t border-slate-100 flex justify-center gap-4">
             <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-semibold shadow-sm">
               <Edit3 size={18} /> Düzenle
             </button>
             <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-semibold shadow-sm">
               <FileText size={18} /> Fatura Yazdır
             </button>
          </div>

        </div>

      </div>

      <SaleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddSale}
        birds={birds}
      />
    </div>
  );
};

export default Sales;
