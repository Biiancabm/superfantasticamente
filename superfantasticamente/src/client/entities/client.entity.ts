import { Entity, Column, PrimaryColumn, OneToOne } from 'typeorm';
import { ClientEmbedding } from './client-embedding.entity';

@Entity()
export class Client {
  @PrimaryColumn()
  code: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  cpf: string;

  @OneToOne(() => ClientEmbedding, (embedding) => embedding.client)
  embedding: ClientEmbedding;
}
