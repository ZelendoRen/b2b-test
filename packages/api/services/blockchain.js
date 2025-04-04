const {
	createPublicClient,
	http,
	getContract,
	createWalletClient,
} = require("viem");
const { privateKeyToAccount } = require("viem/accounts");
const config = require("../config");

class BlockchainController {
	constructor() {
		console.log(config.blockchain.chain);
		this.publicClient = createPublicClient({
			chain: config.blockchain.chain,
			transport: http(),
		});

		const account = privateKeyToAccount(config.blockchain.operator);
		this.walletClient = createWalletClient({
			account,
			chain: config.blockchain.chain,
			transport: http(),
		});

		this.contract = getContract({
			address: config.blockchain.contractAddress,
			abi: config.blockchain.abi.erc20,
			client: {
				public: this.publicClient,
				wallet: this.walletClient,
			},
		});

		this.tokenInfo = null;
	}

	async getTokenInfo() {
		if (!this.tokenInfo) {
			const [name, symbol, decimals] = await Promise.all([
				this.contract.read.name(),
				this.contract.read.symbol(),
				this.contract.read.decimals(),
			]);

			this.tokenInfo = {
				name,
				symbol,
				decimals,
				address: config.blockchain.contractAddress,
			};
		}

		return this.tokenInfo;
	}

	async getTokenBalance(address) {
		return this.contract.read.balanceOf([address]);
	}

	async checkAllowance(owner, spender) {
		try {
			const allowance = await this.contract.read.allowance([owner, spender]);
			return allowance || BigInt(0);
		} catch (error) {
			console.error("Error checking allowance:", error);
			return BigInt(0);
		}
	}

	async transferFrom(from, to, amount) {
		try {
			const tx = await this.contract.write.transferFrom([
				from,
				to,
				amount.toString(),
			]);
			return tx;
		} catch (error) {
			console.error("Error in transferFrom:", error);
			throw new Error(`Transfer failed: ${error.message}`);
		}
	}
}

module.exports = BlockchainController;
