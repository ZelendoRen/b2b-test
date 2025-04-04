import "dotenv/config";
import { ethers } from "hardhat";
import { ERC20 } from "../typechain-types";

const allowance = ethers.MaxUint256;

const main = async () => {
	const deployer = await ethers.getNamedSigner("deployer");
	const user = await ethers.getNamedSigner("user");

	const erc20: ERC20 = await ethers.getContract("TestERC20");

	try {
		const tx = await erc20.connect(user).approve(deployer.address, allowance);
		await tx.wait();

		console.log(`Allowance added to ${deployer.address}`);
		console.log(`From: ${user.address}`);
		console.log(`To: ${deployer.address}`);
		const currentAllowance = await erc20.allowance(
			user.address,
			deployer.address
		);
		console.log(`Allowance: ${currentAllowance}`);
	} catch (error) {
		console.error("Error adding allowance:", error);
		process.exit(1);
	}
};

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
