import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NewsletterService } from './newsletter.service';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';
import { RolesGuard } from '../common/guards/roles.guards';
import { JwtAuthGuard } from '../identity/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post()
  @ApiOperation({ summary: 'Subscribe to newsletter' })
  @ApiResponse({ status: 201, description: 'Successfully subscribed to newsletter' })
  @ApiResponse({ status: 409, description: 'Email already subscribed' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createNewsletterDto: CreateNewsletterDto) {
    return this.newsletterService.create(createNewsletterDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all newsletter subscriptions (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all newsletter subscriptions' })
  findAll() {
    return this.newsletterService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get a specific newsletter subscription by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Newsletter subscription found' })
  @ApiResponse({ status: 404, description: 'Newsletter subscription not found' })
  findOne(@Param('id') id: string) {
    return this.newsletterService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a newsletter subscription (Admin only)' })
  @ApiResponse({ status: 200, description: 'Newsletter subscription updated successfully' })
  @ApiResponse({ status: 404, description: 'Newsletter subscription not found' })
  update(@Param('id') id: string, @Body() updateNewsletterDto: UpdateNewsletterDto) {
    return this.newsletterService.update(id, updateNewsletterDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a newsletter subscription (Admin only)' })
  @ApiResponse({ status: 200, description: 'Newsletter subscription deleted successfully' })
  @ApiResponse({ status: 404, description: 'Newsletter subscription not found' })
  remove(@Param('id') id: string) {
    return this.newsletterService.remove(id);
  }

  @Delete('unsubscribe')
  @ApiOperation({ summary: 'Unsubscribe from newsletter by email' })
  @ApiResponse({ status: 200, description: 'Successfully unsubscribed from newsletter' })
  @ApiResponse({ status: 409, description: 'Email not found in newsletter subscription' })
  unsubscribe(@Query('email') email: string) {
    return this.newsletterService.unsubscribe(email);
  }
} 