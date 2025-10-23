import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Catalogo API')
    .setDescription('API para gestión de catálogo de productos')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();