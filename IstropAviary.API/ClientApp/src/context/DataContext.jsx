/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [birds, setBirds] = useState([]);
  const [nests, setNests] = useState([]);
  const [sales, setSales] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [carePlans, setCarePlans] = useState([]);
  const [pairs, setPairs] = useState([]);
  const [eggs, setEggs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [apiClient, setApiClient] = useState(null);

  const refreshData = async (clientToUse = apiClient) => {
    if (!clientToUse) return;
    setLoading(true);
    try {
      const [birdsRes, nestsRes, pairsRes, carePlansRes] = await Promise.all([
        clientToUse.get('/Birds'),
        clientToUse.get('/Nests'),
        clientToUse.get('/Breeding/pairs').catch(() => ({ data: [] })),
        clientToUse.get('/CarePlans').catch(() => ({ data: [] }))
      ]);
      setBirds(birdsRes.data);
      setNests(nestsRes.data);
      setPairs(pairsRes.data);
      setCarePlans(carePlansRes.data);
      
      try {
         const eggsRes = await clientToUse.get('/Breeding/eggs');
         setEggs(eggsRes.data);
      } catch {
        // Ignore if endpoint is not available
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    import('../api/axiosClient').then(module => {
      const client = module.default;
      setApiClient(() => client);
      refreshData(client);
    });
  }, []);



  // 1. Çiftleştirme Otomasyonu
  const pairBirds = async (maleId, femaleId, nestId) => {
    if (!apiClient) return;
    try {
      await apiClient.post('/Breeding/pair', { maleId, femaleId, nestId });
      await refreshData();
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
      await refreshData();
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
      await refreshData();
      alert('Yavru çıkışı başarıyla kaydedildi.');
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
  const addBird = async (birdData, imageFile = null) => {
    if (!apiClient) return;
    try {
      const payload = {
        bandNumber: birdData.bandNumber,
        gender: parseInt(birdData.gender) || 0,
        mutation: birdData.mutation,
        birthDate: birdData.birthDate ? new Date(birdData.birthDate).toISOString() : null,
        status: birdData.status !== undefined ? parseInt(birdData.status) : 0,
        motherId: birdData.motherId || null,
        fatherId: birdData.fatherId || null
      };
      
      const res = await apiClient.post('/Birds', payload);
      let newBird = res.data;

      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const imgRes = await apiClient.post(`/Birds/${newBird.id}/image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        newBird = { ...newBird, imageUrl: imgRes.data.imageUrl };
      }

      setBirds(prev => [...prev, newBird]);
      alert('Kuş başarıyla eklendi!');
    } catch (error) {
      console.error("Add bird error:", error);
      const errorMessage = error.response?.data?.message || typeof error.response?.data === 'string' ? error.response?.data : 'Kuş eklenirken hata oluştu.';
      throw new Error(errorMessage);
    }
  };

  const uploadBirdImage = async (id, imageFile) => {
    if (!apiClient || !imageFile) return;
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      const res = await apiClient.post(`/Birds/${id}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newImageUrl = res.data.imageUrl;
      setBirds(prev => prev.map(b => b.id === id ? { ...b, imageUrl: newImageUrl } : b));
      return newImageUrl;
    } catch (error) {
      console.error("Upload image error:", error);
      alert('Fotoğraf yüklenirken hata oluştu.');
      throw error;
    }
  };

  const updateBird = async (id, updatedData) => {
    if (!apiClient) return;
    try {
      const existingBird = birds.find(b => b.id === id);
      if (!existingBird) return;
      
      const fullUpdateData = { ...existingBird, ...updatedData };
      const response = await apiClient.put(`/Birds/${id}`, fullUpdateData);
      setBirds(prev => prev.map(b => b.id === id ? response.data : b));
    } catch (error) {
      console.error('Kuş güncellenirken hata:', error);
      throw error;
    }
  };

  const deleteBird = async (id) => {
    if (!apiClient) return;
    try {
      await apiClient.delete(`/Birds/${id}`);
      setBirds(prev => prev.filter(b => b.id !== id));
      alert('Kuş başarıyla silindi.');
    } catch (error) {
      console.error("Delete bird error:", error);
      alert('Kuş silinirken hata oluştu.');
    }
  };

  const addNest = async (nestData) => {
    if (!apiClient) return;
    try {
      const response = await apiClient.post('/Nests', nestData);
      setNests(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Yuvalık eklenirken hata:', error);
      throw error;
    }
  };

  const deleteNest = async (id) => {
    if (!apiClient) return;
    try {
      await apiClient.delete(`/Nests/${id}`);
      setNests(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Yuvalık silinirken hata:', error);
      throw error;
    }
  };

  const updateNest = async (id, updatedData) => {
    if (!apiClient) return;
    try {
      const existingNest = nests.find(n => n.id === id);
      if (!existingNest) return;
      
      const fullUpdateData = { ...existingNest, ...updatedData };
      const response = await apiClient.put(`/Nests/${id}`, fullUpdateData);
      setNests(prev => prev.map(n => n.id === id ? response.data : n));
    } catch (error) {
      console.error('Yuvalık güncellenirken hata:', error);
      throw error;
    }
  };

  const deleteEgg = async (id) => {
    if (!apiClient) return;
    try {
      await apiClient.delete(`/Breeding/egg/${id}`);
      await refreshData();
    } catch (error) {
      console.error('Yumurta silinirken hata:', error);
      alert('Yumurta silinirken bir hata oluştu.');
    }
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

  const addCarePlan = async (planData) => {
    if (!apiClient) return;
    try {
      const response = await apiClient.post('/CarePlans', planData);
      setCarePlans(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Bakım planı eklenirken hata:', error);
      throw error;
    }
  };

  const updateCarePlan = async (id, updatedData) => {
    if (!apiClient) return;
    try {
      await apiClient.put(`/CarePlans/${id}`, updatedData);
      setCarePlans(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    } catch (error) {
      console.error('Bakım planı güncellenirken hata:', error);
      throw error;
    }
  };

  const deleteCarePlan = async (id) => {
    if (!apiClient) return;
    try {
      await apiClient.delete(`/CarePlans/${id}`);
      setCarePlans(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Bakım planı silinirken hata:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider value={{
      loading,
      birds, addBird, updateBird,
      uploadBirdImage,
      deleteBird, setBirds,
      nests, setNests, addNest, deleteNest, updateNest,
      sales, setSales, updateSale,
      transactions, setTransactions, addTransaction, updateTransaction, deleteTransaction,
      carePlans, setCarePlans, addCarePlan, updateCarePlan, deleteCarePlan,
      pairs, setPairs,
      eggs, setEggs, deleteEgg,
      pairBirds, registerEgg, registerHatch, registerSale
    }}>
      {children}
    </DataContext.Provider>
  );
};
