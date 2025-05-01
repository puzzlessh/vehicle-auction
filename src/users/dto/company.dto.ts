import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum CompanyStatus {
  expert = 'ЭКСПЕРТ',
  serviceStation = 'СТОА',
  insuranceCompany = 'СК',
  partner = 'ПАРТНЕР',
  leasing = 'ЛИЗИНГ',
  other = 'ДРУГОЕ',
}

export class CompanyDto {
  @IsNumber()
  readonly id: number;

  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsEnum(CompanyStatus)
  readonly status: CompanyStatus;

  @IsOptional()
  @IsBoolean()
  readonly isActive: boolean;

  @IsDateString()
  readonly created: Date;

  @IsDateString()
  readonly updated: Date;
}
