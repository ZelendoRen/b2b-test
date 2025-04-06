import { localhost, polygonAmoy } from "viem/chains";
import * as contractInfoLocal from "blockchain/deployments/localhost/TestERC20.json";
import * as contractInfoProd from "blockchain/deployments/localhost/TestERC20.json";
import * as contractInfoDev from "blockchain/deployments/localhost/TestERC20.json";

const CONTRACT_INFO = {
	LOCAL: contractInfoLocal,
	PROD: contractInfoProd,
	DEV: contractInfoDev,
};

const ENV = import.meta.env.ENV?.toUpperCase() as keyof typeof CONTRACT_INFO;
const config = {
	blockchain: {
		contractAddress: CONTRACT_INFO[ENV || "LOCAL"]?.address,
		operator: import.meta.env.OPERATOR_PRIVATE_KEY,
		chain:
			import.meta.env.ENV === "PROD" || import.meta.env.ENV === "DEV"
				? polygonAmoy
				: localhost,
		abi: {
			erc20: CONTRACT_INFO[ENV || "LOCAL"]?.abi,
		},
	},
};

export default config;
