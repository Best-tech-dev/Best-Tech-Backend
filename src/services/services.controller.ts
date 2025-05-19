import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { Request, Response } from 'express';
import { CreateServiceDto } from './dto/create-service.dto';
import { JwtAuthGuard } from 'src/identity/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateCategoryDto } from './dto/create-category-dto';
import { CreateSubcategoryDto } from './dto/create-sub-category';

@Controller('services')
export class ServicesController {
    constructor (private readonly servicesService: ServicesService) {}

    @Get()
    async getAllCategoriesWithSubcategories(
    @Res() res: Response,
    ) {
    const result = await this.servicesService.getAllCategoriesWithSubcategories();
    return res.status(result.statusCode).json(result);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post('admin/create-category')
    async createCategory(
    @Body() dto: CreateCategoryDto,
    @Res() res: Response,
    @Req() req: Request,
    ) {
    const result = await this.servicesService.createCategory(dto, req.user);
    return res.status(result.statusCode).json(result);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post('admin/create-subcategory')
    async createSubcategory(
    @Body() dto: CreateSubcategoryDto,
    @Res() res: Response,
    @Req() req: Request,
    ) {
    const result = await this.servicesService.createSubcategory(dto, req.user);
    return res.status(result.statusCode).json(result);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post('admin/create')
    async createService(
        @Body() dto: CreateServiceDto, 
        @Res() res: Response, 
        @Req() req: Request) {
        const result  = await this.servicesService.createService(dto, req.user);
        return res.status(result.statusCode).json(result);
    }
}
