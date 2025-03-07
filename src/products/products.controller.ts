import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('section') section: string,
    @Query('category') category: number,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 4,
  ): Promise<Product[]> {
    return this.productsService.findAll(section, category, page, limit);
  }

  @Post()
  async create(
    @Body() productData: { categoryId: number } & Partial<Product>,
  ): Promise<Product> {
    return this.productsService.create(productData);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() productData: { categoryId?: number } & Partial<Product>,
  ): Promise<Product> {
    return this.productsService.update(id, productData);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.productsService.remove(id);
  }
}
