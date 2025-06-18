/** DTO */
import {
  UserRole,
  UserGender,
  Address,
  Preferencies,
  SocialNetwork,
} from '../dto/index';

/** Mongoose */
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, maxlength: 50 })
  first_name: string;

  @Prop({ required: true, maxlength: 50 })
  last_name: string;

  @Prop({ required: true, maxlength: 50 })
  nickname: string;

  @Prop({ required: true, unique: true, maxlength: 60 })
  email: string;

  @Prop({ maxlength: 20 })
  phone: string;

  @Prop({ required: true, maxlength: 100 })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ maxlength: 500 })
  profile_photo: string;

  @Prop({ required: true })
  birthday: Date;

  @Prop({ type: String, enum: UserGender, default: UserGender.OTHER })
  gender: UserGender;

  @Prop({ type: Address })
  address: Address;

  @Prop({ type: Preferencies })
  preferencies: Preferencies;

  @Prop({ type: SocialNetwork })
  social_network: SocialNetwork;

  @Prop({ default: false })
  user_state: boolean;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;

  @Prop({ default: Date.now })
  last_conection: Date;

  @Prop({ default: true })
  is_active: boolean;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Product', default: [] })
  wishlist: Types.ObjectId[];

  @Prop({
    type: [
      {
        productId: {
          type: SchemaTypes.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    default: [],
  })
  cart: {
    productId: Types.ObjectId;
    quantity: number;
  }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
