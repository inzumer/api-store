/** Mongoose */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
  @Prop({ required: true, unique: true, maxlength: 100 })
  name: string;

  @Prop({ required: true, maxlength: 8000 })
  description: string;

  @Prop({ type: String })
  image_url?: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;

  @Prop({ default: true })
  is_active: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
