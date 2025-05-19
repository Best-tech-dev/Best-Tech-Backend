import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/identity/schemas/user.schema';
import { StaffModule } from './staff/staff.module';
import { StudentModule } from './student/student.module';
import { AdminAuthModule } from './auth/auth.module';
import { ServicesModule } from 'src/services/services.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    StaffModule,
    StudentModule,
    AdminAuthModule,
    ServicesModule
  ],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
