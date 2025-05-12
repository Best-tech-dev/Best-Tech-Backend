import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    },
  },
})
export class Admin {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true 
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user' })
  role: 'user' | 'admin' | 'staff';

  @Prop()
  refreshToken?: string;

  @Prop()
  otp?: string;

  @Prop()
  otpExpires?: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);