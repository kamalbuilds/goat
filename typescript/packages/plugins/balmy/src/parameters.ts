import { createToolParameters } from "@goat-sdk/core";
import { z } from "zod";

export class GetBalanceParameters extends createToolParameters(
    z.object({
        chainId: z.number().describe("The chain ID"),
        account: z.string().describe("The account address"),
        token: z.string().describe("The token address"),
    }),
) {}

export class GetAllowanceParameters extends createToolParameters(
    z.object({
        chainId: z.number().describe("The chain ID"),
        token: z.string().describe("The token address"),
        owner: z.string().describe("The owner address"),
        spender: z.string().describe("The spender address"),
    }),
) {}

export class GetQuoteParameters extends createToolParameters(
    z.object({
        chainId: z.number().describe("The chain ID"),
        tokenIn: z.string().describe("The input token symbol or address"),
        tokenOut: z.string().describe("The output token symbol or address"),
        order: z
            .union([
                z.object({
                    type: z.literal("sell"),
                    sellAmount: z.string().describe("Amount in basis points (e.g., 1000000 for 1 USDC)"),
                }),
                z.object({
                    type: z.literal("buy"),
                    buyAmount: z.string().describe("Amount in basis points (e.g., 1000000 for 1 USDC)"),
                }),
            ])
            .describe("Order details"),
        slippagePercentage: z.number().describe("Maximum allowed slippage (e.g., 0.5 for 0.5%)"),
        gasSpeed: z.string().optional(),
        takerAddress: z.string().optional(),
    }),
) {}

export class ExecuteSwapParameters extends GetQuoteParameters {}
