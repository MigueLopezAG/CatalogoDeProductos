import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-secret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  describe('validate', () => {
    it('should return user payload', () => {
      
      const payload = {
        sub: 'user-id',
        email: 'test@test.com',
        role: 'user',
      };

      
      const result = jwtStrategy.validate(payload);

      
      expect(result).toEqual({
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
      });
    });
  });
});