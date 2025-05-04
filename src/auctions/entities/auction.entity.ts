import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { Offer } from 'src/offers/entities/offer.entities';

export enum AuctionType {
  NOT_ACTIVE = 'NOT_ACTIVE',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
}

@Entity()
export class Auction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: AuctionType,
    default: AuctionType.NOT_ACTIVE,
  })
  type: AuctionType;

  @Column()
  orderId: number;

  @ManyToOne(() => Order, (order) => order.auctions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @OneToMany(() => Offer, (offer) => offer.auction, { cascade: true })
  offers: Offer[];

  @Column({ type: 'timestamp', nullable: true })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  @Column({ default: false })
  public: boolean;

  @Column({ default: true })
  isVisible: boolean;

  @Column({ type: 'float', nullable: true })
  startCost?: number;
}
