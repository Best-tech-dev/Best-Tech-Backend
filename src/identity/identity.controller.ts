import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus, 
  UseGuards, 
  Req, 
  Res,
  UnauthorizedException, 
} from '@nestjs/common';
import { Response } from 'express';
import { Request } from 'express';
import { IdentityService } from './identity.service';
import { CreateUserDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtAuthGuard, JwtRefreshGuard } from './guards/jwt-auth.guard';
import { successResponse } from 'src/utils/response';

declare module 'express' {
  export interface Request {
    user?: { _id: string };
  }
}

@Controller('identity')
export class IdentityController {
  constructor(private identityService: IdentityService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() dto: CreateUserDto, @Res() res: Response) {
    const result = await this.identityService.createUser(dto);
    return res.status(result.statusCode).json(result);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: SignInDto, @Res() res: Response) {
    const result = await this.identityService.signIn(dto);
    return res.status(Number(result.statusCode)).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  @HttpCode(HttpStatus.OK)
  async signout(@Req() req: Request) {
    const user = req.user as { _id: string };
    await this.identityService.signout(user._id);
    return successResponse(
      200,
      true,
      'User signed out successfully',
    )
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Req() req: Request) {
    const user = req.user as { _id: string };
    const authorizationHeader = req.get('Authorization');
    const refreshToken = authorizationHeader ? authorizationHeader.split(' ')[1] : null;
    
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const tokens = await this.identityService.refreshTokens(
      user._id, 
      refreshToken
    );
    
    return { accessToken: tokens.accessToken };
  }
}

// @Post('signin')
// async signin(@Body() body: any, @Res() res: Response) {
//   const result = await this.identityService.signin(body);
//   return res.status(result.statusCode).json(result);
// }