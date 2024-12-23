import { type Chain, PluginBase } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { IonicService } from "./ionic.service";

interface IonicPluginOptions {
  supportedTokens?: string[]; // Optional list of tokens to support
}

export class IonicPlugin extends PluginBase<EVMWalletClient> {
  constructor({ supportedTokens }: IonicPluginOptions = {}) {
    super("ionic", [new IonicService(supportedTokens)]);
  }

  supportsChain = (chain: Chain) => chain.type === "evm";
}

export function ionic(options: IonicPluginOptions = {}) {
  return new IonicPlugin(options);
} 