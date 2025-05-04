import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Order } from '../orders/entities/order.entity';
import { Auction } from 'src/auctions/entities/auction.entity';
import { Offer } from 'src/offers/entities/offer.entities';
import { CompanyAuction } from 'src/auctions/entities/company-auction.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        return {
          type: 'postgres',
          host: configService.get<string>('postgres.host'),
          port: configService.get<number>('postgres.port'),
          username: configService.get<string>('postgres.username'),
          password: configService.get<string>('postgres.password'),
          database: configService.get<string>('postgres.database'),
          entities: [Order, Auction, Offer, CompanyAuction],
          synchronize: process.env.NODE_ENV !== 'production',
          logging: process.env.NODE_ENV === 'development',
        };
      },
    }),
  ],
})
export class DatabaseModule {}
