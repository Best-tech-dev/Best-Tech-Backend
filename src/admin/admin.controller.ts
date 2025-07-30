import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from 'src/identity/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Request } from 'express';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('users')
    async getAllUsers(@Req() req: Request) {
        // Accept role as query param: /admin/users?role=student|staff|admin
        const role = req.query.role as string | undefined;
        return await this.adminService.getAllUsers(req.user, role);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('dashboard')
    async getDashboard(
        @Req() req: Request,
    ) {
        return await this.adminService.getDashboard(req.user);
    }
}
