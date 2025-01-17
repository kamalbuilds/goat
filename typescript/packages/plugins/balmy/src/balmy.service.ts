import { QuoteRequest, buildSDK } from "@balmy/sdk";
import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { ExecuteSwapParameters, GetAllowanceParameters, GetBalanceParameters, GetQuoteParameters } from "./parameters";

type TokenBalance = {
    [address: string]: string;
};

type TokenBalances = {
    [token: string]: TokenBalance;
};

type ChainBalances = {
    [chainId: string]: TokenBalances;
};

export class BalmyService {
    private sdk;

    private config = {
        quotes: {
            sourceList: {
                type: "local" as const,
            },
            defaultConfig: {
                global: {
                    slippagePercentage: 0.5,
                    txValidFor: "180s",
                    disableValidation: true,
                },
                custom: {
                    bebop: {
                        enabled: false,
                        apiKey: "",
                    },
                    "0x": {
                        enabled: true,
                        apiKey: "",
                        baseUrl: "https://api.0x.org",
                    },
                    "li-fi": {
                        apiKey: "",
                    },
                    paraswap: {
                        enabled: false,
                        sourceAllowlist: [],
                        sourceDenylist: [],
                    },
                    "1inch": {
                        enabled: false,
                        customUrl: "https://api.1inch.exchange/v3.0/56",
                        sourceAllowlist: [],
                    },
                },
            },
        },
        provider: {
            source: {
                type: "http" as const,
                url: "https://mainnet.mode.network/",
                supportedChains: [34443],
            },
            defaultConfig: {
                chainId: 34443,
                rpcUrl: "https://mainnet.mode.network/",
            },
        },
    };

    constructor() {
        this.sdk = buildSDK(this.config);
    }

    @Tool({
        description: "Get token balances for an account",
    })
    async getBalances(walletClient: EVMWalletClient, parameters: GetBalanceParameters) {
        const chainid = await walletClient.getChain().id;

        const balances = await this.sdk.balanceService.getBalances({
            tokens: [
                {
                    chainId: chainid,
                    account: parameters.account,
                    token: parameters.token,
                },
            ],
        });

        return Object.entries(balances).reduce((acc: ChainBalances, [chainId, tokens]) => {
            acc[chainId] = Object.entries(tokens).reduce((tokenAcc: TokenBalances, [token, balance]) => {
                tokenAcc[token] = Object.entries(balance).reduce((balAcc: TokenBalance, [address, amount]) => {
                    balAcc[address] = amount.toString();
                    return balAcc;
                }, {});
                return tokenAcc;
            }, {});
            return acc;
        }, {});
    }

    @Tool({
        description: "Get token allowance for my account",
    })
    async getAllowances(walletClient: EVMWalletClient, parameters: GetAllowanceParameters) {
        return await this.sdk.allowanceService.getAllowanceInChain({
            chainId: parameters.chainId,
            token: parameters.token,
            owner: parameters.owner,
            spender: parameters.spender,
        });
    }

    @Tool({
        description: "Get quotes for a token swap",
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

        const quotes = await this.sdk.quoteService.getAllQuotesWithTxs({
            request: request,
            config: {
                timeout: "10s",
            },
        });

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
        description: "Execute a swap using the best quote, also ensure that ERC20 approval is done before calling this",
    })
    async executeSwap(walletClient: EVMWalletClient, parameters: ExecuteSwapParameters) {
        const bestQuote = await this.getQuote(walletClient, parameters);

        const data = bestQuote.tx.data as `0x${string}`;

        const swaptxn = await walletClient.sendTransaction({
            to: bestQuote.tx.to,
            value: BigInt(bestQuote.tx.value),
            data: data,
        });

        return swaptxn.hash;
    }
}
