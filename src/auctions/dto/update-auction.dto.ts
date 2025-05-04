import {
  IsOptional,
  IsNumber,
  IsPositive,
  IsBoolean,
  IsDate,
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
  @IsDate()
  startTime?: Date;

  @IsOptional()
  @IsDate()
  endTime?: Date;

  @IsOptional()
  @IsBoolean()
  public?: boolean;

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
