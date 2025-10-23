import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';

/**We define the structure of the products params to create a schema on mongodb
  @params title
  @params description
  @params discountPercentage
  @params rating
  @params stock
  @params category
  @params thumbnail
  @params images
  @params createdAt
  @params updatedAt
*/
@ObjectType()
@Schema()
export class Product extends Document {
  @Field()
  @Prop({ required: true })
  title: string;

  @Field()
  @Prop({ required: true })
  description: string;

  @Field()
  @Prop({ required: true })
  price: number;

  @Field()
  @Prop({ required: true })
  discountPercentage: number;

  @Field()
  @Prop({ required: true })
  rating: number;

  @Field()
  @Prop({ required: true })
  stock: number;

  @Field()
  @Prop({ required: true })
  category: string;

  @Field()
  @Prop({ required: true })
  thumbnail: string;

  @Field(() => [String])
  @Prop({ type: [String] })
  images: string[];

  @Field()
  @Prop({ default: Date.now })
  createdAt: Date;

  @Field()
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);