const BlockchainController = require("../services/blockchain");
const {
	isAddress,
	recoverMessageAddress,
	formatGwei,
	formatEther,
} = require("viem");

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
				console.log(tokenBalance);
				console.log(data.totalSupply);
				data.balance = formatEther(tokenBalance, "wei");
			}
			data.totalSupply = formatEther(data.totalSupply, "wei");
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
			const withDecimals = body.withDecimals ?? true;
			amount = withDecimals ? BigInt(amount) : parseEther(amount, "wei");
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

	async transferFrom(ctx) {
		try {
			const { from, to, amount, signature } = ctx.request.body;

			if (!isAddress(from) || !isAddress(to)) {
				ctx.body = {
					code: 400,
					response: {
						message: "Invalid address",
					},
				};
				return;
			}

			const message = `You will transfer ${amount} tokens to ${to.toLowerCase()}`;

			const recoveredAddress = await recoverMessageAddress({
				message,
				signature,
			});
			if (recoveredAddress.toLowerCase() !== from.toLowerCase()) {
				ctx.body = {
					code: 400,
					response: {
						message: "Invalid signature",
					},
				};
				return;
			}

			const tokenBalance = await this.blockchainController.getTokenBalance(
				from
			);
			const amountBigInt = BigInt(amount);
			if (tokenBalance < amountBigInt) {
				ctx.body = {
					code: 400,
					response: {
						message: "Insufficient balance",
					},
				};
				return;
			}

			const checkAllowance = await this.blockchainController.checkAllowance(
				from,
				this.blockchainController.walletClient.account.address
			);
			if (checkAllowance < amountBigInt) {
				ctx.body = {
					code: 400,
					response: {
						message: "Insufficient allowance",
					},
				};
				return;
			}

			// Execute transfer
			const tx = await this.blockchainController.transferFrom(
				from,
				to,
				amountBigInt
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
