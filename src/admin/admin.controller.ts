import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/identity/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('users')
    async getAllUsers(userpayload: any) {
        return await this.adminService.getAllUsers(userpayload);
    }

    // @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('admin')
    // @Get('dashboard')
    // async getDashboard(userpayload: any) {
    //     return await this.adminService.getDashboard(userpayload);
    // }
    
}
