import { PartialType } from '@nestjs/graphql';
import { CreateProductDto } from './create-product.dto';
import { InputType } from '@nestjs/graphql';

@InputType()
/**We define the structure of the requeriments of the body to update the product
 * Extend from the createDto file 
  @params title
  @params description
  @params discountPercentage
  @params rating
  @params stock
  @params category
  @params thumbnail
  @params images
*/
export class UpdateProductDto extends PartialType(CreateProductDto) {}