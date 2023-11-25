import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  stock: number;
  @IsNotEmpty()
  price: number;
  @IsNotEmpty()
  category: string;
}
