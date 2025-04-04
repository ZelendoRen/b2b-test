import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import config from "../config";

const main = async ({ deployments, ethers }: HardhatRuntimeEnvironment) => {
	const { deploy } = deployments;
	const { tokenName, tokenSymbol, tokenDecimals } = config;
	const deployer: HardhatEthersSigner = await ethers.getNamedSigner("deployer");

	const testERC20 = await deploy("TestERC20", {
		from: deployer.address,
		args: [tokenName, tokenSymbol, tokenDecimals],
		log: true,
	});

	console.log("TestERC20 deployed to:", testERC20.address);
};

main.tags = ["TestERC20"];

export default main;
