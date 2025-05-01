import { IsArray, IsNumber, IsString } from 'class-validator';

export class RoleDto {
  @IsNumber()
  readonly id: number;

  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsArray()
  readonly permissions: string[];
}
