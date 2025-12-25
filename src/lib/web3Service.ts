// Web3 Integration Service
// Bridges smart contract calls with backend API calls

import { propertyApi } from '@/lib/api';

export interface PropertyCreationData {
  name: string;
  location: string;
  description?: string;
  currentPrice: number;
  totalShares: number;
}

export interface PropertyCreationResult {
  success: boolean;
  blockchainId?: number | string;
  backendId?: string;
  transactionHash?: string;
  error?: string;
}

// Service to handle property creation across blockchain and backend
export const web3PropertyService = {
  /**
   * Creates a property on both blockchain (smart contract) and backend API
   * @param web3Data - Data from smart contract call (tokenId, txHash)
   * @param propertyData - Property details for backend
   * @returns Result with both blockchain and backend IDs
   */
  createPropertyWithBlockchain: async (
    web3Data: {
      tokenId: string | number;
      txHash: string;
    },
    propertyData: PropertyCreationData
  ): Promise<PropertyCreationResult> => {
    try {
      // Create property on backend with blockchain reference
      const result = await propertyApi.create({
        ...propertyData,
        blockchainId: Number(web3Data.tokenId),
      });

      if (result.success) {
        return {
          success: true,
          blockchainId: web3Data.tokenId,
          transactionHash: web3Data.txHash,
          backendId: (result.data as any)?.property?.propertyId,
        };
      } else {
        return {
          success: false,
          blockchainId: web3Data.tokenId,
          transactionHash: web3Data.txHash,
          error: result.error?.message || 'Failed to create property on backend',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unknown error during property creation',
      };
    }
  },
};

// Helper to connect wallet
export const connectWallet = async (): Promise<string | null> => {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    console.error('No Ethereum provider found');
    return null;
  }

  try {
    const accounts = await (window as any).ethereum.request({
      method: 'eth_requestAccounts',
    });
    return accounts[0] || null;
  } catch (error: any) {
    console.error('Failed to connect wallet:', error);
    return null;
  }
};

// Helper to get current wallet address
export const getConnectedWallet = async (): Promise<string | null> => {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    return null;
  }

  try {
    const accounts = await (window as any).ethereum.request({
      method: 'eth_accounts',
    });
    return accounts[0] || null;
  } catch (error) {
    return null;
  }
};

// Helper to listen for account changes
export const onWalletAccountChange = (callback: (account: string | null) => void) => {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    return;
  }

  (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
    callback(accounts[0] || null);
  });
};

// Helper to parse contract creation response
export const parseContractCreationResponse = async (txPromise: any) => {
  try {
    const tx = await txPromise;
    const receipt = await tx.wait();

    // Extract event data from logs
    const iface = (await import('ethers')).utils.Interface;
    // This would need the ABI imported
    
    return {
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
    };
  } catch (error) {
    console.error('Failed to parse contract response:', error);
    return null;
  }
};

export default {
  web3PropertyService,
  connectWallet,
  getConnectedWallet,
  onWalletAccountChange,
  parseContractCreationResponse,
};
