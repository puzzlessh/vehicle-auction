import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { Offer } from './entities/offer.entities';
import { Auction } from '../auctions/entities/auction.entity';
import { CompanyAuction } from '../auctions/entities/company-auction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, Auction, CompanyAuction])],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
