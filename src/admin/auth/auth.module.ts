import { Module } from '@nestjs/common';
import { AdminAuthService } from './auth.service';
import { AdminAuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from '../schema/admin.schema';
import { User, UserSchema } from 'src/identity/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({}),
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService],
})
export class AdminAuthModule {}
