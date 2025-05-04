import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auction } from '../auctions/entities/auction.entity';
import { Order } from '../orders/entities/order.entity';
import { AuctionType } from '../auctions/entities/auction.entity';
import { OrderStatus } from '../orders/entities/order.entity';

@Injectable()
export class AuctionSchedulerService {
  private readonly logger = new Logger(AuctionSchedulerService.name);

  constructor(
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleAuctionStatus() {
    const currentDate = new Date();

    const auctions = await this.auctionRepository.find({
      relations: ['order'],
    });

    for (const auction of auctions) {
      let updated = false;

      if (
        auction.type === AuctionType.NOT_ACTIVE &&
        currentDate >= new Date(auction.startTime)
      ) {
        auction.type = AuctionType.ACTIVE;
        updated = true;
      }

      if (
        (auction.type === AuctionType.ACTIVE ||
          auction.type === AuctionType.NOT_ACTIVE) &&
        currentDate > new Date(auction.endTime)
      ) {
        auction.type = AuctionType.ENDED;
        updated = true;

        if (auction.order) {
          auction.order.status = OrderStatus.COMPLETED;
          await this.orderRepository.save(auction.order);
        }
      }

      if (updated) {
        await this.auctionRepository.save(auction);
        this.logger.log(
          `Аукцион ${auction.id} обновлён до статуса ${auction.type} на ${currentDate.toISOString()}`,
        );
      }
    }
  }
}
