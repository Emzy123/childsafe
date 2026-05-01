import { IsString, IsOptional, IsEnum, IsDateString, MinLength, IsEmail, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class AnonymousReportDto {
  @IsOptional()
  @IsString()
  victimFirstName?: string;

  @IsOptional()
  @IsString()
  victimLastName?: string;

  @IsOptional()
  @Transform(({ value }) => value ? parseInt(value, 10) : undefined)
  @IsInt()
  @Min(0)
  @Max(17)
  victimApproximateAge?: number;

  @IsOptional()
  @IsString()
  victimGender?: string;

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
  @IsString()
  perpetratorFirstName?: string;

  @IsOptional()
  @IsString()
  perpetratorLastName?: string;

  @IsOptional()
  @IsString()
  perpetratorAliases?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  reporterEmail?: string;

  @IsOptional()
  @IsString()
  reporterPhone?: string;
}
