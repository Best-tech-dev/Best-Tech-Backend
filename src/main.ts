import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import * as cron from 'node-cron';
import * as colors from 'colors';
import { failureResponse, successResponse } from './utils/response';
import axios from 'axios';

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

  // create a cron job to run every 5 minutes
  cron.schedule('*/1 * * * *', () => {
    console.log('Running cron job every 5 minutes');
   
    if (process.env.NODE_ENV === 'production') {
      axios.get(`${process.env.STAGING_URL}/api/v1/app`)
      .then((response) => {
        console.log('Cron job response:', response.data.data);
      }
      ).catch((error) => {
        console.error('Error running cron job:', error);
      }
    );
    } else {
      axios.get(`${process.env.LOCAL_URL}/api/v1/app`)
      .then((response) => {
        console.log('Cron job response:', response.data.data);
      }
      ).catch((error) => {
        console.error('Error running cron job:', error);
      }
    );
    }
  });
  // Enable CORS
  app.enableCors({
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: [
      'Content-Type',
    ],
  });
  // Enable helmet for security
  const helmet = require('helmet');
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for simplicity
    crossOriginEmbedderPolicy: false, // Disable COEP for simplicity
    crossOriginResourcePolicy: false, // Disable CORP for simplicity
    referrerPolicy: { policy: 'no-referrer' }, // Set referrer policy
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true, // Include subdomains
      preload: true, // Preload the HSTS policy
    },
    noSniff: true, // Prevent MIME type sniffing
    xssFilter: true, // Enable XSS filter
    // frameguard: {
    //   action: 'deny', // Prevents the page from being displayed in a frame
    //   action: 'sameorigin', // Allows the page to be displayed in a frame on the same origin
    //   action: 'allow-from', // Allows the page to be displayed in a frame from a specific origin
    //   domain: 'https://example.com', // The domain that is allowed to display the page in a frame
    // },
  }))

  const port = process.env.PORT || 2000;
  await app.listen(port, '0.0.0.0');

  console.log(`Server is running on: ${process.env.NODE_ENV === 'production' ? process.env.STAGING_URL : process.env.LOCAL_URL}`);
}
bootstrap();
