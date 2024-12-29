import { Tool } from "@goat-sdk/core";
import { EVMTransactionOptions, EVMWalletClient } from "@goat-sdk/wallet-evm";
import { z } from "zod";
import { parseUnits, formatUnits, type Address, erc20Abi } from "viem";
import type { HealthMetrics, PoolData } from "./types";
import { ionicProtocolAddresses } from "./ionic.config";

import { poolLensAbi } from "./abis/PoolLens";
import { comptrollerAbi } from "./abis/Comptroller"; 
import { ComptrollerProxyAbi } from "./abis/ComptrollerProxyAbi";
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
    this.supportedTokens = supportedTokens || Object.keys(ionicProtocolAddresses[34443].assets);
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
  async supplyAsset(
    wallet: EVMWalletClient,
    params: SupplyAssetParameters,
  ): Promise<void> {
    const { asset, amount } = params;
    const chain = await wallet.getChain();

    // approval is handled by the erc20 plugin

    // Get token address from config
    const tokenAddress = ionicProtocolAddresses[chain.id]?.assets?.[asset]?.address;
    if (!tokenAddress) {
      throw new Error(`Token address not found for ${asset} on chain ${chain.id}`);
    }

    
    // Then supply to pool
    await wallet.sendTransaction({
      to: tokenAddress,
      abi: poolAbi,
      functionName: "mint",
      args: [BigInt(amount)]
    });
  }

  @Tool({
    name: "ionic_borrow_asset",
    description: "Borrow an asset from an Ionic Protocol pool"
  })
  async borrowAsset(
    wallet: EVMWalletClient,
    params: BorrowAssetParameters,
  ): Promise<void> {
    const { asset, amount } = params;
    const chain = await wallet.getChain();
    const { address } = await this.getAssetConfig(chain.id, asset);
    

    const comptrollerAddress = ionicProtocolAddresses[chain.id]?.Comptroller;
    if (!comptrollerAddress) throw new Error("Comptroller not found");
``
    const tokenAddress = ionicProtocolAddresses[chain.id]?.assets?.[asset]?.address;
    if (!tokenAddress) {
      throw new Error(`Token address not found for ${asset} on chain ${chain.id}`);
    }

    // Check borrow allowed
    const borrowAllowed = await wallet.read({
      address: comptrollerAddress,
      abi: ComptrollerProxyAbi,
      functionName: "borrowAllowed",
      args: [address, await wallet.getAddress(), BigInt(amount)]
    });

    if (borrowAllowed.toString() !== "0") {
      throw new Error(`Borrow not allowed: ${borrowAllowed}`);
    }

    
    // Execute borrow
    await wallet.sendTransaction({
      to: tokenAddress,
      abi: poolAbi,
      functionName: "borrow",
      args: [BigInt(amount)]
    });
  }

  @Tool({
    name: "ionic_get_health_metrics",
    description: "Get health metrics for a pool position"
  })
  async getHealthMetrics(
    wallet: EVMWalletClient,
    params: GetHealthMetricsParameters
  ): Promise<HealthMetrics> {
    const { poolId } = params;
    const chain = await wallet.getChain();
    
    const poolAddress = ionicProtocolAddresses[chain.id]?.pools?.[poolId];
    if (!poolAddress) throw new Error(`Pool ${poolId} not found`);

    const poolLensAddress = ionicProtocolAddresses[chain.id]?.PoolLens;
    if (!poolLensAddress) throw new Error("PoolLens not found");

    const userAddress = await wallet.getAddress();

    // Get user's pool data
    const userData = (await wallet.read({
      address: poolLensAddress,
      abi: poolLensAbi,
      functionName: "getUserPoolData",
      args: [userAddress, poolAddress]
    })) as unknown as {
      totalBorrow: bigint;
      totalCollateral: bigint;
      healthFactor: bigint;
    };

    return {
      totalBorrows: userData.totalBorrow.toString(),
      totalCollateral: userData.totalCollateral.toString(),
      healthFactor: userData.healthFactor.toString()
    };
  }
}