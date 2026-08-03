import { useState } from 'react';
import { 
  ArrowLeft, Camera, Edit3, Info, Egg, ScrollText, 
  BookOpen, ShoppingCart, CalendarDays, Home, FileText,
  Star
} from 'lucide-react';
import { useData } from '../../context/DataContext';

const BirdDetail = ({ bird, onBack }) => {
  const { birds } = useData();

  // Find parents
  const father = birds.find(b => b.id === bird.fatherId);
  const mother = birds.find(b => b.id === bird.motherId);

  const getStatusColor = (status) => {
    switch(parseInt(status) || status) {
      case 1: 
      case 'Damızlık': return 'bg-green-100 text-green-700';
      case 2:
      case 'Yavru': return 'bg-blue-100 text-blue-700';
      case 3:
      case 'Dinlenmede': return 'bg-amber-100 text-amber-700';
      case 4:
      case 'Satılık': return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const statusText = (status) => {
    switch(parseInt(status) || status) {
      case 1: return 'Damızlık';
      case 2: return 'Yavru';
      case 3: return 'Dinlenmede';
      case 4: return 'Satılık';
      default: return status || 'Bilinmiyor';
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-10">
      
      {/* Top Header */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <span>Kuşlar</span>
            <ChevronRight size={14} />
            <span className="text-slate-800">{bird.bandNumber}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Kuş Kartı</h2>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        
        {/* Left Profile Card */}
        <div className="w-full xl:w-[320px] bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden shrink-0">
          
          <div className="relative aspect-square bg-slate-100">
            {/* Kuş Resmi Placeholder */}
            <img 
              src={`https://ui-avatars.com/api/?name=${bird.bandNumber}&background=f1f5f9&color=94a3b8&size=512&font-size=0.15`}
              alt={bird.bandNumber}
              className="w-full h-full object-cover"
            />
            <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-700 hover:bg-white shadow-sm transition-colors">
              <Camera size={18} />
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800">{bird.bandNumber}</h3>
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 ${getStatusColor(bird.status)}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {statusText(bird.status)}
              </span>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                <div className="w-5 flex justify-center">
                  {bird.gender === 0 || bird.gender === '0' || bird.gender === 'Erkek' || bird.gender === 'male' ? (
                    <span className="text-blue-500 text-lg">♂</span>
                  ) : bird.gender === 1 || bird.gender === '1' || bird.gender === 'Dişi' || bird.gender === 'female' ? (
                    <span className="text-pink-500 text-lg">♀</span>
                  ) : <Info size={16} />}
                </div>
                <span>
                  {bird.gender === 0 || bird.gender === '0' || bird.gender === 'Erkek' || bird.gender === 'male' ? 'Erkek' 
                   : bird.gender === 1 || bird.gender === '1' || bird.gender === 'Dişi' || bird.gender === 'female' ? 'Dişi' 
                   : 'Bilinmiyor'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                <div className="w-5 flex justify-center"><div className="w-3 h-3 rounded-full bg-indigo-400"></div></div>
                <span>{bird.mutation || 'Mutasyon Yok'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                <div className="w-5 flex justify-center"><CalendarDays size={16} /></div>
                <span>{bird.birthDate || 'Bilinmiyor'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                <div className="w-5 flex justify-center"><Home size={16} /></div>
                <span>Yuvalık: {bird.aviaryName || '-'}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-blue-200 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors">
                <Edit3 size={18} /> Düzenle
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors">
                <Camera size={18} /> Fotoğrafı Değiştir
              </button>
            </div>

          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 w-full flex flex-col min-h-0">
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sol Kolon - Temel Bilgiler */}
            <div className="flex-1 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6 text-slate-800">
                  <FileText size={20} className="text-blue-500" />
                  <h3 className="text-lg font-bold">Temel Bilgiler</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-slate-50 pb-3">
                    <span className="text-slate-500 text-sm">Bilezik No</span>
                    <span className="font-semibold text-slate-800">{bird.bandNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-3">
                    <span className="text-slate-500 text-sm">Cinsiyet</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      {bird.gender === 0 || bird.gender === '0' || bird.gender === 'Erkek' || bird.gender === 'male' ? (
                        <><span className="text-blue-500">♂</span> Erkek</>
                      ) : bird.gender === 1 || bird.gender === '1' || bird.gender === 'Dişi' || bird.gender === 'female' ? (
                        <><span className="text-pink-500">♀</span> Dişi</>
                      ) : 'Bilinmiyor'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-3">
                    <span className="text-slate-500 text-sm">Doğum Tarihi</span>
                    <span className="font-semibold text-slate-800">{bird.birthDate || '-'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-3">
                    <span className="text-slate-500 text-sm">Yaş</span>
                    <span className="font-semibold text-slate-800">-</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-3">
                    <span className="text-slate-500 text-sm">Durum</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusColor(bird.status)}`}>
                      <span className="w-1.5 h-1.5 inline-block rounded-full bg-current mr-1"></span>
                      {statusText(bird.status)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-3">
                    <span className="text-slate-500 text-sm">Yuvalık</span>
                    <span className="font-semibold text-slate-800">{bird.aviaryName || '-'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-3">
                    <span className="text-slate-500 text-sm">Anne</span>
                    <span className="font-semibold text-pink-600">
                      {mother ? `${mother.bandNumber} (♀)` : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-slate-500 text-sm">Baba</span>
                    <span className="font-semibold text-blue-600">
                      {father ? `${father.bandNumber} (♂)` : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ Kolon - Kısa Bilgi & Notlar */}
            <div className="flex-1 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6 text-slate-800">
                  <Star size={20} className="text-amber-500" />
                  <h3 className="text-lg font-bold">Kısa Bilgi</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                    <Home size={20} className="text-slate-400 mb-1" />
                    <span className="text-xs text-slate-500">Yuvalık</span>
                    <span className="font-bold text-slate-800">{bird.aviaryName || '-'}</span>
                  </div>
                  <div className="border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                    <CalendarDays size={20} className="text-slate-400 mb-1" />
                    <span className="text-xs text-slate-500">Yerleştirme</span>
                    <span className="font-bold text-slate-800">-</span>
                  </div>
                  <div className="border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                    <Egg size={20} className="text-slate-400 mb-1" />
                    <span className="text-xs text-slate-500">Toplam Yumurta</span>
                    <span className="font-bold text-slate-800">-</span>
                  </div>
                  <div className="border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                    <div className="text-lg leading-none mb-1 text-slate-400">🐥</div>
                    <span className="text-xs text-slate-500">Çıkan Yavru</span>
                    <span className="font-bold text-slate-800">-</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-slate-800">
                  <Edit3 size={20} className="text-emerald-500" />
                  <h3 className="text-lg font-bold">Notlar</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {bird.notes || 'Bu kuş için henüz bir not eklenmemiş.'}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

// Internal icon since it's not exported from lucide directly with that name in this version
function ChevronRight(props) {
  return (
    <svg
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

export default BirdDetail;
