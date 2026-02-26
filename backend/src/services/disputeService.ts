import { redisClient } from './cacheService'
import { dbService } from './databaseService'
import { v4 as uuidv4 } from 'uuid'

export type DisputeType = 'non_payment' | 'fraud' | 'rule_violation'
export type DisputeStatus = 'open' | 'voting' | 'resolved' | 'escalated'

export interface EvidenceItem {
  id: string
  type: 'text' | 'image' | 'screenshot'
  content: string // text or URL
  uploadedAt: string
}

export interface Dispute {
  id: string
  groupId: string
  filedBy: string
  type: DisputeType
  summary?: string
  evidence: EvidenceItem[]
  status: DisputeStatus
  votes: Record<string, 'yes' | 'no'>
  createdAt: string
  votingDeadline?: string
  decision?: 'yes' | 'no' | 'tie'
  resolvedBy?: string // admin id or empty
  adminDecision?: string
}

const DISPUTE_PREFIX = 'dispute:'
const GROUP_INDEX_PREFIX = 'group_disputes:'

// default voting window in seconds (e.g., 48 hours)
const DEFAULT_VOTING_WINDOW = Number(process.env.DISPUTE_VOTING_WINDOW_SECONDS) || 60 * 60 * 24 * 2

export const disputeService = {
  async fileDispute(groupId: string, filedBy: string, type: DisputeType, summary?: string, evidence: { type: EvidenceItem['type']; content: string }[]) {
    // verify that filer is a member
    const members = await dbService.getGroupMembers(groupId)
    const isMember = members.some((m: any) => m.userId === filedBy)
    if (!isMember) {
      throw new Error('Only group members can file disputes')
    }

    const id = uuidv4()
    const createdAt = new Date().toISOString()
    const votingDeadline = new Date(Date.now() + DEFAULT_VOTING_WINDOW * 1000).toISOString()

    const dispute: Dispute = {
      id,
      groupId,
      filedBy,
      type,
      summary,
      evidence: (evidence || []).map((e) => ({ id: uuidv4(), type: e.type, content: e.content, uploadedAt: new Date().toISOString() })),
      status: 'voting',
      votes: {},
      createdAt,
      votingDeadline,
    }

    await redisClient.set(DISPUTE_PREFIX + id, JSON.stringify(dispute))
    await redisClient.sadd(GROUP_INDEX_PREFIX + groupId, id)

    return dispute
  },

  async getDispute(id: string): Promise<Dispute | null> {
    const raw = await redisClient.get(DISPUTE_PREFIX + id)
    if (!raw) return null
    return JSON.parse(raw) as Dispute
  },

  async listGroupDisputes(groupId: string) {
    const ids = await redisClient.smembers(GROUP_INDEX_PREFIX + groupId)
    const pipe = redisClient.pipeline()
    ids.forEach((id) => pipe.get(DISPUTE_PREFIX + id))
    const res = await pipe.exec()
    return res.map((r) => (r[1] ? JSON.parse(r[1] as string) : null)).filter(Boolean) as Dispute[]
  },

  async voteOnDispute(disputeId: string, voter: string, vote: 'yes' | 'no') {
    const dispute = await this.getDispute(disputeId)
    if (!dispute) throw new Error('Dispute not found')
    if (dispute.status !== 'voting') throw new Error('Voting not open')
    if (new Date(dispute.votingDeadline || 0).getTime() < Date.now()) {
      throw new Error('Voting period has ended')
    }

    // verify voter is a group member
    const members = await dbService.getGroupMembers(dispute.groupId)
    const isMember = members.some((m: any) => m.userId === voter)
    if (!isMember) throw new Error('Only group members may vote')

    dispute.votes[voter] = vote

    // persist
    await redisClient.set(DISPUTE_PREFIX + disputeId, JSON.stringify(dispute))

    // quick auto-tally after vote: if majority reached before deadline
    await this.tryAutoResolve(disputeId)

    return dispute
  },

  async tryAutoResolve(disputeId: string) {
    const dispute = await this.getDispute(disputeId)
    if (!dispute) return null
    if (dispute.status !== 'voting') return dispute

    const members = await dbService.getGroupMembers(dispute.groupId)
    const totalMembers = members.length
    const votes = Object.values(dispute.votes)
    const yes = votes.filter((v) => v === 'yes').length
    const no = votes.filter((v) => v === 'no').length

    // majority threshold (>50%)
    const majority = Math.ceil(totalMembers / 2)

    if (yes >= majority) {
      dispute.status = 'resolved'
      dispute.decision = 'yes'
      dispute.resolvedBy = 'community'
      await redisClient.set(DISPUTE_PREFIX + disputeId, JSON.stringify(dispute))
      return dispute
    }

    if (no >= majority) {
      dispute.status = 'resolved'
      dispute.decision = 'no'
      dispute.resolvedBy = 'community'
      await redisClient.set(DISPUTE_PREFIX + disputeId, JSON.stringify(dispute))
      return dispute
    }

    // if voting deadline passed -> escalate
    if (new Date(dispute.votingDeadline || 0).getTime() < Date.now()) {
      dispute.status = 'escalated'
      await redisClient.set(DISPUTE_PREFIX + disputeId, JSON.stringify(dispute))
      return dispute
    }

    return dispute
  },

  async escalateToAdmin(disputeId: string) {
    const dispute = await this.getDispute(disputeId)
    if (!dispute) throw new Error('Dispute not found')
    dispute.status = 'escalated'
    await redisClient.set(DISPUTE_PREFIX + disputeId, JSON.stringify(dispute))
    return dispute
  },

  async adminResolve(disputeId: string, adminId: string, decision: string) {
    const dispute = await this.getDispute(disputeId)
    if (!dispute) throw new Error('Dispute not found')
    dispute.status = 'resolved'
    dispute.resolvedBy = adminId
    dispute.adminDecision = decision
    await redisClient.set(DISPUTE_PREFIX + disputeId, JSON.stringify(dispute))
    return dispute
  },
}
