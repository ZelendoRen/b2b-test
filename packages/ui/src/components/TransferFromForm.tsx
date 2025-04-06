import { useEffect, useState } from "react";
import { getWalletClient } from "../services/contract";
import { Address, parseEther } from "viem";
import { transferFrom } from "../services/api";

interface TransferFromFormProps {
	fromAddress: Address;
}

export const TransferFromForm = ({ fromAddress }: TransferFromFormProps) => {
	const [toAddress, setToAddress] = useState("");
	const [amount, setAmount] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [walletClient, setWalletClient] = useState<any>(null);

	useEffect(() => {
		const setupWallet = async () => {
			const client = await getWalletClient();
			setWalletClient(client);
		};
		setupWallet();
	}, []);

	const handleTransferFrom = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(null);

		try {
			if (!walletClient) {
				throw new Error("Wallet not connected");
			}

			if (!toAddress || !amount) {
				throw new Error("Please fill in all fields");
			}

			const amountInWei = parseEther(amount, "wei");

			const message = `You will transfer ${amountInWei.toString()} tokens to ${toAddress.toLowerCase()}`;

			const signature = await walletClient.signMessage({
				account: walletClient.account,
				message,
			});

			await transferFrom({
				from: fromAddress,
				to: toAddress,
				amount: amountInWei.toString(),
				signature,
			});

			setSuccess(`Transfer successful!`);
			setToAddress("");
			setAmount("");
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
			<h2 className="text-2xl font-bold mb-4">Transfer From</h2>
			<form onSubmit={handleTransferFrom} className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700">
						To Address
					</label>
					<input
						type="text"
						value={toAddress}
						onChange={(e) => setToAddress(e.target.value)}
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						placeholder="0x..."
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Amount
					</label>
					<input
						type="number"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						placeholder="0.0"
						step="0.000000000000000001"
						min="0"
					/>
				</div>
				{error && <div className="text-red-500 text-sm">{error}</div>}
				{success && <div className="text-green-500 text-sm">{success}</div>}
				<button
					type="submit"
					disabled={loading}
					className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
				>
					{loading ? "Processing..." : "Transfer"}
				</button>
			</form>
		</div>
	);
};
