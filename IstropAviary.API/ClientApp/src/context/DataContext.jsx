import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  // Try to load initial data from localStorage
  const loadData = (key, defaultData) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultData;
    } catch {
      return defaultData;
    }
  };

  const [birds, setBirds] = useState(() => loadData('aviary_birds', [
    { id: 1, bandNumber: 'TR-23-001', gender: 0, mutation: 'Lutino', status: 1, notes: 'Örnek Kuş', aviaryName: 'Ana Salma' },
    { id: 2, bandNumber: 'TR-23-002', gender: 1, mutation: 'Albino', status: 1, notes: 'Örnek Dişi', aviaryName: 'Ana Salma' }
  ]));
  
  const [nests, setNests] = useState(() => loadData('aviary_nests', []));
  const [sales, setSales] = useState(() => loadData('aviary_sales', []));
  const [transactions, setTransactions] = useState(() => loadData('aviary_transactions', [
    { id: 1, date: '31.07.2025', desc: '2026-045 Lutino (Erkek) Satış', type: 'Gelir', category: 'Kuş Satışı', amount: 1000 },
    { id: 2, date: '31.07.2025', desc: 'Mama Alımı - Pro Yem', type: 'Gider', category: 'Yem', amount: 2250 },
    { id: 3, date: '30.07.2025', desc: '2026-046 Mavi (Erkek) Satış', type: 'Gelir', category: 'Kuş Satışı', amount: 800 },
    { id: 4, date: '30.07.2025', desc: 'Vitamin Takviyesi Alımı', type: 'Gider', category: 'İlaç / Vitamin', amount: 450 },
    { id: 5, date: '29.07.2025', desc: 'Kafes Malzemesi Alımı', type: 'Gider', category: 'Malzeme', amount: 1150 },
    { id: 6, date: '28.07.2025', desc: '2026-047 Yeşil (Dişi) Satış', type: 'Gelir', category: 'Kuş Satışı', amount: 700 },
    { id: 7, date: '28.07.2025', desc: 'Elektrik Gideri', type: 'Gider', category: 'Fatura', amount: 320 },
    { id: 8, date: '27.07.2025', desc: 'Kuluçka Kutusu Alımı', type: 'Gider', category: 'Malzeme', amount: 1300 }
  ]));
  const [carePlans, setCarePlans] = useState(() => loadData('aviary_careplans', []));
  const [clutches, setClutches] = useState(() => loadData('aviary_clutches', []));
  const [eggs, setEggs] = useState(() => loadData('aviary_eggs', []));

  // Save to localStorage whenever data changes
  useEffect(() => { localStorage.setItem('aviary_birds', JSON.stringify(birds)); }, [birds]);
  useEffect(() => { localStorage.setItem('aviary_nests', JSON.stringify(nests)); }, [nests]);
  useEffect(() => { localStorage.setItem('aviary_sales', JSON.stringify(sales)); }, [sales]);
  useEffect(() => { localStorage.setItem('aviary_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('aviary_careplans', JSON.stringify(carePlans)); }, [carePlans]);
  useEffect(() => { localStorage.setItem('aviary_clutches', JSON.stringify(clutches)); }, [clutches]);
  useEffect(() => { localStorage.setItem('aviary_eggs', JSON.stringify(eggs)); }, [eggs]);

  // -----------------------------------------------------
  // EVENT-DRIVEN AUTOMATION FUNCTIONS (SIMULATION)
  // -----------------------------------------------------

  // 1. Çiftleştirme Otomasyonu
  const pairBirds = (maleId, femaleId, nestId) => {
    const clutchId = Date.now();
    const newClutch = {
      id: clutchId,
      maleId,
      femaleId,
      nestId,
      startDate: new Date().toISOString().split('T')[0],
      status: 'Aktif'
    };
    
    // Kuşların durumunu "Damızlık (1)" yap ve yuvalığa ata
    const nest = nests.find(n => n.id === nestId) || { nestCode: 'Bilinmiyor' };
    setBirds(prev => prev.map(b => 
      b.id === maleId || b.id === femaleId 
        ? { ...b, status: 1, aviaryName: nest.nestCode } 
        : b
    ));
    
    // Kuluçka aç
    setClutches(prev => [...prev, newClutch]);
  };

  // 2. Yumurta Oluşumu
  const registerEgg = (clutchId, layDate) => {
    // 21 gün kuluçka süresi (varsayılan)
    const hatchDate = new Date(layDate);
    hatchDate.setDate(hatchDate.getDate() + 21);
    
    const newEgg = {
      id: Date.now(),
      clutchId,
      layDate,
      estimatedHatchDate: hatchDate.toISOString().split('T')[0],
      status: 'Dolu'
    };
    
    setEggs(prev => [...prev, newEgg]);
  };

  // 3. Yumurta Çıkışı (Yavru Oluşumu)
  const registerHatch = (eggId, hatchDate) => {
    const egg = eggs.find(e => e.id === eggId);
    if (!egg) return;
    
    const clutch = clutches.find(c => c.id === egg.clutchId);
    if (!clutch) return;

    // Yumurta statüsünü güncelle
    setEggs(prev => prev.map(e => e.id === eggId ? { ...e, status: 'Çıktı', actualHatchDate: hatchDate } : e));
    
    // Yavru kayıt oluştur (Bilezik no şimdilik otomatik generik verilir)
    const newChickId = Date.now();
    const newBird = {
      id: newChickId,
      bandNumber: `YAVRU-${newChickId.toString().slice(-4)}`,
      gender: null, // Bilinmiyor
      mutation: 'Bilinmiyor',
      status: 2, // Yavru
      birthDate: hatchDate,
      motherId: clutch.femaleId,
      fatherId: clutch.maleId,
      aviaryName: 'Anne Altı'
    };
    setBirds(prev => [...prev, newBird]);
  };

  // 4. Satış İşlemi
  const registerSale = (birdIds, customer, buyerPhone, buyerAddress, price, date, notes) => {
    const ids = Array.isArray(birdIds) ? birdIds : [birdIds].filter(Boolean);

    // Kuş statüsü satıldı (4) yapılıyor
    setBirds(prev => prev.map(b => ids.includes(b.id) ? { ...b, status: 4, aviaryName: 'Satıldı' } : b));

    // Satış kaydı
    const newSale = {
      id: `S-${Date.now()}`,
      birdIds: ids,
      customer,
      buyerPhone,
      buyerAddress,
      price,
      date: date || new Date().toISOString().split('T')[0],
      notes: notes || ''
    };
    setSales(prev => [newSale, ...prev]);
  };

  const updateSale = (id, updatedData) => {
    const sale = sales.find(s => s.id === id);
    if (sale) {
        const oldIds = sale.birdIds || [sale.birdId].filter(Boolean);
        const newIds = updatedData.birdIds || [updatedData.birdId].filter(Boolean);
        
        const removedIds = oldIds.filter(x => !newIds.includes(x));
        const addedIds = newIds.filter(x => !oldIds.includes(x));
        
        setBirds(birdsPrev => birdsPrev.map(b => {
          if (removedIds.includes(b.id)) return { ...b, status: 1, aviaryName: 'Ana Salma' };
          if (addedIds.includes(b.id)) return { ...b, status: 4, aviaryName: 'Satıldı' };
          return b;
        }));
    }

    setSales(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
  };

  // 5. Basit Kuş Ekleme (Dışarıdan Alım vb)
  const addBird = (birdData) => {
    const newBird = {
      ...birdData,
      id: Date.now(),
      status: birdData.status,
      gender: birdData.gender
    };
    setBirds(prev => [...prev, newBird]);
  };

  const updateBird = (id, updatedData) => {
    setBirds(prev => prev.map(b => b.id === id ? { ...b, ...updatedData } : b));
  };

  const deleteNest = (id) => {
    setNests(prev => prev.filter(n => n.id !== id));
  };

  const updateNest = (id, updatedData) => {
    setNests(prev => prev.map(n => n.id === id ? { ...n, ...updatedData } : n));
  };

  const deleteEgg = (id) => {
    setEggs(prev => prev.filter(e => e.id !== id));
  };

  const addTransaction = (data) => {
    setTransactions(prev => [{ ...data, id: Date.now() }, ...prev]);
  };

  const updateTransaction = (id, updatedData) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <DataContext.Provider value={{
      birds, addBird, updateBird, setBirds,
      nests, setNests, deleteNest, updateNest,
      sales, setSales, updateSale,
      transactions, setTransactions, addTransaction, updateTransaction, deleteTransaction,
      carePlans, setCarePlans,
      clutches, setClutches,
      eggs, setEggs, deleteEgg,
      pairBirds, registerEgg, registerHatch, registerSale
    }}>
      {children}
    </DataContext.Provider>
  );
};
