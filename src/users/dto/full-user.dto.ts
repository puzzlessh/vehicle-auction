import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsString,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { CompanyDto } from './company.dto';
// import { RoleDto } from './role.dto';

export class FullUserDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly middleName: string;

  @IsString()
  readonly lastName: string;

  @IsBoolean()
  readonly isActive: boolean;

  @IsNumber()
  readonly id: number;

  @IsString()
  readonly description: string;

  @ValidateNested()
  readonly company: CompanyDto;

  @IsObject()
  readonly role: {
    id: number;
    name: string;
    description: string;
    permissions: string[];
  };
}
