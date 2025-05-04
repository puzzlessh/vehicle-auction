import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { OrderStatus } from '../entities/order.entity';
export class CreateOrderDto {
  @IsString()
  model: string;

  @IsString()
  type: string;

  @IsString({ each: true })
  imageList: string[];

  @IsString()
  vin: string;

  @IsNumber()
  @IsOptional()
  odometer?: number;

  @IsString()
  vehiclePassport: string;

  @IsString()
  plateNumber: string;

  @IsString()
  bodyColor: string;

  @IsString()
  description: string;

  @IsDate()
  deadLine: Date;

  @IsBoolean()
  isEvacuationRequired: boolean;

  @IsBoolean()
  isPrepaymentAllowed: boolean;

  @IsBoolean()
  isAuctionStarted: boolean;

  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}
