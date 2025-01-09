import { Tool } from "@goat-sdk/core";
import type { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { ROUTER_ABI } from "./abi/router";
import { SwapExactTokensParams, AddLiquidityParams } from "./parameters";

const ROUTER_ADDRESS = "0xa062aE8A9c5e11aaA026fc2670B0D65cCc8B2858";

export class VelodromeService {
    @Tool({
        name: "swap_exact_tokens",
        description: "Swap an exact amount of tokens on Velodrome",
    })
    async swapExactTokens(walletClient: EVMWalletClient, parameters: SwapExactTokensParams) {
        const timestamp = Math.floor(Date.now() / 1000) + parameters.deadline;

        const routes = [{
            from: parameters.tokenIn,
            to: parameters.tokenOut,
            stable: false
        }];

        const hash = await walletClient.sendTransaction({
            to: ROUTER_ADDRESS,
            abi: ROUTER_ABI,
            functionName: "swapExactTokensForTokens",
            args: [
                parameters.amountIn,
                parameters.amountOutMin,
                routes,
                parameters.to || walletClient.getAddress(),
                timestamp,
            ],
        });

        return hash.hash;
    }

    @Tool({
        name: "add_liquidity",
        description: "Add liquidity to a Velodrome pool",
    })
    async addLiquidity(walletClient: EVMWalletClient, parameters: AddLiquidityParams) {
        const timestamp = Math.floor(Date.now() / 1000) + parameters.deadline;

        const hash = await walletClient.sendTransaction({
            to: ROUTER_ADDRESS,
            abi: ROUTER_ABI,
            functionName: "addLiquidity",
            args: [
                parameters.token0,
                parameters.token1,
                parameters.stable,
                parameters.amount0Desired,
                parameters.amount1Desired,
                parameters.amount0Min,
                parameters.amount1Min,
                parameters.to || walletClient.getAddress(),
                timestamp,
            ],
        });

        return hash.hash;
    }
} 