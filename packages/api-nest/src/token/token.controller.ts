import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { TokenService } from "./token.service";
import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Post,
	Query,
} from "@nestjs/common";
import { TokenInfoDto, TransferDto } from "../dto/transfer.dto";
import { formatGwei } from "viem";

@ApiTags("token")
@Controller("token")
export class TokenController {
	constructor(private readonly tokenService: TokenService) {}

	@Get("info")
	@ApiOperation({ summary: "Get token information" })
	@ApiResponse({
		status: 200,
		description: "Token information retrieved successfully",
	})
	@ApiResponse({ status: 500, description: "Internal server error" })
	async getTokenInfo(@Query() tokenInfoDto: TokenInfoDto) {
		try {
			let data = {};

			data = {
				...data,
				...(await this.tokenService.getTokenInfo()),
			};
			if (tokenInfoDto.address) {
				const balance = await this.tokenService.getTokenBalance(
					tokenInfoDto.address
				);
				data = {
					...data,
					balance: balance,
				};
			}
			return data;
		} catch (error) {
			throw new HttpException(
				error.message || "Failed to get token information",
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

	@Post("transfer")
	@ApiOperation({ summary: "Transfer tokens" })
	@ApiResponse({ status: 200, description: "Tokens transferred successfully" })
	@ApiResponse({ status: 400, description: "Invalid request" })
	@ApiResponse({ status: 500, description: "Internal server error" })
	async transfer(@Body() transferDto: TransferDto) {
		try {
			return await this.tokenService.transfer(transferDto);
		} catch (error) {
			throw new HttpException(
				error.message || "Failed to transfer tokens",
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}
}
