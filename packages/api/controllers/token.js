const BlockchainController = require("../services/blockchain");
const { isAddress } = require("viem");

class TokenController {
	constructor() {
		this.blockchainController = new BlockchainController();
	}

	async getTokenInfo(ctx) {
		try {
			let data = { ...(await this.blockchainController.getTokenInfo()) };

			const userAddress = ctx.query.address;
			if (isAddress(userAddress)) {
				const tokenBalance = await this.blockchainController.getTokenBalance(
					userAddress
				);
				data = {
					...data,
					userAddress,
					balance: tokenBalance,
				};
			}

			ctx.body = {
				code: 200,
				response: data,
			};
		} catch (error) {
			ctx.body = {
				code: 500,
				response: {
					message: error instanceof Error ? error.message : "Unknown error",
				},
			};
		}
	}

	async transfer(ctx) {
		try {
			const body = ctx.request.body;
			const fromAddress = body.fromAddress;
			const toAddress = body.toAddress;
			let amount = Number(body.amount);
			console.log(fromAddress, toAddress);
			if (!isAddress(fromAddress) || !isAddress(toAddress)) {
				ctx.body = {
					code: 400,
					response: {
						message: "Invalid address",
					},
				};
				return;
			}
			const tokenBalance = await this.blockchainController.getTokenBalance(
				fromAddress
			);
			const tokenInfo = await this.blockchainController.getTokenInfo();
			const withDecimals = body.withDecimals ?? true;
			amount = withDecimals
				? BigInt(amount)
				: BigInt(amount) * BigInt(10 ** Number(tokenInfo.decimals));
			console.log(tokenBalance, amount);
			if (tokenBalance < amount) {
				ctx.body = {
					code: 400,
					response: {
						message: "Insufficient balance",
					},
				};
				return;
			}
			const checkAllowance = await this.blockchainController.checkAllowance(
				fromAddress,
				this.blockchainController.walletClient.account.address
			);
			console.log(checkAllowance, amount);
			if (checkAllowance < amount) {
				ctx.body = {
					code: 400,
					response: {
						message: "Insufficient allowance",
					},
				};
				return;
			}
			const tx = await this.blockchainController.transferFrom(
				fromAddress,
				toAddress,
				amount
			);
			ctx.body = {
				code: 200,
				response: {
					txHash: tx,
					status: "success",
				},
			};
		} catch (error) {
			ctx.body = {
				code: 500,
				response: {
					message: error instanceof Error ? error.message : "Unknown error",
				},
			};
		}
	}
}

module.exports = TokenController;
