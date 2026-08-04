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
  const [transactions, setTransactions] = useState(() => loadData('aviary_transactions', []));
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
  const registerSale = (birdId, customer, price, date) => {
    const bird = birds.find(b => b.id === birdId);
    if(!bird) return;

    // Kuş statüsü satıldı (4) yapılıyor
    setBirds(prev => prev.map(b => b.id === birdId ? { ...b, status: 4, aviaryName: 'Satıldı' } : b));

    // Satış kaydı
    const newSale = {
      id: `S-${Date.now()}`,
      birdId,
      birdBandNumber: bird.bandNumber,
      customer,
      price,
      date: date || new Date().toISOString().split('T')[0]
    };
    setSales(prev => [newSale, ...prev]);
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

  return (
    <DataContext.Provider value={{
      birds, addBird, setBirds,
      nests, setNests,
      sales, setSales,
      transactions, setTransactions,
      carePlans, setCarePlans,
      clutches, setClutches,
      eggs, setEggs,
      pairBirds, registerEgg, registerHatch, registerSale
    }}>
      {children}
    </DataContext.Provider>
  );
};
