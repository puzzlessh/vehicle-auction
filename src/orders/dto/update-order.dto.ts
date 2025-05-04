import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { OrderStatus } from '../entities/order.entity';
export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString({ each: true })
  imageList?: string[];

  @IsOptional()
  @IsString()
  vin?: string;

  @IsNumber()
  @IsOptional()
  odometer?: number;

  @IsOptional()
  @IsString()
  vehiclePassport?: string;

  @IsOptional()
  @IsString()
  plateNumber?: string;

  @IsOptional()
  @IsString()
  bodyColor?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  deadLine?: Date;

  @IsOptional()
  @IsBoolean()
  isEvacuationRequired?: boolean;

  @IsOptional()
  @IsBoolean()
  isPrepaymentAllowed?: boolean;

  @IsOptional()
  @IsBoolean()
  isAuctionStarted?: boolean;

  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}
