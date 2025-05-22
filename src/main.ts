import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',');
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: process.env.ALLOWED_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
});

  // ✅ Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // strips properties that are not in the DTO
      forbidNonWhitelisted: true, // throws error on unknown properties
      transform: true,          // transforms payloads to DTO instances
    }),
  );

  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: '', method: RequestMethod.GET }],
  });

  const port = process.env.PORT || 2000;
  await app.listen(port, '0.0.0.0');

  console.log(`Server is running on: http://localhost:${port}/api/v1`);
}
bootstrap();
