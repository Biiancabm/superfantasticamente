import axios from 'axios';
import type { Client, CreateClientDto, UpdateClientDto } from '../types/client';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const clientApi = {
  // Get all clients
  getAll: async (): Promise<Client[]> => {
    const response = await api.get<Client[]>('/clients');
    return response.data;
  },

  // Get client by code
  getByCode: async (code: string): Promise<Client> => {
    const response = await api.get<Client>(`/clients/${code}`);
    return response.data;
  },

  // Create new client
  create: async (data: CreateClientDto): Promise<Client> => {
    const response = await api.post<Client>('/clients', data);
    return response.data;
  },

  // Update client
  update: async (code: string, data: UpdateClientDto): Promise<Client> => {
    const response = await api.patch<Client>(`/clients/${code}`, data);
    return response.data;
  },

  // Delete client
  delete: async (code: string): Promise<void> => {
    await api.delete(`/clients/${code}`);
  },

  // Search similar clients
  searchSimilar: async (name: string): Promise<Client[]> => {
    const response = await api.get<Client[]>(`/clients/fodastico/${name}`);
    return response.data;
  },

  // Create embedding for client
  createEmbedding: async (code: string): Promise<void> => {
    await api.post(`/clients/${code}/embedding`);
  },

  // Create embeddings for all clients
  createAllEmbeddings: async (): Promise<void> => {
    await api.post('/clients/all/embeddings');
  },
};

export default api;
