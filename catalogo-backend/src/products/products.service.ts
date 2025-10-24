import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Product } from './products.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';

@Injectable()
export class ProductsService {
  private readonly externalApiUrl = 'https://dummyjson.com/products';

  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private httpService: HttpService,
  ) {}

  /**Function to get the data of DummyJSON*/
  async syncWithExternalApi(): Promise<void> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(this.externalApiUrl),
      );
      const products = response.data.products;

      for (const productData of products) {
        const existingProduct = await this.productModel.findOne({
          title: productData.title,
        });

        if (!existingProduct) {
          await this.productModel.create({
            ...productData,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    } catch (error) {
      throw new Error('Failed to sync with external API', error);
    }
  }
  
  /**Function to find the product in base of the filters in the query */
  async findAll(filterProductDto: FilterProductDto): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { search, minPrice, maxPrice, category, page = 0, limit = 0 } = filterProductDto;
    const query: any = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const products = await this.productModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    const total = await this.productModel.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return {
      products,
      total,
      page,
      limit,
      totalPages,
    };
  }
  
  /**Function to create a new product*/
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = await this.productModel.create({
      ...createProductDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return product;
  }

  /**Function to update a new product*/
  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      { ...updateProductDto, updatedAt: new Date() },
      { new: true },
    );
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

   /**Function to delete a product*/
  async remove(id: string): Promise<Product> {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  /**Function to get the categories of the products*/
  async getCategories(): Promise<string[]> {
    const categories = await this.productModel.distinct('category');
    return categories;
  }

}