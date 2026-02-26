import { ethers } from 'ethers';

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
}

export class WalletService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;

  async connectWallet(): Promise<WalletState> {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      this.provider = provider;
      this.signer = signer;

      return {
        address: accounts[0],
        isConnected: true,
        chainId: Number(network.chainId),
      };
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  async disconnectWallet(): Promise<void> {
    this.provider = null;
    this.signer = null;
  }

  async getBalance(address: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }

    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  async contribute(contractAddress: string, abi: any[], amount: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    const contract = new ethers.Contract(contractAddress, abi, this.signer);
    const tx = await contract.contribute({
      value: ethers.parseEther(amount),
    });

    return tx.hash;
  }

  async switchNetwork(chainId: number): Promise<void> {
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }

    try {
      await this.provider.send('wallet_switchEthereumChain', [
        { chainId: `0x${chainId.toString(16)}` },
      ]);
    } catch (error: any) {
      // Chain not added, try to add it
      if (error.code === 4902) {
        throw new Error('Please add this network to your wallet');
      }
      throw error;
    }
  }

  onAccountsChanged(callback: (accounts: string[]) => void): void {
    if ((window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', callback);
    }
  }

  onChainChanged(callback: (chainId: string) => void): void {
    if ((window as any).ethereum) {
      (window as any).ethereum.on('chainChanged', callback);
    }
  }

  removeListeners(): void {
    if ((window as any).ethereum) {
      (window as any).ethereum.removeAllListeners('accountsChanged');
      (window as any).ethereum.removeAllListeners('chainChanged');
    }
  }
}

export const walletService = new WalletService();
