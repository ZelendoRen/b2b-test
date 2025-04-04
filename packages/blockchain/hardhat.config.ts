import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "hardhat-gas-reporter";
import "hardhat/config";
import "solidity-coverage";
import { namedAccounts } from "./utils/accounts";

const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY as string;
const config: HardhatUserConfig = {
	solidity: "0.8.28",
	networks: {
		dev: {
			url: "https://polygon-amoy.gateway.tenderly.co",
			accounts: deployerPrivateKey ? [deployerPrivateKey] : [],
			chainId: 80002,
		},
		prod: {
			url: "https://polygon-amoy.gateway.tenderly.co",
			accounts: deployerPrivateKey ? [deployerPrivateKey] : [],
			chainId: 80002,
		},
		hardhat: {
			chainId: 1337,
		},
	},
	paths: {
		deploy: "deploy",
		deployments: "deployments",
		imports: "imports",
	},
	namedAccounts: namedAccounts,
};

export default config;
