// Wallet connection component with Freighter/Albedo integration
// This component provides a reusable wallet connection interface

import React from 'react'
import { WalletConnect } from './WalletConnect';


export const WalletConnector: React.FC = () => {
  const handleConnect = (address: string) => {
    console.log('Wallet connected:', address);
  };

  const handleDisconnect = () => {
    console.log('Wallet disconnected');
  };

  const handleError = (error: string) => {
    console.error('Wallet connection error:', error);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Wallet Connection</h2>
      <WalletConnect
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onError={handleError}
        showNetworkSelector={true}
      />
    </div>
  );
};
