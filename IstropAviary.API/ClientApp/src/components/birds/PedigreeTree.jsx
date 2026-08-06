import React from 'react';
import { useData } from '../../context/DataContext';

const BirdNode = ({ bird, label }) => {
  if (!bird) {
    return (
      <div className="flex flex-col items-center justify-center p-3 w-32 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</span>
        <span className="text-sm font-medium text-slate-400">Bilinmiyor</span>
      </div>
    );
  }

  const isMale = bird.gender === 0 || bird.gender === '0' || bird.gender === 'Erkek' || bird.gender === 'male';
  const isFemale = bird.gender === 1 || bird.gender === '1' || bird.gender === 'Dişi' || bird.gender === 'female';
  const genderColor = isMale ? 'text-blue-500 bg-blue-50 border-blue-200' : isFemale ? 'text-pink-500 bg-pink-50 border-pink-200' : 'text-slate-500 bg-white border-slate-200';

  return (
    <div className={`flex flex-col items-center p-3 w-32 border-2 rounded-xl shadow-sm transition-all hover:shadow-md cursor-pointer ${genderColor}`}>
      <span className="text-[10px] font-bold opacity-70 uppercase tracking-wider mb-1">{label}</span>
      <span className="text-lg leading-none mb-1">{isMale ? '♂' : isFemale ? '♀' : '?'}</span>
      <span className="text-sm font-bold truncate w-full text-center" title={bird.bandNumber}>{bird.bandNumber}</span>
      {bird.mutation && <span className="text-[10px] opacity-80 mt-1 truncate w-full text-center">{bird.mutation}</span>}
    </div>
  );
};

const PedigreeTree = ({ rootBird }) => {
  const { birds } = useData();

  const getBird = (id) => birds.find(b => b.id === id);

  const father = getBird(rootBird.fatherId);
  const mother = getBird(rootBird.motherId);

  const paternalGrandfather = father ? getBird(father.fatherId) : null;
  const paternalGrandmother = father ? getBird(father.motherId) : null;

  const maternalGrandfather = mother ? getBird(mother.fatherId) : null;
  const maternalGrandmother = mother ? getBird(mother.motherId) : null;

  return (
    <div className="w-full overflow-x-auto py-6">
      <div className="min-w-[600px] flex flex-col items-center relative">
        
        {/* Gen 3: Grandparents */}
        <div className="flex w-full justify-between px-10 mb-8 relative">
          <div className="flex gap-4">
            <BirdNode bird={paternalGrandfather} label="Büyükbaba" />
            <BirdNode bird={paternalGrandmother} label="Büyükanne" />
          </div>
          <div className="flex gap-4">
            <BirdNode bird={maternalGrandfather} label="Büyükbaba" />
            <BirdNode bird={maternalGrandmother} label="Büyükanne" />
          </div>
        </div>

        {/* Lines for Grandparents to Parents */}
        <div className="absolute top-20 w-full flex justify-between px-28">
           <div className="w-[120px] h-8 border-b-2 border-r-2 border-l-2 border-slate-300 rounded-b-xl -mt-4"></div>
           <div className="w-[120px] h-8 border-b-2 border-r-2 border-l-2 border-slate-300 rounded-b-xl -mt-4"></div>
        </div>
        
        {/* Lines dropping down to Parents */}
        <div className="absolute top-24 w-full flex justify-between px-[170px]">
           <div className="w-0.5 h-8 bg-slate-300"></div>
           <div className="w-0.5 h-8 bg-slate-300"></div>
        </div>

        {/* Gen 2: Parents */}
        <div className="flex w-full justify-around px-20 mb-8 mt-2 relative">
          <BirdNode bird={father} label="Baba" />
          <BirdNode bird={mother} label="Anne" />
        </div>

        {/* Lines for Parents to Child */}
        <div className="absolute top-[200px] w-full flex justify-center">
           <div className="w-[300px] h-8 border-b-2 border-r-2 border-l-2 border-slate-300 rounded-b-xl -mt-4"></div>
        </div>

        {/* Line dropping down to Child */}
        <div className="absolute top-[204px] w-full flex justify-center">
           <div className="w-0.5 h-8 bg-slate-300 mt-2"></div>
        </div>

        {/* Gen 1: Child (Root) */}
        <div className="mt-4">
          <BirdNode bird={rootBird} label="Seçili Kuş" />
        </div>

      </div>
    </div>
  );
};

export default PedigreeTree;
