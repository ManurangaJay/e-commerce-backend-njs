import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { Category } from '../category/category.entity';
import { DeleteResult } from 'typeorm';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: Repository<Product>;
  let categoryRepository: Repository<Category>;

  beforeEach(async () => {
    const mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
            createQueryBuilder: jest.fn(() => mockQueryBuilder), // Add this!
          },
        },
        {
          provide: getRepositoryToken(Category),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    categoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should call productRepository.createQueryBuilder and getMany', async () => {
      await service.findAll('best-selling', 1, 0, 4);
      expect(productRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should throw an error if category is not found', async () => {
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.create({ categoryId: 1, name: 'New Product' } as any),
      ).rejects.toThrow('Category not found');
    });

    it('should create and save a new product if category exists', async () => {
      const mockCategory = { id: 1, name: 'Category' } as Category;
      const mockProduct = {
        id: 1,
        name: 'New Product',
        category: mockCategory,
      } as Product;

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(mockCategory);
      jest.spyOn(productRepository, 'create').mockReturnValue(mockProduct); // Add this line!
      jest.spyOn(productRepository, 'save').mockResolvedValue(mockProduct);

      const result = await service.create({
        categoryId: 1,
        name: 'New Product',
      } as any);

      expect(productRepository.create).toHaveBeenCalledWith({
        name: 'New Product',
        category: mockCategory,
      });
      expect(productRepository.save).toHaveBeenCalledWith(mockProduct);
      expect(result).toHaveProperty('id', 1);
    });

    describe('update', () => {
      it('should throw an error if product is not found', async () => {
        jest.spyOn(productRepository, 'findOne').mockResolvedValue(null);

        await expect(
          service.update(1, { name: 'Updated Product' } as any),
        ).rejects.toThrow('Product not found');
      });

      it('should update and save a product if found', async () => {
        const mockProduct = {
          id: 1,
          name: 'Old Product',
          category: {},
        } as Product;
        jest.spyOn(productRepository, 'findOne').mockResolvedValue(mockProduct);
        jest.spyOn(productRepository, 'save').mockResolvedValue({
          ...mockProduct,
          name: 'Updated Product',
        });

        const result = await service.update(1, {
          name: 'Updated Product',
        } as any);
        expect(productRepository.save).toHaveBeenCalledWith({
          id: 1,
          name: 'Updated Product',
          category: {},
        });
        expect(result.name).toBe('Updated Product');
      });
    });

    describe('remove', () => {
      it('should delete the product', async () => {
        const mockDeleteResult: DeleteResult = { affected: 1 } as DeleteResult;

        jest
          .spyOn(productRepository, 'delete')
          .mockResolvedValue(mockDeleteResult);

        await service.remove(1);
        expect(productRepository.delete).toHaveBeenCalledWith(1);
      });
    });
  });
});
