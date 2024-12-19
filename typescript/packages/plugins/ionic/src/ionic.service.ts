import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { IonicSdk } from "@ionicprotocol/sdk";
import { z } from "zod";
import { type HealthMetrics } from "./types";
import { parseUnits, formatUnits } from "viem";

export class IonicService {
  private sdk: IonicSdk;
  private supportedTokens: string[];
  private readonly LOOP_SUPPORTED_ASSETS = ["weETH", "dMBTC", "wrsETH", "ezETH", "STONE"];

  constructor(chainId: number, supportedTokens?: string[]) {
    this.supportedTokens = supportedTokens || ["USDC", "WETH", "MODE"];
    
    
    this.sdk = new IonicSdk(
      walletClient.publicClient, 
      walletClient.walletClient, 
      {
        chainId,
        
      }
    );
  }

  @Tool({
    name: "supply_asset",
    description: "Supply an asset to an Ionic Protocol pool",
    parameters: z.object({
      poolId: z.string().describe("The ID of the pool to supply to"),
      asset: z.string().describe("The asset to supply (e.g. USDC, WETH)"),
      amount: z.string().describe("The amount to supply"),
    }),
  })
  async supplyAsset(walletClient: EVMWalletClient, parameters: z.infer<typeof parameters>) {
    const { poolId, asset, amount } = parameters;
    
    // Fetch pool data
    const pool = await this.sdk.fetchPoolData(poolId);
    
    // Find the asset in the pool
    const assetConfig = pool.assets.find(a => a.symbol === asset);
    if (!assetConfig) {
      throw new Error(`Asset ${asset} not found in pool ${poolId}`);
    }

    // Convert amount to proper decimals
    const amountBigInt = parseUnits(amount, assetConfig.decimals);

    // Approve spending if needed
    await this.sdk.approve(
      walletClient.account.address,
      assetConfig.address,
      amountBigInt
    );

    // Supply asset to pool
    const tx = await this.sdk.supply(
      poolId,
      assetConfig.address,
      amountBigInt
    );

    return tx.hash;
  }

  @Tool({
    name: "borrow_asset",
    description: "Borrow an asset from an Ionic Protocol pool",
    parameters: z.object({
      poolId: z.string().describe("The ID of the pool to borrow from"),
      asset: z.string().describe("The asset to borrow (e.g. USDC, WETH)"),
      amount: z.string().describe("The amount to borrow"),
    }),
  })
  async borrowAsset(walletClient: EVMWalletClient, parameters: z.infer<typeof parameters>) {
    const { poolId, asset, amount } = parameters;
    
    const pool = await this.sdk.fetchPoolData(poolId);
    const assetConfig = pool.assets.find(a => a.symbol === asset);
    
    if (!assetConfig) {
      throw new Error(`Asset ${asset} not found in pool ${poolId}`);
    }

    const amountBigInt = parseUnits(amount, assetConfig.decimals);

    // Check borrow capacity
    const { borrowCapacity } = await this.sdk.getBorrowCapacity(
      poolId,
      walletClient.account.address,
      assetConfig.address
    );

    if (amountBigInt > borrowCapacity) {
      throw new Error(`Borrow amount exceeds capacity. Max: ${formatUnits(borrowCapacity, assetConfig.decimals)}`);
    }

    // Execute borrow
    const tx = await this.sdk.borrow(
      poolId,
      assetConfig.address,
      amountBigInt
    );

    return tx.hash;
  }

  @Tool({
    name: "loop_position",
    description: "Create a leveraged loop position with supported assets",
    parameters: z.object({
      asset: z.string().describe("The asset to loop (e.g. weETH, dMBTC)"),
      initialAmount: z.string().describe("Initial amount to supply"),
      targetLeverage: z.number().min(1).max(5).describe("Target leverage ratio (1-5x)"),
      poolId: z.string().describe("The pool ID to create the loop in"),
    }),
  })
  async loopPosition(walletClient: EVMWalletClient, parameters: z.infer<typeof parameters>) {
    const { asset, initialAmount, targetLeverage, poolId } = parameters;

    if (!this.LOOP_SUPPORTED_ASSETS.includes(asset)) {
      throw new Error(`Asset ${asset} not supported for looping. Supported: ${this.LOOP_SUPPORTED_ASSETS.join(", ")}`);
    }

    const pool = await this.sdk.fetchPoolData(poolId);
    const assetConfig = pool.assets.find(a => a.symbol === asset);
    
    if (!assetConfig) {
      throw new Error(`Asset ${asset} not found in pool ${poolId}`);
    }

    // Initial supply
    const initialAmountBigInt = parseUnits(initialAmount, assetConfig.decimals);
    await this.supplyAsset(walletClient, {
      poolId,
      asset,
      amount: initialAmount
    });

    // Calculate loop amounts based on target leverage
    const iterations = Math.floor((targetLeverage - 1) * 2); // Number of borrow/supply cycles
    let currentAmount = initialAmountBigInt;

    for (let i = 0; i < iterations; i++) {
      // Calculate borrow amount (usually 75-80% of supply to maintain safety margin)
      const borrowAmount = (currentAmount * 75n) / 100n;
      
      // Borrow
      await this.borrowAsset(walletClient, {
        poolId,
        asset,
        amount: formatUnits(borrowAmount, assetConfig.decimals)
      });

      // Supply borrowed amount
      await this.supplyAsset(walletClient, {
        poolId,
        asset,
        amount: formatUnits(borrowAmount, assetConfig.decimals)
      });

      currentAmount = borrowAmount;
    }

    return "Loop position created successfully";
  }

  @Tool({
    name: "swap_collateral",
    description: "Swap collateral between assets in a pool",
    parameters: z.object({
      poolId: z.string().describe("The pool ID"),
      fromAsset: z.string().describe("Asset to swap from"),
      toAsset: z.string().describe("Asset to swap to"), 
      amount: z.string().describe("Amount to swap"),
    }),
  })
  async swapCollateral(walletClient: EVMWalletClient, parameters: z.infer<typeof parameters>) {
    const { poolId, fromAsset, toAsset, amount } = parameters;
    
    const pool = await this.sdk.fetchPoolData(poolId);
    
    const fromAssetConfig = pool.assets.find(a => a.symbol === fromAsset);
    const toAssetConfig = pool.assets.find(a => a.symbol === toAsset);

    if (!fromAssetConfig || !toAssetConfig) {
      throw new Error("One or both assets not found in pool");
    }

    const amountBigInt = parseUnits(amount, fromAssetConfig.decimals);

    // Execute collateral swap through Ionic's built-in swap functionality
    const tx = await this.sdk.swapCollateral(
      poolId,
      fromAssetConfig.address,
      toAssetConfig.address,
      amountBigInt,
      {
        slippageTolerance: 0.005 // 0.5% default slippage tolerance
      }
    );

    return tx.hash;
  }

  @Tool({
    name: "check_health",
    description: "Check portfolio health metrics",
    parameters: z.object({
      poolId: z.string().describe("The pool ID to check"),
    }),
  })
  async checkHealth(walletClient: EVMWalletClient, parameters: z.infer<typeof parameters>): Promise<HealthMetrics> {
    const { poolId } = parameters;
    const pool = await this.sdk.fetchPoolData(poolId);
    
    // Get user's positions
    const userAddress = walletClient.account.address;
    const positions = await this.sdk.getPositions(poolId, userAddress);

    // Calculate total supplied and borrowed value
    let totalSuppliedUSD = 0n;
    let totalBorrowedUSD = 0n;
    const assetPerformance: HealthMetrics['assetPerformance'] = {};

    for (const asset of pool.assets) {
      const supplied = positions.supplied[asset.address] || 0n;
      const borrowed = positions.borrowed[asset.address] || 0n;
      
      // Get USD values
      const suppliedUSD = await this.sdk.getUSDValue(asset.address, supplied);
      const borrowedUSD = await this.sdk.getUSDValue(asset.address, borrowed);
      
      totalSuppliedUSD += suppliedUSD;
      totalBorrowedUSD += borrowedUSD;

      // Calculate asset performance metrics
      assetPerformance[asset.symbol] = {
        apy: Number(formatUnits(asset.supplyAPY, 18)),
        tvl: Number(formatUnits(asset.totalSupply, asset.decimals)),
        utilization: Number(formatUnits(asset.utilization, 18))
      };
    }

    // Calculate LTV
    const ltv = totalSuppliedUSD > 0n 
      ? Number((totalBorrowedUSD * 100n) / totalSuppliedUSD) 
      : 0;

    // Determine liquidation risk
    let liquidationRisk: HealthMetrics['liquidationRisk'] = "LOW";
    if (ltv > 80) {
      liquidationRisk = "HIGH";
    } else if (ltv > 65) {
      liquidationRisk = "MEDIUM";
    }

    return {
      ltv,
      liquidationRisk,
      assetPerformance
    };
  }

  @Tool({
    name: "manage_ion",
    description: "Manage ION token operations (claim, bridge, stake)",
    parameters: z.object({
      action: z.enum(["claim", "bridge", "stake"]).describe("The ION action to perform"),
      amount: z.string().optional().describe("Amount for bridge/stake operations"),
      targetChain: z.number().optional().describe("Target chain ID for bridge operation"),
    }),
  })
  async manageIon(walletClient: EVMWalletClient, parameters: z.infer<typeof parameters>) {
    const { action, amount, targetChain } = parameters;

    switch (action) {
      case "claim":
        const claimTx = await this.sdk.claimIon(walletClient.account.address);
        return claimTx.hash;

      case "bridge":
        if (!amount || !targetChain) {
          throw new Error("Amount and target chain required for bridge operation");
        }
        const bridgeTx = await this.sdk.bridgeIon(
          parseUnits(amount, 18),
          targetChain
        );
        return bridgeTx.hash;

      case "stake":
        if (!amount) {
          throw new Error("Amount required for stake operation");
        }
        const stakeTx = await this.sdk.stakeIon(parseUnits(amount, 18));
        return stakeTx.hash;
    }
  }
}