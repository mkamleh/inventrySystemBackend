import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterOperator, PaginateQuery, paginate } from 'nestjs-paginate';
import { EventGateway } from 'src/event/event.gateway';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private gatewate: EventGateway,
  ) {}
  defaultPaginfation: PaginateQuery = { page: 1, path: 'null' };

  async create(createProductDto: CreateProductDto) {
    await this.productRepository.save(createProductDto);
    return this.findAll(this.defaultPaginfation);
  }

  async findAll(query?: PaginateQuery) {
    const data = await paginate(query, this.productRepository, {
      sortableColumns: ['stock'],
      searchableColumns: ['name', 'category', 'price'],
      filterableColumns: {
        name: [FilterOperator.SW],
        category: [FilterOperator.SW],
        price: [FilterOperator.BTW],
      },
    });
    this.gatewate.sendMessage(data);
    return data;
  }

  async update(updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOneBy({
      id: updateProductDto.id,
    });
    if (!product) {
      throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    }
    await this.productRepository.update(updateProductDto.id, updateProductDto);
    return this.findAll(this.defaultPaginfation);
  }

  async remove(id: number) {
    const updatedResult = await this.productRepository.softDelete(id);
    if (!updatedResult.affected) {
      throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    }
    return this.findAll(this.defaultPaginfation);
  }
}
