/** Mongoose */
import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/** DTOs */
import { CURRENCIES, Currency } from '../dto';

export type ProductDocument = HydratedDocument<Product>;

export class Review {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop({ type: String, required: true, maxlength: 500 })
  comment: string;

  @Prop({ default: Date.now })
  created_at?: Date;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ type: Number })
  vote_affirmative: number;

  @Prop({ type: Number })
  vote_negative: number;
}

@Schema()
export class Product {
  @Prop({ required: true, maxlength: 150 })
  name: string;

  @Prop({ required: true, unique: true, maxlength: 70000 })
  description: string;

  @Prop({ required: true, maxlength: 20 })
  price: number;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category_id: Types.ObjectId;

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ type: Number, required: true })
  stock: number;

  @Prop({ type: String, enum: CURRENCIES, required: true })
  currency: Currency;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;

  @Prop({ default: true })
  is_active: boolean;

  @Prop({ type: [Review], default: [] })
  reviews: Review[];

  @Prop({ type: Number, min: 0, max: 5 })
  score: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
