import { type Chain, PluginBase } from "@goat-sdk/core";
import { BalmyService } from "./balmy.service";

const SUPPORTED_CHAIN_IDS = [
    1,      // Ethereum
    10,     // Optimism
    42161,  // Arbitrum
    42170,  // Arbitrum Nova
    137,    // Polygon
    56,     // BNB Chain
    8453,   // Base
    250,    // Fantom
    42220,  // Celo
    1088,   // Metis
    43114,  // Avalanche
    128,    // Heco
    66,     // OKC
    1285,   // Moonriver
    1284,   // Moonbeam
    122,    // Fuse
    106,    // Velas
    100,    // Gnosis
    25,     // Cronos
    288,    // Boba
    58,     // Ontology
    8217,   // Kaia
    1313161554, // Aurora
    592,    // Astar
    1666600000, // Harmony
    199,    // BitTorrent
    42262,  // Oasis
    204,    // opBNB
    7700,   // Canto
    9001,   // Evmos
    30,     // Rootstock
    1101,   // Polygon zkEVM
    2222,   // Kava
    59144,  // Linea
    34443,  // Mode
    81457,  // Blast
    534352, // Scroll
    5000,   // Mantle
    // Testnets
    5,      // Goerli
    11155111, // Sepolia
    80001,  // Mumbai
    84531   // Base Goerli
];

export class BalmyPlugin extends PluginBase {
    constructor() {
        super("balmy", [new BalmyService()]);
    }

    supportsChain = (chain: Chain) => 
        chain.type === "evm" && SUPPORTED_CHAIN_IDS.includes(chain.id);
}

export function balmy() {
    return new BalmyPlugin();
}
