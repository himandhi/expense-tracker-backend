import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS so frontend (port 5173) can talk to backend (port 3000)
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // Enable validation pipes (validates DTOs automatically)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(3000);
  console.log('Backend running on http://localhost:3000');
}
void bootstrap();
