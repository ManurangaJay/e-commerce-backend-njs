import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll(@Query('id') id?: string) {
    // Convert id to number if it exists
    const idAsNumber = id ? Number(id) : undefined;
    return this.categoryService.find(idAsNumber); // Pass the converted number or undefined
  }

  @Post()
  create(@Body('name') name: string) {
    return this.categoryService.create(name);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.categoryService.delete(Number(id)); // Convert id to number before deleting
  }
}
