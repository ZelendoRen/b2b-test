import { ethers } from "hardhat";
import { TestERC20 } from "../typechain-types";
import "dotenv/config";
import { AddressLike } from "ethers";
import config from "../config";

const amount: bigint = BigInt(10000 * 10 ** config.tokenDecimals);

const main = async () => {
	const deployer = await ethers.getNamedSigner("deployer");
	const user = await ethers.getNamedSigner("user");

	const erc20: TestERC20 = await ethers.getContract("TestERC20");

	const tx = await erc20.connect(deployer).mint(user.address, amount);
	await tx.wait();

	const balance = await erc20.balanceOf(user.address);
	console.log(`Balance: ${balance}`);

	console.log(`Minted ${amount} tokens to ${user.address}`);
};

main();
