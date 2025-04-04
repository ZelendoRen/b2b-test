import { Injectable } from "@nestjs/common";
import { Address, createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import config from "../config/config";

@Injectable()
export class BlockchainService {
	private publicClient;
	private walletClient;
	private contractAddress;
	private contractAbi;

	constructor() {
		this.publicClient = createPublicClient({
			chain: config.blockchain.chain,
			transport: http(),
		});

		const account = privateKeyToAccount(config.blockchain.operator as Address);
		this.walletClient = createWalletClient({
			account,
			chain: config.blockchain.chain,
			transport: http(),
		});

		this.contractAddress = config.blockchain.contractAddress;
		this.contractAbi = config.blockchain.abi;
	}

	async getTokenInfo() {
		const [name, symbol, decimals, totalSupply] = await Promise.all([
			this.publicClient.readContract({
				address: this.contractAddress,
				abi: this.contractAbi,
				functionName: "name",
			}),
			this.publicClient.readContract({
				address: this.contractAddress,
				abi: this.contractAbi,
				functionName: "symbol",
			}),
			this.publicClient.readContract({
				address: this.contractAddress,
				abi: this.contractAbi,
				functionName: "decimals",
			}),
			this.publicClient.readContract({
				address: this.contractAddress,
				abi: this.contractAbi,
				functionName: "totalSupply",
			}),
		]);

		return {
			name,
			symbol,
			decimals,
			totalSupply: totalSupply.toString(),
		};
	}

	async getTokenBalance(address: Address) {
		return this.publicClient.readContract({
			address: this.contractAddress,
			abi: this.contractAbi,
			functionName: "balanceOf",
			args: [address],
		});
	}

	async transfer(to: string, amount: number) {
		const allowance = await this.publicClient.readContract({
			address: this.contractAddress,
			abi: this.contractAbi,
			functionName: "allowance",
			args: [this.walletClient.account.address, to],
		});

		if (BigInt(allowance) < BigInt(amount)) {
			throw new Error("Insufficient allowance");
		}

		const hash = await this.walletClient.writeContract({
			address: this.contractAddress,
			abi: this.contractAbi,
			functionName: "transfer",
			args: [to, BigInt(amount)],
		});

		return { hash };
	}
}
