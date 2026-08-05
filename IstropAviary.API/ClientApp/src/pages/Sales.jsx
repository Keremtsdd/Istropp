import { useState } from 'react';
import { 
  FileText, Printer, Plus, Search, Filter, ChevronLeft, ChevronRight,
  Calendar as CalendarIcon, Banknote, ShoppingBag, User, Phone, MapPin, Edit3, Trash2
} from 'lucide-react';
import { useData } from '../context/DataContext';
import SaleModal from '../components/modals/SaleModal';

const Sales = () => {
  const { sales, birds, registerSale, updateSale, deleteSale } = useData();
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSales = sales.filter(s => {
    const q = searchQuery.toLowerCase();
    return s.customer?.toLowerCase().includes(q);
  });

  // Sahte mock data yerine Context'ten gelen verileri al. Eger secili yoksa ilkini sec.
  const activeSale = filteredSales.find(s => s.id === selectedSaleId) || filteredSales[0];
  
  if (!selectedSaleId && filteredSales.length > 0) {
    setSelectedSaleId(filteredSales[0].id);
  }

  const activeIds = activeSale ? (activeSale.birdIds || [activeSale.birdId].filter(Boolean)) : [];
  const mockBirds = activeSale ? birds.filter(b => activeIds.includes(b.id)).map(b => ({
    id: b.bandNumber,
    gender: b.gender === 0 || b.gender === '0' || b.gender === 'Erkek' ? 'male' : 'female',
    mutation: b.mutation,
    age: '-',
    price: '-'
  })) : [];

  const handleAddSale = (saleData) => {
    if (editingSale) {
      updateSale(editingSale.id, {
        birdIds: saleData.birdIds,
        customer: saleData.buyerName,
        buyerPhone: saleData.buyerPhone,
        buyerAddress: saleData.buyerAddress,
        price: saleData.price,
        date: saleData.date,
        status: saleData.status,
        notes: saleData.notes
      });
      setEditingSale(null);
    } else {
      registerSale(
        saleData.birdIds, 
        saleData.buyerName, 
        saleData.buyerPhone, 
        saleData.buyerAddress, 
        saleData.price, 
        saleData.date,
        saleData.notes
      );
    }
    setIsModalOpen(false);
  };

  const openEditModal = () => {
    setEditingSale(activeSale);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingSale(null);
    setIsModalOpen(true);
  };

  const handleDeleteSale = (id) => {
    if (window.confirm("Bu satışı silmek istediğinize emin misiniz? İlgili kuşların durumu 'Ana Salma' olarak güncellenecektir.")) {
      deleteSale(id);
      if (selectedSaleId === id) setSelectedSaleId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 print:hidden">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Satış Kayıtları</h2>
          <p className="text-slate-500 mt-1">Gerçekleştirilen satışları görüntüleyin ve yeni satış ekleyin.</p>
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button 
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 border border-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm flex-1 sm:flex-none whitespace-nowrap"
          >
            <Plus size={18} /> Yeni Satış
          </button>
          <button onClick={() => window.print()} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium shadow-sm flex-1 sm:flex-none">
            <Printer size={18} /> Yazdır
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* Left Column - Sales List */}
        <div className="w-full lg:w-[380px] bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col shrink-0 overflow-hidden print:hidden">
          
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Satış Listesi</h3>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Müşteri ara..." 
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <button className="px-3 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 text-sm">
                <Filter size={16} /> Filtrele
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[600px]">
            {filteredSales.length === 0 ? (
              <div className="p-10 text-center text-slate-500 text-sm">Satış kaydı bulunamadı.</div>
            ) : filteredSales.map((sale) => (
              <div 
                key={sale.id}
                onClick={() => setSelectedSaleId(sale.id)}
                className={`p-4 border-b border-slate-50 cursor-pointer transition-all flex justify-between items-center ${
                  selectedSaleId === sale.id 
                    ? 'bg-blue-50/50 border-l-4 border-l-blue-500 pl-3' 
                    : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex-1">
                  <div className={`font-bold mb-0.5 text-sm ${selectedSaleId === sale.id ? 'text-blue-700' : 'text-slate-700'}`}>
                    {sale.customer}
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div className="font-bold text-slate-800 text-sm">{sale.price} ₺</div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteSale(sale.id); }} 
                    className="text-slate-300 hover:text-red-500 transition-colors p-1"
                    title="Satışı Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
            <span>Toplam {filteredSales.length} kayıt gösteriliyor.</span>
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
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 border border-slate-100 rounded-xl flex items-center gap-3">
              <div className="text-slate-400"><CalendarIcon size={24} /></div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5 font-medium">Satış Tarihi</p>
                <p className="font-bold text-slate-800 text-xs leading-tight whitespace-pre-line">{activeSale.date}</p>
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
                  <span>{activeSale.buyerPhone || '-'}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-slate-400 mt-0.5 shrink-0" />
                  <span className="break-words">{activeSale.buyerAddress || '-'}</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 relative">
              <h4 className="text-slate-700 font-bold mb-2 text-sm">Not</h4>
              <button onClick={openEditModal} className="absolute top-4 right-4 text-slate-400 hover:text-blue-600 transition-colors">
                <Edit3 size={16} />
              </button>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{activeSale.notes || '-'}</p>
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
          <div className="mt-auto pt-4 border-t border-slate-100 flex flex-wrap justify-center gap-4 print:hidden">
             <button onClick={() => handleDeleteSale(activeSale.id)} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold shadow-sm">
               <Trash2 size={18} /> Sil
             </button>
             <button onClick={openEditModal} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-semibold shadow-sm">
               <Edit3 size={18} /> Düzenle
             </button>
             <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 border border-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm">
               <FileText size={18} /> Fatura Yazdır
             </button>
          </div>

            </>
          )}

        </div>

      </div>

      <SaleModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSale(null);
        }}
        onSave={handleAddSale}
        birds={birds}
        initialData={editingSale}
      />
    </div>
  );
};

export default Sales;
