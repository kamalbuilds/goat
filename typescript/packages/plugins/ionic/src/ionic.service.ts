import { Tool } from "@goat-sdk/core";
import { EVMTransactionOptions, EVMWalletClient } from "@goat-sdk/wallet-evm";
import { z } from "zod";
import { parseUnits, formatUnits, type Address } from "viem";
import type { HealthMetrics } from "./types";

import { poolLensAbi } from "./abis/PoolLens";
import { comptrollerAbi } from "./abis/Comptroller"; 
import erc20Abi  from "./abis/ERC20";
import { ionicAddress } from "./address";

export class IonicService {
  private supportedTokens: string[];

  constructor(supportedTokens?: string[]) {
    this.supportedTokens = supportedTokens || ["USDC", "WETH", "MODE"];
  }

  @Tool({
    name: "ionic_supply_asset",
    description: "Supply an asset to an Ionic Protocol pool (amount in base units) requires poolId, asset, and amount",
  })
  async supplyAsset(walletClient: EVMWalletClient, parameters: z.infer<typeof parameters>) {
    const { poolId, asset, amount } = parameters;

    // Get pool data from PoolLens contract
    const poolLensContract = {
      abi: poolLensAbi,
      address: "POOL_LENS_ADDRESS" as Address // Get from deployments
    };

    const poolData = await walletClient.read({
      ...poolLensContract,
      functionName: "getPoolData",
      args: [poolId]
    });
    

    // Find asset config
    const assetConfig = poolData.assets.find(a => a.symbol === asset);
    if (!assetConfig) {
      throw new Error(`Asset ${asset} not found in pool ${poolId}`);
    }

    // Supply asset directly through Comptroller
    const comptrollerContract = {
      abi: comptrollerAbi,
      address: ionicAddress.comptroller
    };

    const tx = await walletClient.sendTransaction({
      to: comptrollerContract.address,
      abi: comptrollerAbi,
      functionName: "supply",
      args: [assetConfig.address, amount]
    });

    return tx.hash;
  }

  @Tool({
    name: "ionic_borrow_asset", 
    description: "Borrow an asset from an Ionic Protocol pool (amount in base units) requires poolId, asset, and amount",
    parameters: z.object({
      poolId: z.string().describe("The ID of the pool to borrow from"),
      asset: z.string().describe("The asset to borrow"),
      amount: z.string().describe("The amount to borrow in base units"),
    }),
  })
  async borrowAsset(walletClient: EVMWalletClient, parameters: BorrowAssetParameters) {
    const { poolId, asset, amount } = parameters;

    const poolLensContract = {
      abi: poolLensAbi,
      address: "POOL_LENS_ADDRESS" as Address
    };

    const poolData = await walletClient.read({
      address: poolLensContract.address,
      abi: poolLensAbi,
      functionName: "getPoolData", 
      args: [poolId]
    });

    const assetConfig = poolData.assets.find(a => a.symbol === asset);
    if (!assetConfig) {
      throw new Error(`Asset ${asset} not found in pool ${poolId}`);
    }

    const comptrollerContract = {
      abi: comptrollerAbi,
      address: ionicAddress.comptroller
    };

    const tx = await walletClient.sendTransaction({
      to: comptrollerContract.address,
      functionName: "borrow",
      args: [assetConfig.address, amount],
      abi: comptrollerAbi,
    });

   

    return tx.hash;
  }

  @Tool({
    name: "get_ionic_health_metrics",
    description: "Get health metrics for an Ionic Protocol pool position requires poolId to check the metrics for",
  })
  async getHealthMetrics(walletClient: EVMWalletClient, parameters: z.infer<typeof parameters>): Promise<HealthMetrics> {
    const { poolId } = parameters;

    const poolLensContract = {
      abi: poolLensAbi,
      address: ionicAddress.poollens
    };

    const poolData = await walletClient.read({
      address: poolLensContract.address,
      abi: poolLensAbi,
      functionName: "getPoolData",
      args: [poolId]
    });

    const assetPerformance: HealthMetrics['assetPerformance'] = {};

    let totalSuppliedUSD = 0n;
    let totalBorrowedUSD = 0n;

    for (const asset of poolData.assets) {
      totalSuppliedUSD += asset.totalSupplyUSD;
      totalBorrowedUSD += asset.totalBorrowUSD;

      assetPerformance[asset.symbol] = {
        apy: Number(formatUnits(asset.supplyAPY, 18)),
        tvl: Number(formatUnits(asset.totalSupply, asset.decimals)),
        utilization: Number(formatUnits(asset.utilization, 18))
      };
    }

    const ltv = totalSuppliedUSD > 0n 
      ? Number((totalBorrowedUSD * 100n) / totalSuppliedUSD)
      : 0;

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
}