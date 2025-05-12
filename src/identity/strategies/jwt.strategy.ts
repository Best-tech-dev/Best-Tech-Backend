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
    // console.log("From jwt.strategy: Payload sub: ", payload.sub);
    const user = await this.userModel.findById(payload.sub).exec();
    
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    
    return {
      userId: user._id,
      email: user.email,
      role: user.role,
    };
  }
}