import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AuctionSchedulerService } from './auction-scheduler.service';
import { Auction } from '../auctions/entities/auction.entity';
import { Order } from '../orders/entities/order.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Auction, Order]),
  ],
  providers: [AuctionSchedulerService],
})
export class AuctionSchedulerModule {}
