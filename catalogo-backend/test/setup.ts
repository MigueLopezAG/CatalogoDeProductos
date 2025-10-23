import { MongooseModule,  } from '@nestjs/mongoose';

export const mockMongooseModule = MongooseModule.forRoot('mongodb://localhost:27017/test-product-catalog');

export const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
  verify: jest.fn().mockReturnValue({ id: 'mock-user-id', email: 'test@test.com', role: 'user' }),
};

export const mockConfigService = {
  get: jest.fn().mockImplementation((key: string) => {
    const config = {
      JWT_SECRET: 'test-secret',
      MONGODB_URI: 'mongodb://localhost:27017/test',
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return config[key];
  }),
};