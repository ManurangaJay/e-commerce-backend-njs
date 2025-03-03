import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

interface Product {
  image: string;
  name: string;
  price: number;
  discountedPrice: number;
  description: string;
  rating: number;
  reviewsCount: number;
}

@Injectable()
export class ProductsService {
  private products: Product[];

  constructor() {
    const filePath = join(process.cwd(), 'resources', 'products.json');
    try {
      const fileContents = readFileSync(filePath, 'utf-8');
      this.products = JSON.parse(fileContents);
    } catch (error) {
      console.error('Error reading the products.json file:', error);
      this.products = [];
    }
  }

  findAll(section: string, page: number, size: number): Product[] {
    let filteredProducts = this.products;

    switch (section) {
      case 'featured':
        break;

      case 'best-selling':
        filteredProducts = filteredProducts.filter(
          (product) => product.reviewsCount > 300,
        );
        break;

      case 'deals':
        filteredProducts = filteredProducts.filter(
          (product) => product.discountedPrice > 0,
        );
        break;

      default:
        break;
    }

    const startIndex = page * size;
    const endIndex = startIndex + size;

    return filteredProducts.slice(startIndex, endIndex);
  }
}
