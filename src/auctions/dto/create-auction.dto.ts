import {
  IsNumber,
  IsPositive,
  IsArray,
  IsBoolean,
  IsOptional,
  IsDate,
} from 'class-validator';

export class CreateAuctionDto {
  @IsNumber()
  @IsPositive()
  orderId: number;

  @IsDate()
  startTime: Date;

  @IsDate()
  endTime: Date;

  @IsOptional()
  @IsBoolean()
  public?: boolean;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  startCost?: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  allowedCompanyIds: number[];
}
