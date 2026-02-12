"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const client_entity_1 = require("./entities/client.entity");
const client_embedding_entity_1 = require("./entities/client-embedding.entity");
const generative_ai_1 = require("@google/generative-ai");
let ClientService = class ClientService {
    constructor(clientRepository, clientEmbeddingRepository, configService) {
        this.clientRepository = clientRepository;
        this.clientEmbeddingRepository = clientEmbeddingRepository;
        this.configService = configService;
        const apiKey = this.configService.get('GEMINI_API_KEY');
        if (apiKey) {
            this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        }
    }
    async onModuleInit() {
        try {
            await this.clientRepository.query('CREATE EXTENSION IF NOT EXISTS vector;');
            console.log('PostgreSQL vector extension enabled (or already exists).');
        }
        catch (error) {
            console.error('Failed to enable PostgreSQL vector extension:', error);
        }
    }
    async create(createClientDto) {
        const existing = await this.clientRepository.findOne({
            where: { code: createClientDto.code },
        });
        if (existing) {
            throw new common_1.ConflictException(`Client with code ${createClientDto.code} already exists`);
        }
        const client = this.clientRepository.create(createClientDto);
        const savedClient = await this.clientRepository.save(client);
        try {
            await this.createEmbeddingForClient(savedClient.code);
        }
        catch (error) {
            console.error(`Failed to create initial embedding for client ${savedClient.code}:`, error.message);
        }
        return savedClient;
    }
    async findAll() {
        return this.clientRepository.find({ relations: ['embedding'] });
    }
    async findOne(code) {
        const client = await this.clientRepository.findOne({
            where: { code },
            relations: ['embedding'],
        });
        if (!client) {
            throw new common_1.NotFoundException(`Client with code ${code} not found`);
        }
        return client;
    }
    async update(code, updateClientDto) {
        const result = await this.clientRepository.update(code, updateClientDto);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Client with code ${code} not found`);
        }
        try {
            await this.createEmbeddingForClient(code);
        }
        catch (error) {
            console.error(`Failed to update embedding for client ${code}:`, error.message);
        }
        return this.findOne(code);
    }
    async remove(code) {
        const client = await this.findOne(code);
        return this.clientRepository.remove(client);
    }
    async generateEmbedding(text) {
        if (!this.genAI) {
            throw new Error('GEMINI_API_KEY not configured');
        }
        const model = this.genAI.getGenerativeModel({ model: 'models/gemini-embedding-001' });
        const result = await model.embedContent(text);
        return result.embedding.values;
    }
    prepareClientText(client) {
        return `Client: ${client.name}, Code: ${client.code}, Email: ${client.email}, Phone: ${client.phone}, CPF: ${client.cpf}`;
    }
    async createEmbeddingForClient(code) {
        const client = await this.findOne(code);
        const textToEmbed = this.prepareClientText(client);
        const vector = await this.generateEmbedding(textToEmbed);
        const vectorString = `[${vector.join(',')}]`;
        let embedding = client.embedding;
        if (!embedding) {
            embedding = this.clientEmbeddingRepository.create({
                client: client,
                embedding: vectorString,
            });
        }
        else {
            embedding.embedding = vectorString;
        }
        return this.clientEmbeddingRepository.save(embedding);
    }
    async createAllEmbeddings() {
        const clients = await this.clientRepository.find();
        for (const client of clients) {
            if (!client.embedding) {
                await this.createEmbeddingForClient(client.code);
            }
            else {
                console.log(`Client ${client.name} already has an embedding`);
            }
        }
    }
    async findSimilar(search) {
        const embedding = await this.generateEmbedding(search);
        const vectorString = `[${embedding.join(',')}]`;
        const rawResults = await this.clientRepository.query(`
      SELECT c.code,
             1 - (e.embedding <=> $1::vector) AS similarity
      FROM client c
      JOIN client_embedding e ON e."clientCode" = c.code
      WHERE 1 - (e.embedding <=> $1::vector) > 0.5
      ORDER BY e.embedding <=> $1::vector
      LIMIT 10;
      `, [vectorString]);
        if (!rawResults || rawResults.length === 0) {
            throw new common_1.NotFoundException('No similar clients found');
        }
        const clients = await Promise.all(rawResults.map(async (res) => {
            const client = await this.clientRepository.findOne({
                where: { code: res.code },
                relations: ['embedding']
            });
            return {
                ...client,
                similarity: parseFloat(res.similarity),
            };
        }));
        return clients;
    }
};
exports.ClientService = ClientService;
exports.ClientService = ClientService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(client_entity_1.Client)),
    __param(1, (0, typeorm_1.InjectRepository)(client_embedding_entity_1.ClientEmbedding)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService])
], ClientService);
//# sourceMappingURL=client.service.js.map