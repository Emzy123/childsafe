import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreatePerpetratorDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  aliases?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  knownAssociations?: string;

  @IsArray()
  @IsOptional()
  modusOperandi?: string[];
}

export class UpdatePerpetratorDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  aliases?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  knownAssociations?: string;

  @IsArray()
  @IsOptional()
  modusOperandi?: string[];
}
