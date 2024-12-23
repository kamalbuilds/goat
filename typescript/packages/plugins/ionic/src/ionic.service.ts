import { Tool } from "@goat-sdk/core";
import { EVMTransactionOptions, EVMWalletClient } from "@goat-sdk/wallet-evm";
import { z } from "zod";
import { parseUnits, formatUnits, type Address } from "viem";
import type { HealthMetrics, PoolData } from "./types";
import { ionicProtocolAddresses } from "./ionic.config";

import { poolLensAbi } from "./abis/PoolLens";
import { comptrollerAbi } from "./abis/Comptroller"; 
import { poolAbi } from "./abis/Pool";
import { poolDirectoryAbi } from "./abis/PoolDirectory";

import {
  SupplyAssetParameters,
  BorrowAssetParameters,
  GetHealthMetricsParameters
} from "./parameters";

export class IonicService {
  private supportedTokens: string[];

  constructor(supportedTokens?: string[]) {
    this.supportedTokens = supportedTokens || ["USDC", "WETH"];
  }

  private async getAssetConfig(chainId: number, symbol: string): Promise<{ address: Address, decimals: number }> {
    const config = ionicProtocolAddresses[chainId]?.assets?.[symbol];
    if (!config?.address || config.decimals === undefined) {
      throw new Error(`Asset ${symbol} not found in Ionic Protocol addresses for chain ${chainId}`);
    }
    return { address: config.address as Address, decimals: config.decimals };
  }

  @Tool({
    name: "ionic_supply_asset",
    description: "Supply an asset to an Ionic Protocol pool"
  })
  async supplyAsset(walletClient: EVMWalletClient, parameters: SupplyAssetParameters) {
    const { poolId, asset, amount } = parameters;
    const chainId = walletClient.getChain().id;

    try {

      const poolAddress = ionicProtocolAddresses[chainId]?.pools[poolId] as Address;
      if (!poolAddress) {
        throw new Error(`Pool address not found for pool ID ${poolId} on chain ${chainId}`);
      }

      console.log("poolAddress", poolAddress);

      const assetConfig = await this.getAssetConfig(chainId, asset);
      const amountBigInt = parseUnits(amount, assetConfig.decimals);

      
      
      const tx = await walletClient.sendTransaction({
        to: poolAddress,
        abi: poolAbi,
        functionName: "supply",
        args: [assetConfig.address, amountBigInt]
      });

      return tx.hash;
    } catch (error: any) {
      throw new Error(`Failed to supply asset: ${error.message}`);
    }
  }

  @Tool({
    name: "ionic_borrow_asset",
    description: "Borrow an asset from an Ionic Protocol pool (amount in base units)"
  })
  async borrowAsset(walletClient: EVMWalletClient, parameters: BorrowAssetParameters) {
    const { poolId, asset, amount } = parameters;
    const chainId = walletClient.getChain().id;

    try {
      const poolDirectoryAddress = ionicProtocolAddresses[chainId]?.PoolDirectory as Address;
      if (!poolDirectoryAddress) {
        throw new Error(`PoolDirectory address not found for chain ID ${chainId}`);
      }

      const poolDataRaw = await walletClient.read({
        address: poolDirectoryAddress,
        abi: poolDirectoryAbi,
        functionName: 'pools',
        args: [BigInt(poolId)]
      });

      const poolData = poolDataRaw as unknown as [bigint, boolean, Address];
      const comptrollerAddress = poolData[2];
      
      if (!comptrollerAddress || comptrollerAddress === '0x0000000000000000000000000000000000000000') {
        throw new Error(`Comptroller address not found for pool ID ${poolId}`);
      }

      const assetConfig = await this.getAssetConfig(chainId, asset);
      const amountBigInt = parseUnits(amount, assetConfig.decimals);

      const tx = await walletClient.sendTransaction({
        to: comptrollerAddress,
        abi: comptrollerAbi,
        functionName: "borrow",
        args: [assetConfig.address, amountBigInt]
      });

      return tx.hash;
    } catch (error: any) {
      throw new Error(`Failed to borrow asset: ${error.message}`);
    }
  }

  @Tool({
    name: "get_ionic_health_metrics",
    description: "Get health metrics for an Ionic Protocol pool position"
  })
  async getHealthMetrics(walletClient: EVMWalletClient, parameters: GetHealthMetricsParameters): Promise<HealthMetrics> {
    const { poolId } = parameters;
    const chainId = walletClient.getChain().id;
    
    try {
      const poolLensAddress = ionicProtocolAddresses[chainId]?.PoolLens as Address;
      if (!poolLensAddress) {
        throw new Error(`PoolLens not found for chain ID ${chainId}`);
      }

      const poolData = await walletClient.read({
        address: poolLensAddress,
        abi: poolLensAbi,
        functionName: "getPoolAssetsWithData",
        args: [BigInt(poolId)]
      }) as unknown as PoolData;

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
    } catch (error: any) {
      throw new Error(`Failed to get health metrics for pool ${poolId}: ${error.message}`);
    }
  }
}