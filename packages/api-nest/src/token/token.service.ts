import { Injectable } from "@nestjs/common";
import { BlockchainService } from "../blockchain/blockchain.service";
import { TransferDto } from "../dto/transfer.dto";
import { Address } from "viem";

@Injectable()
export class TokenService {
	constructor(private readonly blockchainService: BlockchainService) {}

	async getTokenInfo() {
		return this.blockchainService.getTokenInfo();
	}

	async getTokenBalance(address: Address) {
		return this.blockchainService.getTokenBalance(address);
	}

	async transfer(transferDto: TransferDto) {
		return this.blockchainService.transfer(transferDto.to, transferDto.amount);
	}
}
