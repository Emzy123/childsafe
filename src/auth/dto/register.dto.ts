import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
