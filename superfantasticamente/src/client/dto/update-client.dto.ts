import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './create-client.dto';

// Note: To use PartialType, you need @nestjs/mapped-types installed.
// If not available, you can define properties manually.
// For this task, assuming standard NestJS environment.
export class UpdateClientDto extends PartialType(CreateClientDto) {}
