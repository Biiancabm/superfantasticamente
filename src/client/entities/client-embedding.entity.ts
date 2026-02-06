import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Client } from './client.entity';

@Entity()
export class ClientEmbedding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'vector' })
  embedding: string;

  @OneToOne(() => Client, (client) => client.embedding, { onDelete: 'CASCADE' })
  @JoinColumn()
  client: Client;
}
