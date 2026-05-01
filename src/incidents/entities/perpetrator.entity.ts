import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Perpetrator {
  @Prop({ required: false })
  id?: string;

  @Prop({ required: false })
  firstName?: string;

  @Prop({ required: false })
  lastName?: string;

  @Prop({ required: false, type: [String] })
  aliases?: string[];

  @Prop({ required: false })
  address?: string;

  @Prop({ required: false })
  knownAssociations?: string;

  @Prop({ required: false, type: [String] })
  modusOperandi?: string[];

  @Prop({ required: false })
  createdAt?: Date;
}

export const PerpetratorSchema = SchemaFactory.createForClass(Perpetrator);
export type PerpetratorDocument = Perpetrator & Document;
