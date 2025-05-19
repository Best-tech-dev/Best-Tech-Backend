// schemas/service.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Category extends Document {

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ required: true})
  creatorEmail: string; // e.g., 'Web Development', 'Mobile App Development'

  @Prop({ required: true })
  categoryName: string;

  @Prop()
  description: string;

  @Prop()
  icon?: string; // URL 

  @Prop()
  tags?: string[]; // for searching — e.g., ['React', 'Vue', 'JavaScript']

  @Prop({ default: true })
  isActive: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
