<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
# besttechnologiesltd-backend

# B-Tech Backend API

A comprehensive NestJS backend API for B-Tech services with PostgreSQL database, Prisma ORM, JWT authentication, and comprehensive logging.

## 🚀 Features

- **PostgreSQL Database** with Prisma ORM
- **JWT Authentication** with refresh tokens
- **Role-based Access Control** (User, Admin, Staff)
- **Comprehensive Logging** with Winston
- **Swagger API Documentation**
- **CORS Support**
- **Input Validation** with class-validator
- **Health Check Endpoints**

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd btech-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/best_tech_db?schema=public"

   # JWT Configuration
   JWT_ACCESS_SECRET=your_jwt_access_secret_here
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
   JWT_ACCESS_EXPIRATION=15m
   JWT_REFRESH_EXPIRATION=7d

   # Server Configuration
   PORT=2000

   # CORS Configuration
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
   ALLOWED_METHODS=GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Create and apply database migrations
   npm run prisma:migrate

   # Or push schema directly (for development)
   npm run db:push
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run start:prod
   ```

## 📚 API Documentation

Once the server is running, you can access:

- **Swagger UI**: http://localhost:2000/api/docs
- **API Base URL**: http://localhost:2000/api/v1
- **Health Check**: http://localhost:2000/api/v1/health

## 🔐 Authentication

The API uses JWT tokens for authentication:

1. **Sign Up**: `POST /api/v1/identity/signup`
2. **Sign In**: `POST /api/v1/identity/signin`
3. **Sign Out**: `POST /api/v1/identity/signout` (requires auth)
4. **Refresh Token**: `POST /api/v1/identity/refresh` (requires auth)

## 📊 Logging

The application includes comprehensive logging:

- **Console Logs**: Real-time logs in development
- **File Logs**: Stored in `logs/` directory
  - `combined.log`: All logs
  - `error.log`: Error logs only

### Logging Commands
```bash
# View all logs
npm run logs:view

# View error logs only
npm run logs:error

# Clear all logs
npm run logs:clear
```

### Log Features
- Database connection logging
- API request logging with response times
- Error tracking with stack traces
- Sanitized database URLs in logs

## 🗄️ Database Schema

### Tables
- **users**: User accounts with authentication
- **staff**: Staff profiles linked to users
- **students**: Student profiles linked to users
- **categories**: Service categories
- **subcategories**: Subcategories linked to categories
- **services**: Services linked to categories and users

### Database Commands
```bash
# Generate Prisma client
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Push schema changes
npm run db:push

# Open Prisma Studio
npm run prisma:studio
```

## 🔧 Available Scripts

```bash
# Development
npm run start:dev          # Start in development mode
npm run start:debug        # Start in debug mode

# Production
npm run build              # Build the application
npm run start:prod         # Start in production mode

# Database
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Create and apply migrations
npm run prisma:studio      # Open Prisma Studio
npm run db:push           # Push schema changes

# Logging
npm run logs:view         # View combined logs
npm run logs:error        # View error logs
npm run logs:clear        # Clear all logs

# Code Quality
npm run lint              # Run ESLint
npm run format            # Format code with Prettier

# Testing
npm run test              # Run unit tests
npm run test:e2e          # Run end-to-end tests
npm run test:cov          # Run tests with coverage
```

## 🏗️ Project Structure

```
src/
├── common/
│   ├── decorators/       # Custom decorators
│   ├── guards/          # Authentication guards
│   ├── helper-functions/ # Utility functions
│   └── logger/          # Logging service
├── config/              # Configuration files
├── identity/            # Authentication module
├── users/               # User management
├── services/            # Service management
├── admin/               # Admin functionality
├── prisma/              # Database service
└── main.ts              # Application entry point
```

## 🔒 Security Features

- JWT token authentication
- Role-based access control
- Input validation and sanitization
- CORS protection
- Password hashing with bcrypt
- Secure database connections

## 🚨 Error Handling

The application includes comprehensive error handling:

- Validation errors with detailed messages
- Authentication errors
- Database connection errors
- Custom error responses
- Logged errors with stack traces

## 📈 Monitoring

- Health check endpoints
- Database connection monitoring
- API request/response logging
- Error tracking and reporting
- Performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
1. Check the API documentation at `/api/docs`
2. Review the logs for error details
3. Check the database connection
4. Verify environment variables

## 🔄 Migration from MongoDB

This project was migrated from MongoDB to PostgreSQL. See `MIGRATION_GUIDE.md` for detailed information about the migration process and benefits.
