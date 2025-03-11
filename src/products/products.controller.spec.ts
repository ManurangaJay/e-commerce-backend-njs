import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result = [{ id: 1, name: 'Product 1', price: 100 }];
      mockProductsService.findAll.mockResolvedValue(result);

      const products = await controller.findAll('', 0, 0, 4);
      expect(products).toEqual(result);
    });
  });

  describe('create', () => {
    it('should create and return a product', async () => {
      const productData = { name: 'New Product', price: 200, categoryId: 1 };
      const result = { id: 1, ...productData };
      mockProductsService.create.mockResolvedValue(result);

      const product = await controller.create(productData);
      expect(product).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update and return the product', async () => {
      const id = 1;
      const productData = { name: 'Updated Product', price: 250 };
      const result = { id, ...productData };
      mockProductsService.update.mockResolvedValue(result);

      const product = await controller.update(id, productData);
      expect(product).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const id = 1;
      mockProductsService.remove.mockResolvedValue(undefined);

      await controller.remove(id);
      expect(mockProductsService.remove).toHaveBeenCalledWith(id);
    });
  });
});
