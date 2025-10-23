import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

/**We define the structure of the requeriments of the body to register
  @params email
  @params password
  @params password
*/
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;
}