import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
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

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  
  //Expose the enpoint to get the categories of the products
  @Get('categories')
  async getCategories() {
    return this.productsService.getCategories();
  }

  //Expose the enpoint to load the Database with the DummyJson information
  @Post('sync')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async syncProducts() {
    await this.productsService.syncWithExternalApi();
    return { message: 'Products synced successfully' };
  }

  //Expose the enpoint to get all the products with the filters
  @Get()
  async findAll(@Query() filterProductDto: FilterProductDto) {
    return this.productsService.findAll(filterProductDto);
  }

  //Expose the enpoint to Crete a new product
  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  /**Expose the enpoint to Update a product searched by @_id*/
  @Put(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  //Expose the endpoint to delete a product in base of the @_id
  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}