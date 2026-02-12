import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Get()
  findAll() {
    return this.clientService.findAll();
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.clientService.findOne(code);
  }

  @Patch(':code')
  update(@Param('code') code: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(code, updateClientDto);
  }

  @Delete(':code')
  remove(@Param('code') code: string) {
    return this.clientService.remove(code);
  }

  @Post(':code/embedding')
  createEmbedding(@Param('code') code: string) {
    return this.clientService.createEmbeddingForClient(code);
  } 

  @Post('all/embeddings')
  createAllEmbeddings() {
    return this.clientService.createAllEmbeddings();
  }

  // @Get(':name/embedding')
  // findOneEmbedding(@Param('name') name: string) {
  //   console.log(name);
  //   return this.clientService.findOneEmbedding(name);
  // }

  // @Get('search/:name')
  // searchSimilar(@Param('name') name: string) {
  //   return this.clientService.findSimilarClient(name);
  // }

  @Get('fodastico/:name')
  searchFodastico(@Param('name') name: string) {
    return this.clientService.findSimilar(name);
  }
}


