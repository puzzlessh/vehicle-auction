import {
  IsNumber,
  IsPositive,
  IsArray,
  IsDateString,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateAuctionDto {
  @IsNumber()
  @IsPositive()
  readonly orderId: number;

  @IsDateString()
  startTime: Date;

  @IsDateString()
  endTime: Date;

  @IsBoolean()
  public?: boolean;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  startCost?: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  readonly allowedCompanyIds: number[];
}
