import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
export declare class ClientController {
    private readonly clientService;
    constructor(clientService: ClientService);
    create(createClientDto: CreateClientDto): Promise<import("./entities/client.entity").Client>;
    findAll(): Promise<import("./entities/client.entity").Client[]>;
    findOne(code: string): Promise<import("./entities/client.entity").Client>;
    update(code: string, updateClientDto: UpdateClientDto): Promise<import("./entities/client.entity").Client>;
    remove(code: string): Promise<import("./entities/client.entity").Client>;
    createEmbedding(code: string): Promise<import("./entities/client-embedding.entity").ClientEmbedding>;
    createAllEmbeddings(): Promise<void>;
    searchFodastico(name: string): Promise<any[]>;
}
