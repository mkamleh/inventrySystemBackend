import { Product } from 'src/product/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Product, {
    cascade: ['insert', 'update'],
  })
  @JoinTable()
  products: Product[];

  @Column()
  amount: number;

  @Column()
  totalItems: number;

  @CreateDateColumn()
  createdAt: Date; // Creation date

  @UpdateDateColumn()
  updatedAt: Date; // Last updated date

  @DeleteDateColumn()
  deletedAt: Date; // Deletion date
}
