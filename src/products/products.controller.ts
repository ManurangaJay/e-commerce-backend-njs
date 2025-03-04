import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity'; // Import the entity instead of defining the interface

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('section') section: string,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 4,
  ): Promise<Product[]> {
    return this.productsService.findAll(section, page, limit);
  }
}
