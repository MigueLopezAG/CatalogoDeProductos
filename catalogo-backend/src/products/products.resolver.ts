import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './products.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

//functions to expose the Grapqhl endpoints in base of the received query adding the middlwares to validate the session token and rol
@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => [Product])
  async products(
    @Args('filter', { type: () => FilterProductDto, nullable: true }) 
    filter: FilterProductDto,
  ) {
    const result = await this.productsService.findAll(filter || {});
    return result.products;
  }

  @Query(() => [String])
  async categories() {
    return this.productsService.getCategories();
  }


  @Mutation(() => Product)
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createProduct(@Args('createProductInput') createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Mutation(() => Product)
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateProduct(
    @Args('id') id: string,
    @Args('updateProductInput') updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Mutation(() => Product)
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deleteProduct(@Args('id') id: string) {
    return this.productsService.remove(id);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async syncProducts() {
    await this.productsService.syncWithExternalApi();
    return true;
  }
}