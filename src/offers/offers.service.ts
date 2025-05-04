import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entities';
import { Auction } from '../auctions/entities/auction.entity';
import { CompanyAuction } from '../auctions/entities/company-auction.entity';
import { Order } from '../orders/entities/order.entity';
import { FullUserDto } from '../users/dto/full-user.dto';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { AuctionType } from '../auctions/entities/auction.entity';

@Injectable()
export class OffersService {
  private readonly logger = new Logger(OffersService.name);

  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
    @InjectRepository(CompanyAuction)
    private readonly companyAuctionRepository: Repository<CompanyAuction>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(
    createOfferDto: CreateOfferDto,
    user: FullUserDto,
  ): Promise<Offer> {
    return await this.offerRepository.manager.transaction(async (manager) => {
      try {
        if (!user.role.permissions.includes('CREATE-OFFER')) {
          throw new ForbiddenException('Нет прав для создания предложения');
        }

        if (!user.company?.id) {
          throw new NotFoundException('Компания пользователя не найдена');
        }

        const auction = await manager.findOne(Auction, {
          where: { id: createOfferDto.auctionId },
        });
        if (!auction) {
          throw new NotFoundException(
            `Аукцион с id ${createOfferDto.auctionId} не найден`,
          );
        }

        if (!auction.isVisible) {
          const companyAuction = await manager.findOne(CompanyAuction, {
            where: {
              auctionId: createOfferDto.auctionId,
              companyId: user.company.id,
            },
          });
          if (!companyAuction) {
            throw new ForbiddenException(
              'Ваша компания не разрешена для участия в этом аукционе',
            );
          }
        }

        if (auction.type !== AuctionType.ACTIVE) {
          throw new ForbiddenException(
            'Можно создавать предложения только для активных аукционов',
          );
        }

        const offer = manager.create(Offer, {
          auctionId: createOfferDto.auctionId,
          userId: user.id,
          companyId: user.company.id,
          price: createOfferDto.price,
          description: createOfferDto.description ?? '',
        });
        return await manager.save(Offer, offer);
      } catch (error: unknown) {
        this.logger.error(
          `Ошибка при создании предложения для аукциона ${createOfferDto.auctionId} пользователем ${user.id}`,
          error instanceof Error ? error.stack : undefined,
        );
        if (
          error instanceof NotFoundException ||
          error instanceof ForbiddenException
        ) {
          throw error;
        }
        throw new InternalServerErrorException(
          'Не удалось создать предложение',
        );
      }
    });
  }

  async update(
    id: number,
    updateOfferDto: UpdateOfferDto,
    user: FullUserDto,
  ): Promise<Offer> {
    return await this.offerRepository.manager.transaction(async (manager) => {
      try {
        if (!user.role.permissions.includes('UPDATE-OFFER')) {
          throw new ForbiddenException('Нет прав для обновления предложения');
        }

        if (!user.company?.id) {
          throw new NotFoundException('Компания пользователя не найдена');
        }

        const offer = await manager.findOne(Offer, {
          where: { id },
          relations: ['auction'],
        });
        if (!offer) {
          throw new NotFoundException(`Предложение с id ${id} не найдено`);
        }

        if (offer.userId !== user.id) {
          throw new ForbiddenException(
            'Вы не являетесь создателем этого предложения',
          );
        }

        if (!offer.auction.isVisible) {
          const companyAuction = await manager.findOne(CompanyAuction, {
            where: {
              auctionId: offer.auctionId,
              companyId: user.company.id,
            },
          });
          if (!companyAuction) {
            throw new ForbiddenException(
              'Ваша компания не разрешена для участия в этом аукционе',
            );
          }
        }

        if (offer.auction.type !== AuctionType.ACTIVE) {
          throw new ForbiddenException(
            'Можно обновлять предложения только для активных аукционов',
          );
        }

        const updatedOffer = manager.create(Offer, {
          ...offer,
          price: updateOfferDto.price,
          description: updateOfferDto.description ?? offer.description,
        });
        return await manager.save(Offer, updatedOffer);
      } catch (error: unknown) {
        this.logger.error(
          `Ошибка при обновлении предложения с id ${id} пользователем ${user.id}`,
          error instanceof Error ? error.stack : undefined,
        );
        if (
          error instanceof NotFoundException ||
          error instanceof ForbiddenException
        ) {
          throw error;
        }
        throw new InternalServerErrorException(
          'Не удалось обновить предложение',
        );
      }
    });
  }

  async getOffers(
    auctionId: number | undefined,
    user: FullUserDto,
  ): Promise<Offer[]> {
    try {
      if (!user.role.permissions.includes('VIEW-OFFERS')) {
        throw new ForbiddenException('Нет прав для просмотра предложений');
      }

      if (auctionId === undefined) {
        throw new BadRequestException('Не указан параметр auction_id');
      }

      const auction = await this.auctionRepository.findOne({
        where: { id: auctionId },
        relations: ['order'],
      });
      if (!auction) {
        throw new NotFoundException(`Аукцион с id ${auctionId} не найден`);
      }

      const isCreator = auction.order.createdById === user.id;

      if (!isCreator) {
        if (auction.type !== AuctionType.ENDED) {
          throw new ForbiddenException(
            'Предложения можно видеть только после завершения аукциона',
          );
        }
      }

      const offers = await this.offerRepository
        .createQueryBuilder('offer')
        .where('offer.auctionId = :auctionId', { auctionId })
        .getMany();

      return offers;
    } catch (error: unknown) {
      this.logger.error(
        `Ошибка при получении предложений для аукциона ${auctionId} пользователем ${user.id}`,
        error instanceof Error ? error.stack : undefined,
      );
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Не удалось получить предложения');
    }
  }
}
