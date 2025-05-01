import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Company } from 'src/users/entities/company.entity';

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

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ManyToOne(() => Company, (company) => company.orders)
  company: Company;

  @Column()
  model: string;

  @Column()
  order: string;

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

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
