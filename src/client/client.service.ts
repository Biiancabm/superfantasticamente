import { Injectable, NotFoundException, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Client } from './entities/client.entity';
import { ClientEmbedding } from './entities/client-embedding.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class ClientService implements OnModuleInit {
  private genAI: GoogleGenerativeAI;

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(ClientEmbedding)
    private readonly clientEmbeddingRepository: Repository<ClientEmbedding>,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async onModuleInit() {
    try {
      await this.clientRepository.query('CREATE EXTENSION IF NOT EXISTS vector;');
      console.log('PostgreSQL vector extension enabled (or already exists).');
    } catch (error) {
      console.error('Failed to enable PostgreSQL vector extension:', error);
    }
  }


  async create(createClientDto: CreateClientDto) {
    const existing = await this.clientRepository.findOne({
      where: { code: createClientDto.code },
    });
    if (existing) {
      throw new ConflictException(`Client with code ${createClientDto.code} already exists`);
    }

    const client = this.clientRepository.create(createClientDto);
    return this.clientRepository.save(client);
  }

  async findAll() {
    return this.clientRepository.find({ relations: ['embedding'] });
  }

  async findOne(code: string) {
    const client = await this.clientRepository.findOne({
      where: { code },
      relations: ['embedding'],
    });
    if (!client) {
      throw new NotFoundException(`Client with code ${code} not found`);
    }
    return client;
  }

  async update(code: string, updateClientDto: UpdateClientDto) {
    const result = await this.clientRepository.update(code, updateClientDto);
    if (result.affected === 0) {
      throw new NotFoundException(`Client with code ${code} not found`);
    }
    return this.findOne(code);
  }

  async remove(code: string) {
    const client = await this.findOne(code);
    return this.clientRepository.remove(client);
  }


  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.genAI) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const model = this.genAI.getGenerativeModel({ model: 'models/gemini-embedding-001' });
    const result = await model.embedContent(text);
    
    return result.embedding.values;
  }

  async createEmbeddingForClient(code: string) {
    const client = await this.findOne(code);
    
    console.log(client);

    const vector = await this.generateEmbedding(client.name);
  
    const embeddingString = JSON.stringify(vector);


    let embedding = client.embedding;
    if (!embedding) {
      embedding = this.clientEmbeddingRepository.create({
        client: client,
        embedding: embeddingString,
      });
    } else {
      embedding.embedding = embeddingString;
    }
    console.log(embedding);
    return this.clientEmbeddingRepository.save(embedding);
  }


  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      console.error(`Vector length mismatch: Search vector (${vecA.length}) vs Database vector (${vecB.length})`);
      throw new Error(`Vectors must have the same length: ${vecA.length} vs ${vecB.length}`);
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    if (denominator === 0) {
      return 0;
    }

    return dotProduct / denominator;
  }

  async findSimilar(search: string) {
   const embedding = await this.generateEmbedding(search);
   const vectorString = `[${embedding.join(',')}]`;

const clientes = await this.clientRepository.query(
  `
  SELECT c.code,
         1 - (e.embedding <=> $1::vector) AS similarity
  FROM client c
  JOIN client_embedding e ON e."clientCode" = c.code
  WHERE 1 - (e.embedding <=> $1::vector) > 0.7
  ORDER BY e.embedding <=> $1::vector
  LIMIT 1;
  `,
  [vectorString],
);

if (!clientes || clientes.length === 0) {
  throw new NotFoundException('No similar clients found');
}
const result = await this.clientRepository.find({ where: { code: clientes[0].code } });
return clientes;
  }

 
  async findSimilarClient(searchText: string) {
    try {
      const searchEmbedding = await this.generateEmbedding(searchText);
      const clients = await this.clientRepository.find({ 
        relations: ['embedding'] 
      });
      console.log('Total clients found:', clients.length);

      if (clients.length === 0) {
        throw new NotFoundException('No clients found in database');
      }

      const clientsWithEmbeddings = clients.filter(client => client.embedding?.embedding);

      if (clientsWithEmbeddings.length === 0) {
        throw new NotFoundException('No clients with embeddings found');
      }

      const similarities = clientsWithEmbeddings.map(client => {
        try {
          let clientEmbedding: number[];
          
          if (typeof client.embedding.embedding === 'string') {
            clientEmbedding = JSON.parse(client.embedding.embedding);
          } else if (Array.isArray(client.embedding.embedding)) {
            clientEmbedding = client.embedding.embedding;
          } else {
            console.error('Invalid embedding format for client:', client.code);
            return null;
          }
          console.log(clientEmbedding);

          const similarity = this.cosineSimilarity(searchEmbedding, clientEmbedding);
          console.log(`Client ${client.name} similarity:`, similarity);
          
          return {
            client,
            similarity,
          };
        } catch (error) {
          console.error(`Error processing client ${client.code}:`, error.message);
          return null;
        }
      }).filter(result => result !== null);

      if (similarities.length === 0) {
        throw new NotFoundException('No valid embeddings could be processed');
      }

      similarities.sort((a, b) => b.similarity - a.similarity);

      const bestMatch = similarities[0];
      if (bestMatch.similarity < 0.7) {
        console.log(bestMatch.similarity);
        throw new NotFoundException('No similar clients found');
      }
      return {
        code: bestMatch.client.code,
        name: bestMatch.client.name,
        similarity: bestMatch.similarity,
        searchText,
        allMatches: similarities.map(s => ({
          code: s.client.code,
          name: s.client.name,
          similarity: s.similarity,
        })),
      };
    } catch (error) {
      console.error('Error in findSimilarClient:', error);
      throw error;
    }
  }
}
