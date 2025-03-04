import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  image: string;

  @Column('text')
  name: string;

  @Column('int')
  price: number;

  @Column('int')
  discountedPrice: number;

  @Column('text')
  description: string;

  @Column('int')
  rating: number;

  @Column('int')
  reviewsCount: number;
}
