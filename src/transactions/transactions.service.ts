import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { Product } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private dataSource: DataSource,
    private productService: ProductService,
  ) {}
  async create(createTransactionDto: CreateTransactionDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    let total = 0;
    let totalItems = 0;

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const prodcut of createTransactionDto.products) {
        const currentProduct = await queryRunner.manager
          .getRepository(Product)
          .createQueryBuilder('user')
          .useTransaction(true)
          .setLock('pessimistic_write')
          .where('id = :id', { id: prodcut.id })
          .getOne();
        if (!currentProduct || currentProduct.stock < prodcut.quantity) {
          throw new HttpException(
            `${currentProduct.name} is deleted or qunatity is bigger than stock`,
            HttpStatus.BAD_REQUEST,
          );
        }
        total += currentProduct.price * prodcut.quantity;
        totalItems += prodcut.quantity;

        await queryRunner.manager
          .getRepository(Product)
          .createQueryBuilder('test')
          .update()
          .set({
            stock: Number(currentProduct.stock) - Number(prodcut.quantity),
          })
          .where('id = :id', { id: prodcut.id })
          .execute();
      }

      if (total !== createTransactionDto.amount) {
        throw new HttpException(
          'total amount is wrong',
          HttpStatus.BAD_REQUEST,
        );
      }
      createTransactionDto.totalItems = totalItems;
      await queryRunner.commitTransaction();
      this.productService.findAll({ page: 1, path: 'null' });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.transactionRepository.find({
      withDeleted: true,
      relations: {
        products: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
