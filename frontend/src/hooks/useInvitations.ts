import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Invitation {
  id: string;
  groupId: string;
  groupName: string;
  invitedBy: string;
  invitedAt: number;
  status: 'pending' | 'accepted' | 'declined';
  inviteCode: string;
}

interface InvitationsState {
  invitations: Invitation[];
  sentInvitations: Map<string, string[]>; // groupId -> invitedAddresses
  addInvitation: (invitation: Invitation) => void;
  updateInvitationStatus: (id: string, status: Invitation['status']) => void;
  getInvitationByCode: (code: string) => Invitation | undefined;
  trackInvite: (groupId: string, invitedAddress: string) => void;
  getInvitedMembers: (groupId: string) => string[];
}

export const useInvitations = create<InvitationsState>()(
  persist(
    (set, get) => ({
      invitations: [],
      sentInvitations: new Map(),

      addInvitation: (invitation) =>
        set((state) => ({
          invitations: [...state.invitations, invitation],
        })),

      updateInvitationStatus: (id, status) =>
        set((state) => ({
          invitations: state.invitations.map((inv) =>
            inv.id === id ? { ...inv, status } : inv
          ),
        })),

      getInvitationByCode: (code) => {
        const state = get();
        return state.invitations.find((inv) => inv.inviteCode === code);
      },

      trackInvite: (groupId, invitedAddress) =>
        set((state) => {
          const newMap = new Map(state.sentInvitations);
          const existing = newMap.get(groupId) || [];
          if (!existing.includes(invitedAddress)) {
            newMap.set(groupId, [...existing, invitedAddress]);
          }
          return { sentInvitations: newMap };
        }),

      getInvitedMembers: (groupId) => {
        const state = get();
        return state.sentInvitations.get(groupId) || [];
      },
    }),
    {
      name: 'ajo-invitations-storage',
    }
  )
);
