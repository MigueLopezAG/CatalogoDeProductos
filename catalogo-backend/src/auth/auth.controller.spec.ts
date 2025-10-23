/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
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

    it('should register a new user', async () => {
      // Arrange
      const expectedResult = { token: 'jwt-token' };
      mockAuthService.register.mockResolvedValue(expectedResult);

      // Act
      const result = await authController.register(registerDto);

      // Assert
      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@test.com',
      password: 'password123',
    };

    it('should login user', async () => {
      // Arrange
      const expectedResult = { token: 'jwt-token' };
      mockAuthService.login.mockResolvedValue(expectedResult);

      // Act
      const result = await authController.login(loginDto);

      // Assert
      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResult);
    });
  });
});