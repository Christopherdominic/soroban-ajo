export class MultiSigError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'MultiSigError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class MultiSigNotFoundError extends MultiSigError {
  constructor(groupId: string) {
    super(`Multi-sig configuration not found for group: ${groupId}`, 'MULTISIG_NOT_FOUND', 404);
  }
}

export class ProposalNotFoundError extends MultiSigError {
  constructor(proposalId: string) {
    super(`Proposal not found: ${proposalId}`, 'PROPOSAL_NOT_FOUND', 404);
  }
}

export class ProposalExpiredError extends MultiSigError {
  constructor(proposalId: string) {
    super(`Proposal has expired: ${proposalId}`, 'PROPOSAL_EXPIRED', 410);
  }
}

export class ProposalAlreadyExecutedError extends MultiSigError {
  constructor(proposalId: string) {
    super(`Proposal already executed: ${proposalId}`, 'PROPOSAL_ALREADY_EXECUTED', 409);
  }
}

export class InsufficientSignaturesError extends MultiSigError {
  constructor(current: number, required: number) {
    super(
      `Insufficient signatures: ${current}/${required}`,
      'INSUFFICIENT_SIGNATURES',
      400
    );
  }
}

export class DuplicateSignatureError extends MultiSigError {
  constructor(signerId: string) {
    super(`Signer has already signed: ${signerId}`, 'DUPLICATE_SIGNATURE', 409);
  }
}

export class UnauthorizedSignerError extends MultiSigError {
  constructor(walletAddress: string) {
    super(`Unauthorized signer: ${walletAddress}`, 'UNAUTHORIZED_SIGNER', 403);
  }
}

export class InvalidThresholdError extends MultiSigError {
  constructor(threshold: number, totalSigners: number) {
    super(
      `Invalid threshold: ${threshold} (must be <= ${totalSigners})`,
      'INVALID_THRESHOLD',
      400
    );
  }
}

export class InvalidSignatureError extends MultiSigError {
  constructor(message: string = 'Invalid signature') {
    super(message, 'INVALID_SIGNATURE', 400);
  }
}
