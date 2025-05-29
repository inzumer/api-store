import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UsersDocument = HydratedDocument<Users>;

@Schema()
export class Users {
  @Prop({ required: true, maxlength: 50 })
  name: string;

  @Prop({ required: true, maxlength: 50 })
  last_name: string;

  @Prop({ required: true, unique: true, maxlength: 60 })
  email: string;

  @Prop({ required: true, maxlength: 15 })
  phone: string;

  @Prop({ required: true, maxlength: 15 })
  password: string;

  @Prop({ enum: ['admin', 'user', 'guest'], default: 'user' })
  role: string;

  @Prop({ maxlength: 500 })
  profile_photo: string;

  @Prop({ required: true })
  birthday: Date;

  @Prop({ required: true, enum: ['Female', 'Male', 'Other'] })
  gender: string;

  @Prop({ type: Types.ObjectId, ref: 'Address', required: true })
  address_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Preferences' })
  preferencies_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'SocialNetwork' })
  socil_network_id: Types.ObjectId;

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
}

export const UsersSchema = SchemaFactory.createForClass(Users);
