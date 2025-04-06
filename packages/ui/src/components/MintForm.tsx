import { useEffect, useState } from "react";
import { getTokenContract } from "../services/contract";
import { Address, parseEther } from "viem";

interface MintFormProps {
	fromAddress: Address;
}

export default function MintForm({ fromAddress }: MintFormProps) {
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

	const handleMint = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
			setError("Please enter a valid amount");
			return;
		}

		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			await tokenContract.write.mint([fromAddress, parseEther(amount, "wei")]);

			setSuccess(true);
			setAmount("");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to mint tokens");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleMint} className="space-y-4">
			<div>
				<label
					htmlFor="amount"
					className="block text-sm font-medium text-gray-700"
				>
					Amount to Mint
				</label>
				<input
					type="number"
					id="amount"
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
					placeholder="Enter amount"
					min="0"
					step="0.000000000000000001"
				/>
			</div>

			{error && (
				<div className="p-4 bg-red-50 text-red-700 rounded-md">{error}</div>
			)}

			{success && (
				<div className="p-4 bg-green-50 text-green-700 rounded-md">
					Tokens minted successfully!
				</div>
			)}

			<button
				type="submit"
				className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
				disabled={loading}
			>
				{loading ? "Minting..." : "Mint Tokens"}
			</button>
		</form>
	);
}
