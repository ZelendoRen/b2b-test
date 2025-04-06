import { useState } from "react";
import { getTokenInfo } from "./services/api";
import { connectWallet } from "./services/wallet";
import TransferForm from "./components/TransferForm";
import { TransferFromForm } from "./components/TransferFromForm";
import MintForm from "./components/MintForm";
import { Address, zeroAddress } from "viem";
import { AllowanceForm } from "./components/AllowanceForm";

interface TokenInfo {
	name: string;
	symbol: string;
	decimals: number;
	totalSupply: string;
	balance: string;
}

function App() {
	const [address, setAddress] = useState<Address>(zeroAddress);
	const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleConnectWallet = async () => {
		try {
			const walletAddress = await connectWallet();
			setAddress(walletAddress.account.address as Address);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to connect wallet");
		}
	};

	const handleGetTokenInfo = async () => {
		if (!address) {
			setError("Please connect your wallet first");
			return;
		}

		setLoading(true);
		setError(null);
		try {
			const info = await getTokenInfo(address);
			setTokenInfo(info);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to fetch token info"
			);
		} finally {
			setLoading(false);
		}
	};

	if (address === zeroAddress || address === undefined) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="bg-white shadow rounded-lg p-6 w-full max-w-md">
					<h1 className="text-2xl font-bold mb-4 text-center">
						Token Management
					</h1>
					<div className="space-y-4">
						<button
							className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
							onClick={handleConnectWallet}
						>
							Connect MetaMask
						</button>
						{error && (
							<div className="p-4 bg-red-50 text-red-700 rounded-md">
								{error}
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="bg-white shadow rounded-lg p-6">
						<h1 className="text-2xl font-bold mb-4 text-center">
							Token Management
						</h1>

						<div className="mb-4">
							<label
								htmlFor="address"
								className="block text-sm font-medium text-gray-700"
							>
								Connected Wallet
							</label>
							<div className="mt-1 p-2 bg-gray-50 rounded-md">{address}</div>
						</div>

						{error && (
							<div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
								{error}
							</div>
						)}

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
							<div className="bg-gray-50 p-4 rounded-lg">
								<h2 className="text-lg font-medium mb-2 text-center">
									Token Info
								</h2>
								<div className="flex justify-center">
									<button
										className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
										onClick={handleGetTokenInfo}
										disabled={loading}
									>
										{loading ? "Loading..." : "Get Token Info"}
									</button>
								</div>

								{tokenInfo && (
									<div className="mt-4 space-y-2">
										<p>
											<span className="font-medium">Name:</span>{" "}
											{tokenInfo.name}
										</p>
										<p>
											<span className="font-medium">Symbol:</span>{" "}
											{tokenInfo.symbol}
										</p>
										<p>
											<span className="font-medium">Decimals:</span>{" "}
											{tokenInfo.decimals}
										</p>
										<p>
											<span className="font-medium">Total Supply:</span>{" "}
											{tokenInfo.totalSupply}
										</p>
										<p>
											<span className="font-medium">User Balance:</span>{" "}
											{tokenInfo.balance}
										</p>
									</div>
								)}
							</div>

							<div className="bg-gray-50 p-4 rounded-lg">
								<h2 className="text-lg font-medium mb-2 text-center">
									Mint Tokens
								</h2>
								<div className="flex justify-center">
									<MintForm fromAddress={address} />
								</div>
							</div>

							<div className="bg-gray-50 p-4 rounded-lg">
								<h2 className="text-lg font-medium mb-2 text-center">
									Transfer Tokens
								</h2>
								<div className="flex justify-center">
									<TransferForm fromAddress={address} />
								</div>
							</div>

							<div className="bg-gray-50 p-4 rounded-lg">
								<h2 className="text-lg font-medium mb-2 text-center">
									Transfer From
								</h2>
								<div className="flex justify-center">
									<TransferFromForm fromAddress={address} />
								</div>
							</div>

							<div className="bg-gray-50 p-4 rounded-lg">
								<h2 className="text-lg font-medium mb-2 text-center">
									Allowance
								</h2>
								<div className="flex justify-center">
									<AllowanceForm fromAddress={address} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
