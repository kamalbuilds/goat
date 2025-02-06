import { createToolParameters } from "@goat-sdk/core";
import { z } from "zod";

const hexAddress = z.string().regex(/^0x[a-fA-F0-9]{40}$/);

export class SwapParameters extends createToolParameters(
    z.object({
        tokenIn: hexAddress.describe("The address of the input token"),
        tokenOut: hexAddress.describe("The address of the output token"),
        amountIn: z.string().describe("The amount of input tokens to swap (in basis points/wei)"),
        amountOutMin: z.string().describe("Minimum amount of output tokens to receive"),
        slippage: z.string().default("0.5").describe("Maximum slippage allowed (in percentage)"),
        deadline: z.number().optional().describe("Transaction deadline (in seconds)"),
        wethIsEth: z.boolean().default(false).describe("Whether to use ETH instead of WETH"),
    })
) {}

export class AddLiquidityParameters extends createToolParameters(
    z.object({
        tokenA: hexAddress.describe("First token address"),
        tokenB: hexAddress.describe("Second token address"),
        amountADesired: z.string().describe("Desired amount of first token"),
        amountBDesired: z.string().describe("Desired amount of second token"),
        amountAMin: z.string().describe("Minimum amount of first token"),
        amountBMin: z.string().describe("Minimum amount of second token"),
        deadline: z.number().optional().describe("Transaction deadline (in seconds)"),
    })
) {}

export class RemoveLiquidityParameters extends createToolParameters(
    z.object({
        tokenA: hexAddress.describe("First token address"),
        tokenB: hexAddress.describe("Second token address"),
        liquidity: z.string().describe("Amount of LP tokens to remove"),
        amountAMin: z.string().describe("Minimum amount of first token"),
        amountBMin: z.string().describe("Minimum amount of second token"),
        deadline: z.number().optional().describe("Transaction deadline (in seconds)"),
    })
) {} 