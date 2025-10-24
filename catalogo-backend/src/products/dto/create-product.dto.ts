import { IsString, IsNumber, IsArray, IsUrl, Min } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

/**We define the structure of the requeriments of the body to register
  @params title
  @params description
  @params discountPercentage
  @params rating
  @params stock
  @params category
  @params thumbnail
  @params images
*/
@InputType()
export class CreateProductDto {
  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  description: string;

  @Field()
  @IsNumber()
  @Min(0)
  price: number;

  @Field()
  @IsNumber()
  @Min(0)
  discountPercentage: number;

  @Field()
  @IsNumber()
  @Min(0)
  rating: number;

  @Field()
  @IsNumber()
  @Min(0)
  stock: number;

  @Field()
  @IsString()
  category: string;

  @Field()
  @IsUrl()
  thumbnail: string;

  @Field(() => [String])
  @IsArray()
  @IsUrl({}, { each: true })
  images: string[];
}