/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { NotFoundException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { ProductsService } from './products.service';
import { Product } from './products.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let productModel: any;
  let httpService: HttpService;

  const mockProductModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    create: jest.fn(),
    countDocuments: jest.fn(),
    distinct: jest.fn(),
  };

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockProduct = {
    _id: 'product-id',
    title: 'Test Product',
    description: 'Test Description',
    price: 100,
    discountPercentage: 10,
    rating: 4.5,
    stock: 50,
    category: 'Test Category',
    thumbnail: 'test-thumbnail.jpg',
    images: ['image1.jpg', 'image2.jpg'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
    productModel = module.get(getModelToken(Product.name));
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    const filterProductDto: FilterProductDto = {
      page: 1,
      limit: 10,
    };

    it('should return paginated products', async () => {
      
      const mockProducts = [mockProduct];
      productModel.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue(mockProducts),
          }),
        }),
      });
      productModel.countDocuments.mockResolvedValue(1);

      
      const result = await productsService.findAll(filterProductDto);

      
      expect(productModel.find).toHaveBeenCalled();
      expect(productModel.countDocuments).toHaveBeenCalled();
      expect(result).toEqual({
        products: mockProducts,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should filter products by search term', async () => {
      
      const searchFilter: FilterProductDto = {
        search: 'test',
        page: 1,
        limit: 10,
      };

      productModel.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue([mockProduct]),
          }),
        }),
      });
      productModel.countDocuments.mockResolvedValue(1);

      
      await productsService.findAll(searchFilter);

      
      expect(productModel.find).toHaveBeenCalledWith({
        title: { $regex: 'test', $options: 'i' },
      });
    });

    it('should filter products by price range', async () => {
      
      const priceFilter: FilterProductDto = {
        minPrice: 50,
        maxPrice: 200,
        page: 1,
        limit: 10,
      };

      productModel.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue([mockProduct]),
          }),
        }),
      });
      productModel.countDocuments.mockResolvedValue(1);

      
      await productsService.findAll(priceFilter);

      
      expect(productModel.find).toHaveBeenCalledWith({
        price: { $gte: 50, $lte: 200 },
      });
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
      
      productModel.create.mockResolvedValue(mockProduct);

      
      const result = await productsService.create(createProductDto);

      
      expect(productModel.create).toHaveBeenCalledWith({
        ...createProductDto,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
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
      productModel.findByIdAndUpdate.mockResolvedValue(updatedProduct);

      
      const result = await productsService.update('product-id', updateProductDto);

      
      expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'product-id',
        { ...updateProductDto, updatedAt: expect.any(Date) },
        { new: true },
      );
      expect(result).toEqual(updatedProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      
      productModel.findByIdAndUpdate.mockResolvedValue(null);

      
      await expect(productsService.update('non-existent-id', updateProductDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      
      productModel.findByIdAndDelete.mockResolvedValue(mockProduct);

      
      const result = await productsService.remove('product-id');

      
      expect(productModel.findByIdAndDelete).toHaveBeenCalledWith('product-id');
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      
      productModel.findByIdAndDelete.mockResolvedValue(null);

      
      await expect(productsService.remove('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('syncWithExternalApi', () => {
    it('should sync products with external API', async () => {
      
      const externalProducts = {
        data: {
          products: [
            {
              id: 1,
              title: 'External Product',
              description: 'External Description',
              price: 100,
              discountPercentage: 10,
              rating: 4.5,
              stock: 50,
              brand: 'External Brand',
              category: 'External Category',
              thumbnail: 'external-thumbnail.jpg',
              images: ['external-image1.jpg'],
            },
          ],
        },
      };

      mockHttpService.get.mockReturnValue(of(externalProducts));
      productModel.findOne.mockResolvedValue(null);
      productModel.create.mockResolvedValue(mockProduct);

      
      await productsService.syncWithExternalApi();

      
      expect(httpService.get).toHaveBeenCalledWith('https://dummyjson.com/products');
      expect(productModel.findOne).toHaveBeenCalledWith({ title: 'External Product' });
      expect(productModel.create).toHaveBeenCalled();
    });

    it('should handle sync errors', async () => {
      
      mockHttpService.get.mockReturnValue(throwError(() => new Error('API Error')));

      
      await expect(productsService.syncWithExternalApi()).rejects.toThrow('Failed to sync with external API');
    });
  });

  describe('getCategories', () => {
    it('should return all categories', async () => {
      
      const categories = ['Category1', 'Category2'];
      productModel.distinct.mockResolvedValue(categories);

      
      const result = await productsService.getCategories();

      
      expect(productModel.distinct).toHaveBeenCalledWith('category');
      expect(result).toEqual(categories);
    });
  });

});