import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../src/auth/auth.module';
import { ProductsModule } from '../src/products/products.module';

enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

describe('Products Integration Tests', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        MongooseModule.forRoot('mongodb://localhost:27017/test-product-catalog'),
        AuthModule,
        ProductsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();

    adminToken = jwtService.sign({
      id: 'admin-id',
      email: 'admin@test.com',
      role: Role.ADMIN,
    });

    userToken = jwtService.sign({
      id: 'user-id',
      email: 'user@test.com',
      role: Role.USER,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /products', () => {
    it('should return products without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .expect(200);

      expect(response.body).toHaveProperty('products');
      expect(response.body).toHaveProperty('total');
    });

    it('should filter products by search term', async () => {
      const response = await request(app.getHttpServer())
        .get('/products?search=test')
        .expect(200);

      expect(response.body).toHaveProperty('products');
    });
  });

  describe('POST /products', () => {
    it('should create product as admin', async () => {
      const productData = {
        title: 'Integration Test Product',
        description: 'Test Description',
        price: 100,
        discountPercentage: 10,
        rating: 4.5,
        stock: 50,
        brand: 'Test Brand',
        category: 'Test Category',
        thumbnail: 'test.jpg',
        images: ['image1.jpg', 'image2.jpg'],
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.title).toBe(productData.title);
    });

    it('should not create product as user', async () => {
      const productData = {
        title: 'User Product',
        description: 'User Description',
        price: 50,
        discountPercentage: 5,
        rating: 4.0,
        stock: 25,
        brand: 'User Brand',
        category: 'User Category',
        thumbnail: 'user.jpg',
        images: ['user1.jpg'],
      };

      await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(productData)
        .expect(403);
    });
  });
});