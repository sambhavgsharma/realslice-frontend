// API Client for frontend-backend communication
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface ApiError {
  message: string;
  status: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

// Generic API request handler
async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<ApiResponse<T>> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: {
          message: errorData.message || `API Error: ${response.status}`,
          status: response.status,
        },
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data as T,
    };
  } catch (err: any) {
    return {
      success: false,
      error: {
        message: err.message || 'Network error',
        status: 0,
      },
    };
  }
}

// User API
export const userApi = {
  register: async (name: string, email: string, password: string) => {
    return apiRequest('/users/register', 'POST', { name, email, password });
  },

  login: async (email: string, password: string) => {
    return apiRequest<{ message: string; token: string }>('/users/login', 'POST', {
      email,
      password,
    });
  },

  getProfile: async () => {
    return apiRequest('/users/me', 'GET');
  },

  linkWallet: async (walletAddress: string) => {
    return apiRequest('/users/link-wallet', 'POST', { walletAddress });
  },
};

// Property API
export const propertyApi = {
  create: async (propertyData: {
    name: string;
    location: string;
    description?: string;
    currentPrice: number;
    totalShares: number;
    blockchainId?: number;
  }) => {
    return apiRequest('/properties', 'POST', propertyData);
  },

  getAll: async () => {
    return apiRequest('/properties', 'GET');
  },

  getById: async (propertyId: string) => {
    return apiRequest(`/properties/${propertyId}`, 'GET');
  },

  getSellOrders: async (propertyId: string) => {
    return apiRequest(`/properties/${propertyId}/sell-orders`, 'GET');
  },
};

// Transaction API
export const transactionApi = {
  buyFromOrder: async (orderId: string, sharesToBuy: number) => {
    return apiRequest('/transactions/buy', 'POST', { orderId, sharesToBuy });
  },

  createSellOrder: async (propertyId: string, shares: number, pricePerShare: number) => {
    return apiRequest('/transactions/sell-order', 'POST', {
      propertyId,
      shares,
      pricePerShare,
    });
  },

  getTransactions: async () => {
    return apiRequest('/transactions', 'GET');
  },
};

export default {
  userApi,
  propertyApi,
  transactionApi,
};
