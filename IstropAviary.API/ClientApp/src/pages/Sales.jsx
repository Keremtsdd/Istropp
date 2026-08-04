import { useState } from 'react';
import { 
  FileText, Printer, Plus, Search, Filter, ChevronLeft, ChevronRight,
  Calendar as CalendarIcon, Banknote, ShoppingBag, User, Phone, MapPin, Edit3
} from 'lucide-react';
import { useData } from '../context/DataContext';
import SaleModal from '../components/modals/SaleModal';

const Sales = () => {
  const { sales, birds, registerSale } = useData();
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sahte mock data yerine Context'ten gelen verileri al. Eger secili yoksa ilkini sec.
  const activeSale = sales.find(s => s.id === selectedSaleId) || sales[0];
  
  if (!selectedSaleId && sales.length > 0) {
    setSelectedSaleId(sales[0].id);
  }

  const mockBirds = activeSale ? birds.filter(b => b.id === activeSale.birdId).map(b => ({
    id: b.bandNumber,
    gender: b.gender === 0 || b.gender === '0' || b.gender === 'Erkek' ? 'male' : 'female',
    mutation: b.mutation,
    age: '-',
    price: activeSale.price + ' ₺'
  })) : [];

  const handleAddSale = (saleData) => {
    registerSale(Number(saleData.birdId), saleData.buyerName, saleData.price, saleData.date);
    // registerSale updates sales array, but to auto-select we might need to wait for render.
    // For now we just close the modal.
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
          <button onClick={() => window.print()} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium shadow-sm flex-1 sm:flex-none">
            <FileText size={18} /> PDF Yazdır
          </button>
          <button onClick={() => window.print()} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium shadow-sm flex-1 sm:flex-none">
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
            {sales.length === 0 ? (
              <div className="p-10 text-center text-slate-500 text-sm">Satış kaydı bulunamadı.</div>
            ) : sales.map((sale) => (
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
                  <div className="font-bold text-slate-800 mb-1 text-sm">{sale.price} ₺</div>
                  <div className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Tamamlandı</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
            <span>Toplam {sales.length} kayıt gösteriliyor.</span>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 flex items-center justify-center rounded bg-blue-600 text-white font-medium">1</button>
            </div>
          </div>
        </div>

        {/* Right Column - Sale Detail */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col p-6">
          {!activeSale ? (
             <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
               <ShoppingBag size={48} className="opacity-50" />
               <p>Sol taraftan bir satış seçin veya yeni satış ekleyin.</p>
             </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Satış Detayı</h3>
            <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">Tamamlandı</span>
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
                <p className="font-bold text-slate-800 text-xs leading-tight whitespace-pre-line">{activeSale.date}</p>
              </div>
            </div>
            <div className="p-4 border border-slate-100 rounded-xl flex items-center gap-3">
              <div className="text-slate-400"><Banknote size={24} /></div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5 font-medium">Ödeme Türü</p>
                <p className="font-bold text-slate-800">Nakit</p>
              </div>
            </div>
            <div className="p-4 border border-slate-100 rounded-xl flex items-center gap-3">
              <div className="text-slate-400"><ShoppingBag size={24} /></div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5 font-medium">Toplam Tutar</p>
                <p className="font-bold text-green-600 text-lg">{activeSale.price} ₺</p>
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
                  <span>-</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-slate-400" />
                  <span>-</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 relative">
              <h4 className="text-slate-700 font-bold mb-2 text-sm">Not</h4>
              <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <Edit3 size={16} />
              </button>
              <p className="text-sm text-slate-600 leading-relaxed">-</p>
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
                    <td className="p-3 text-right font-bold text-slate-800">{activeSale.price} ₺</td>
                  </tr>
                  <tr className="bg-green-50/30">
                    <td colSpan="3"></td>
                    <td className="p-3 text-right font-bold text-green-700 text-base">Toplam</td>
                    <td className="p-3 text-right font-bold text-green-700 text-lg">{activeSale.price} ₺</td>
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
             <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-semibold shadow-sm">
               <FileText size={18} /> Fatura Yazdır
             </button>
          </div>

            </>
          )}

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
