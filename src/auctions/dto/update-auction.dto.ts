import {
  IsOptional,
  IsNumber,
  IsPositive,
  IsBoolean,
  IsDateString,
  IsArray,
} from 'class-validator';
import { AuctionType } from '../entities/auction.entity';

export class UpdateAuctionDto {
  @IsNumber()
  @IsPositive()
  orderId: number;

  @IsOptional()
  type?: AuctionType;

  @IsOptional()
  @IsDateString()
  startTime?: Date;

  @IsOptional()
  @IsDateString()
  endTime?: Date;

  @IsOptional()
  @IsBoolean()
  public?: boolean;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  startCost?: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  allowedCompanyIds?: number[];
}
