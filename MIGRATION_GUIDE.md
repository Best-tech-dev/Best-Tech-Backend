# MongoDB to PostgreSQL Migration Guide

## Overview
This project has been successfully migrated from MongoDB with Mongoose to PostgreSQL with Prisma ORM.

## Changes Made

### 1. Database Schema
- **Before**: MongoDB schemas using Mongoose
- **After**: PostgreSQL schema using Prisma

### 2. Dependencies Updated
- Removed: `@nestjs/mongoose`, `mongoose`
- Added: `@prisma/client`, `prisma`

### 3. Configuration Changes
- Updated environment variables from `MONGODB_URI` to `DATABASE_URL`
- Updated validation schema to use PostgreSQL connection string

### 4. Service Layer Updates
- All services now use Prisma client instead of Mongoose models
- Updated all database queries to use Prisma syntax
- Maintained the same API endpoints and functionality

## Setup Instructions

### 1. Environment Configuration
Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/btech_backend?schema=public"

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

### 2. Database Setup
1. Install PostgreSQL on your system
2. Create a new database named `btech_backend`
3. Update the `DATABASE_URL` in your `.env` file with your PostgreSQL credentials

### 3. Database Migration
Run the following commands to set up the database:

```bash
# Generate Prisma client
npm run prisma:generate

# Create and apply database migrations
npm run prisma:migrate

# Or if you want to push the schema directly (for development)
npm run db:push
```

### 4. Start the Application
```bash
# Install dependencies
npm install

# Start in development mode
npm run start:dev
```

## Database Schema

The new PostgreSQL schema includes the following tables:

- **users**: User accounts with authentication
- **staff**: Staff profiles linked to users
- **students**: Student profiles linked to users
- **categories**: Service categories
- **subcategories**: Subcategories linked to categories
- **services**: Services linked to categories and users

## Key Features Maintained

- ✅ User authentication and authorization
- ✅ JWT token management
- ✅ Role-based access control
- ✅ Service management
- ✅ Category and subcategory management
- ✅ All existing API endpoints

## Migration Benefits

1. **Better Performance**: PostgreSQL offers better performance for complex queries
2. **ACID Compliance**: Full ACID compliance for data integrity
3. **Type Safety**: Prisma provides excellent TypeScript support
4. **Relationships**: Better handling of relationships between entities
5. **Scalability**: PostgreSQL scales better for production workloads

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check your `DATABASE_URL` format
   - Ensure the database exists

2. **Migration Errors**
   - Run `npm run prisma:generate` first
   - Check if the database is accessible
   - Verify your PostgreSQL user has proper permissions

3. **Type Errors**
   - Run `npm run prisma:generate` after schema changes
   - Restart your development server

### Getting Help

If you encounter issues:
1. Check the Prisma documentation: https://www.prisma.io/docs
2. Verify your PostgreSQL installation
3. Check the application logs for detailed error messages 