import { type Chain, PluginBase } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { DragonswapService } from "./dragonswap.service";

export type DragonswapConfig = {
    routerAddress?: string;
    factoryAddress?: string;
    wseiAddress?: string;
    rpcUrl?: string;
};

const DEFAULT_CONFIG: DragonswapConfig = {
    routerAddress: "0x7e1090746AB11DC1BbDAcE625644c066ad4cbF6b", // Default router address
    factoryAddress: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f", // Default factory address
    wseiAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // Default WSEI address
};

export class DragonswapPlugin extends PluginBase<EVMWalletClient> {
    constructor(private readonly config: DragonswapConfig = DEFAULT_CONFIG) {
        super("dragonswap", [new DragonswapService(config)]);
    }

    supportsChain = (chain: Chain) => chain.type === "evm";
}

export function dragonswap(config?: DragonswapConfig) {
    return new DragonswapPlugin(config);
} 