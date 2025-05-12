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
      const authHeader = req.get('Authorization');
      if (!authHeader) {
        throw new UnauthorizedException('Authorization header is missing');
      }
      const refreshToken = authHeader.split(' ')[1];
      
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