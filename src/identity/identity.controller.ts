import { Controller, Post, Res, Body } from '@nestjs/common';
import { Response } from 'express';
import { IdentityService } from './identity.service';

@Controller('auth')
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @Post('signin')
  async signin(@Body() body: any, @Res() res: Response) {
    const result = await this.identityService.signin(body);
    return res.status(result.statusCode).json(result);
  }

  @Post('signup')
  async signup(@Body() body: any, @Res() res: Response) {
    const result = await this.identityService.signup(body);
    return res.status(result.statusCode).json(result);
  }
}
