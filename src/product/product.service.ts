import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterOperator, PaginateQuery, paginate } from 'nestjs-paginate';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}
  create(createProductDto: CreateProductDto) {
    this.productRepository.save(createProductDto);
    return 'This action adds a new product';
  }

  findAll(query: PaginateQuery) {
    return paginate(query, this.productRepository, {
      sortableColumns: ['stock'],
      searchableColumns: ['name', 'category'],
      filterableColumns: {
        name: [FilterOperator.SW],
        category: [FilterOperator.SW],
        price: [FilterOperator.BTW],
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  async update(updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOneBy({
      id: updateProductDto.id,
    });
    if (!product) {
      throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    }
    return this.productRepository.update(updateProductDto.id, updateProductDto);
  }

  async remove(id: number) {
    const updatedResult = await this.productRepository.softDelete(id);
    if (!updatedResult.affected) {
      throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    }
    return updatedResult;
  }
}
