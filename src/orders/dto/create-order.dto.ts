import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
export class CreateOrderDto {
  @IsString()
  readonly creator: string;

  @IsString()
  readonly customer: string;

  @IsString()
  readonly model: string;

  @IsString()
  readonly order: string;

  @IsString({ each: true })
  readonly imageList: string[];

  @IsString()
  readonly vin: string;

  @IsNumber()
  readonly odometer: number;

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

  @IsString()
  readonly type: string;

  @IsString()
  readonly status: string;

  @IsDate()
  readonly createAt: Date;
}
