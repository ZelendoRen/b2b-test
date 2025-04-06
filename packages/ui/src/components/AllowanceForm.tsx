import { useEffect, useState } from "react";
import { Address, parseEther } from "viem";
import { getTokenContract, getPublicClient } from "../services/contract";

interface AllowanceFormProps {
	fromAddress: `0x${string}`;
}

export const AllowanceForm = ({ fromAddress }: AllowanceFormProps) => {
	const [amount, setAmount] = useState("");
	const [spender, setSpender] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [contract, setContract] = useState<any>();

	useEffect(() => {
		contractSetup();
	}, []);
	const contractSetup = async () => {
		const contract = await getTokenContract();
		setContract(contract);
	};

	const handleGrantAllowance = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess(false);
		setIsLoading(true);

		try {
			if (!amount || !spender) {
				throw new Error("Please fill in all fields");
			}

			await contract.write.approve([
				spender as Address,
				parseEther(amount, "wei"),
			]);

			await setSuccess(true);
			setAmount("");
			setSpender("");
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to grant allowance"
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<h2 className="text-xl font-semibold mb-4">Grant Allowance</h2>
			<form onSubmit={handleGrantAllowance} className="space-y-4">
				<div>
					<label
						htmlFor="spender"
						className="block text-sm font-medium text-gray-700"
					>
						Spender Address
					</label>
					<input
						type="text"
						id="spender"
						value={spender}
						onChange={(e) => setSpender(e.target.value)}
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						placeholder="0x..."
						required
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
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						placeholder="0.0"
						step="0.000000000000000001"
						min="0"
						required
					/>
				</div>
				{error && <p className="text-red-500 text-sm">{error}</p>}
				{success && (
					<p className="text-green-500 text-sm">
						Allowance granted successfully!
					</p>
				)}
				<button
					type="submit"
					disabled={isLoading}
					className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
				>
					{isLoading ? "Granting..." : "Grant Allowance"}
				</button>
			</form>
		</div>
	);
};
