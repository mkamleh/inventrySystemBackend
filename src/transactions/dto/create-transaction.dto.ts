import { IsNotEmpty, IsNumber } from 'class-validator';
import { Product } from 'src/product/entities/product.entity';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;
  @IsNotEmpty()
  products: (Product & { quantity: number })[];
  totalItems: number;
}
