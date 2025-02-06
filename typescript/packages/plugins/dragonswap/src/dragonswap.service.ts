import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { ethers } from "ethers";
import { DragonswapConfig } from "./dragonswap.plugin";
import { SwapParameters, AddLiquidityParameters, RemoveLiquidityParameters } from "./parameters";
import { ROUTER_ABI, FACTORY_ABI, PAIR_ABI, ERC20_ABI } from "./abis";

export class DragonswapService {
    private router: ethers.Contract;
    private factory: ethers.Contract;

    constructor(private readonly config: DragonswapConfig) {}

    private async getRouter(walletClient: EVMWalletClient) {
        if (!this.router) {
            this.router = new ethers.Contract(
                this.config.routerAddress!,
                ROUTER_ABI,
                await walletClient.getSigner()
            );
        }
        return this.router;
    }

    private async getFactory(walletClient: EVMWalletClient) {
        if (!this.factory) {
            this.factory = new ethers.Contract(
                this.config.factoryAddress!,
                FACTORY_ABI,
                await walletClient.getSigner()
            );
        }
        return this.factory;
    }

    @Tool({
        description: "Swap tokens on Dragonswap",
    })
    async swap(walletClient: EVMWalletClient, parameters: SwapParameters) {
        const router = await this.getRouter(walletClient);
        const deadline = parameters.deadline || Math.floor(Date.now() / 1000) + 1200;

        // Approve token if needed
        const tokenContract = new ethers.Contract(
            parameters.tokenIn,
            ERC20_ABI,
            await walletClient.getSigner()
        );
        await tokenContract.approve(this.config.routerAddress!, parameters.amountIn);

        // Execute swap
        const tx = await router.swapExactTokensForTokens(
            parameters.amountIn,
            parameters.amountOutMin,
            [parameters.tokenIn, parameters.tokenOut],
            await walletClient.getAddress(),
            deadline
        );

        return tx.hash;
    }

    @Tool({
        description: "Add liquidity to Dragonswap pool",
    })
    async addLiquidity(walletClient: EVMWalletClient, parameters: AddLiquidityParameters) {
        const router = await this.getRouter(walletClient);
        const deadline = parameters.deadline || Math.floor(Date.now() / 1000) + 1200;

        // Approve tokens
        const tokenA = new ethers.Contract(
            parameters.tokenA,
            ERC20_ABI,
            await walletClient.getSigner()
        );
        const tokenB = new ethers.Contract(
            parameters.tokenB,
            ERC20_ABI,
            await walletClient.getSigner()
        );

        await tokenA.approve(this.config.routerAddress!, parameters.amountADesired);
        await tokenB.approve(this.config.routerAddress!, parameters.amountBDesired);

        // Add liquidity
        const tx = await router.addLiquidity(
            parameters.tokenA,
            parameters.tokenB,
            parameters.amountADesired,
            parameters.amountBDesired,
            parameters.amountAMin,
            parameters.amountBMin,
            await walletClient.getAddress(),
            deadline
        );

        return tx.hash;
    }

    @Tool({
        description: "Remove liquidity from Dragonswap pool",
    })
    async removeLiquidity(walletClient: EVMWalletClient, parameters: RemoveLiquidityParameters) {
        const router = await this.getRouter(walletClient);
        const deadline = parameters.deadline || Math.floor(Date.now() / 1000) + 1200;

        // Get pair address
        const factory = await this.getFactory(walletClient);
        const pairAddress = await factory.getPair(parameters.tokenA, parameters.tokenB);
        
        // Approve LP tokens
        const pair = new ethers.Contract(
            pairAddress,
            PAIR_ABI,
            await walletClient.getSigner()
        );
        await pair.approve(this.config.routerAddress!, parameters.liquidity);

        // Remove liquidity
        const tx = await router.removeLiquidity(
            parameters.tokenA,
            parameters.tokenB,
            parameters.liquidity,
            parameters.amountAMin,
            parameters.amountBMin,
            await walletClient.getAddress(),
            deadline
        );

        return tx.hash;
    }
} 