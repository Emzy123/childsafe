import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Victim {
  @Prop({ required: false })
  id?: string;

  @Prop({ required: false })
  firstName?: string;

  @Prop({ required: false })
  lastName?: string;

  @Prop({ required: false })
  dateOfBirth?: Date;

  @Prop({ required: false, name: 'approximate_age' })
  approximateAge?: number;

  @Prop({ required: false })
  gender?: string;

  @Prop({ required: false })
  address?: string;

  @Prop({ required: false, name: 'contact_info' })
  contactInfo?: string;

  @Prop({ required: false })
  createdAt?: Date;
}

export const VictimSchema = SchemaFactory.createForClass(Victim);
export type VictimDocument = Victim & Document;
