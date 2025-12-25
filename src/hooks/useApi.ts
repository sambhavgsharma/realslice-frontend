import { useCallback, useState, useEffect } from 'react';
import { userApi, propertyApi, transactionApi, ApiError } from '@/lib/api';

// Auth Hook
export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    const result = await userApi.register(name, email, password);
    setLoading(false);
    if (result.success) {
      return result.data;
    } else {
      setError(result.error || null);
      return null;
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    const result = await userApi.login(email, password);
    setLoading(false);
    if (result.success) {
      const token = result.data?.token;
      if (token) {
        localStorage.setItem('authToken', token);
      }
      return result.data;
    } else {
      setError(result.error || null);
      return null;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setUser(null);
  }, []);

  const getProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await userApi.getProfile();
    setLoading(false);
    if (result.success) {
      setUser(result.data);
      return result.data;
    } else {
      setError(result.error || null);
      return null;
    }
  }, []);

  const linkWallet = useCallback(async (walletAddress: string) => {
    setLoading(true);
    setError(null);
    const result = await userApi.linkWallet(walletAddress);
    setLoading(false);
    if (result.success) {
      return result.data;
    } else {
      setError(result.error || null);
      return null;
    }
  }, []);

  // Check if user is logged in on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('authToken')) {
      getProfile();
    }
  }, []);

  return { user, loading, error, register, login, logout, getProfile, linkWallet };
};

// Properties Hook
export const useProperties = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await propertyApi.getAll();
    setLoading(false);
    if (result.success) {
      setProperties((result.data as any[]) || []);
      return result.data;
    } else {
      setError(result.error || null);
      return null;
    }
  }, []);

  const getById = useCallback(async (propertyId: string) => {
    setLoading(true);
    setError(null);
    const result = await propertyApi.getById(propertyId);
    setLoading(false);
    if (result.success) {
      return result.data;
    } else {
      setError(result.error || null);
      return null;
    }
  }, []);

  const create = useCallback(async (propertyData: any) => {
    setLoading(true);
    setError(null);
    const result = await propertyApi.create(propertyData);
    setLoading(false);
    if (result.success) {
      await fetchAll(); // Refresh list
      return result.data;
    } else {
      setError(result.error || null);
      return null;
    }
  }, [fetchAll]);

  const getSellOrders = useCallback(async (propertyId: string) => {
    setLoading(true);
    setError(null);
    const result = await propertyApi.getSellOrders(propertyId);
    setLoading(false);
    if (result.success) {
      return result.data;
    } else {
      setError(result.error || null);
      return null;
    }
  }, []);

  return { properties, loading, error, fetchAll, getById, create, getSellOrders };
};

// Transactions Hook
export const useTransactions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const buyFromOrder = useCallback(async (orderId: string, sharesToBuy: number) => {
    setLoading(true);
    setError(null);
    const result = await transactionApi.buyFromOrder(orderId, sharesToBuy);
    setLoading(false);
    if (result.success) {
      return result.data;
    } else {
      setError(result.error || null);
      return null;
    }
  }, []);

  const createSellOrder = useCallback(
    async (propertyId: string, shares: number, pricePerShare: number) => {
      setLoading(true);
      setError(null);
      const result = await transactionApi.createSellOrder(propertyId, shares, pricePerShare);
      setLoading(false);
      if (result.success) {
        return result.data;
      } else {
        setError(result.error || null);
        return null;
      }
    },
    []
  );

  return { loading, error, buyFromOrder, createSellOrder };
};
