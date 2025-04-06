import { useEffect, useState } from "react";
import { getTokenContract } from "../services/contract";
import { Address, parseEther } from "viem";

interface TransferFormProps {
	fromAddress: Address;
}

export default function TransferForm({ fromAddress }: TransferFormProps) {
	const [toAddress, setToAddress] = useState("");
	const [amount, setAmount] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [tokenContract, setTokenContract] = useState<any>(null);

	useEffect(() => {
		contractSetup();
	}, []);

	const contractSetup = async () => {
		const contract = await getTokenContract();
		setTokenContract(contract);
	};

	const handleTransfer = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!toAddress || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
			setError("Please enter valid address and amount");
			return;
		}

		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			const amountInWei = parseEther(amount, "wei");
			await tokenContract.write.transfer([toAddress as Address, amountInWei], {
				account: fromAddress,
			});

			setSuccess(true);
			setToAddress("");
			setAmount("");
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to transfer tokens"
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleTransfer} className="space-y-4">
			<div>
				<label
					htmlFor="toAddress"
					className="block text-sm font-medium text-gray-700"
				>
					To Address
				</label>
				<input
					type="text"
					id="toAddress"
					value={toAddress}
					onChange={(e) => setToAddress(e.target.value)}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					placeholder="Enter recipient address"
				/>
			</div>

			<div>
				<label
					htmlFor="amount"
					className="block text-sm font-medium text-gray-700"
				>
					Amount
				</label>
				<input
					type="number"
					id="amount"
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					placeholder="Enter amount to transfer"
					min="0"
					step="0.000000000000000001"
				/>
			</div>

			{error && (
				<div className="p-4 bg-red-50 text-red-700 rounded-md">{error}</div>
			)}

			{success && (
				<div className="p-4 bg-green-50 text-green-700 rounded-md">
					Tokens transferred successfully!
				</div>
			)}

			<button
				type="submit"
				className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
				disabled={loading}
			>
				{loading ? "Processing..." : "Transfer Tokens"}
			</button>
		</form>
	);
}
