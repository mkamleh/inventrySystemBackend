import { IsNotEmpty } from 'class-validator';
import { Product } from 'src/product/entities/product.entity';
import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export class CreateTransactionDto {
  @IsNotEmpty()
  amount: number;
  @IsNotEmpty()
  products: Product[];
  @CreateDateColumn()
  createdAt: Date; // Creation date

  @UpdateDateColumn()
  updatedAt: Date; // Last updated date

  @DeleteDateColumn()
  deletedAt: Date; // Deletion date
}
