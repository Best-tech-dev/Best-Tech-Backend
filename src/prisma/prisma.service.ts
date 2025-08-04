import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LoggerService } from '../common/logger/logger.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private logger: LoggerService) {
    super({
      log: ['info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      const databaseUrl = process.env.DATABASE_URL || 'unknown';
      this.logger.logDatabaseConnection(databaseUrl, true);
      this.logger.log('🔌 Prisma client connected', 'Prisma');
    } catch (error) {
      const databaseUrl = process.env.DATABASE_URL || 'unknown';
      this.logger.logDatabaseConnection(databaseUrl, false);
      this.logger.error('Failed to connect to database', error.stack, 'Prisma');
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Prisma client disconnected', 'Prisma');
  }
}