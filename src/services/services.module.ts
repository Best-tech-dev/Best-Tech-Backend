import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Service, ServiceSchema } from './schema/services.schema';
import { Category, CategorySchema } from './schema/category.schema';
import SubcategorySchema, { Subcategory } from './schema/sub-category-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Service.name, schema: ServiceSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Subcategory.name, schema: SubcategorySchema },
    ]),
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService], // Optional: export for admin or user module use
})
export class ServicesModule {}
