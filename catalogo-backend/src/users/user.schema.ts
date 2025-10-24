import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

/**We define the structure of the user params to create a schema on mongodb
  @params email
  @params password
  @params role
  @params createdAt
*/
@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: Role.USER })
  role: Role;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);