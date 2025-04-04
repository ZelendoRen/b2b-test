import { ethers, network } from "hardhat";

class Reverting {
	private snapshotId: number;

	constructor() {
		this.snapshotId = 0;
	}

	async snapshot() {
		this.snapshotId = await network.provider.send("evm_snapshot", []);
	}

	async revert() {
		await network.provider.send("evm_revert", [this.snapshotId]);
	}

	async setTime(timestamp: number) {
		await network.provider.send("evm_mine", [timestamp]);
	}

	async getTime() {
		const block = await ethers.provider.getBlock("latest");
		return block?.timestamp;
	}
}

export default Reverting;
