import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '../../common/enums/user-role.enum';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, name: 'password_hash' })
  passwordHash: string;

  @Prop({
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.SOCIAL_WORKER,
  })
  role: UserRole;

  @Prop({ default: true, name: 'is_active' })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
