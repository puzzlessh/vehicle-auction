export class CreateOrderDto {
  readonly creator: string;
  readonly customer: string;
  readonly model: string;
  readonly order: string;
  readonly imageList: string[];
  readonly vin: string;
  readonly odometer: number;
  readonly vehiclePassport: string;
  readonly plateNumber: string;
  readonly bodyColor: string;
  readonly description: string;
  readonly deadLine: Date;
  readonly isEvacuationRequired: boolean;
  readonly isPrepaymentAllowed: boolean;
  readonly isAuctionStarted: boolean;
  readonly type: string;
  readonly status: string;
  readonly createAt: Date;
}
