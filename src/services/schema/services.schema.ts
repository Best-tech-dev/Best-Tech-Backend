// schemas/service.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Service extends Document {

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ required: true})
  creatorEmail: string; // e.g., 'Web Development', 'Mobile App Development'

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  category: string; // e.g., 'Software Development'

  @Prop()
  subcategory?: string; // optional — e.g., 'Frontend Development'

  @Prop()
  icon?: string; // URL 

  @Prop()
  price?: number; // optional — for our paid services

  @Prop()
  duration?: string; // e.g., "2 weeks", "3 months"

  @Prop()
  tags?: string[]; // for searching — e.g., ['React', 'Vue', 'JavaScript']

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
