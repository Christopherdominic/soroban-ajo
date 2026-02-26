import { GroupDetailPage } from './components/GroupDetailPage';
import { WalletButton } from './components/WalletButton';
import { Toaster } from './components/ui/sonner';

export default function App() {
  // Example group ID (contract address)
  const groupId = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-lg">ROSCA Groups</h2>
            </div>
            <WalletButton />
          </div>
        </header>

        {/* Main Content */}
        <GroupDetailPage groupId={groupId} />
      </div>
      <Toaster />
    </>
  );
}