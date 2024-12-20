export const ROUTER_ABI = [
    {
        inputs: [
            {
                internalType: "address",
                name: "tokenA",
                type: "address"
            },
            {
                internalType: "address", 
                name: "tokenB",
                type: "address"
            },
            {
                internalType: "bool",
                name: "stable",
                type: "bool"
            },
            {
                internalType: "uint256",
                name: "amountADesired",
                type: "uint256"
            },
            {
                internalType: "uint256",
                name: "amountBDesired", 
                type: "uint256"
            },
            {
                internalType: "uint256",
                name: "amountAMin",
                type: "uint256"
            },
            {
                internalType: "uint256",
                name: "amountBMin",
                type: "uint256"
            },
            {
                internalType: "address",
                name: "to",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "deadline",
                type: "uint256"
            }
        ],
        name: "addLiquidity",
        outputs: [
            {
                internalType: "uint256",
                name: "amountA",
                type: "uint256"
            },
            {
                internalType: "uint256", 
                name: "amountB",
                type: "uint256"
            },
            {
                internalType: "uint256",
                name: "liquidity",
                type: "uint256"
            }
        ],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "amountIn",
                type: "uint256"
            },
            {
                internalType: "uint256",
                name: "amountOutMin",
                type: "uint256"
            },
            {
                internalType: "address[]",
                name: "path",
                type: "address[]"
            },
            {
                internalType: "address",
                name: "to",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "deadline",
                type: "uint256"
            }
        ],
        name: "swapExactTokensForTokens",
        outputs: [
            {
                internalType: "uint256[]",
                name: "amounts",
                type: "uint256[]"
            }
        ],
        stateMutability: "nonpayable",
        type: "function"
    }
] as const; 