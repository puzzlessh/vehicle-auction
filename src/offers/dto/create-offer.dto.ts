import { IsNumber, IsPositive, IsOptional, IsString } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @IsPositive()
  auctionId: number;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsOptional()
  @IsString()
  description?: string;
}
