import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum OrderStatus {
  DRAFT = 'DRAFT',
  MODERATION = 'MODERATION',
  CANCELED = 'CANCELED',
  PROCESS = 'PROCESS',
  COMPLETED = 'COMPLETED',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  companyId: number;

  @Column()
  model: string;

  @Column('text', { array: true })
  imageList: string[];

  @Column()
  vin: string;

  @Column()
  odometer: number;

  @Column()
  vehiclePassport: string;

  @Column()
  plateNumber: string;

  @Column()
  bodyColor: string;

  @Column()
  description: string;

  @Column()
  deadLine: Date;

  @Column()
  isEvacuationRequired: boolean;

  @Column()
  isPrepaymentAllowed: boolean;

  @Column()
  isAuctionStarted: boolean;

  @Column()
  type: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.DRAFT,
  })
  status: OrderStatus;

  @Column()
  createdById: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
