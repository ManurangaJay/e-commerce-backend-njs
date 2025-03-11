import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Category } from '../category/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(
    section: string,
    category: number,
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

    if (category) {
      query = query.andWhere('product.categoryId = :categoryId', {
        categoryId: category,
      });
    }

    query = query.leftJoinAndSelect('product.category', 'category');

    query = query.skip(page * size).take(size);

    try {
      return await query.getMany();
    } catch (error) {
      console.error('Error fetching products from the database:', error);
      return [];
    }
  }

  async create(
    productData: { categoryId: number } & Partial<Product>,
  ): Promise<Product> {
    const { categoryId, ...data } = productData;

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    const product = this.productsRepository.create({ ...data, category });
    return await this.productsRepository.save(product);
  }

  async update(
    id: number,
    productData: { categoryId?: number } & Partial<Product>,
  ): Promise<Product> {
    const { categoryId, ...data } = productData;

    const product = await this.productsRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    if (categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });

      if (!category) {
        throw new Error('Category not found');
      }

      product.category = category;
    }

    Object.assign(product, data);
    return this.productsRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    await this.productsRepository.delete(id);
  }
}
