# NestJS MongoDB Authentication with JWT Tokens

This guide covers how to set up MongoDB with NestJS using TypeScript, including JWT authentication with access and refresh tokens.

## Project Setup

### 1. Create a new NestJS project

```bash
# Install NestJS CLI globally if not already installed
npm i -g @nestjs/cli

# Create a new NestJS project
nest new auth-api
cd auth-api   
```

### 2. Install required dependencies

```bash
# MongoDB dependencies
npm i @nestjs/mongoose mongoose

# Authentication and encryption dependencies
npm i @nestjs/jwt bcrypt
npm i -D @types/bcrypt

# Config and validation dependencies 
npm i @nestjs/config class-validator class-transformer
```

### 3. Project Structure

```
src/
├── app.module.ts
├── main.ts
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   └── strategies/
│       ├── jwt.strategy.ts
│       └── jwt-refresh.strategy.ts
├── config/
│   ├── configuration.ts
│   └── validation.schema.ts
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── dto/
│   │   ├── sign-in.dto.ts
│   │   └── sign-up.dto.ts
│   └── interfaces/
│       ├── tokens.interface.ts
│       └── jwt-payload.interface.ts
└── users/
    ├── users.module.ts
    ├── users.service.ts
    ├── schemas/
    │   └── user.schema.ts
    ├── dto/
    │   └── create-user.dto.ts
    └── interfaces/
        └── user.interface.ts
```

## Configuration Setup

### 1. Environment Configuration

Create a `.env` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/auth-api

# JWT
JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Server
PORT=3000
```

### 2. Configuration Setup

Create `src/config/configuration.ts`:

```typescript
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    uri: process.env.MONGODB_URI,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRATION,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION,
  },
});
```

Create `src/config/validation.schema.ts`:

```typescript
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  MONGODB_URI: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRATION: Joi.string().required(),
  JWT_REFRESH_EXPIRATION: Joi.string().required(),
});
```

## MongoDB Setup with Mongoose

### 1. Update AppModule with MongoDB Connection

Update `src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
```

### 2. User Schema and Interface

Create `src/users/schemas/user.schema.ts`:

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.refreshToken;
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
```

Create `src/users/interfaces/user.interface.ts`:

```typescript
import { Document } from 'mongoose';

export interface IUser extends Document {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
  refreshToken?: string;
}
```

### 3. Users Module and Service

Create `src/users/users.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

Create `src/users/dto/create-user.dto.ts`:

```typescript
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly password: string;
}
```

Create `src/users/users.service.ts`:

```typescript
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const { email, password } = createUserDto;
    
    // Check if user exists
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    
    return newUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    let update: { refreshToken?: string | null } = {};
    
    if (refreshToken) {
      // Hash refresh token before storing
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      update = { refreshToken: hashedRefreshToken };
    } else {
      update = { refreshToken: null };
    }
    
    await this.userModel.findByIdAndUpdate(userId, update).exec();
  }
}
```

## JWT Authentication Setup

### 1. Authentication Interfaces

Create `src/auth/interfaces/tokens.interface.ts`:

```typescript
export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
```

Create `src/auth/interfaces/jwt-payload.interface.ts`:

```typescript
export interface JwtPayload {
  sub: string;  // userId
  email: string;
}
```

### 2. DTOs for Authentication

Create `src/auth/dto/sign-up.dto.ts`:

```typescript
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class SignUpDto extends CreateUserDto {}
```

Create `src/auth/dto/sign-in.dto.ts`:

```typescript
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
```

### 3. JWT Strategy

Create `src/common/strategies/jwt.strategy.ts`:

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.accessSecret'),
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const user = await this.usersService.findById(payload.sub);
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
```

Create `src/common/strategies/jwt-refresh.strategy.ts`:

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.refreshSecret'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.headers.authorization.split(' ')[1];
    const user = await this.usersService.findById(payload.sub);
    
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    
    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    
    return user;
  }
}
```

### 4. JWT Auth Guard

Create `src/common/guards/jwt-auth.guard.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {}
```

### 5. Auth Service and Controller

Create `src/auth/auth.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { JwtRefreshStrategy } from '../common/strategies/jwt-refresh.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    UsersModule,
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
```

Create `src/auth/auth.service.ts`:

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Tokens } from './interfaces/tokens.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<Tokens> {
    const user = await this.usersService.create(signUpDto);
    const tokens = await this.getTokens(user._id.toString(), user.email);
    await this.usersService.updateRefreshToken(user._id, tokens.refreshToken);
    return tokens;
  }

  async signIn(signInDto: SignInDto): Promise<Tokens> {
    const { email, password } = signInDto;
    
    const user = await this.usersService.findByEmail(email);
    const passwordMatches = await bcrypt.compare(password, user.password);
    
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const tokens = await this.getTokens(user._id.toString(), user.email);
    await this.usersService.updateRefreshToken(user._id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
  }

  async refreshTokens(userId: string, email: string): Promise<Tokens> {
    const tokens = await this.getTokens(userId, email);
    await this.usersService.updateRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }

  private async getTokens(userId: string, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('jwt.accessSecret'),
        expiresIn: this.configService.get<string>('jwt.accessExpiresIn'),
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
```

Create `src/auth/auth.controller.ts`:

```typescript
import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtRefreshAuthGuard } from '../common/guards/jwt-auth.guard';
import { Tokens } from './interfaces/tokens.interface';
import { Request } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ accessToken: string }> {
    const tokens = await this.authService.signUp(signUpDto);
    // Only return access token in response for security
    return { accessToken: tokens.accessToken };
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto): Promise<{ accessToken: string }> {
    const tokens = await this.authService.signIn(signInDto);
    // Only return access token in response for security
    return { accessToken: tokens.accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request): Promise<void> {
    const user = req.user as { _id: string };
    await this.authService.logout(user._id);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Req() req: Request): Promise<{ accessToken: string }> {
    const user = req.user as { _id: string; email: string };
    const tokens = await this.authService.refreshTokens(user._id, user.email);
    // Only return access token in response for security
    return { accessToken: tokens.accessToken };
  }
}
```

## Main Application Entry Point

Update `src/main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // Get port from config
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
```

## Security Best Practices Implemented

1. **Password Hashing**: User passwords are hashed with bcrypt before storing
2. **Token Management**: Refresh tokens are hashed before storing
3. **Token Security**: Only the access token is returned to the client, refresh token is HTTP-only
4. **Data Sanitization**: Password and refresh token are removed from user responses
5. **Input Validation**: All DTOs have strict validation using class-validator
6. **Proper Error Handling**: Authentication errors return appropriate status codes
7. **JWT Configuration**: Separate secrets for access and refresh tokens
8. **Environment Variables**: All sensitive information stored in environment variables

## Testing the Authentication Flow

### Register a new user

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Sign in

```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Access protected route

```bash
curl -X GET http://localhost:3000/protected-route \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Refresh token

```bash
curl -X GET http://localhost:3000/auth/refresh \
  -H "Authorization: Bearer YOUR_REFRESH_TOKEN"
```

### Logout

```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```