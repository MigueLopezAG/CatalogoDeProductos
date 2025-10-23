/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';

describe('ProductsController', () => {
  let productsController: ProductsController;
  let productsService: ProductsService;

  const mockProductsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getCategories: jest.fn(),
    getBrands: jest.fn(),
    syncWithExternalApi: jest.fn(),
  };

  const mockProduct = {
    _id: 'product-id',
    title: 'Test Product',
    description: 'Test Description',
    price: 100,
    discountPercentage: 10,
    rating: 4.5,
    stock: 50,
    brand: 'Test Brand',
    category: 'Test Category',
    thumbnail: 'test-thumbnail.jpg',
    images: ['image1.jpg', 'image2.jpg'],
    createdAt: new Date(),
    updatedAt: new Date(),
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

    productsController = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      
      const filterProductDto: FilterProductDto = { page: 1, limit: 10 };
      const expectedResult = {
        products: [mockProduct],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      mockProductsService.findAll.mockResolvedValue(expectedResult);

      
      const result = await productsController.findAll(filterProductDto);

      
      expect(productsService.findAll).toHaveBeenCalledWith(filterProductDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('create', () => {
    const createProductDto: CreateProductDto = {
      title: 'New Product',
      description: 'New Description',
      price: 200,
      discountPercentage: 15,
      rating: 4.0,
      stock: 100,
      category: 'New Category',
      thumbnail: 'new-thumbnail.jpg',
      images: ['new-image1.jpg', 'new-image2.jpg'],
    };

    it('should create a new product', async () => {
      
      mockProductsService.create.mockResolvedValue(mockProduct);

      
      const result = await productsController.create(createProductDto);

      
      expect(productsService.create).toHaveBeenCalledWith(createProductDto);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('update', () => {
    const updateProductDto: UpdateProductDto = {
      title: 'Updated Product',
      price: 150,
    };

    it('should update a product', async () => {
      
      const updatedProduct = { ...mockProduct, ...updateProductDto };
      mockProductsService.update.mockResolvedValue(updatedProduct);

      
      const result = await productsController.update('product-id', updateProductDto);

      
      expect(productsService.update).toHaveBeenCalledWith('product-id', updateProductDto);
      expect(result).toEqual(updatedProduct);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      
      mockProductsService.remove.mockResolvedValue(mockProduct);

      
      const result = await productsController.remove('product-id');

      
      expect(productsService.remove).toHaveBeenCalledWith('product-id');
      expect(result).toEqual(mockProduct);
    });
  });

  describe('getCategories', () => {
    it('should return all categories', async () => {
      
      const categories = ['Category1', 'Category2'];
      mockProductsService.getCategories.mockResolvedValue(categories);

      
      const result = await productsController.getCategories();

      
      expect(productsService.getCategories).toHaveBeenCalled();
      expect(result).toEqual(categories);
    });
  });

  describe('syncProducts', () => {
    it('should sync products with external API', async () => {
      
      mockProductsService.syncWithExternalApi.mockResolvedValue(undefined);

      
      const result = await productsController.syncProducts();

      
      expect(productsService.syncWithExternalApi).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Products synced successfully' });
    });
  });
});