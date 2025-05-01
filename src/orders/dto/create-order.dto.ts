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
  readonly model: string;

  @IsString()
  readonly type: string;

  @IsString()
  readonly order: string;

  @IsString({ each: true })
  readonly imageList: string[];

  @IsString()
  readonly vin: string;

  @IsNumber()
  @IsOptional()
  readonly odometer?: number;

  @IsString()
  readonly vehiclePassport: string;

  @IsString()
  readonly plateNumber: string;

  @IsString()
  readonly bodyColor: string;

  @IsString()
  readonly description: string;

  @IsDate()
  readonly deadLine: Date;

  @IsBoolean()
  readonly isEvacuationRequired: boolean;

  @IsBoolean()
  readonly isPrepaymentAllowed: boolean;

  @IsBoolean()
  readonly isAuctionStarted: boolean;

  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}
