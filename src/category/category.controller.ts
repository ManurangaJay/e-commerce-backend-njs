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
    const idAsNumber = id ? Number(id) : undefined;
    return this.categoryService.find(idAsNumber);
  }

  @Post()
  create(@Body('name') name: string) {
    return this.categoryService.create(name);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.categoryService.delete(Number(id));
  }
}
