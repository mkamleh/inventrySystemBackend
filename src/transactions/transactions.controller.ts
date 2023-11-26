import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Roles } from 'src/decorator/roles.decorators';
import { Role } from 'src/enums/roles';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    @InjectRepository(Transaction)
    private productRepository: Repository<Transaction>,
  ) {}

  @Post()
  @Roles(Role.User)
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    await this.transactionsService.create(createTransactionDto);
    await this.productRepository.save(createTransactionDto);
  }

  @Get()
  @Roles(Role.Admin)
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin)
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateTransactionDto: UpdateTransactionDto,
  // ) {
  //   return this.transactionsService.update(+id, updateTransactionDto);
  // }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}
