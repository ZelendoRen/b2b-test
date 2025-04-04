const { localhost, polygonAmoy } = require("viem/chains");

const CONTRACT_INFO = {
	LOCAL: require("blockchain/deployments/localhost/TestERC20.json"),
	PROD: require("blockchain/deployments/localhost/TestERC20.json"),
	DEV: require("blockchain/deployments/localhost/TestERC20.json"),
};

const config = {
	blockchain: {
		contractAddress:
			CONTRACT_INFO[process.env.ENV?.toUpperCase() || "LOCAL"]?.address,
		operator:
			process.env.OPERATOR_PRIVATE_KEY ||
			"0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
		chain: process.env.ENV?.toLowerCase() === "local" ? localhost : polygonAmoy,
		abi: {
			erc20: CONTRACT_INFO[process.env.ENV?.toUpperCase() || "LOCAL"]?.abi,
		},
	},
	api: {
		port: Number(process.env.PORT) || 3000,
		maxConcurrent: Number(process.env.MAX_CONCURRENT) || 1,
		minTime: Number(process.env.MIN_TIME) || 1000,
	},
};

module.exports = config;
