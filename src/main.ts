import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Enable CORS for React frontend (supports development and production)
  const corsOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
  app.enableCors({
    origin: corsOrigin.split(',').map(url => url.trim()),
    credentials: true,
  });
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // Health check endpoint for Render (before global prefix)
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/api', (_req: any, res: any) => {
    res.status(200).json({ status: 'ok' });
  });

  // Global prefix
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application running on port ${port}`);
}
bootstrap();
