import { IsBoolean, IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class SystemConfigDto {
  @IsOptional()
  @IsString()
  systemName?: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsBoolean()
  maintenanceMode?: boolean;

  @IsOptional()
  @IsBoolean()
  allowAnonymousReporting?: boolean;

  @IsOptional()
  @IsBoolean()
  caseAutoAssignment?: boolean;

  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  dataRetentionDays?: number;

  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(1440)
  sessionTimeout?: number;

  @IsOptional()
  passwordPolicy?: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  };
}
