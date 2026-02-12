export interface Client {
  code: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

export interface CreateClientDto {
  code: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

export interface UpdateClientDto {
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
}
