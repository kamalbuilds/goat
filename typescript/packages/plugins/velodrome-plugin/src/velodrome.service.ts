import { Tool } from "@goat-sdk/core";
import type { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { ROUTER_ABI } from "./abi/router";
import { universalrouterabi } from "./abi/universalrouterabi";
import { AddLiquidityParams, SwapExactTokensParams } from "./parameters";

// Router addresses for different chains
const ROUTER_ADDRESSES: Record<number, string> = {
    10: "0x4bF3E32de155359D1D75e8B474b66848221142fc",
    34443: "0x652e53C6a4FE39B6B30426d9c96376a105C89A95",
    252: "0x652e53C6a4FE39B6B30426d9c96376a105C89A95",
    1750: "0x652e53C6a4FE39B6B30426d9c96376a105C89A95",
    1135: "0x652e53C6a4FE39B6B30426d9c96376a105C89A95",
};

export class VelodromeService {
    @Tool({
        name: "swap_exact_tokens",
        description:
            "Swap an exact amount of tokens on Velodrome. Approves tokens first to the router address if needed.",
    })
    async swapExactTokens(walletClient: EVMWalletClient, parameters: SwapExactTokensParams) {
        if (!walletClient) {
            throw new Error("Wallet client is not initialized");
        }

        const timestamp = Math.floor(Date.now() / 1000) + parameters.deadline;

        // Create route array for V2 swap
        const routes = [
            {
                from: parameters.tokenIn,
                to: parameters.tokenOut,
                stable: parameters.stable,
            },
        ];

        const chain = walletClient.getChain();
        const routerAddress = chain ? ROUTER_ADDRESSES[chain.id || 10] : ROUTER_ADDRESSES[10];

        // Execute swap using UniversalRouter
        const hash = await walletClient.sendTransaction({
            to: routerAddress,
            abi: universalrouterabi,
            functionName: "execute",
            args: [
                // Command bytes - V2_SWAP_EXACT_IN (0x08)
                "0x08",
                [
                    // Encode swap parameters
                    {
                        recipient: parameters.to || walletClient.getAddress(),
                        amountIn: parameters.amountIn,
                        amountOutMin: parameters.amountOutMin,
                        routes: routes,
                        payerIsUser: true,
                    },
                ],
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
        if (!walletClient) {
            throw new Error("Wallet client is not initialized");
        }

        const timestamp = Math.floor(Date.now() / 1000) + parameters.deadline;
        const chain = walletClient.getChain();
        const routerAddress = chain ? ROUTER_ADDRESSES[chain.id || 10] : ROUTER_ADDRESSES[10];

        const hash = await walletClient.sendTransaction({
            to: routerAddress,
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
