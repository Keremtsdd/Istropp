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

  // Save to localStorage whenever data changes
  useEffect(() => { localStorage.setItem('aviary_birds', JSON.stringify(birds)); }, [birds]);
  useEffect(() => { localStorage.setItem('aviary_nests', JSON.stringify(nests)); }, [nests]);
  useEffect(() => { localStorage.setItem('aviary_sales', JSON.stringify(sales)); }, [sales]);
  useEffect(() => { localStorage.setItem('aviary_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('aviary_careplans', JSON.stringify(carePlans)); }, [carePlans]);
  useEffect(() => { localStorage.setItem('aviary_clutches', JSON.stringify(clutches)); }, [clutches]);

  // Actions
  const addBird = (birdData) => {
    const newBird = {
      ...birdData,
      id: Date.now(), // Generate a fake ID
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
      clutches, setClutches
    }}>
      {children}
    </DataContext.Provider>
  );
};
