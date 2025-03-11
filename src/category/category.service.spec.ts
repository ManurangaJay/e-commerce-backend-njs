import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: Repository<Category>;

  const mockCategoryRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find', () => {
    it('should call findOne when id is provided', async () => {
      const id = 1;
      const category = { id, name: 'Test Category' } as Category;
      mockCategoryRepository.findOne.mockResolvedValue(category);

      const result = await service.find(id);
      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(category);
    });

    it('should call find when no id is provided', async () => {
      const categories = [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
      ] as Category[];
      mockCategoryRepository.find.mockResolvedValue(categories);

      const result = await service.find();
      expect(categoryRepository.find).toHaveBeenCalled();
      expect(result).toEqual(categories);
    });
  });

  describe('create', () => {
    it('should call create and save with the correct data', async () => {
      const categoryName = 'New Category';
      const createdCategory = { id: 1, name: categoryName } as Category;

      mockCategoryRepository.create.mockReturnValue(createdCategory);
      mockCategoryRepository.save.mockResolvedValue(createdCategory);

      const result = await service.create(categoryName);
      expect(categoryRepository.create).toHaveBeenCalledWith({
        name: categoryName,
      });
      expect(categoryRepository.save).toHaveBeenCalledWith(createdCategory);
      expect(result).toEqual(createdCategory);
    });
  });

  describe('delete', () => {
    it('should call delete with the correct id', async () => {
      const id = 1;
      mockCategoryRepository.delete.mockResolvedValue({ affected: 1 });

      await service.delete(id);
      expect(categoryRepository.delete).toHaveBeenCalledWith(id);
    });
  });
});
