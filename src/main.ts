import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  console.log(`Server is running on: ${process.env.NODE_ENV === 'production' ? process.env.STAGING_URL : process.env.LOCAL_URL}`);
}
bootstrap();
