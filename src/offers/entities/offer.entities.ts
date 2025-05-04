import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Auction } from 'src/auctions/entities/auction.entity';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  auctionId: number;

  @ManyToOne(() => Auction, (auction) => auction.offers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'auctionId' })
  auction: Auction;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'text' })
  description: string;

  @Column()
  userId: number;

  @Column()
  companyId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
