import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Victim } from './victim.entity';
import { Perpetrator } from './perpetrator.entity';
import { User } from '../../users/entities/user.entity';

export type AbuseType = 'physical' | 'sexual' | 'emotional' | 'neglect' | 'other';
export type CaseStatus = 'reported' | 'under_investigation' | 'with_agency' | 'closed';

@Schema({ timestamps: true })
export class Incident {
  @Prop({ required: true, unique: true, name: 'case_ref' })
  caseRef: string;

  @Prop({ required: false, name: 'user_id' })
  userId?: string;

  @Prop({ required: false, name: 'victim_id', type: Types.ObjectId, ref: 'Victim' })
  victimId?: string;

  @Prop({ required: false, name: 'perpetrator_id', type: Types.ObjectId, ref: 'Perpetrator' })
  perpetratorId?: string;

  @Prop({ required: false, name: 'reported_by' })
  reportedBy?: string;

  @Prop({ required: true, enum: ['physical', 'sexual', 'emotional', 'neglect', 'other'], name: 'abuse_type' })
  abuseType: AbuseType;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: Date, name: 'incident_date' })
  incidentDate: Date;

  @Prop({ required: true })
  location: string;

  @Prop({ enum: ['reported', 'under_investigation', 'with_agency', 'closed'], default: 'reported', name: 'status' })
  status: CaseStatus;

  @Prop({ default: false, name: 'is_anonymous' })
  isAnonymous: boolean;

  @Prop({ required: false, name: 'reporter_contact' })
  reporterContact?: string;

  @Prop({ required: false, name: 'assignee_id', type: Types.ObjectId, ref: 'User' })
  assigneeId?: string;

  @Prop({ required: false })
  jurisdiction?: string;
}

export const IncidentSchema = SchemaFactory.createForClass(Incident);

// Add references for population
IncidentSchema.index({ caseRef: 1 }, { unique: true });

export type IncidentDocument = Incident & Document;
