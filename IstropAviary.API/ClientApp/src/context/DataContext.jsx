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

  const [birds, setBirds] = useState([]);
  const [nests, setNests] = useState([]);
  const [sales, setSales] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [carePlans, setCarePlans] = useState([]);
  const [clutches, setClutches] = useState([]);
  const [eggs, setEggs] = useState([]);

  const [apiClient, setApiClient] = useState(null);

  useEffect(() => {
    import('../api/axiosClient').then(module => {
      const client = module.default;
      setApiClient(() => client);

      // Fetch initial data from API
      const fetchData = async () => {
        try {
          const [birdsRes, nestsRes, clutchesRes] = await Promise.all([
            client.get('/Birds'),
            client.get('/Nests'),
            client.get('/Clutches').catch(() => ({ data: [] }))
          ]);
          setBirds(birdsRes.data);
          setNests(nestsRes.data);
          setClutches(clutchesRes.data);
          
          try {
             const eggsRes = await client.get('/Breeding/eggs');
             setEggs(eggsRes.data);
          } catch(e) {}
        } catch (error) {
          console.error("API Fetch Error:", error);
        }
      };

      fetchData();
    });
  }, []);



  // 1. Çiftleştirme Otomasyonu
  const pairBirds = async (maleId, femaleId, nestId) => {
    if (!apiClient) return;
    try {
      await apiClient.post('/Breeding/pair', { maleId, femaleId, nestId });
      // To show immediate feedback without full refresh, we could just reload page or fetch data.
      // For now, let's just trigger a reload to fetch new data (if fetching was implemented).
      // Since fetching isn't fully implemented in Context yet, we will just alert for now.
      alert('Kuşlar başarıyla eşleştirildi (Sunucu onayladı).');
    } catch (error) {
      console.error("Pairing error:", error);
      alert('Eşleştirme sırasında bir hata oluştu.');
    }
  };

  // 2. Yumurta Oluşumu
  const registerEgg = async (pairId, layDate) => {
    if (!apiClient) return;
    try {
      await apiClient.post('/Breeding/egg', { pairId, laidDate: layDate });
      alert('Yumurta başarıyla kaydedildi.');
    } catch (error) {
      console.error("Egg error:", error);
      alert('Yumurta kaydedilirken bir hata oluştu.');
    }
  };

  // 3. Yumurta Çıkışı (Yavru Oluşumu)
  const registerHatch = async (eggId, hatchDate) => {
    if (!apiClient) return;
    try {
      await apiClient.post('/Breeding/hatch', { eggId, hatchDate });
      alert('Yavru çıkışı kaydedildi.');
    } catch (error) {
      console.error("Hatch error:", error);
      alert('Yavru çıkışı kaydedilirken hata oluştu.');
    }
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
  const addBird = async (birdData) => {
    if (!apiClient) return;
    try {
      const payload = {
        bandNumber: birdData.bandNumber,
        gender: parseInt(birdData.gender) || 0,
        mutation: birdData.mutation,
        birthDate: birdData.birthDate ? new Date(birdData.birthDate).toISOString() : null,
        status: parseInt(birdData.status) || 1,
        // photo/notes are not in BirdCreateDto yet but we'll pass what we can
      };
      const res = await apiClient.post('/Birds', payload);
      setBirds(prev => [...prev, res.data]);
      alert('Kuş başarıyla eklendi!');
    } catch (error) {
      console.error("Add bird error:", error);
      alert('Kuş eklenirken hata oluştu.');
    }
  };

  const updateBird = async (id, updatedData) => {
    // Backend'de henüz PUT /Birds/{id} yok, şimdilik sadece state'i güncelliyoruz
    // İleride backend'e eklendiğinde buraya apiClient.put(...) eklenecek
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
