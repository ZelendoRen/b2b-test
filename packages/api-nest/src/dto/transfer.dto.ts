import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { Address } from "viem";

export class TransferDto {
	@ApiProperty({ description: "Recipient address" })
	@IsString()
	@IsNotEmpty()
	to: string;

	@ApiProperty({ description: "Amount to transfer" })
	@IsNumber()
	@IsNotEmpty()
	amount: number;
}

export class TokenInfoDto {
	@ApiProperty({ description: "Token address", required: false })
	@IsOptional()
	address: Address;
}
