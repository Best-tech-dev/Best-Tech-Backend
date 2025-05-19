import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Subcategory extends Document {
  @Prop({ required: true })
  subcategoryName: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop()
  creatorEmail: string;

  @Prop({ default: true })
  isActive: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}


const SubcategorySchema = SchemaFactory.createForClass(Subcategory);

SubcategorySchema.pre('save', function (next) {
    if (this.subcategoryName) {
      this.subcategoryName = this.subcategoryName.toLowerCase();
    }
    next();
});

export default SubcategorySchema;