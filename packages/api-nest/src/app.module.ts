import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TokenController } from './token/token.controller';
import { TokenService } from './token/token.service';
import { BlockchainService } from './blockchain/blockchain.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [TokenController],
  providers: [TokenService, BlockchainService],
})
export class AppModule {}
