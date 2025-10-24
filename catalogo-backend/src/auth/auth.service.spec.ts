/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User } from '../users/user.schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let userModel: any;
  let jwtService: JwtService;

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  const mockUser = {
    _id: 'user-id',
    email: 'test@test.com',
    password: 'hashed-password',
    role: Role.USER,
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userModel = module.get(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@test.com',
      password: 'password123',
      role: Role.USER,
    };

    it('should register a new user successfully', async () => {
      
      userModel.findOne.mockResolvedValue(null);
      userModel.create.mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      
      const result = await authService.register(registerDto);

      
      expect(userModel.findOne).toHaveBeenCalledWith({ email: registerDto.email });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(userModel.create).toHaveBeenCalledWith({
        email: registerDto.email,
        password: 'hashed-password',
        role: registerDto.role,
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        role: mockUser.role,
      });
      expect(result).toEqual({ token: 'mock-jwt-token' });
    });

    it('should throw ConflictException if user already exists', async () => {
      
      userModel.findOne.mockResolvedValue(mockUser);

      
      await expect(authService.register(registerDto)).rejects.toThrow(ConflictException);
      expect(userModel.findOne).toHaveBeenCalledWith({ email: registerDto.email });
      expect(userModel.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@test.com',
      password: 'password123',
    };

    it('should login user successfully', async () => {
      
      userModel.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      
      const result = await authService.login(loginDto);

      
      expect(userModel.findOne).toHaveBeenCalledWith({ email: loginDto.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: mockUser._id,
        email: mockUser.email,
        role: mockUser.role,
      });
      expect(result).toEqual({ token: 'mock-jwt-token' });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      
      userModel.findOne.mockResolvedValue(null);

      
      await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(userModel.findOne).toHaveBeenCalledWith({ email: loginDto.email });
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      
      userModel.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      
      await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(userModel.findOne).toHaveBeenCalledWith({ email: loginDto.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
    });
  });
});