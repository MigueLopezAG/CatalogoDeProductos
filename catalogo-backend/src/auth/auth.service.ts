import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  /**Function to register of a new user
  *  @param email string
  *  @param password string
  *  @param role string default = user
  *  @return session token
  */
  async register(registerDto: RegisterDto): Promise<{ token: string }> {
    const { email, password, role } = registerDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      email,
      password: hashedPassword,
      role,
    });

    const token = this.jwtService.sign({ 
      id: user._id, 
      email: user.email, 
      role: user.role 
    });

    return { token };
  }

  /**Function to login an user
    @param email string
    @param password string
    @return session token
  */
  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ 
      id: user._id, 
      email: user.email, 
      role: user.role 
    });

    return { token };
  }
}