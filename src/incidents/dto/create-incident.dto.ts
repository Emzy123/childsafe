import { IsString, IsOptional, IsEnum, IsDateString, IsUUID, MinLength, IsInt, Min, Max } from 'class-validator';

export class CreateIncidentDto {
  @IsOptional()
  @IsUUID()
  victimId?: string;

  @IsOptional()
  @IsString()
  victimFirstName?: string;

  @IsOptional()
  @IsString()
  victimLastName?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(17)
  victimApproximateAge?: number;

  @IsOptional()
  @IsUUID()
  perpetratorId?: string;

  @IsOptional()
  @IsString()
  perpetratorFirstName?: string;

  @IsOptional()
  @IsString()
  perpetratorLastName?: string;

  @IsEnum(['physical', 'sexual', 'emotional', 'neglect', 'other'])
  abuseType: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsDateString()
  incidentDate: string;

  @IsString()
  @MinLength(3)
  location: string;

  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @IsOptional()
  @IsString()
  jurisdiction?: string;
}

export class UpdateIncidentDto {
  @IsOptional()
  @IsEnum(['physical', 'sexual', 'emotional', 'neglect', 'other'])
  abuseType?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['reported', 'under_investigation', 'with_agency', 'closed'])
  status?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
