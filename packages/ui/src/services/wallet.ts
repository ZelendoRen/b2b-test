import {
	createPublicClient,
	createWalletClient,
	custom,
	http,
	toHex,
} from "viem";
import { mainnet, localhost } from "viem/chains";

export const getChain = () => {
	if (import.meta.env.DEV) {
		return localhost;
	}
	return mainnet;
};

export const getPublicClient = async () => {
	const chain = getChain();
	return createPublicClient({
		chain,
		transport: custom(window.ethereum!),
	});
};

export const connectWallet = async () => {
	try {
		const chain = getChain();
		const accounts = await window.ethereum.request({
			method: "eth_requestAccounts",
		});
		const walletClient = createWalletClient({
			account: accounts[0],
			chain,
			transport: custom(window.ethereum!),
		});
		try {
			await walletClient.switchChain({
				id: chain.id,
			});
		} catch (error) {
			await walletClient.addChain({ chain });
		}
		return walletClient;
	} catch (error) {
		throw new Error("Failed to connect wallet");
	}
};
declare global {
	interface Window {
		ethereum?: any;
	}
}
