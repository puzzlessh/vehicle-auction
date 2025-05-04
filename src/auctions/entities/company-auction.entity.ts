import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Auction } from './auction.entity';

@Entity()
export class CompanyAuction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  auctionId: number;

  @ManyToOne(() => Auction, (auction) => auction.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'auctionId' })
  auction: Auction;

  @Column()
  companyId: number;
}
