import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Client } from './entities/client.entity';
import { ClientEmbedding } from './entities/client-embedding.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
export declare class ClientService implements OnModuleInit {
    private readonly clientRepository;
    private readonly clientEmbeddingRepository;
    private readonly configService;
    private genAI;
    constructor(clientRepository: Repository<Client>, clientEmbeddingRepository: Repository<ClientEmbedding>, configService: ConfigService);
    onModuleInit(): Promise<void>;
    create(createClientDto: CreateClientDto): Promise<Client>;
    findAll(): Promise<Client[]>;
    findOne(code: string): Promise<Client>;
    update(code: string, updateClientDto: UpdateClientDto): Promise<Client>;
    remove(code: string): Promise<Client>;
    generateEmbedding(text: string): Promise<number[]>;
    private prepareClientText;
    createEmbeddingForClient(code: string): Promise<ClientEmbedding>;
    createAllEmbeddings(): Promise<void>;
    findSimilar(search: string): Promise<any[]>;
}
