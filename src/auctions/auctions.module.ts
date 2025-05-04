import { Module } from '@nestjs/common';
import { AuctionsController } from './auctions.controller';
import { AuctionsService } from './auctions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from './entities/auction.entity';
import { Offer } from 'src/offers/entities/offer.entities';
import { CompanyAuction } from './entities/company-auction.entity';
import { Order } from 'src/orders/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auction, Offer, CompanyAuction, Order])],
  controllers: [AuctionsController],
  providers: [AuctionsService],
})
export class AuctionsModule {}
