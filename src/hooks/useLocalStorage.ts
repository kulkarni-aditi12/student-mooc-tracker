import { useState, useEffect } from 'react';
import { getStorageData, setStorageData } from '../utils/storage';
import { AppData } from '../types';

export const useLocalStorage = () => {
  const [data, setData] = useState<AppData>(getStorageData());

  const updateData = (newData: AppData) => {
    setData(newData);
    setStorageData(newData);
  };

  const refreshData = () => {
    setData(getStorageData());
  };

  useEffect(() => {
    const handleStorageChange = () => {
      refreshData();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return { data, updateData, refreshData };
};