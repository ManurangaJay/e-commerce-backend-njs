import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

interface Product {
  image: string;
  name: string;
  price: number;
  discountedPrice: number;
  description: string;
  rating: number;
  reviewsCount: number;
}

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(
    @Query('section') section: string,
    @Query('page') page: number = 0, // Default to page 0
    @Query('size') size: number = 4, // Default to size 4 products per page
  ): Product[] {
    return this.productsService.findAll(section, page, size);
  }
}
