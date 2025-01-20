import { ChainId } from "@balancer/sdk";
import { Chain, PluginBase } from "@goat-sdk/core";
import { BalancerService } from "./balancer.service";
import { mode , base } from "viem/chains";
type BalancerConfig = {
    apiUrl: string;
    rpcUrl: string;
    defaultChainId: ChainId;
};

const DEFAULT_CONFIG: BalancerConfig = {
    apiUrl: "https://api-v3.balancer.fi/",
    rpcUrl: "https://rpc.ankr.com/polygon",
    defaultChainId: ChainId.POLYGON,
};

const SUPPORTED_CHAINS = [mode, base];

export class BalancerPlugin extends PluginBase {
    constructor(config: BalancerConfig = DEFAULT_CONFIG) {
        super("balancer", [new BalancerService(config)]);
    }

    supportsChain = (chain: Chain) => chain.type === "evm" && SUPPORTED_CHAINS.some((c) => c.id === chain.id);
}

export function balancer(config?: BalancerConfig) {
    return new BalancerPlugin(config);
}
