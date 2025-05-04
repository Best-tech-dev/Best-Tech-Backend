import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: '', method: RequestMethod.GET }],
  });

  const port = process.env.PORT || 2000;
  await app.listen(port, '0.0.0.0');

  console.log(`Server is running on: http://localhost:${port}/api/v1`);
}
bootstrap();
