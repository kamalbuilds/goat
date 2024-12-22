import readline from "node:readline";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mode } from "viem/chains";
import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { MODE, erc20 } from "@goat-sdk/plugin-erc20";
import { modeGovernance } from "../../../packages/plugins/mode-governance";
import { viem } from "@goat-sdk/wallet-viem";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

require("dotenv").config();

const account = privateKeyToAccount(
    process.env.WALLET_PRIVATE_KEY as `0x${string}`
);

const walletClient = createWalletClient({
    account,
    transport: http(process.env.RPC_PROVIDER_URL),
    chain: mode,
});

const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

(async () => {
    const tools = await getOnChainTools({
        wallet: viem(walletClient),
        plugins: [
            erc20({ 
                tokens: [{
                    ...MODE,
                    // spenders: ["0xff8AB822b8A853b01F9a9E9465321d6Fe77c9D2F"] // MODE_VOTING_ESCROW address
                }]
            }), 
            modeGovernance(),
        ],
    });

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    while (true) {
        const prompt = await new Promise<string>((resolve) => {
            rl.question('Enter your prompt (or "exit" to quit): ', resolve);
        });

        if (prompt === "exit") {
            rl.close();
            break;
        }

        console.log("\n===========================================");
        console.log("🤖 Processing prompt:", prompt);
        console.log("===========================================\n");

        console.log("\n-------------------\n");
        console.log("🛠️  TOOLS CALLED");
        console.log("-------------------");

        try {
            const result = await generateText({
                model: openai("gpt-4o"),
                tools: tools,
                maxSteps: 15,
                prompt: prompt,
                onStepFinish: (event) => {
                    console.log("\n👉 Step Result:");
                    console.log(JSON.stringify(event.toolResults, null, 2));
                },
            });

            console.log("\n📊 FINAL RESPONSE");
            console.log("-------------------");
            console.log(result.text);
        } catch (error) {
            console.log("\n❌ ERROR");
            console.log("-------------------");
            console.error(error);
        }
        console.log("\n===========================================\n");
    }
})(); 