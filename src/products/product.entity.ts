import { Category } from '../category/category.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  image: string;

  @Column('text')
  name: string;

  @Column('numeric', { precision: 10, scale: 2 })
  price: number;

  @Column('numeric', { precision: 10, scale: 2 })
  discountedPrice: number;

  @Column('text')
  description: string;

  @Column('int')
  rating: number;

  @Column('int')
  reviewsCount: number;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
