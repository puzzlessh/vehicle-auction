import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { JwtModule } from './jwt/jwt.module';
import { DatabaseModule } from './database/database.module';
import { AuctionsModule } from './auctions/auctions.module';
import { OffersModule } from './offers/offers.module';
import { AuctionSchedulerModule } from './auction-scheduler/auction-scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    JwtModule,
    OrdersModule,
    DatabaseModule,
    AuctionsModule,
    OffersModule,
    AuctionSchedulerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
