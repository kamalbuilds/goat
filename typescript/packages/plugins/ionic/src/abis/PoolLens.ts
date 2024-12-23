export const poolLensAbi = [
    {
      "type": "function",
      "name": "directory",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "contract PoolDirectory"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getBorrowCapsDataForAsset",
      "inputs": [
        {
          "name": "asset",
          "type": "address",
          "internalType": "contract ICErc20"
        }
      ],
      "outputs": [
        {
          "name": "collateral",
          "type": "address[]",
          "internalType": "address[]"
        },
        {
          "name": "borrowCapsPerCollateral",
          "type": "uint256[]",
          "internalType": "uint256[]"
        },
        {
          "name": "collateralBlacklisted",
          "type": "bool[]",
          "internalType": "bool[]"
        },
        {
          "name": "totalBorrowCap",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "nonWhitelistedTotalBorrows",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getBorrowCapsForAsset",
      "inputs": [
        {
          "name": "asset",
          "type": "address",
          "internalType": "contract ICErc20"
        }
      ],
      "outputs": [
        {
          "name": "collateral",
          "type": "address[]",
          "internalType": "address[]"
        },
        {
          "name": "borrowCapsPerCollateral",
          "type": "uint256[]",
          "internalType": "uint256[]"
        },
        {
          "name": "collateralBlacklisted",
          "type": "bool[]",
          "internalType": "bool[]"
        },
        {
          "name": "totalBorrowCap",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getHealthFactor",
      "inputs": [
        {
          "name": "user",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "pool",
          "type": "address",
          "internalType": "contract IonicComptroller"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getHealthFactorHypothetical",
      "inputs": [
        {
          "name": "pool",
          "type": "address",
          "internalType": "contract IonicComptroller"
        },
        {
          "name": "account",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "cTokenModify",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "redeemTokens",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "borrowAmount",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "repayAmount",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getPoolAssetsByUser",
      "inputs": [
        {
          "name": "comptroller",
          "type": "address",
          "internalType": "contract IonicComptroller"
        },
        {
          "name": "user",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct PoolLens.PoolAsset[]",
          "components": [
            {
              "name": "cToken",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "underlyingToken",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "underlyingName",
              "type": "string",
              "internalType": "string"
            },
            {
              "name": "underlyingSymbol",
              "type": "string",
              "internalType": "string"
            },
            {
              "name": "underlyingDecimals",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "underlyingBalance",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "supplyRatePerBlock",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "borrowRatePerBlock",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "totalSupply",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "totalBorrow",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "supplyBalance",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "borrowBalance",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "liquidity",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "membership",
              "type": "bool",
              "internalType": "bool"
            },
            {
              "name": "exchangeRate",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "underlyingPrice",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "oracle",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "collateralFactor",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "reserveFactor",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "adminFee",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "ionicFee",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "borrowGuardianPaused",
              "type": "bool",
              "internalType": "bool"
            },
            {
              "name": "mintGuardianPaused",
              "type": "bool",
              "internalType": "bool"
            }
          ]
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getPoolAssetsWithData",
      "inputs": [
        {
          "name": "comptroller",
          "type": "address",
          "internalType": "contract IonicComptroller"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct PoolLens.PoolAsset[]",
          "components": [
            {
              "name": "cToken",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "underlyingToken",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "underlyingName",
              "type": "string",
              "internalType": "string"
            },
            {
              "name": "underlyingSymbol",
              "type": "string",
              "internalType": "string"
            },
            {
              "name": "underlyingDecimals",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "underlyingBalance",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "supplyRatePerBlock",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "borrowRatePerBlock",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "totalSupply",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "totalBorrow",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "supplyBalance",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "borrowBalance",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "liquidity",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "membership",
              "type": "bool",
              "internalType": "bool"
            },
            {
              "name": "exchangeRate",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "underlyingPrice",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "oracle",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "collateralFactor",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "reserveFactor",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "adminFee",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "ionicFee",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "borrowGuardianPaused",
              "type": "bool",
              "internalType": "bool"
            },
            {
              "name": "mintGuardianPaused",
              "type": "bool",
              "internalType": "bool"
            }
          ]
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getPoolSummary",
      "inputs": [
        {
          "name": "comptroller",
          "type": "address",
          "internalType": "contract IonicComptroller"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "",
          "type": "address[]",
          "internalType": "address[]"
        },
        {
          "name": "",
          "type": "string[]",
          "internalType": "string[]"
        },
        {
          "name": "",
          "type": "bool",
          "internalType": "bool"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getPoolsByAccountWithData",
      "inputs": [
        {
          "name": "account",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256[]",
          "internalType": "uint256[]"
        },
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct PoolDirectory.Pool[]",
          "components": [
            {
              "name": "name",
              "type": "string",
              "internalType": "string"
            },
            {
              "name": "creator",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "comptroller",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "blockPosted",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "timestampPosted",
              "type": "uint256",
              "internalType": "uint256"
            }
          ]
        },
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct PoolLens.IonicPoolData[]",
          "components": [
            {
              "name": "totalSupply",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "totalBorrow",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "underlyingTokens",
              "type": "address[]",
              "internalType": "address[]"
            },
            {
              "name": "underlyingSymbols",
              "type": "string[]",
              "internalType": "string[]"
            },
            {
              "name": "whitelistedAdmin",
              "type": "bool",
              "internalType": "bool"
            }
          ]
        },
        {
          "name": "",
          "type": "bool[]",
          "internalType": "bool[]"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getPoolsOIonicrWithData",
      "inputs": [
        {
          "name": "user",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256[]",
          "internalType": "uint256[]"
        },
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct PoolDirectory.Pool[]",
          "components": [
            {
              "name": "name",
              "type": "string",
              "internalType": "string"
            },
            {
              "name": "creator",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "comptroller",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "blockPosted",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "timestampPosted",
              "type": "uint256",
              "internalType": "uint256"
            }
          ]
        },
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct PoolLens.IonicPoolData[]",
          "components": [
            {
              "name": "totalSupply",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "totalBorrow",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "underlyingTokens",
              "type": "address[]",
              "internalType": "address[]"
            },
            {
              "name": "underlyingSymbols",
              "type": "string[]",
              "internalType": "string[]"
            },
            {
              "name": "whitelistedAdmin",
              "type": "bool",
              "internalType": "bool"
            }
          ]
        },
        {
          "name": "",
          "type": "bool[]",
          "internalType": "bool[]"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getPublicPoolsByVerificationWithData",
      "inputs": [
        {
          "name": "whitelistedAdmin",
          "type": "bool",
          "internalType": "bool"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256[]",
          "internalType": "uint256[]"
        },
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct PoolDirectory.Pool[]",
          "components": [
            {
              "name": "name",
              "type": "string",
              "internalType": "string"
            },
            {
              "name": "creator",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "comptroller",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "blockPosted",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "timestampPosted",
              "type": "uint256",
              "internalType": "uint256"
            }
          ]
        },
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct PoolLens.IonicPoolData[]",
          "components": [
            {
              "name": "totalSupply",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "totalBorrow",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "underlyingTokens",
              "type": "address[]",
              "internalType": "address[]"
            },
            {
              "name": "underlyingSymbols",
              "type": "string[]",
              "internalType": "string[]"
            },
            {
              "name": "whitelistedAdmin",
              "type": "bool",
              "internalType": "bool"
            }
          ]
        },
        {
          "name": "",
          "type": "bool[]",
          "internalType": "bool[]"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getPublicPoolsWithData",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "uint256[]",
          "internalType": "uint256[]"
        },
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct PoolDirectory.Pool[]",
          "components": [
            {
              "name": "name",
              "type": "string",
              "internalType": "string"
            },
            {
              "name": "creator",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "comptroller",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "blockPosted",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "timestampPosted",
              "type": "uint256",
              "internalType": "uint256"
            }
          ]
        },
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct PoolLens.IonicPoolData[]",
          "components": [
            {
              "name": "totalSupply",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "totalBorrow",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "underlyingTokens",
              "type": "address[]",
              "internalType": "address[]"
            },
            {
              "name": "underlyingSymbols",
              "type": "string[]",
              "internalType": "string[]"
            },
            {
              "name": "whitelistedAdmin",
              "type": "bool",
              "internalType": "bool"
            }
          ]
        },
        {
          "name": "",
          "type": "bool[]",
          "internalType": "bool[]"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getSupplyCapsDataForPool",
      "inputs": [
        {
          "name": "comptroller",
          "type": "address",
          "internalType": "contract IonicComptroller"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "address[]",
          "internalType": "address[]"
        },
        {
          "name": "",
          "type": "uint256[]",
          "internalType": "uint256[]"
        },
        {
          "name": "",
          "type": "uint256[]",
          "internalType": "uint256[]"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getSupplyCapsForPool",
      "inputs": [
        {
          "name": "comptroller",
          "type": "address",
          "internalType": "contract IonicComptroller"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "address[]",
          "internalType": "address[]"
        },
        {
          "name": "",
          "type": "uint256[]",
          "internalType": "uint256[]"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getWhitelistedPoolsByAccount",
      "inputs": [
        {
          "name": "account",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256[]",
          "internalType": "uint256[]"
        },
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct PoolDirectory.Pool[]",
          "components": [
            {
              "name": "name",
              "type": "string",
              "internalType": "string"
            },
            {
              "name": "creator",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "comptroller",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "blockPosted",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "timestampPosted",
              "type": "uint256",
              "internalType": "uint256"
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getWhitelistedPoolsByAccountWithData",
      "inputs": [
        {
          "name": "account",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256[]",
          "internalType": "uint256[]"
        },
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct PoolDirectory.Pool[]",
          "components": [
            {
              "name": "name",
              "type": "string",
              "internalType": "string"
            },
            {
              "name": "creator",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "comptroller",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "blockPosted",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "timestampPosted",
              "type": "uint256",
              "internalType": "uint256"
            }
          ]
        },
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct PoolLens.IonicPoolData[]",
          "components": [
            {
              "name": "totalSupply",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "totalBorrow",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "underlyingTokens",
              "type": "address[]",
              "internalType": "address[]"
            },
            {
              "name": "underlyingSymbols",
              "type": "string[]",
              "internalType": "string[]"
            },
            {
              "name": "whitelistedAdmin",
              "type": "bool",
              "internalType": "bool"
            }
          ]
        },
        {
          "name": "",
          "type": "bool[]",
          "internalType": "bool[]"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "initialize",
      "inputs": [
        {
          "name": "_directory",
          "type": "address",
          "internalType": "contract PoolDirectory"
        },
        {
          "name": "_name",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "_symbol",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "_hardcodedAddresses",
          "type": "address[]",
          "internalType": "address[]"
        },
        {
          "name": "_hardcodedNames",
          "type": "string[]",
          "internalType": "string[]"
        },
        {
          "name": "_hardcodedSymbols",
          "type": "string[]",
          "internalType": "string[]"
        },
        {
          "name": "_uniswapLPTokenNames",
          "type": "string[]",
          "internalType": "string[]"
        },
        {
          "name": "_uniswapLPTokenSymbols",
          "type": "string[]",
          "internalType": "string[]"
        },
        {
          "name": "_uniswapLPTokenDisplayNames",
          "type": "string[]",
          "internalType": "string[]"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "name",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "string",
          "internalType": "string"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "symbol",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "string",
          "internalType": "string"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "event",
      "name": "Initialized",
      "inputs": [
        {
          "name": "version",
          "type": "uint8",
          "indexed": false,
          "internalType": "uint8"
        }
      ],
      "anonymous": false
    },
    {
      "type": "error",
      "name": "ComptrollerError",
      "inputs": [
        {
          "name": "errCode",
          "type": "uint256",
          "internalType": "uint256"
        }
      ]
    }
  ] as const; 