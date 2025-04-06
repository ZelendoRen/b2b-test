interface TokenInfo {
	name: string;
	symbol: string;
	decimals: number;
	totalSupply: string;
	balance: string;
}

interface TransferResponse {
	success: boolean;
	message: string;
}

interface TransferFromRequest {
	from: string;
	to: string;
	amount: string;
	signature: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getTokenInfo = async (address: string): Promise<TokenInfo> => {
	const response = await fetch(`${API_URL}/token?address=${address}`);
	if (!response.ok) {
		throw new Error("Failed to fetch token info");
	}
	return response.json().then((data) => data.response);
};

export const transferTokens = async (
	from: string,
	to: string,
	amount: string
): Promise<TransferResponse> => {
	const response = await fetch(`${API_URL}/token/transfer`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ from, to, amount }),
	});
	if (!response.ok) {
		throw new Error("Failed to transfer tokens");
	}
	return response.json();
};

export const transferFrom = async (
	data: TransferFromRequest
): Promise<TransferResponse> => {
	const response = await fetch(`${API_URL}/token/transfer-from`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
	if (!response.ok) {
		throw new Error("Failed to transfer tokens");
	}
	return response.json();
};
