import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { IdentityModule } from './identity/identity.module';

@Module({
  imports: [UsersModule, AdminModule, IdentityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
