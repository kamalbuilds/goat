import { type ServiceBase, type WalletClientBase } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { type Address } from "viem";
import { MerchantMoePluginOptions } from "./merchantmoe.plugin";
import { erc20ABI, routerABI, factoryABI, stakingABI } from "./abi";

// Contract addresses
const ADDRESSES = {
    MOE_TOKEN: "0x4515A45337F461A11Ff0FE8aBF3c606AE5dC00c9",
    MASTER_CHEF: "0xd4BD5e47548D8A6ba2a0Bf4cE073Cbf8fa523DcC",
    MOE_STAKING: "0xE92249760e1443FbBeA45B03f607Ba84471Fa793",
    SMOE: "0xb3938E6ee233E7847a5F17bb843E9bD0Aa07e116",
    MOE_FACTORY: "0x5bef015ca9424a7c07b68490616a4c1f094bedec",
    MOE_ROUTER: "0xeaEE7EE68874218c3558b40063c42B82D3E7232a",
    VEMOE: "0x240616e2448e078934863fB6eb5133834BF14Ef1",
    VEMOE_REWARDER: "0x151B82CA3a0c9dA9Dfde200F9C527cD89dd6aea8",
} as const;

export class MerchantMoeService implements ServiceBase {
    private client: EVMWalletClient;
    private rpcUrl?: string;

    constructor(options?: MerchantMoePluginOptions) {
        this.rpcUrl = options?.rpcUrl;
    }

    setClient(client: WalletClientBase) {
        if (!(client instanceof EVMWalletClient)) {
            throw new Error("MerchantMoeService requires an EVMWalletClient");
        }
        this.client = client;
    }

    // Token Functions
    async getMoeBalance(address: Address): Promise<bigint> {
        return this.client.readContract({
            address: ADDRESSES.MOE_TOKEN,
            abi: erc20ABI,
            functionName: "balanceOf",
            args: [address],
        });
    }

    // Staking Functions
    async getStakedMoe(address: Address): Promise<bigint> {
        return this.client.readContract({
            address: ADDRESSES.MOE_STAKING,
            abi: stakingABI,
            functionName: "balanceOf",
            args: [address],
        });
    }

    async stakeMoe(amount: bigint) {
        return this.client.writeContract({
            address: ADDRESSES.MOE_STAKING,
            abi: stakingABI,
            functionName: "stake",
            args: [amount],
        });
    }

    async unstakeMoe(amount: bigint) {
        return this.client.writeContract({
            address: ADDRESSES.MOE_STAKING,
            abi: stakingABI,
            functionName: "withdraw",
            args: [amount],
        });
    }

    async getEarnedMoe(address: Address): Promise<bigint> {
        return this.client.readContract({
            address: ADDRESSES.MOE_STAKING,
            abi: stakingABI,
            functionName: "earned",
            args: [address],
        });
    }

    async claimRewards() {
        return this.client.writeContract({
            address: ADDRESSES.MOE_STAKING,
            abi: stakingABI,
            functionName: "getReward",
            args: [],
        });
    }

    async exitStaking() {
        return this.client.writeContract({
            address: ADDRESSES.MOE_STAKING,
            abi: stakingABI,
            functionName: "exit",
            args: [],
        });
    }

    // VeMoe Functions
    async getVeMoeBalance(address: Address): Promise<bigint> {
        return this.client.readContract({
            address: ADDRESSES.VEMOE,
            abi: erc20ABI,
            functionName: "balanceOf",
            args: [address],
        });
    }

    // Router Functions
    async getAmountsOut(amountIn: bigint, path: Address[]): Promise<bigint[]> {
        return this.client.readContract({
            address: ADDRESSES.MOE_ROUTER,
            abi: routerABI,
            functionName: "getAmountsOut",
            args: [amountIn, path],
        });
    }

    async swapExactTokensForTokens(
        amountIn: bigint,
        amountOutMin: bigint,
        path: Address[],
        to: Address,
        deadline: bigint
    ) {
        return this.client.writeContract({
            address: ADDRESSES.MOE_ROUTER,
            abi: routerABI,
            functionName: "swapExactTokensForTokens",
            args: [amountIn, amountOutMin, path, to, deadline],
        });
    }

    async swapTokensForExactTokens(
        amountOut: bigint,
        amountInMax: bigint,
        path: Address[],
        to: Address,
        deadline: bigint
    ) {
        return this.client.writeContract({
            address: ADDRESSES.MOE_ROUTER,
            abi: routerABI,
            functionName: "swapTokensForExactTokens",
            args: [amountOut, amountInMax, path, to, deadline],
        });
    }

    // Factory Functions
    async getPair(tokenA: Address, tokenB: Address): Promise<Address> {
        return this.client.readContract({
            address: ADDRESSES.MOE_FACTORY,
            abi: factoryABI,
            functionName: "getPair",
            args: [tokenA, tokenB],
        });
    }

    async getAllPairsLength(): Promise<bigint> {
        return this.client.readContract({
            address: ADDRESSES.MOE_FACTORY,
            abi: factoryABI,
            functionName: "allPairsLength",
            args: [],
        });
    }

    async getPairAtIndex(index: number): Promise<Address> {
        return this.client.readContract({
            address: ADDRESSES.MOE_FACTORY,
            abi: factoryABI,
            functionName: "allPairs",
            args: [index],
        });
    }
} 