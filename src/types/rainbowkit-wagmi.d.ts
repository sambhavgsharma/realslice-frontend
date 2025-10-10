declare module "@rainbow-me/rainbowkit" {
  export const getDefaultWallets: any;
  export const RainbowKitProvider: any;
  export const ConnectButton: any;
  export const ConnectButtonCustom: any;
  export default any;
}

declare module "wagmi" {
  export const WagmiConfig: any;
  export function createClient(...args: any[]): any;
  export function configureChains(...args: any[]): any;
  export const useAccount: any;
  export const useConnect: any;
  export const useDisconnect: any;
}

declare module "wagmi/chains" {
  export const mainnet: any;
  export const goerli: any;
  export const polygon: any;
  export const optimism: any;
  export const arbitrum: any;
}

declare module "wagmi/providers/public" {
  export function publicProvider(...args: any[]): any;
}
