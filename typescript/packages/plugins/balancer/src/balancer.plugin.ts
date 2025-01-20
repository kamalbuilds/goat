import { type Chain, PluginBase } from "@goat-sdk/core";
import { ChainId } from "@balancer/sdk";
import { BalancerService } from "./balancer.service";

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

export class BalancerPlugin extends PluginBase {
    constructor(config: BalancerConfig = DEFAULT_CONFIG) {
        super("balancer", [new BalancerService(config)]);
    }

    supportsChain = () => true;
}

export function balancer(config?: BalancerConfig) {
    return new BalancerPlugin(config);
}
