import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

describe('CategoryController', () => {
  let controller: CategoryController;
  let categoryService: CategoryService;

  const mockCategoryService = {
    find: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call CategoryService.find with no id when no query param is passed', async () => {
      await controller.findAll();
      expect(categoryService.find).toHaveBeenCalledWith(undefined);
    });

    it('should call CategoryService.find with a number when id query param is passed', async () => {
      await controller.findAll('1');
      expect(categoryService.find).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should call CategoryService.create with the correct name', async () => {
      const categoryName = 'New Category';
      await controller.create(categoryName);
      expect(categoryService.create).toHaveBeenCalledWith(categoryName);
    });
  });

  describe('delete', () => {
    it('should call CategoryService.delete with the correct id', async () => {
      const categoryId = '5';
      await controller.delete(categoryId);
      expect(categoryService.delete).toHaveBeenCalledWith(5);
    });
  });
});
