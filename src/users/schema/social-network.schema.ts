import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SocialNetworkDocument = HydratedDocument<SocialNetwork>;

@Schema()
export class SocialNetwork {
  @Prop()
  facebook: string;

  @Prop()
  instagram: string;

  @Prop()
  tiktok: string;
}

export const SocialNetworkSchema = SchemaFactory.createForClass(SocialNetwork);
