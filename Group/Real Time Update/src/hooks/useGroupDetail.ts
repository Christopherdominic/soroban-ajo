import { useState, useEffect } from 'react';
import { GroupData, Transaction } from '../types/group';
import { blockchainService } from '../services/blockchain';

export function useGroupDetail(groupId: string) {
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGroupData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [data, txs] = await Promise.all([
        blockchainService.getGroupData(groupId),
        blockchainService.getTransactionHistory(groupId),
      ]);
      
      setGroupData(data);
      setTransactions(txs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch group data');
      console.error('Error fetching group data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchGroupData();
    }
  }, [groupId]);

  return {
    groupData,
    transactions,
    loading,
    error,
    refetch: fetchGroupData,
  };
}
