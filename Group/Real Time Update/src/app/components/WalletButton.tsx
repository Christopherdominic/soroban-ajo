import { useWallet } from '../../hooks/useWallet';
import { Button } from './ui/button';
import { Wallet, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from 'sonner';

export function WalletButton() {
  const { address, isConnected, isConnecting, chainId, connect, disconnect } = useWallet();

  const handleConnect = async () => {
    try {
      await connect();
      toast.success('Wallet connected successfully');
    } catch (error) {
      toast.error('Failed to connect wallet');
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    toast.success('Wallet disconnected');
  };

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard');
    }
  };

  if (!isConnected) {
    return (
      <Button onClick={handleConnect} disabled={isConnecting}>
        <Wallet className="mr-2 h-4 w-4" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    );
  }

  const shortAddress = `${address?.slice(0, 6)}...${address?.slice(-4)}`;
  const chainName = getChainName(chainId || 0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Wallet className="mr-2 h-4 w-4" />
          {shortAddress}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Wallet Info</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Address:</span>
            <code className="text-xs">{shortAddress}</code>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-muted-foreground">Network:</span>
            <span className="text-xs">{chainName}</span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyAddress}>
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDisconnect}>
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getChainName(chainId: number): string {
  const chains: Record<number, string> = {
    1: 'Ethereum Mainnet',
    5: 'Goerli',
    11155111: 'Sepolia',
    137: 'Polygon',
    80001: 'Mumbai',
    56: 'BSC',
    97: 'BSC Testnet',
    42161: 'Arbitrum',
    421613: 'Arbitrum Goerli',
    10: 'Optimism',
    420: 'Optimism Goerli',
  };

  return chains[chainId] || `Chain ${chainId}`;
}
