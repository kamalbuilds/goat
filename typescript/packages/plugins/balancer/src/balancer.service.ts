import { Tool } from "@goat-sdk/core";
import type { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { BalancerApi, ChainId, Slippage, SwapKind, Token, Swap, AddLiquidity, AddLiquidityKind } from "@balancer/sdk";
import { SwapParameters, LiquidityParameters } from "./parameters";

export class BalancerService {
    @Tool({
        description: "Performs a token swap on Balancer using their Smart Order Router",
    })
    async swap(walletClient: EVMWalletClient, parameters: SwapParameters) {
        const balancerApi = new BalancerApi(
            "https://api-v3.balancer.fi/",
            walletClient.getChain().id as ChainId
        );

        const tokenIn = new Token(
            walletClient.getChain().id as ChainId,
            parameters.tokenIn,
            18
        );

        const tokenOut = new Token(
            walletClient.getChain().id as ChainId,
            parameters.tokenOut,
            18
        );

        const swapAmount = BigInt(parameters.amountIn);

        const sorPaths = await balancerApi.sorSwapPaths.fetchSorSwapPaths({
            chainId: walletClient.getChain().id as ChainId,
            tokenIn: parameters.tokenIn,
            tokenOut: parameters.tokenOut,
            swapKind: SwapKind.GivenIn,
            swapAmount,
        });

        const swap = new Swap({
            chainId: walletClient.getChain().id as ChainId,
            paths: sorPaths,
            swapKind: SwapKind.GivenIn,
        });

        const updated = await swap.query(walletClient.transport);

        const callData = swap.buildCall({
            slippage: Slippage.fromPercentage(parameters.slippage),
            deadline: parameters.deadline ? BigInt(parameters.deadline) : BigInt(Math.floor(Date.now() / 1000) + 3600),
            queryOutput: updated,
            wethIsEth: parameters.wethIsEth,
        });

        const tx = await walletClient.sendTransaction({
            to: callData.to,
            data: callData.callData,
            value: callData.value,
        });

        return tx.hash;
    }

    @Tool({
        description: "Provides liquidity to a Balancer pool",
    })
    async addLiquidity(walletClient: EVMWalletClient, parameters: LiquidityParameters) {
        const balancerApi = new BalancerApi(
            "https://api-v3.balancer.fi/",
            walletClient.getChain().id as ChainId
        );

        const poolState = await balancerApi.pools.fetchPoolState(parameters.pool);

        const amountsIn = parameters.amounts.map(amount => ({
            address: amount.token,
            decimals: amount.decimals,
            rawAmount: BigInt(amount.amount),
        }));

        const addLiquidityInput = {
            amountsIn,
            chainId: walletClient.getChain().id as ChainId,
            rpcUrl: walletClient.getChain().rpcUrl,
            kind: AddLiquidityKind.Unbalanced,
        };

        const addLiquidity = new AddLiquidity();
        const queryOutput = await addLiquidity.query(addLiquidityInput, poolState);

        const call = addLiquidity.buildCall({
            ...queryOutput,
            slippage: Slippage.fromPercentage(parameters.slippage),
            chainId: walletClient.getChain().id as ChainId,
            wethIsEth: parameters.wethIsEth,
        });

        const tx = await walletClient.sendTransaction({
            to: call.to,
            data: call.callData,
            value: call.value,
        });

        return tx.hash;
    }
} 