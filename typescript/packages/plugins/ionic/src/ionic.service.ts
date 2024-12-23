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
  GetHealthMetricsParameters,
  GetPoolDataParameters,
  GetPoolAssetsParameters,
  GetPoolRatesParameters,
  GetUserPositionParameters
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
    description: "Supply an asset to an Ionic Protocol pool (amount in base units)"
  })
  async supplyAsset(walletClient: EVMWalletClient, parameters: SupplyAssetParameters) {
    const { poolId, asset, amount } = parameters;
    const chainId = walletClient.getChain();
    const chainid = chainId.id;
    const poolAddress = ionicProtocolAddresses[chainid]?.pools[poolId] as Address;

    if (!poolAddress) {
      throw new Error(`Pool with ID ${poolId} not found for chain ID ${chainId}`);
    }

    try {
      const assetConfig = await this.getAssetConfig(chainid, asset);
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

    const poolLensContract = {
      abi: poolLensAbi,
      address: "POOL_LENS_ADDRESS" as Address
    };

    const assetConfig = poolData.assets.find(a => a.symbol === asset);
    if (!assetConfig) {
      throw new Error(`Asset ${asset} not found in pool ${poolId}`);
    }

    const chainid = walletClient.getChain().id;

    const poolDirectoryAddress = ionicProtocolAddresses[chainid]?.PoolDirectory as Address;
    if (!poolDirectoryAddress) {
        throw new Error(`PoolDirectory address not found for chain ID ${chainId}`);
    }
    const poolDataRaw = await walletClient.read({
        address: poolDirectoryAddress,
        abi: poolDirectoryAbi,
        functionName: 'pools',
        args: [BigInt(poolId)],
    });
    const poolData = poolDataRaw.value as [bigint, boolean, Address];
    const comptrollerAddress = poolData[2];
    if (!comptrollerAddress || comptrollerAddress === '0x0000000000000000000000000000000000000000') {
        throw new Error(`Comptroller address not found for pool ID ${poolId}`);
    }

    const comptrollerContract = {
      abi: comptrollerAbi,
      address: comptrollerAddress
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
    description: "Get health metrics for an Ionic Protocol pool position"
  })
  async getHealthMetrics(walletClient: EVMWalletClient, parameters: GetHealthMetricsParameters): Promise<HealthMetrics> {
    const { poolId } = parameters;
    const chainId = walletClient.getChain().id;
    
    const poolLensAddress = ionicProtocolAddresses[chainId]?.PoolLens as Address;
    if (!poolLensAddress) {
      throw new Error(`PoolLens not found for chain ID ${chainId}`);
    }

    try {
      const poolData = await walletClient.read({
        address: poolLensAddress,
        abi: poolLensAbi,
        functionName: "getPoolAssetsWithData",
        args: [BigInt(poolId)]
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
    } catch (error: any) {
      throw new Error(`Failed to get health metrics: ${error.message}`);
    }
  }
}