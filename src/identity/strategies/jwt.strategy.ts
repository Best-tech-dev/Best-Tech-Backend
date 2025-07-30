import { 
  Injectable, 
  UnauthorizedException 
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthPayload } from '../interfaces/auth-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.accessSecret'),
    });
  }

  async validate(payload: AuthPayload) {
    // console.log("From jwt.strategy: Payload sub: ", payload.sub);
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub }
    });
    
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    
    return {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
  }
}