import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PreferencesDocument = HydratedDocument<Preferences>;

@Schema()
export class Preferences {
  @Prop()
  theme: string;

  @Prop()
  lang: string;
}

export const PreferencesSchema = SchemaFactory.createForClass(Preferences);
