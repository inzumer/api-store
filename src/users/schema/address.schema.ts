import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AddressDocument = HydratedDocument<Address>;

@Schema()
export class Address {
  @Prop()
  street: string;

  @Prop()
  city: string;

  @Prop()
  country: string;

  @Prop()
  postalCode: string;

  @Prop()
  state: string;

  @Prop()
  house_number: number;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
