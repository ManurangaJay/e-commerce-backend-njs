import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAll(
    section: string,
    page: number,
    size: number,
  ): Promise<Product[]> {
    let query = this.productsRepository.createQueryBuilder('product');

    switch (section) {
      case 'best-selling':
        query = query.where('product.reviewsCount > :reviewsCount', {
          reviewsCount: 300,
        });
        break;
      case 'deals':
        query = query.where('product.discountedPrice > :discountedPrice', {
          discountedPrice: 0,
        });
        break;
      default:
        break;
    }

    query = query.skip(page * size).take(size);

    try {
      return await query.getMany();
    } catch (error) {
      console.error('Error fetching products from the database:', error);
      return [];
    }
  }

  async create(productData: Partial<Product>): Promise<Product> {
    const product = this.productsRepository.create(productData);
    return await this.productsRepository.save(product);
  }

  async update(id: number, productData: Partial<Product>): Promise<Product> {
    await this.productsRepository.update(id, productData);
    const updatedProduct = await this.productsRepository.findOne({
      where: { id },
    });
    if (!updatedProduct) {
      throw new Error('Product not found');
    }
    return updatedProduct;
  }

  async remove(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }
}
