export interface HealthMetrics {
  ltv: number;
  liquidationRisk: "LOW" | "MEDIUM" | "HIGH";
  assetPerformance: {
    [asset: string]: {
      apy: number;
      tvl: number;
      utilization: number;
    };
  };
}

export interface LoopingConfig {
  maxLeverage: number;
  supportedAssets: string[];
  minCollateralUSD: number;
}

export interface SupplyPosition {
  asset: string;
  amount: string;
  value: string;
  apy: number;
}

export interface CollateralSwapConfig {
  slippageTolerance: number;
  maxSwapSize: number;
} 

export interface BorrowPosition {
  asset: string;
  amount: string;
  value: string;
  apy: number;
  collateral: boolean;
} 

export interface PoolAsset {
  symbol: string;
  decimals: number;
  totalSupply: bigint;
  totalSupplyUSD: bigint;
  totalBorrowUSD: bigint;
  supplyAPY: bigint;
  utilization: bigint;
}

export interface PoolData {
  assets: PoolAsset[];
} 