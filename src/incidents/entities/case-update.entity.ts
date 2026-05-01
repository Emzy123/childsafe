import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class CaseUpdate {
  @Prop({ required: true, name: 'incident_id' })
  incidentId: string;

  @Prop({ required: false, name: 'updated_by' })
  updatedBy?: string;

  @Prop({ required: false, name: 'old_status' })
  oldStatus?: string;

  @Prop({ required: true, name: 'new_status' })
  newStatus: string;

  @Prop({ required: false })
  notes?: string;

  @Prop({ required: false })
  type?: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: false, type: MongooseSchema.Types.Mixed })
  metadata?: any;
}

export const CaseUpdateSchema = SchemaFactory.createForClass(CaseUpdate);
export type CaseUpdateDocument = CaseUpdate & Document;
