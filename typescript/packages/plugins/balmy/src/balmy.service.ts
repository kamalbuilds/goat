import { QuoteRequest, buildSDK } from "@balmy/sdk";
import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { ExecuteSwapParameters, GetQuoteParameters } from "./parameters";

export class BalmyService {
    private sdk;

    constructor() {
        this.sdk = buildSDK();
    }

    @Tool({
        description: "Get quotes for a token swap using Balmy",
    })
    async getQuote(walletClient: EVMWalletClient, parameters: GetQuoteParameters) {
        const chainid = await walletClient.getChain().id;

        const request: QuoteRequest = {
            chainId: chainid,
            sellToken: parameters.tokenIn,
            buyToken: parameters.tokenOut,
            order:
                parameters.order.type === "sell"
                    ? {
                          type: "sell",
                          sellAmount: parameters.order.Amount,
                      }
                    : {
                          type: "buy",
                          buyAmount: parameters.order.Amount,
                      },
            slippagePercentage: parameters.slippagePercentage,
            gasSpeed: parameters.gasSpeed,
            takerAddress: parameters.takerAddress || "0x0000000000000000000000000000000000000000",
        };

        console.log("request", request);

        const quotes = await this.sdk.quoteService.getAllQuotesWithTxs({
            request: request,
            config: {
                timeout: "10s",
            },
        });

        console.log(quotes);

        // Convert BigInt values to strings for logging and return
        const quotesForLog = quotes.map((quote) => ({
            ...quote,
            sellAmount: {
                ...quote.sellAmount,
                amount: quote.sellAmount.amount.toString(),
            },
            buyAmount: {
                ...quote.buyAmount,
                amount: quote.buyAmount.amount.toString(),
            },
            maxSellAmount: {
                ...quote.maxSellAmount,
                amount: quote.maxSellAmount.amount.toString(),
            },
            minBuyAmount: {
                ...quote.minBuyAmount,
                amount: quote.minBuyAmount.amount.toString(),
            },
            gas: {
                ...quote?.gas,
                estimatedGas: quote?.gas?.estimatedGas?.toString() ?? "0",
                estimatedCost: quote?.gas?.estimatedCost?.toString() ?? "0",
            },
            tx: {
                ...quote.tx,
                value: (quote.tx?.value ?? 0n).toString(),
            },
            customData: {
                ...quote.customData,
                tx: {
                    ...quote.customData.tx,
                    value: (quote.customData.tx?.value ?? 0n).toString(),
                },
            },
        }));

        return quotesForLog[0];
    }

    @Tool({
        description:
            "Execute a swap using the best quote using Balmy, also ensure that ERC20 approval is done before calling this",
    })
    async executeSwap(walletClient: EVMWalletClient, parameters: ExecuteSwapParameters) {
        const bestQuote = await this.getQuote(walletClient, parameters);

        const data = `0x${bestQuote.tx.data.replace("0x", "")}` as `0x${string}`;

        const swaptxn = await walletClient.sendTransaction({
            to: bestQuote.tx.to,
            value: BigInt(bestQuote.tx.value),
            data: data,
        });

        return swaptxn.hash;
    }
}
