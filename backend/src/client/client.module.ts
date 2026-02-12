import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';

import { ClientEmbedding } from './entities/client-embedding.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, ClientEmbedding])],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
