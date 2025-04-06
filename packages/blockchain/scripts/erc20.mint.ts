import { ethers } from "hardhat";
import { TestERC20 } from "../typechain-types";
import "dotenv/config";
import config from "../config";

const amount: bigint = BigInt(10000 * 10 ** config.tokenDecimals);

const main = async () => {
	const deployer = await ethers.getNamedSigner("deployer");
	const userAddress =
		process.env.ACTIONS_ADDRESS || (await ethers.getSigner("user")).address;

	const erc20: TestERC20 = await ethers.getContract("TestERC20");

	const tx = await erc20.connect(deployer).mint(userAddress, amount);
	await tx.wait();

	const tx2 = await deployer.sendTransaction({
		to: userAddress,
		value: ethers.parseEther("100"),
	});
	await tx2.wait();

	const balance = await erc20.balanceOf(userAddress);
	console.log(`Balance: ${balance}`);

	console.log(`Minted ${amount} tokens to ${userAddress}`);
};

main();
