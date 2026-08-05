import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Edit3, Trash2 } from 'lucide-react';
import FormDropdown from '../ui/FormDropdown';

const AllTransactionsModal = ({ isOpen, onClose, transactions, onEdit, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('Tümü');

  const filteredTransactions = useMemo(() => {
    let result = transactions;
    if (filterType !== 'Tümü') {
      result = result.filter(t => t.type === filterType);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => t.desc?.toLowerCase().includes(q));
    }
    return result;
  }, [transactions, filterType, searchQuery]);

  const formatMoney = (val) => new Intl.NumberFormat('tr-TR').format(val) + ' ₺';

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white rounded-2xl w-full max-w-5xl h-[85vh] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Tüm İşlemler</h3>
            <p className="text-sm text-slate-500">Tüm gelir ve gider kayıtlarınızın tam listesi.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200/50 text-slate-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex gap-4 bg-white shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Açıklama ara..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="w-40">
            <FormDropdown 
              value={filterType}
              onChange={setFilterType}
              options={[
                { value: 'Tümü', label: 'Tümü' },
                { value: 'Gelir', label: 'Sadece Gelir' },
                { value: 'Gider', label: 'Sadece Gider' }
              ]}
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto bg-slate-50/30">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="sticky top-0 bg-white shadow-sm">
              <tr className="text-xs text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <th className="p-4 pl-6 w-32">Tarih</th>
                <th className="p-4">Açıklama</th>
                <th className="p-4 text-center w-24">Tür</th>
                <th className="p-4 text-right w-36">Tutar</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-slate-500 bg-white">
                    İşlem bulunamadı.
                  </td>
                </tr>
              ) : filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors bg-white">
                  <td className="p-4 pl-6 text-slate-500">{tx.date}</td>
                  <td className="p-4 font-medium">{tx.desc}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                      tx.type === 'Gelir' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`p-4 text-right font-bold text-base ${
                    tx.type === 'Gelir' ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {formatMoney(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
          <span className="text-sm font-medium text-slate-500">
            Toplam <strong className="text-slate-800">{filteredTransactions.length}</strong> kayıt gösteriliyor.
          </span>
          <button onClick={onClose} className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors">
            Kapat
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};
export default AllTransactionsModal;
