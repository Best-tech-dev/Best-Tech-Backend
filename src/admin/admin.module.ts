import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/identity/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // ✅ Register the User model here
  ],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
