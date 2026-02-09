import { IsNotEmpty, IsString } from "class-validator";

export class CreateClientDto {

  @IsNotEmpty({ message: 'Code is required' })
  @IsString({ message: 'Code must be a string' })
  code: string;

  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  // @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a string' })
  email: string;

  // @IsNotEmpty({ message: 'Phone is required' })
  @IsString({ message: 'Phone must be a string' })
  phone: string;

  // @IsNotEmpty({ message: 'CPF is required' })
  @IsString({ message: 'CPF must be a string' })
  cpf: string;
}
