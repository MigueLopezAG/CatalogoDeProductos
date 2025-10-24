import { IsEmail, IsString, MinLength } from 'class-validator';

/**We define the structure of the requeriments of the body to login
  @params email
  @params password
*/
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}