export class Order {
  id: number;
  creator: string;
  customer: string;
  model: string;
  order: string;
  imageList: string[];
  vin: string;
  odometer: number;
  vehiclePassport: string;
  plateNumber: string;
  bodyColor: string;
  description: string;
  deadLine: Date;
  isEvacuationRequired: boolean;
  isPrepaymentAllowed: boolean;
  isAuctionStarted: boolean;
  type: string;
  status: string;
  createAt: Date;
}
