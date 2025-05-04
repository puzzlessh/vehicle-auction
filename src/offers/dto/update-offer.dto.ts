import { IsString, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class UpdateOfferDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @IsPositive()
  price?: number;
}
