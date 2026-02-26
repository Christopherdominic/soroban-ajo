// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * Minimal cross-chain bridge contract scaffold.
 * This is a placeholder demonstrating lock/release operations.
 * For production use integrate with a messaging layer like Wormhole or LayerZero
 * and implement proper relayer verification, merkle proofs, and replay protection.
 */
contract Bridge {
    address public admin;
    mapping(bytes32 => bool) public processed;

    event Locked(address indexed token, address indexed sender, uint256 amount, uint256 targetChain, bytes targetAddress, bytes32 indexed nonce);
    event Released(address indexed token, address indexed receiver, uint256 amount, bytes32 indexed nonce);

    modifier onlyAdmin() {
        require(msg.sender == admin, "only admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /**
     * Lock tokens on source chain to be bridged to destination chain.
     * In a real integration this would call ERC20.transferFrom and emit an event
     * consumed by the bridge relayer.
     */
    function lock(address token, uint256 amount, uint256 targetChain, bytes calldata targetAddress, bytes32 nonce) external {
        // NOTE: implement ERC20 transferFrom(token, msg.sender, address(this), amount)
        emit Locked(token, msg.sender, amount, targetChain, targetAddress, nonce);
    }

    /**
     * Release tokens (mint or transfer) after a verified cross-chain message.
     * Only callable by an off-chain relayer or admin after verifying cross-chain proof.
     */
    function release(address token, address receiver, uint256 amount, bytes32 nonce) external onlyAdmin {
        require(!processed[nonce], "already processed");
        processed[nonce] = true;
        // For wrapped tokens: call ERC20.mint(receiver, amount)
        // For native token: transfer
        emit Released(token, receiver, amount, nonce);
    }

    /**
     * Admin can update the admin address.
     */
    function setAdmin(address newAdmin) external onlyAdmin {
        admin = newAdmin;
    }
}
