import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { Contract } from "ethers";
import Reverting from "../utils/reverting";
import config from "../config";

const reverting = new Reverting();

describe("TestERC20", function () {
	let deployer: HardhatEthersSigner;
	let testERC20: Contract;

	describe("Deployment", function () {
		before(async () => {
			await deployments.fixture(["TestERC20"]);
			deployer = await ethers.getNamedSigner("deployer");
			testERC20 = await ethers.getContract("TestERC20");
			await reverting.snapshot();
		});

		afterEach(async () => {
			await reverting.revert();
		});

		describe("Minting", function () {
			it("Should mint 1000 tokens to the deployer", async () => {
				const balanceBefore: bigint = await testERC20.balanceOf(
					deployer.address
				);
				const tx = await testERC20.mint(deployer.address, 1000);
				await tx.wait();
				const balanceAfter: bigint = await testERC20.balanceOf(
					deployer.address
				);
				expect(balanceAfter).to.equal(balanceBefore + 1000n);
			});
		});

		describe("Approvals", function () {
			it("Should approve 100 tokens to the second account", async () => {
				const balanceBefore: bigint = await testERC20.balanceOf(
					deployer.address
				);
				const tx = await testERC20.approve(deployer.address, 100);
				await tx.wait();
				const balanceAfter: bigint = await testERC20.balanceOf(
					deployer.address
				);
				expect(balanceAfter).to.equal(balanceBefore);
			});
		});

		describe("Getters", function () {
			it("Should return the right name", async () => {
				expect(await testERC20.name()).to.equal(config.tokenName);
			});

			it("Should return the right symbol", async () => {
				expect(await testERC20.symbol()).to.equal(config.tokenSymbol);
			});

			it("Should return the right decimals", async () => {
				expect(await testERC20.decimals()).to.equal(
					BigInt(config.tokenDecimals)
				);
			});
		});
	});
});
