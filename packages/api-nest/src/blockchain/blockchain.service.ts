import { Injectable } from "@nestjs/common";
import {
	Address,
	createPublicClient,
	createWalletClient,
	getContract,
	http,
	WalletClient,
	PublicClient,
	formatGwei,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import config from "../config/config";

type TokenInfo = {
	name: string;
	symbol: string;
	decimals: number;
};
@Injectable()
export class BlockchainService {
	private publicClient: PublicClient;
	private walletClient: WalletClient;
	private contract;
	private tokenInfo: TokenInfo;
	constructor() {
		this.publicClient = createPublicClient({
			chain: config.blockchain.chain,
			transport: http(),
		});
		this.contract = getContract({
			address: config.blockchain.contractAddress,
			abi: config.blockchain.abi.erc20,
			client: this.publicClient,
		});

		const account = privateKeyToAccount(config.blockchain.operator as Address);
		this.walletClient = createWalletClient({
			account,
			chain: config.blockchain.chain,
			transport: http(),
		});
	}

	async getTokenInfo() {
		try {
			if (
				!this.tokenInfo.name ||
				!this.tokenInfo.symbol ||
				!this.tokenInfo.decimals
			) {
				const [name, symbol, decimals] = await Promise.all([
					this.contract.read.name(),
					this.contract.read.symbol(),
					this.contract.read.decimals(),
				]);
			}
			let totalSupply;
			try {
				totalSupply = await this.contract.read.totalSupply();
			} catch (error) {
				totalSupply = BigInt(0);
			}

			return {
				name: this.tokenInfo.name,
				symbol: this.tokenInfo.symbol,
				decimals: this.tokenInfo.decimals,
				totalSupply: (totalSupply / 10 ** this.tokenInfo.decimals).toString(),
			};
		} catch (error) {
			throw error;
		}
	}

	async getTokenBalance(address: Address) {
		try {
			const balance = await this.contract.read.balanceOf([address]);
			return (balance / 10 ** this.tokenInfo.decimals).toString();
		} catch (error) {
			throw new Error("Failed to get token balance");
		}
	}

	async transfer(to: string, amount: number) {
		try {
			const allowance = await this.contract.read.allowance([
				this.walletClient?.account?.address,
				to,
			]);

			if (BigInt(allowance) < BigInt(amount)) {
				throw new Error("Insufficient allowance");
			}

			const hash = await this.contract.write.transfer([to, BigInt(amount)]);

			return { hash };
		} catch (error) {
			throw new Error("Failed to transfer tokens");
		}
	}
}
