# NestJS Independent Identity Module Setup

## Project Structure

```
src/
├── app.module.ts
├── main.ts
├── config/
│   ├── configuration.ts
│   └── validation.schema.ts
└── identity/
    ├── identity.module.ts
    ├── identity.service.ts
    ├── identity.controller.ts
    ├── strategies/
    │   ├── jwt.strategy.ts
    │   └── jwt-refresh.strategy.ts
    ├── guards/
    │   ├── jwt-auth.guard.ts
    │   └── jwt-refresh.guard.ts
    ├── schemas/
    │   └── user.schema.ts
    ├── interfaces/
    │   ├── tokens.interface.ts
    │   └── auth-payload.interface.ts
    └── dto/
        ├── sign-up.dto.ts
        ├── sign-in.dto.ts
        └── reset-password.dto.ts
```

## Environment File (.env)
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

## 1. User Schema

### src/identity/schemas/user.schema.ts
```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true 
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
```

## 2. DTOs

### src/identity/dto/sign-up.dto.ts
```typescript
import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  MinLength, 
  MaxLength 
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;
}
```

### src/identity/dto/sign-in.dto.ts
```typescript
import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  MinLength 
} from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
```

## 3. Interfaces

### src/identity/interfaces/tokens.interface.ts
```typescript
export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
```

### src/identity/interfaces/auth-payload.interface.ts
```typescript
export interface AuthPayload {
  sub: string;
  email: string;
}
```

## 4. Guards

### src/identity/guards/jwt-auth.guard.ts
```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {}
```

## 5. Strategies

### src/identity/strategies/jwt.strategy.ts
```typescript
import { 
  Injectable, 
  UnauthorizedException 
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { AuthPayload } from '../interfaces/auth-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.accessSecret'),
    });
  }

  async validate(payload: AuthPayload) {
    const user = await this.userModel.findById(payload.sub).exec();
    
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    
    return user;
  }
}
```

### src/identity/strategies/jwt-refresh.strategy.ts
```typescript
import { 
  Injectable, 
  UnauthorizedException 
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { AuthPayload } from '../interfaces/auth-payload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.refreshSecret'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: AuthPayload) {
    const refreshToken = req.get('Authorization').split(' ')[1];
    
    const user = await this.userModel
      .findById(payload.sub)
      .where('email', payload.email)
      .exec();
    
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    
    return { 
      ...user.toJSON(), 
      refreshToken 
    };
  }
}
```

## 6. Identity Service

### src/identity/identity.service.ts
```typescript
import { 
  Injectable, 
  ConflictException,
  UnauthorizedException 
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { User } from './schemas/user.schema';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Tokens } from './interfaces/tokens.interface';
import { AuthPayload } from './interfaces/auth-payload.interface';

@Injectable()
export class IdentityService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<Tokens> {
    const { email, password, firstName, lastName } = signUpDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    await newUser.save();

    // Generate tokens
    return this.generateTokens({
      sub: newUser._id.toString(),
      email: newUser.email,
    });
  }

  async signIn(signInDto: SignInDto): Promise<Tokens> {
    const { email, password } = signInDto;

    // Find user by email
    const user = await this.userModel.findOne({ email }).exec();
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    return this.generateTokens({
      sub: user._id.toString(),
      email: user.email,
    });
  }

  async logout(userId: string): Promise<void> {
    // Optional: Implement specific logout logic if needed
    await this.userModel.findByIdAndUpdate(userId, { 
      refreshToken: null 
    }).exec();
  }

  async refreshTokens(
    userId: string, 
    refreshToken: string
  ): Promise<Tokens> {
    // Find user by ID
    const user = await this.userModel.findById(userId).exec();
    
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    // Generate new tokens
    return this.generateTokens({
      sub: user._id.toString(),
      email: user.email,
    });
  }

  private async generateTokens(payload: AuthPayload): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.accessSecret'),
        expiresIn: this.configService.get<string>('jwt.accessExpiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
```

## 7. Identity Controller

### src/identity/identity.controller.ts
```typescript
import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus, 
  UseGuards, 
  Req 
} from '@nestjs/common';
import { Request } from 'express';

import { IdentityService } from './identity.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtAuthGuard, JwtRefreshGuard } from './guards/jwt-auth.guard';

@Controller('identity')
export class IdentityController {
  constructor(private identityService: IdentityService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpDto: SignUpDto) {
    const tokens = await this.identityService.signUp(signUpDto);
    return { accessToken: tokens.accessToken };
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto) {
    const tokens = await this.identityService.signIn(signInDto);
    return { accessToken: tokens.accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    const user = req.user as { _id: string };
    await this.identityService.logout(user._id);
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Req() req: Request) {
    const user = req.user as { _id: string };
    const refreshToken = req.get('Authorization').split(' ')[1];
    
    const tokens = await this.identityService.refreshTokens(
      user._id, 
      refreshToken
    );
    
    return { accessToken: tokens.accessToken };
  }
}
```

## 8. Identity Module

### src/identity/identity.module.ts
```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { IdentityService } from './identity.service';
import { IdentityController } from './identity.controller';
import { User, UserSchema } from './schemas/user.schema';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.accessSecret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.accessExpiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [IdentityController],
  providers: [
    IdentityService, 
    JwtStrategy, 
    JwtRefreshStrategy
  ],
  exports: [IdentityService],
})
export class IdentityModule {}
```

## 9. App Module

### src/app.module.ts
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { IdentityModule } from './identity/identity.module';

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
    IdentityModule,
  ],
})
export class AppModule {}