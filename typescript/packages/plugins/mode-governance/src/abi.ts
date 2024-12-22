import { parseAbi } from "viem";

export const VOTING_ESCROW_ABI = parseAbi([
    "function createLock(uint256 _value) external returns (uint256)",
    "function createLockFor(uint256 _value, address _to) external returns (uint256)",
    "function withdraw(uint256 _tokenId) external",
    "function beginWithdrawal(uint256 _tokenId) external",
    
    "function locked(uint256 _tokenId) external view returns ((uint208 amount, uint48 start))",
    "function votingPower(uint256 _tokenId) external view returns (uint256)",
    "function votingPowerForAccount(address _account) external view returns (uint256 accountVotingPower)",
    "function totalVotingPower() external view returns (uint256)",
    "function totalLocked() external view returns (uint256)",
    "function minDeposit() external view returns (uint256)",
    "function isVoting(uint256 _tokenId) external view returns (bool)",
    "function ownedTokens(address _owner) external view returns (uint256[] tokenIds)",
    
    "function setMinDeposit(uint256 _minDeposit) external",
    "function pause() external",
    "function unpause() external",
    "function paused() external view returns (bool)",
]);

export const MODE_TOKEN_ABI = parseAbi([
    "function balanceOf(address account) external view returns (uint256)",
    "function approve(address spender, uint256 amount) external returns (bool)",
]);

export const BPT_TOKEN_ABI = parseAbi([
    "function balanceOf(address account) external view returns (uint256)",
    "function approve(address spender, uint256 amount) external returns (bool)",
]); 