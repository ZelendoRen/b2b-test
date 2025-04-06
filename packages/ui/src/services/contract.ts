import {
	Address,
	createPublicClient,
	createWalletClient,
	custom,
	getContract,
	http,
} from "viem";
import { mainnet, localhost } from "viem/chains";
import config from "../config";

const getChain = () => {
	if (import.meta.env.DEV) {
		return {
			...config.blockchain.chain,
			rpcUrls: {
				default: { http: [config.blockchain.chain.rpcUrls.default.http[0]] },
				public: { http: [config.blockchain.chain.rpcUrls.default.http[0]] },
			},
		};
	}
	return mainnet;
};

export const getPublicClient = () => {
	const chain = getChain();
	return createPublicClient({
		chain,
		transport: http(),
	});
};

export const getWalletClient = async () => {
	if (!window.ethereum) {
		throw new Error("MetaMask is not installed");
	}

	const chain = getChain();
	const walletClient = createWalletClient({
		chain,
		transport: custom(window.ethereum!),
		account: window.ethereum.selectedAddress,
	});

	return walletClient;
};

export const getTokenContract = async () => {
	const walletClient = await getWalletClient();
	const tokenAddress = config.blockchain.contractAddress;

	if (!tokenAddress) {
		throw new Error("Token address is not configured");
	}

	return await getContract({
		address: tokenAddress as Address,
		abi: config.blockchain.abi.erc20,
		client: walletClient,
	});
};
