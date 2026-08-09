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
      const [birdsRes, nestsRes, pairsRes, carePlansRes, salesRes, transactionsRes] = await Promise.all([
        clientToUse.get('/Birds'),
        clientToUse.get('/Nests'),
        clientToUse.get('/Breeding/pairs').catch(() => ({ data: [] })),
        clientToUse.get('/CarePlans').catch(() => ({ data: [] })),
        clientToUse.get('/Sales').catch(() => ({ data: [] })),
        clientToUse.get('/Transactions').catch(() => ({ data: [] }))
      ]);
      setBirds(birdsRes.data);
      setNests(nestsRes.data);
      setPairs(pairsRes.data);
      setCarePlans(carePlansRes.data);
      setSales(salesRes.data);
      setTransactions(transactionsRes.data);
      
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
  const registerSale = async (birdIds, customerName, customerPhone, customerCity, price, date, notes, paymentType = 'Nakit') => {
    if (!apiClient) return;
    try {
      const ids = Array.isArray(birdIds) ? birdIds : [birdIds].filter(Boolean);
      const parsedPrice = parseFloat(price) || 0;
      const saleDetails = ids.map(id => ({ birdId: id, price: ids.length === 1 ? parsedPrice : 0 }));
      
      const payload = {
        saleNumber: '',
        date: date || new Date().toISOString().split('T')[0],
        customerName: customerName,
        customerPhone: customerPhone,
        customerCity: customerCity,
        paymentType: paymentType,
        totalAmount: parsedPrice,
        notes: notes,
        saleDetails: saleDetails
      };

      await apiClient.post('/Sales', payload);
      await refreshData();
      alert('Satış başarıyla kaydedildi.');
    } catch (error) {
      console.error("Sale register error:", error);
      alert('Satış kaydedilirken hata oluştu.');
    }
  };

  const updateSale = async (id, updatedData) => {
    if (!apiClient) return;
    try {
      const ids = Array.isArray(updatedData.birdIds) ? updatedData.birdIds : [updatedData.birdIds].filter(Boolean);
      const parsedPrice = parseFloat(updatedData.price) || 0;
      const saleDetails = ids.map(bid => ({ birdId: bid, price: ids.length === 1 ? parsedPrice : 0 }));

      const payload = {
        saleNumber: updatedData.saleNumber || '',
        date: updatedData.date || new Date().toISOString().split('T')[0],
        customerName: updatedData.customerName,
        customerPhone: updatedData.customerPhone,
        customerCity: updatedData.customerCity,
        paymentType: updatedData.paymentType || 'Nakit',
        totalAmount: parsedPrice,
        notes: updatedData.notes,
        saleDetails: saleDetails
      };

      await apiClient.put(`/Sales/${id}`, payload);
      await refreshData();
      alert('Satış başarıyla güncellendi.');
    } catch (error) {
      console.error("Sale update error:", error);
      alert('Satış güncellenirken hata oluştu.');
    }
  };

  const deleteSale = async (id) => {
    if (!apiClient) return;
    try {
      await apiClient.delete(`/Sales/${id}`);
      await refreshData();
      alert('Satış başarıyla iptal edildi, kuşlar ana salmaya alındı.');
    } catch (error) {
      console.error("Sale delete error:", error);
      alert('Satış iptal edilirken hata oluştu.');
    }
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

  const addTransaction = async (data) => {
    if (!apiClient) return;
    try {
      const apiData = {
        ...data,
        type: data.type === 'Gelir' ? 'Income' : 'Expense'
      };
      const response = await apiClient.post('/Transactions', apiData);
      setTransactions(prev => [response.data, ...prev]);
    } catch (error) {
      console.error('İşlem eklenirken hata:', error);
      throw error;
    }
  };

  const updateTransaction = async (id, updatedData) => {
    if (!apiClient) return;
    try {
      const apiData = {
        ...updatedData,
        type: updatedData.type === 'Gelir' ? 'Income' : 'Expense'
      };
      await apiClient.put(`/Transactions/${id}`, apiData);
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...apiData } : t));
    } catch (error) {
      console.error('İşlem güncellenirken hata:', error);
      throw error;
    }
  };

  const deleteTransaction = async (id) => {
    if (!apiClient) return;
    try {
      await apiClient.delete(`/Transactions/${id}`);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('İşlem silinirken hata:', error);
      throw error;
    }
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
      sales, setSales, updateSale, deleteSale,
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
