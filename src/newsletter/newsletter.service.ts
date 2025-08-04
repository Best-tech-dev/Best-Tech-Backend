import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';

@Injectable()
export class NewsletterService {
  constructor(private prisma: PrismaService) {}

  async create(createNewsletterDto: CreateNewsletterDto) {
    try {
      return await this.prisma.newsletter.create({
        data: createNewsletterDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email already subscribed to newsletter');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.newsletter.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.newsletter.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateNewsletterDto: UpdateNewsletterDto) {
    return this.prisma.newsletter.update({
      where: { id },
      data: updateNewsletterDto,
    });
  }

  async remove(id: string) {
    return this.prisma.newsletter.delete({
      where: { id },
    });
  }

  async unsubscribe(email: string) {
    const newsletter = await this.prisma.newsletter.findUnique({
      where: { email },
    });

    if (!newsletter) {
      throw new ConflictException('Email not found in newsletter subscription');
    }

    return this.prisma.newsletter.delete({
      where: { email },
    });
  }
} 