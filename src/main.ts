import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for React frontend
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // Global prefix
  app.setGlobalPrefix('api');
  
  await app.listen(3000);
  console.log('Application running on http://localhost:3000');
}
bootstrap();
